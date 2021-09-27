<?php
ini_set ('display_errors', FALSE);

/* == Core configuration section == */
# == Set system constants here, if you need to override their default values == #

/* == Non-configurable section == */

header ('Content-Type: text/plain; charset=UTF-8');

require_once 'def.php';

define ('__INCLUDE_SAFE__', TRUE);
require_once 'log'. PHP;
require_once 'str'. PHP;

require_once 'et'. PHP;
require_once 'mt'. PHP;

final class Core {
    const
        ERR_FATAL = 1,
        ERR_WARN = 2,

        MSG_ERROR = 0,
        MSG_INFO = 1,
        MSG_DEBUG = 2,

        FLAG_TRIM_LEFT = 1,
        FLAG_TRIM_RIGHT = 2,
        FLAG_TRIM_EXTRA = 4,
        FLAG_NULL_IF_BLANK = 8,
        FLAG_NULL_IF_WHITESPACES = 16,

        LOG_SYSTEM = 0,
        LOG_AUTH = 1,
        LOG_CM = 2,
        LOG_LOCK = 3,

        VERSION = VERSION;

    private static
        $lock = FALSE,
        $logs = array ('system', 'auth', 'crossmaster', 'lock');

    public static function report ($code, $level = self::ERR_FATAL, $message = NULL) {
        $args = array_slice (func_get_args (), 3);
        if (count ($args) === 1 && is_array ($args[0])) $args = $args[0];
        static::message (static::MSG_DEBUG, vsprintf ($code. ': '. $message, $args));

        if (self::ERR_FATAL === $level) {
            echo 'Application error. Exit code: "', $code, '". See debug data for details.';
            exit (1);
        }
    }

    public static function loadConfigFile ($file, $fail_safe = FALSE) {
        $file = PATH_CONF. $file. INC;
        $fail = FALSE;
        is_file ($file) && is_readable ($file) || (!$fail_safe && static::report ('Core.loadConfigFile', static::ERR_FATAL, 'Configuration file "%s" could not be loaded. Terminating.', $file) || ($fail = TRUE));
        if ($fail) return FALSE;
        
        $file = file ($file);
        return unserialize ($file[1]);
    }

    public static function writeConfigFile ($file, $data) {
        if (!is_array ($data)) {
            static::report ('Core.writeConfigFile.invalidConfigData', static::ERR_FATAL, 'Invalid data type to write inside config.');
        }

        $file = PATH_CONF. $file. INC;
        if (is_file ($file) && !is_writeable ($file)) {
            static::report ('Core.writeConfigFile.fileIsNotWriteable', static::ERR_FATAL, 'Could not write to file "%s".', $file);
        }

        return file_put_contents ($file, '<?php defined (\'__INCLUDE_SAFE__\') || die (); ?>'. PHP_EOL. serialize ($data));
    }

    public static function loadMessageFile ($file) {
        $file = PATH_MSG. $file. INC;
        is_file ($file) && is_readable ($file) || static::report ('Core.loadMessageFile', static::ERR_FATAL, 'Message file "%s" could not be loaded. Terminating.', $file);

        $file = file ($file);
        return unserialize ($file[1]);
    }

    public static function getInputVar ($src, $flags) {
        $src = (int) $src;
        $flags = (int) $flags;
        $args = array_slice (func_get_args (), 2);

        count ($args) === 0 && static::report ('Core.getInputVar.missingVariableName', static::ERR_FATAL, 'You must specify variable name to get from request.');

        switch ($src) {
            case INPUT_POST: $src = &$_POST; break;
            case INPUT_GET: $src = &$_GET; break;
            case INPUT_COOKIE: $src = &$_COOKIE; break;
            case INPUT_ENV: $src = &$_ENV; break;
            case INPUT_SERVER: $src = &$_SERVER; break;
            case INPUT_SESSION: $src = &$_SESSION; break;
            case INPUT_REQUEST: $src = &$_REQUEST; break;

            default:
                count ($args) === 0 && static::report ('Core.getInputVar.invalidSourceParameter', static::ERR_FATAL, 'You have specified an invalid source ($src) parameter: "%s".', $src);
            break;
        }

        while (($arg = array_shift ($args)) !== NULL) {
            if (is_array ($src) && isset ($src[$arg]) && $src[$arg] !== '') $src = &$src[$arg];
            else return NULL;
        }

        if ($src === NULL) return $src;

        if ($flags) STR::trim ($src, $flags);

        return $src;
    }

    public static function dateTimeConvert ($date, $from, $to = NULL) {
        $out = DateTime::createFromFormat ($from, $date);

        if (!$out) return NULL;
        if (!$to) return $out;
        return $out->format ($to);
    }

    public static function strEncrypt ($key, $str, $base64 = true) {
        $iv = mcrypt_create_iv (mcrypt_get_iv_size (MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_RAND);
        $result = mcrypt_encrypt (MCRYPT_RIJNDAEL_256, $key, $str, MCRYPT_MODE_ECB, $iv);
        return $base64 ? base64_encode ($result) : $result;      
    }
    
    public static function strDecrypt ($key, $str, $base64 = true) {
        $iv = mcrypt_create_iv (mcrypt_get_iv_size (MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC), MCRYPT_RAND);
        $result = trim (mcrypt_decrypt (MCRYPT_RIJNDAEL_256, $key, $base64 ? base64_decode ($str) : $str, MCRYPT_MODE_ECB, $iv));
        return $result;
    }

    public static function lock ($lock = NULL) {
        if ($lock === NULL) {
            return static::$lock;
        }

        static::$lock = !!$lock;

        return TRUE;
    }

    public static function message ($type = self::MSG_ERROR, $msg = NULL) {
        if (!in_array ($type, array (0, 1, 2))) {
            static::report ('Core.message.invalidType', static::ERR_WARN, 'Invalid message type specified for '. __METHOD__. '(): "%s"', $type);
        }
        defined ('LOG_LEVEL') && Log::EVENT_MSG & LOG_LEVEL && Log::addEvent (Log::EVENT_MSG, array ('type' => $type, 'text' => $msg));

        if ($msg === NULL) {
            $out = static::getInputVar (INPUT_SESSION, 0, 'sys', 'msg', $type);
            $_SESSION['sys']['msg'][$type] = array ();
            return $out ? $out : NULL;
        }

        if (!SYS_DEBUG && $type === static::MSG_DEBUG) {
            return TRUE;
        }
        $_SESSION['sys']['msg'][$type][] = $msg;
        return TRUE;
    }

    public static function log ($logfile, $string) {
        if (!array_key_exists ($logfile, static::$logs) && !is_string ($logfile)) {
            static::message (static::MSG_DEBUG, "Invalid log file type: \"${logfile}\". Writing to system log.");
            $logfile = static::LOG_SYSTEM;
            $log = static::$logs[$logfile];
        } else if (is_string ($logfile)) {
            $log = $logfile;
        } else {
            $log = static::$logs[$logfile];
        }

        $log = PATH_LOG. $log. LOG;
        if (file_exists ($log)) {
            !is_writable ($log) && static::report ('Core.log.nonWritable', static::ERR_FATAL, 'Log file "%s" is not writable.', $log);
        } else {
            !is_writable ($dir = dirname ($log)) && static::report ('Core.log.folderNonWritable', static::ERR_FATAL, 'Log directory "%s" is not writable.', $dir);
        }

        $time = date (FORMAT_DATETIME);
        $ip = static::getInputVar (INPUT_SERVER, 0, 'REMOTE_ADDR');
        $hn = gethostbyaddr ($ip);
        $string = func_get_args ();
        array_shift ($string);
        $string = preg_replace ('/;/u', ',', implode ('', $string));
        file_put_contents ($log, "${time};${ip};${hn};${string}\n", FILE_APPEND);
    }
}

is_readable (PATH_ROOT) || Core::report ('Core.checkPaths.Root', Core::ERR_FATAL, 'Directory "%s" is not readable. Can not continue. Please, check permissions and try again.', PATH_ROOT);
is_dir (PATH_CONF) && is_readable (PATH_CONF) ||
    Core::report ('Core.checkPaths.Conf', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_CONF);
is_dir (PATH_DATA) && is_readable (PATH_DATA) ||
    Core::report ('Core.checkPaths.Data', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_DATA);
is_dir (PATH_UL) && is_readable (PATH_UL) ||
    Core::report ('Core.checkPaths.UL', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_UL);
is_dir (PATH_DL) && is_readable (PATH_DL) ||
    Core::report ('Core.checkPaths.DL', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_DL);
is_dir (PATH_TMP) && is_readable (PATH_TMP) ||
    Core::report ('Core.checkPaths.Tmp', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_TMP);
is_dir (PATH_JS) && is_readable (PATH_JS) ||
    Core::report ('Core.checkPaths.JS', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_JS);
is_dir (PATH_LOG) && is_readable (PATH_LOG) ||
    Core::report ('Core.checkPaths.Log', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_LOG);
is_dir (PATH_MOD) && is_readable (PATH_MOD) ||
    Core::report ('Core.checkPaths.Mod', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_MOD);
is_dir (PATH_PUB) && is_readable (PATH_PUB) ||
    Core::report ('Core.checkPaths.Pub', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_PUB);
is_dir (PATH_LIB) && is_readable (PATH_LIB) ||
    Core::report ('Core.checkPaths.Lib', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_LIB);
is_dir (PATH_MSG) && is_readable (PATH_MSG) ||
    Core::report ('Core.checkPaths.Msg', Core::ERR_FATAL, 'Directory "%s" can not be opened for reading. Can not continue. Please, check permissions and try again.', PATH_MSG);

require_once PATH_SYS. '__core_class'. PHP;

require_once PATH_DBC. 'sb'. PHP;
require_once PATH_SYS. 'session'. PHP;

SYS_INIT && require_once PATH_SYS. SYS_INIT. PHP;
require_once PATH_SYS. 'mod'. PHP;

?>