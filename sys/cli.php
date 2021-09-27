<?php

// Check whether script was included previuosly or else look after argv - this should always contain at least one parameter - script file name
defined ('STDIN') or exit ('File does not requested with CLI!'. PHP_EOL);
defined ('SYS_CLI') || !isset ($argv) && exit (1);

ini_set ('memory_limit', -1);

require_once 'def.php';

define ('SYS_CLI', TRUE);
define ('__INCLUDE_SAFE__', TRUE);
define ('__ARGV0__', $argv[0]);
unset ($argv[0]);

require_once 'log'. PHP;
require_once 'str'. PHP;

require_once 'et'. PHP;
require_once 'mt'. PHP;

final class CLI {
    const
        MSG_ERROR = 0,
        MSG_INFO = 1,
        MSG_DEBUG = 2,
        MSG_REFRESH = 3,
            
        EXIT_SUCCESS = 0,
        EXIT_ERR_WARN = 1,
        EXIT_ERR_FATAL = 254,

        FAIL_SAFE = TRUE,
            
        LOG_SELF = -1,
        LOG_PREFX = 'cli.',

        LOG_SYSTEM = 0,
        LOG_AUTH = 1,
        LOG_CM = 2,
        LOG_LOCK = 3,
            
        SCRIPT = __ARGV0__;
    
    public static
        $global = array (),
        $generic = array (),
        $usage;
    
    private static
        $param = array (),
        $cp = array ('global' => array (), 'generic' => array ()),
        $vp = array ('global' => array (), 'generic' => array ());

    private static
        $logs = array ('system', 'auth', 'crossmaster', 'lock');
    
    public static function setUsage ($msg) {
        self::$usage = PHP_EOL. $msg;
    }

    public static function message ($type = self::MSG_ERROR, $msg = NULL, $terminate_refresh = FALSE) {
        if (!in_array ($type, array (0, 1, 2, 3))) {
            self::report ('CLI.message.invalidType', self::EXIT_ERR_WARN, 'Invalid message type specified for '. __METHOD__. '(): "%s"', $type);
        }
        defined ('LOG_LEVEL') && Log::EVENT_MSG & LOG_LEVEL && Log::addEvent (Log::EVENT_MSG, array ('type' => $type, 'text' => $msg));
        
        switch ($type) {
            case CLI::MSG_REFRESH: echo "\r". sprintf ('%s', $msg); if ($terminate_refresh === TRUE) echo PHP_EOL; break;
            default: echo sprintf ('%s'. PHP_EOL, $msg); break;
        }
    }

    public static function report ($code, $level = self::EXIT_ERR_FATAL, $message = NULL) {
        $args = array_slice (func_get_args (), 3);
        if (count ($args) === 1 && is_array ($args[0])) $args = $args[0];
        static::message (static::MSG_DEBUG, vsprintf ($code. ': '. $message, $args));
        exit ($level);
    }
    
    public static function processMessage ($counter, $total, $precision = 1) {
        if ($precision < 1) $precision = 1;
        if ($counter > $total) return FALSE;
        ($counter % $precision == 0 || $counter == $total) && self::message (self::MSG_REFRESH, sprintf ('  Processing: '. $counter. '/'. $total. '... %01.2f%%', round (10000 * ($counter / $total)) / 100));
    }

    function progressBar ($counter, $total, $message = "", $length = 55) {
        $prc = round( ($counter * 100) / $total, 1 );
        $bar = round( ($length * $prc) / 100 );
        self::message ( CLI::MSG_REFRESH, sprintf ("|%2\$s|%3\$s %1\$.1f%% %4\$s", $prc, str_repeat ("#", $bar), str_repeat (".", $length - $bar), $message) );
    }
    
    public static function prompt ($msg, $char = FALSE) {
        self::message (CLI::MSG_REFRESH, $msg);
        $stdin = fopen ('php://stdin', 'r');
        $char === TRUE && ($src = fgetc ($stdin)) || ($src = fgets ($stdin));
        $src = preg_replace ('/^\s*/ui', '', $src);
        $src = preg_replace ('/\s*$/ui', '', $src);
        $src = preg_replace ('/\s{2,}/ui', ' ', $src);
        return $src;
    }

    public static function loadConfigFile ($file, $fail_safe = FALSE) {
        $file = PATH_CONF. $file. INC;
        $fail = FALSE;
        is_file ($file) && is_readable ($file) || (!$fail_safe && self::report ('CLI.loadConfigFile', self::EXIT_ERR_FATAL, 'Configuration file "%s" could not be loaded. Terminating.', $file) || ($fail = TRUE));
        if ($fail) return FALSE;

        $file = file ($file);
        return unserialize ($file[1]);
    }

    public static function writeConfigFile ($file, $data) {
        !is_array ($data) && self::report ('CLI.writeConfigFile.invalidConfigData', self::EXIT_ERR_FATAL, 'Invalid data type to write inside config.');

        $file = PATH_CONF. $file. INC;
        file_put_contents ($file, '<?php defined (\'__INCLUDE_SAFE__\') || die (); ?>'. PHP_EOL. serialize ($data)) || self::report ('CLI.writeConfigFile.fileIsNotWriteable', self::EXIT_ERR_FATAL, 'Could not write to file "%s".', $file);

        return TRUE;
    }

    public static function loadMessageFile ($file, $fail_safe = FALSE) {
        $file = PATH_MSG. $file. INC;
        $fail = FALSE;
        is_file ($file) && is_readable ($file) || (!$fail_safe && static::report ('CLI.loadMessageFile', static::EXIT_ERR_FATAL, 'Message file "%s" could not be loaded. Terminating.', $file) || ($fail = TRUE));
        if ($fail) return FALSE;

        $file = file ($file);
        return unserialize ($file[1]);
    }

    public static function writeMessageFile ($file, $data) {
        !is_array ($data) && self::report ('CLI.writeMessageFile.invalidConfigData', self::EXIT_ERR_FATAL, 'Invalid data type to write inside config.');

        $file = PATH_MSG. $file. INC;
        file_put_contents ($file, '<?php defined (\'__INCLUDE_SAFE__\') || die (); ?>'. PHP_EOL. serialize ($data)) || self::report ('CLI.writeMessageFile.fileIsNotWriteable', self::EXIT_ERR_FATAL, 'Could not write to file "%s".', $file);

        return TRUE;
    }

    public static function dateTimeConvert ($date, $from, $to = NULL) {
        $out = DateTime::createFromFormat ($from, $date);

        if (!$out) return NULL;
        if (!$to) return $out;
        return $out->format ($to);
    }

    public static function log ($logfile, $string) {
        if ($logfile === self::LOG_SELF || !is_string ($logfile)) {
            $log = basename (self::SCRIPT, PHP);
        } else if (is_string ($logfile)) {
            $log = $logfile;
        }

        $log = PATH_LOG. self::LOG_PREFX. $log. LOG;
        if (file_exists ($log)) {
            !is_writable ($log) && self::report ('CLI.log.nonWritable', self::EXIT_ERR_FATAL, 'Log file "%s" is not writable.', $log);
        } else {
            !is_writable ($dir = dirname ($log)) && self::report ('CLI.log.folderNonWritable', self::EXIT_ERR_FATAL, 'Log directory "%s" is not writable.', $dir);
        }

        $time = date (FORMAT_DATETIME);
        $string = func_get_args ();
        array_shift ($string);
        $string = preg_replace ('/;/u', ',', implode ('', $string));
        file_put_contents ($log, "${time};${string}". PHP_EOL, FILE_APPEND);
    }
    
    public static function quit ($level = self::EXIT_SUCCESS) {is_string ($level) && ($level .= PHP_EOL); exit ($level);}
    
    public static function parseParams ($args) {
        if (!$args) return;
        foreach ($args as $arg) {
            if (!preg_match ('/^-+/', $arg)) continue;
            $arg = preg_replace ('/^-+/', '', $arg);
            $arg = preg_split ('/=/', $arg, 2, PREG_SPLIT_NO_EMPTY);
            $arg = preg_replace ('/(^\s+|\s+$)/', '', $arg);
            count (self::$vp['global']) && in_array ($arg[0], self::$vp['global']) && (self::$cp['global'][$arg[0]] = TRUE) || (self::$cp['global'][$arg[0]] = FALSE);
            count (self::$vp['generic']) && in_array ($arg[0], self::$vp['generic']) && (self::$cp['generic'][$arg[0]] = TRUE) || (self::$cp['generic'][$arg[0]] = FALSE);
            if (isset (self::$cp['global'][$arg[0]]) && self::$cp['global'][$arg[0]] === TRUE) {
                self::$global[$arg[0]] = isset ($arg[1]) ? $arg[1] : TRUE;
                unset (self::$cp['generic'][$arg[0]]);
            }
            if (isset (self::$cp['generic'][$arg[0]]) && self::$cp['generic'][$arg[0]] === TRUE) {
                self::$generic[$arg[0]] = isset ($arg[1]) ? $arg[1] : TRUE;
                unset (self::$cp['global'][$arg[0]]);
            }
            self::$param[$arg[0]] = isset ($arg[1]) ? $arg[1] : TRUE;
        }
        
        foreach (self::$cp['global'] as $param => $chk) $chk === FALSE && self::report ('CLI.parseParams.wrongParam', self::EXIT_ERR_WARN, '%s%s', $param, self::$usage);
        foreach (self::$cp['generic'] as $param => $chk) $chk === FALSE && self::report ('CLI.parseParams.wrongParam', self::EXIT_ERR_WARN, '%s%s', $param, self::$usage);
        
        foreach (self::$vp['global'] as $_g) !isset (self::$global[$_g]) && self::$global[$_g] = FALSE;
    }
    
    public static function globalParams () {self::$vp['global'] = func_get_args ();}
    
    public static function genericParams () {self::$vp['generic'] = func_get_args ();}
    
    public static function getParam ($param) {return self::$param[$param];}
}

CLI::setUsage ('No usage message specified.');

require_once PATH_SYS. '__core_class'. PHP;

require_once PATH_DBC. 'sb'. PHP;
Log::init ();

?>
