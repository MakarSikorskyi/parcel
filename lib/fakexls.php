<?php

defined ('__INCLUDE_SAFE__') || die ();
defined ('FXLS_MAX_EXECUTION_TIME') || define ('FXLS_MAX_EXECUTION_TIME', ini_get('max_execution_time') - 5);

require_once PATH_LIB. 'dl'. PHP;

final class FXLS {
    
    const FILE_XLS = 0;
    const FILE_CSV = 1;

    static $realname;
    static $filename;
    private static $file;
    static $ftype;
    static $offset;
    private static $eof_offset;
    private static $css;
    private static $column_names;
    private static $content_prepend;

    static $excel_row_count;
    static $row_count;
    static $total_count = FALSE;

    private static $header_rowspan;
    private static $header_colspan;
    private static $spanrepeat = TRUE;
    private static $rowspan;
    private static $colspan;

    static $appending;
    private static $timer;
    private static $timeout;
    static $genesis;

    static $parts;
    static $date;
    
    final static function clean () {
        self::$realname = NULL;
        self::$filename = NULL;
        self::$file = NULL;
        self::$ftype = NULL;
        self::$offset = NULL;
        self::$eof_offset = NULL;
        self::$css = NULL;
        self::$column_names = NULL;
        self::$content_prepend = NULL;
        
        self::$excel_row_count = NULL;
        self::$row_count = NULL;
        self::$total_count = FALSE;
        
        self::$header_rowspan = NULL;
        self::$header_colspan = NULL;
        self::$spanrepeat = TRUE;
        self::$rowspan = NULL;
        self::$colspan = NULL;
        
        self::$appending = FALSE;
        self::$timer = NULL;
        self::$timeout = FALSE;
        self::$genesis = NULL;
        
        self::$parts = NULL;
        self::$date = NULL;
    }

    final private static function getColumnLetter ($iter) {
        $letter = NULL;
        if ($iter > 26) {
            $letter = chr (64 + round ($iter / 26, 0, PHP_ROUND_HALF_DOWN));
            $iter -= 26 * round ($iter / 26, 0, PHP_ROUND_HALF_DOWN);
        }
        return $letter. chr (64 + $iter);
    }

    final static function setColumnNames (array $mapping, $rowspan = FALSE, $colspan = FALSE) {
        self::$column_names = $mapping;
        if ($rowspan && is_array ($rowspan)) self::$header_rowspan = $rowspan;
        if ($colspan && is_array ($colspan)) self::$header_colspan = $colspan;
    }

    final static function setStyle ($element, $css) {
        self::$css .= PHP_EOL. $element. ' {'. $css. '}';
    }

    final static function setCellStyle ($cell_id, $css) {
        self::$css .= self::setStyle ('#'. $cell_id, $css);
    }

    final static function setColumnStyle ($col_id, $css) {
        self::$css .= self::setStyle ('.col'. $col_id, $css);
    }

    final static function setRowStyle ($col_id, $css) {
        self::$css .= self::setStyle ('.row'. $col_id, $css);
    }

    final private static function buildXLSStyle () {
        if (self::$css) return '<style type="text/css">'. self::$css. PHP_EOL. '</style>'. PHP_EOL;
        else return NULL;
    }

    final static function setSpanGrid ($rowspan = FALSE, $colspan = FALSE, $repeat = TRUE) {
        self::$spanrepeat = $repeat;
        if ($rowspan && is_array ($rowspan)) self::$rowspan = $rowspan;
        if ($colspan && is_array ($colspan)) self::$colspan = $colspan;
    }

    final private static function buildXLSTableRow ($row) {
        self::$row_count++;
        fseek (self::$file, 0, SEEK_END);
        self::$eof_offset = ftell (self::$file);
        fseek (self::$file, self::$offset, SEEK_SET);
        self::$content_prepend = fread (self::$file, self::$eof_offset - self::$offset);
        fseek (self::$file, self::$offset, SEEK_SET);
        $rows_array_keys = array_keys ($row);
        if (is_array ($row[$rows_array_keys[0]])) $rows = $row;
        else $rows = array ($row);
        $criterator = 0;
        foreach ($rows as $row) {
            $criterator++;
            self::$excel_row_count++;
            ob_start ();
?>
    <tr class="row<?php echo self::$excel_row_count; ?>">
<?php
            fwrite (self::$file, ob_get_clean ());
            $iterator = 0;
            rewind:
            foreach ($row as $property => $pvalue) {
                $iterator++;
                $curColumnLetter = self::getColumnLetter ($iterator);
                $rowspan = ''; $colspan = '';
                if (self::$rowspan) {
                    if (isset (self::$rowspan[$criterator][$iterator]) && self::$rowspan[$criterator][$iterator] > 1) {
                        for ($i = $criterator + 1; $i <= $criterator + self::$rowspan[$criterator][$iterator] - 1; $i++) {
                            self::$rowspan[$i][$iterator] = 0;
                        }
                        $rowspan = ' rowspan="'. self::$rowspan[$criterator][$iterator]. '"';
                    }
                    if (isset (self::$rowspan[$criterator][$iterator]) && self::$rowspan[$criterator][$iterator] == 0) {
                        goto rewind;
                    }
                }
                if (self::$colspan) {
                    if (isset (self::$colspan[$criterator][$iterator]) && self::$colspan[$criterator][$iterator] > 1) {
                        $colspan = ' colspan="'. self::$colspan[$criterator][$iterator]. '"';
                        $iterator += self::$colspan[$criterator][$iterator] - 1;
                    }
                }
                ob_start ();
?>
      <td id="<?php echo $curColumnLetter. self::$excel_row_count; ?>" class="col<?php echo $curColumnLetter; ?>"<?php echo $rowspan; ?><?php echo $colspan; ?>><?php echo $pvalue; ?></td>
<?php
                unset ($row[$property]);
                fwrite (self::$file, ob_get_clean ());
            }
            ob_start ();
?>
    </tr>
<?php
            fwrite (self::$file, ob_get_clean ());
        }
        self::$offset = ftell (self::$file);
        fwrite (self::$file, self::$content_prepend);
    }

    final private static function buildXLSTableHeader () {
        if (!self::$column_names) return FALSE;
        fseek (self::$file, 0, SEEK_END);
        self::$eof_offset = ftell (self::$file);
        fseek (self::$file, self::$offset, SEEK_SET);
        self::$content_prepend = fread (self::$file, self::$eof_offset - self::$offset);
        fseek (self::$file, self::$offset, SEEK_SET);
        $column_names_array_keys = array_keys (self::$column_names);
        if (is_array (self::$column_names[$column_names_array_keys[0]])) {
            $header_rows = self::$column_names;
        } else {
            $header_rows = array (self::$column_names);
        }
        $criterator = 0;
        foreach ($header_rows as self::$column_names) {
            $criterator++;
            self::$excel_row_count++;
            ob_start ();
?>
    <tr class="row<?php echo self::$excel_row_count; ?>">
<?php
            fwrite (self::$file, ob_get_clean ());
            $iterator = 0;
            rewind:
            foreach (self::$column_names as $id => $columnName) {
                $iterator++;
                $curColumnLetter = self::getColumnLetter ($iterator);
                $rowspan = ''; $colspan = '';
                if (self::$header_rowspan) {
                    if (isset (self::$header_rowspan[$criterator][$iterator]) && self::$header_rowspan[$criterator][$iterator] > 1) {
                        for ($i = $criterator + 1; $i <= $criterator + self::$header_rowspan[$criterator][$iterator] - 1; $i++) {
                            self::$header_rowspan[$i][$iterator] = 0;
                        }
                        $rowspan = ' rowspan="'. self::$header_rowspan[$criterator][$iterator]. '"';
                    }
                    if (isset (self::$header_rowspan[$criterator][$iterator]) && self::$header_rowspan[$criterator][$iterator] == 0) {
                        goto rewind;
                    }
                }
                if (self::$header_colspan) {
                    if (isset (self::$header_colspan[$criterator][$iterator]) && self::$header_colspan[$criterator][$iterator] > 1) {
                        $colspan = ' colspan="'. self::$header_colspan[$criterator][$iterator]. '"';
                        $iterator += self::$header_colspan[$criterator][$iterator] - 1;
                    }
                }
                ob_start ();
?>
      <td id="<?php echo $curColumnLetter. self::$excel_row_count; ?>" class="col<?php echo $curColumnLetter; ?>"<?php echo $rowspan; ?><?php echo $colspan; ?>><?php echo $columnName; ?></td>
<?php
                unset (self::$column_names[$id]);
                fwrite (self::$file, ob_get_clean ());
            }
            ob_start ();
?>
    </tr>
<?php
            fwrite (self::$file, ob_get_clean ());
        }
        self::$offset = ftell (self::$file);
        fwrite (self::$file, self::$content_prepend);
    }

    final private static function buildXLSTable () {
        fseek (self::$file, 0, SEEK_END);
        self::$eof_offset = ftell (self::$file);
        fseek (self::$file, self::$offset, SEEK_SET);
        self::$content_prepend = fread (self::$file, self::$eof_offset - self::$offset);
        fseek (self::$file, self::$offset, SEEK_SET);
        ob_start ();
?>
  <table style="border-collapse:collapse">
<?php
        fwrite (self::$file, ob_get_clean ());
        self::$offset = ftell (self::$file);
        ob_start ();
?>
  </table>
<?php
        fwrite (self::$file, ob_get_clean ());
        fwrite (self::$file, self::$content_prepend);
        self::buildXLSTableHeader ();
    }

    final private static function buildXLSHtml () {
        self::$content_prepend = FALSE;
        ob_start ();
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Excel.Sheet">
<?php echo self::buildXLSStyle (); ?>
</head>
<body>
<?php
        fwrite (self::$file, ob_get_clean ());
        self::$offset = ftell (self::$file);
        ob_start ();
?>
</body>
</html>
<?php
        fwrite (self::$file, ob_get_clean ());
    }

    final static function buildXLSFile () {
        if (self::$filename && file_exists (self::$filename)) {
            self::$file = fopen (self::$filename, 'r+');
            fseek (self::$file, 0, SEEK_END);
            if (self::$appending) return;
        } else {
            self::$filename = tempnam (PATH_TMP, 'xls_');
            self::$file = fopen (self::$filename, 'w+');
            self::$parts = 0;
            if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
                $d = new DateTime ();
                $date = $d->format (DBD::FORMAT_DATETIME);
                $s = DBD::get(1)->prepare ('INSERT INTO `sb_fxls` (
                                      `date`, `user`, `tmpfile`, `excel_row_count`,
                                      `row_count`, `parts`, `status`
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?)');
                if (!$s->execute (array ($date, User::get ('id'), self::$filename, 0, 0, self::$parts, 0))) defined ('SYS_CLI') && CLI::report ('FXLS.InsertDBRecord') || Core::report ('FXLS.InsertDBRecord');
                self::$date = $date;
            }
        }
        self::$excel_row_count = 0;
        self::$row_count = 0;
        self::buildXLSHtml ();
        self::buildXLSTable ();
    }
    
    final static function buildCSVFile () {
        if (self::$filename && file_exists (self::$filename)) {
            self::$file = fopen (self::$filename, 'r+');
            fseek (self::$file, 0, SEEK_END);
            if (self::$appending) return;
        } else {
            self::$filename = tempnam (PATH_TMP, 'csv_');
            self::$file = fopen (self::$filename, 'w+');
            self::$parts = 0;
            if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
                $d = new DateTime ();
                $date = $d->format (DBD::FORMAT_DATETIME);
                $s = DBD::get(1)->prepare ('INSERT INTO `sb_fxls` (
                                      `date`, `user`, `tmpfile`, `ftype`,
                                      `row_count`, `total_count`, `parts`, `status`
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                if (!$s->execute (array ($date, User::get ('id'), self::$filename, FXLS::FILE_CSV, 0, self::$total_count, self::$parts, 0))) defined ('SYS_CLI') &&  CLI::report ('FXLS.InsertDBRecord') || Core::report ('FXLS.InsertDBRecord');
                self::$date = $date;
            }
        }
        self::$row_count = 0;
        if (self::$column_names) fwrite (self::$file, iconv ('UTF-8', 'cp1251', implode (';', self::$column_names)). PHP_EOL);
//        if (self::$column_names) fwrite (self::$file,  mb_convert_encoding(implode (';', self::$column_names), "Windows-1251", "utf-8"). PHP_EOL);
    }

    final static function fromPDO (PDOStatement $s) {
        while ($r = $s->fetch (PDO::FETCH_ASSOC)) {
            self::$ftype === FXLS::FILE_XLS && self::buildXLSTableRow ($r);
            self::$ftype === FXLS::FILE_CSV && fwrite (self::$file, iconv ('UTF-8', 'cp1251', implode (';', preg_replace('/["`\n\r]/ui', '', $r))). PHP_EOL);
//            self::$ftype === FXLS::FILE_CSV && fwrite (self::$file, mb_convert_encoding (implode (';', self::$column_names), "Windows-1251", "utf-8"). PHP_EOL);
            if (self::timeout ()) break;
        }
        if (self::$row_count < self::$total_count) {
            self::$timeout = TRUE;
        }
        self::$parts++;
    }

    final static function fromArray (array $s) {
        // Этот костыль нужно както по другому переделать
        if (self::$ftype === FXLS::FILE_XLS && self::$spanrepeat === FALSE) {
            self::buildXLSTableRow ($s);
        } else {
            foreach ($s as $row => $data) {
                self::$ftype === FXLS::FILE_XLS && self::buildXLSTableRow ($data);
                self::$ftype === FXLS::FILE_CSV && fwrite (self::$file, iconv ('UTF-8', 'cp1251', implode (';', preg_replace('/["`\n\r]/ui', '', $data))). PHP_EOL);
//                self::$ftype === FXLS::FILE_CSV && fwrite (self::$file, mb_convert_encoding(implode (';', preg_replace('/["`\n\r]/ui', '', $data)), "Windows-1251", "utf-8"). PHP_EOL);
                if (self::timeout ()) break;
            }
        }
        if (self::$row_count < self::$total_count) {
            self::$timeout = TRUE;
        }
        self::$parts++;
    }

    final static function download () {
        if (self::$realname) {
            download (self::$filename, self::$realname);
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

    final static function processedRecords ($limited = FALSE) {
        if (!self::$appending) return 0;
        return self::$row_count;
//        else return self::$row_count - 1;
    }

    final private static function processedRecordsPercentage () {
        if (self::$total_count) return round (100 * self::processedRecords () / self::$total_count, 1);
        else return 0;
    }

    final private static function timeout () {
        if (defined ('SYS_CLI')) return FALSE;
        if (self::processLifeTime () >= FXLS_MAX_EXECUTION_TIME) {
            self::$timeout = TRUE;
            return TRUE;
        } else {
            self::$timeout = FALSE;
            return FALSE;
        }
    }
    
    final static function create ($filename, $data, $ftype = FXLS::FILE_XLS) {
        self::timerStart ();
        self::$realname = $filename;
        self::$ftype = $ftype;
        self::$ftype === FXLS::FILE_XLS && self::buildXLSFile ();
        self::$ftype === FXLS::FILE_CSV && self::buildCSVFile ();
        if ($data instanceof PDOStatement) {
            self::$total_count === FALSE && (self::$total_count = $data->rowCount ());
            self::fromPDO ($data);
        } else {
            self::$total_count === FALSE && (self::$total_count = count ($data));
            self::fromArray ($data);
        }
        fclose (self::$file);
        if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
            $s = DBD::get(1)->prepare ('UPDATE `sb_fxls`
                                SET `status`=?, `offset`=?, `excel_row_count`=?, `row_count`=?, `total_count`=?, `parts`=?, `genesis`=?
                                WHERE `user`=? AND `date`=?');
            if (!$s->execute (array (
                '1', self::$offset, self::$excel_row_count, self::$row_count, self::$total_count, self::$parts, 
                self::genesis (), User::get ('id'), self::$date
            ))) defined ('SYS_CLI') && CLI::report ('FXLS.UpdateDBRecord') || Core::report ('FXLS.UpdateDBRecord');
        }
    }

    final static function load ($filename, $data, $total_records = FALSE, $ftype = FXLS::FILE_XLS) {
        self::$total_count = $total_records;
        self::create ($filename, $data, $ftype);
        if (class_exists ('AJAX')) AJAX::set ('FXLS_PROCESSED', self::processedRecordsPercentage ());
        if (self::$timeout) {
            if (class_exists ('DBD') && class_exists ('User') && User::authCheck ()) {
                $s = DBD::get(1)->prepare ('UPDATE `sb_fxls` SET `status`=? WHERE `user`=? AND `date`=?');
                if (!$s->execute (array ('-1', User::get ('id'), self::$date))) defined ('SYS_CLI') && CLI::report ('FXLS.UpdateDBRecord') || Core::report ('FXLS.UpdateDBRecord');
            }
            if (class_exists ('AJAX')) AJAX::set ('FXLS_TIMEOUT', TRUE);
        } else self::download ();
    }
}

if (!defined ('SYS_CLI')) {
    FXLS::$appending = Core::getInputVar (INPUT_REQUEST, NULL, 'fxls_append');
    if (FXLS::$appending) {
        $s = DBD::get(1)->prepare ('SELECT
                              `date`, `tmpfile`, `ftype`, `offset`, `excel_row_count`,
                              `row_count`, `total_count`, `parts`, `status`, `genesis`
                            FROM `sb_fxls`
                            WHERE `user`=:1 AND `date` = (SELECT MAX(`date`) FROM `sb_fxls` WHERE `user`=:1)');
        if (!$s->execute (array (':1' => User::get ('id')))) Core::report ('FXLS.GetDBRecord');
        if ($r = $s->fetch ()) {
            FXLS::$date = $r->date;
            FXLS::$filename = $r->tmpfile;
            FXLS::$ftype = $r->ftype;
            FXLS::$offset = $r->offset;
            FXLS::$excel_row_count = $r->excel_row_count;
            FXLS::$row_count = $r->row_count;
            FXLS::$total_count = $r->total_count;
            FXLS::$parts = $r->parts;
            FXLS::$genesis = (double)$r->genesis;
        } else {
            FXLS::$appending = FALSE;
        }
    }
}

?>