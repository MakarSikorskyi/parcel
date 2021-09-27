<?php

defined ('__INCLUDE_SAFE__') || die ();

require_once PATH_LIB. 'dl'. PHP;

final class FDOC {

    static $filename;
    private static $file;
    static $offset;
    private static $eof_offset;
    private static $css;
    private static $page_layout = '2.0cm 2.0cm 2.0cm 3.0cm';
    private static $content_prepend;

    private static $vars = array ();
    private static $vals = array ();

    private static $content;

    static $appending;
    private static $timer;
    private static $timeout;
    static $genesis;

    static $parts;
    static $date;

    final static function getCSS ($file) {
        if (!is_file ($file) || !is_readable ($file)) {
            class_exists ('Core') && Core::report ('FDOC.CSS.notReadable', Core::ERR_FATAL, 'File requested for loading CSS Styles (named "%s") is missing or not readable', $file);
            return FALSE;
        }
        self::$css .= PHP_EOL. file_get_contents ($file);
    }

    final static function setStyle ($element, $css) {
        self::$css .= PHP_EOL. $element. ' {'. $css. '}';
    }

    final static function setPageLayout ($pl) {
        self::$page_layout = $pl;
    }

    final private static function buildDOCStyle () {
        if (self::$css) return '<style type="text/css">'. self::$css. PHP_EOL. '</style>'. PHP_EOL;
        else return NULL;
    }

    final private static function buildDOCHtml () {
        self::setStyle ('@page FDOC', 'size:595.3pt 841.9pt; margin:'. self::$page_layout. ';');
        self::setStyle ('div.FDOC', 'page:FDOC;');
        ob_start ();
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Word.Document">
<?php echo self::buildDOCStyle (); ?>
</head>
<body>
  <div class="FDOC">
<?php
        fwrite (self::$file, ob_get_clean ());
        self::$offset = ftell (self::$file);
        ob_start ();
?>
  </div>
</body>
</html>
<?php
        fwrite (self::$file, ob_get_clean ());
    }

    final static function buildDOCFile () {
        if (self::$filename && file_exists (self::$filename)) {
            self::$file = fopen (self::$filename, 'r+');
            fseek (self::$file, 0, SEEK_END);
            if (self::$appending) return;
        } else {
            self::$filename = tempnam (PATH_TMP, 'doc_');
            self::$file = fopen (self::$filename, 'w+');
            self::$parts = 0;
            if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
                $s = DBD::get ()->prepare ('INSERT INTO `sb_fdoc` (
                                             `date`, `user`, `tmpfile`, `parts`, `status`
                                           ) VALUES (?, ?, ?, ?, ?)');
                if (!$s->execute (array (
                    date ('Y-m-d H:i:s'), User::get ('id'), self::$filename, self::$parts, 0
                ))) Core::report ('FDOC.InsertDBRecord');
                $s = DBD::get ()->prepare ('SELECT MAX(`date`) AS `date`
                                           FROM `sb_fdoc`
                                           WHERE `user`=?');
                if (!$s->execute (array (User::get ('id')))) Core::report ('FDOC.GetDBRecord');
                if ($r = $s->fetch ()) {
                    self::$date = $r->date;
                }
            }
        }
        self::buildDOCHtml ();
    }

    final static function fromArray ($html, array $s) {
        self::$vars = array ();
        self::$vals = array ();
        if (count ($s)) {
            foreach (array_keys($s) as $var) {
                self::$vars[] = '{'. $var. '}';
                self::$vals[] = $s[$var];
            }
        }
        self::$content = str_replace (self::$vars, self::$vals, $html);
        fseek (self::$file, 0, SEEK_END);
        self::$eof_offset = ftell (self::$file);
        fseek (self::$file, self::$offset, SEEK_SET);
        self::$content_prepend = fread (self::$file, self::$eof_offset - self::$offset);
        fseek (self::$file, self::$offset, SEEK_SET);
        fwrite (self::$file, self::$content);
        self::$offset = ftell (self::$file);
        fwrite (self::$file, ob_get_clean ());
        fwrite (self::$file, self::$content_prepend);
        self::$parts++;
    }

    final static function download ($filename) {
        if ($filename) {
            download (self::$filename, $filename);
            return TRUE;
        } else {
            return FALSE;
        }
    }

    final private static function timerStart () {
        self::$timer = microtime (TRUE);
    }

    final private static function processLifeTime () {
        return round (microtime (TRUE) - self::$timer, 4);
    }

    final private static function genesis () {
        self::$genesis += self::processLifeTime ();
        return self::$genesis;
    }
    
    final static function create ($filename, $html, array $data) {
        self::timerStart ();
        self::buildDOCFile ();
        self::fromArray ($html, $data);
        fclose (self::$file);
        if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
            $s = DBD::get ()->prepare ('UPDATE `sb_fdoc`
                                       SET `status`=?, `offset`=?, `parts`=?, `genesis`=?
                                       WHERE `user`=? AND `date`=?');
            if (!$s->execute (array (
                '1', self::$offset, self::$parts, self::genesis (), User::get ('id'), self::$date
            ))) Core::report ('FDOC.UpdateDBRecord');
        }
    }

    final static function load ($filename, $html, array $data) {
        self::create ($filename, $html, $data);
        if (self::$timeout) {
            if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
                $s = DBD::get ()->prepare ('UPDATE `sb_fdoc` SET `status`=? WHERE `user`=? AND `date`=?');
                if (!$s->execute (array ('-1', User::get ('id'), self::$date))) Core::report ('FDOC.UpdateDBRecord');
            }
            if (class_exists ('AJAX')) AJAX::set ('FDOC_TIMEOUT', TRUE);
        } else self::download ($filename);
    }
}

if (class_exists ('Core')) {
    FDOC::$appending = Core::getInputVar (INPUT_REQUEST, NULL, 'fdoc_append');
} else {
    FDOC::$appending = isset ($_REQUEST['fdoc_append']) ? $_REQUEST['fdoc_append'] : FALSE;
}
if (FDOC::$appending) {
    if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
        $s = DBD::get ()->prepare ('SELECT `date`, `tmpfile`, `offset`, `parts`, `status`, `genesis`
                                    FROM `sb_fdoc`
                                    WHERE `user`=:1 AND `date` IN (SELECT MAX(`date`) FROM `sb_fdoc` WHERE `user`=:1)');
        if (!$s->execute (array (':1' => User::get ('id')))) Core::report ('FDOC.GetDBRecord');
        if ($r = $s->fetch ()) {
            FDOC::$date = $r->date;
            FDOC::$filename = $r->tmpfile;
            FDOC::$offset = $r->offset;
            FDOC::$parts = $r->parts;
            FDOC::$genesis = (double)$r->genesis;
        } else {
            FDOC::$appending = FALSE;
        }
    }
}

?>