<?php
ini_set ('session.use_cookies', 0);
define ('API_DEVELOPED_BY', 'Raiffeisen Bank Aval Distribution and Delivery Channels Division Customer Info Service Department', TRUE);

require_once 'def.php';

define ('SYS_API', TRUE);
define ('__INCLUDE_SAFE__', TRUE);
require_once 'log'. PHP;
require_once 'str'. PHP;

require_once 'et'. PHP;
require_once 'mt'. PHP;

require_once PATH_SYS. 'api'. _. 'handler'. PHP;

require_once PATH_LIB. 'xml'. PHP;

final class API {
    const
        METHOD_OPTIONS  = 'OPTIONS',
        METHOD_GET      = 'GET',
        METHOD_POST     = 'POST',
        METHOD_PUT      = 'PUT',
        METHOD_DELETE   = 'DELETE',
        METHOD_PATCH    = 'PATCH',

        ALLOW_OPTIONS   = 0,
        ALLOW_GET       = 0x001, // 1
        ALLOW_POST      = 0x002, // 2
        ALLOW_PUT       = 0x004, // 4
        ALLOW_DELETE    = 0x008, // 8
        ALLOW_PATCH     = 0x010, // 16

        LOG_SYSTEM = 0,
        LOG_AUTH = 1,
        LOG_CM = 2,
        LOG_LOCK = 3,

        ERR_FATAL   = 1,
        ERR_WARN    = 2,
        
        MSG_ERROR   = 0,
        MSG_INFO    = 1,
        MSG_DEBUG   = 2;
    
    private static
        $__SEND = FALSE,
        $manager = NULL,
        $__DEBUG = API_DEBUG,
        $__AUTH = FALSE,
        $__SESSID = NULL,
        $data = array (
            'response' => array (),
            'sys' => array ('env' => array ()),
            'request' => array ()
        );
    public static
        $request = array (
            'header' => array ('accept' => 'application/json', 'content-type' => 'application/json'),
            'method' => NULL, 'url' => NULL, 'body' => NULL
        );

    private static
        $logs = array ('system', 'auth', 'crossmaster', 'lock');

    public static function set ($n, $v) {
        static::$data['response'][$n] = $v;

        return TRUE;
    }
    
    private static final function  __headers () {
        header ('X-API-Developed-By: '. API_DEVELOPED_BY);
        header ('X-API-Version: '. SYS_API_VERSION);
        if (static::$__DEBUG === TRUE) header ('X-API-Debug: on');
    }

    private static final function send () {
        if (static::$__SEND === TRUE) return FALSE;
        static::__headers ();
        
        if (static::$__DEBUG !== TRUE) {
            if (isset (static::$data['sys']['debug'])) unset (static::$data['sys']['debug']);
            unset (static::$data['request'], static::$data['sys']['env']);
        } else {
            static::$data['request'] = static::$request;
            if (preg_match ('/json/', strtolower (static::$request['header']['accept'])))
                static::$data['sys']['env']['json_encode_options'] = JSON_FORCE_OBJECT | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG;
            if (!count (static::$data['sys']['env'])) unset (static::$data['sys']['env']);
        }
        if (!count (static::$data['sys'])) unset (static::$data['sys']);
        
        switch (strtolower (static::$request['header']['accept'])) {
            case 'application/xml': case 'text/xml':
                header ('Content-Type: application/xml; charset=UTF-8');
                echo XML::serialize (static::$data, 'api');
            break;
            default: case 'application/json': case 'text/json':
                header ('Content-Type: application/json; charset=UTF-8');
                echo json_encode (static::$data, JSON_FORCE_OBJECT | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG);
            break;
        }
        static::$__SEND = TRUE;
        exit (0);
    }
    
    private final function __construct () {
        static::$request['url'] = preg_replace ('/\?(.*)$/', '', $_SERVER['REQUEST_URI']);
        static::$request['url'] .= preg_match ('/\/$/', static::$request['url']) ? '' : '/';
        static::$request['method'] = $_SERVER['REQUEST_METHOD'];
        static::$request['api'] = STR::trim (preg_replace ('/\/(.*)$/', '', str_replace (URL_API, '', static::$request['url'])), STR::FLAG_ALL);
        
        foreach ($_SERVER as $key => $value) {
            if (!preg_match ('/^(HTTP_|CONTENT_)/', $key)) continue;
            if (preg_match ('/^HTTP_/', $key)) $key = substr ($key, 5);
            $header = str_replace ('_', '-', strtolower ($key));
            static::$request['header'][$header] = STR::trim ($value, STR::FLAG_ALL);
        }
        if (isset (static::$request['header']['x-api-debug']) && static::$request['header']['x-api-debug'] === 'on') static::$__DEBUG = TRUE;
        static::$request['body'] = file_get_contents ('php://input');

        switch (strtolower (static::$request['header']['content-type'])) {
            case 'application/xml': case 'text/xml':
                static::$request['body'] = XML::unserialize (static::$request['body']);
                static::$request['body'] = json_decode (json_encode (static::$request['body']), TRUE);
                $_POST = static::$request['body'];
            break;
            case 'application/x-www-form-urlencoded':
                static::$request['body'] = $_POST;
            break;
            case 'application/json': case 'text/json':
                // Remove UTF8 BOM:
                //static::$request['body'] = preg_replace ('/^'. pack ('H*', 'EFBBBF'). '/', '', static::$request['body']);
                static::$request['body'] = json_decode (static::$request['body'], TRUE);
                if ($json_error = json_last_error ()) {
                    $json_error_msg = array (
                        JSON_ERROR_DEPTH => 'The maximum stack depth has been exceeded.',
                        JSON_ERROR_STATE_MISMATCH => 'Occurs with underflow or with the modes mismatch. Invalid or malformed JSON.',
                        JSON_ERROR_CTRL_CHAR => 'Control character error, possibly incorrectly encoded.',
                        JSON_ERROR_SYNTAX => 'Syntax error.',
                        JSON_ERROR_UTF8 => 'Malformed UTF-8 characters, possibly incorrectly encoded.'
                    );
                    API::message (API::MSG_ERROR, '[JSON]['. $json_error. '] '. $json_error_msg[$json_error]);
                }
                $_POST = static::$request['body'];
            break;
            default:
                API::message (API::MSG_ERROR, 'Unsupported request content-type: '. strtolower (static::$request['header']['content-type']));
            break;
        }
        
        if (!NO_DATABASE) {
            require_once PATH_DBC. 'sb'. PHP;
            Log::init ();
            require_once PATH_SYS. 'api'. _. 'key'. PHP;
            APIKey::setVersion (SYS_API_VERSION);
            static::$data['sys']['user'] = array ('id' => 0, 'auth' => static::$__AUTH);
            if (isset (static::$request['header']['x-api-key']) && (static::$__AUTH = APIKey::auth (static::$request['header']['x-api-key']))) {
                static::$__SESSID = APIKey::getSession ();
                if (!empty (static::$__SESSID)) session_id (static::$__SESSID);
                static::$data['sys']['user']['id'] = APIKey::getUser ();
            }
            static::$data['sys']['user']['auth'] = static::$__AUTH;
            
            require_once PATH_SYS. 'user'. PHP;
            if (empty (static::$__SESSID) && static::$__AUTH === TRUE) {
                APIKey::setSession ();
                static::$__AUTH = User::authTry (APIKey::getUserName ());
            } else if (static::$__AUTH === TRUE) static::$__AUTH = User::authCheck ();
            $_SESSION['x-api'] = TRUE;
            static::$request['user'] = User::get ('id');
            static::$request['session'] = Session::ID ();
        }
        
        if (!empty (static::$request['api'])) {
            if (!file_exists (PATH_API. static::$request['api']. _. 'handler'. PHP)) {
                API::report ('API.__construct', API::ERR_FATAL, 'Missing handler: '. URL_API. static::$request['api']. _);
            }
            require_once PATH_API. static::$request['api']. _. 'handler'. PHP;
        }
    }
    
    public function __destruct () {
        $__sessid = session_id ();
        if (!self::$__AUTH && !empty ($__sessid)) session_destroy ();
        static::send ();
    }
    
    public static function init () {
        !(static::$manager instanceof static) && (static::$manager = new static ());
        return TRUE;
    }

    public static function message ($type = self::MSG_ERROR, $msg = NULL) {
        if (!in_array ($type, array (static::MSG_ERROR, static::MSG_INFO, static::MSG_DEBUG))) {
            static::report ('API.message.invalidType', static::ERR_WARN, 'Invalid message type specified for '. __METHOD__. '(): "%s"', $type);
        }
        defined ('LOG_LEVEL') && Log::EVENT_MSG & LOG_LEVEL && Log::addEvent (Log::EVENT_MSG, array ('type' => $type, 'text' => $msg));

        if (!static::$__DEBUG && $type === static::MSG_DEBUG) return TRUE;
        switch ($type) {
            case static::MSG_ERROR:
                if (!isset (self::$data['sys']['error']) || !is_array (self::$data['sys']['error'])) self::$data['sys']['error'] = array ();
                self::$data['sys']['error'][] = $msg;
            break;
            case static::MSG_INFO:
                if (!isset (self::$data['sys']['msg']) || !is_array (self::$data['sys']['msg'])) self::$data['sys']['msg'] = array ();
                self::$data['sys']['msg'][] = $msg;
            break;
            default: case static::MSG_DEBUG:
                if (!isset (self::$data['sys']['debug']) || !is_array (self::$data['sys']['debug'])) self::$data['sys']['debug'] = array ();
                self::$data['sys']['debug'][] = $msg;
            break;
        }
        return TRUE;
    }

    public static function report ($code, $level = self::ERR_FATAL, $message = NULL) {
        static::message (API::MSG_ERROR, 'Fatal error occurred. Exit code: "'. $code. '". See debug data for details.');
        $args = array_slice (func_get_args (), 3);
        if (count ($args) === 1 && is_array ($args[0])) $args = $args[0];
        static::message (static::MSG_DEBUG, vsprintf ($code. ': '. $message, $args));

        if (self::ERR_FATAL === $level) self::send ();
    }

    public static function getInputVar ($src, $flags) {
        $src = (int) $src;
        $flags = (int) $flags;
        $args = array_slice (func_get_args (), 2);

        count ($args) === 0 && static::report ('API.getInputVar.missingVariableName', static::ERR_FATAL, 'You must specify variable name to get from request.');

        switch ($src) {
            case INPUT_POST: $src = &$_POST; break;
            case INPUT_GET: $src = &$_GET; break;
            case INPUT_COOKIE: $src = &$_COOKIE; break;
            case INPUT_ENV: $src = &$_ENV; break;
            case INPUT_SERVER: $src = &$_SERVER; break;
            case INPUT_SESSION: $src = &$_SESSION; break;
            case INPUT_REQUEST: $src = &$_REQUEST; break;

            default:
                count ($args) === 0 && static::report ('API.getInputVar.invalidSourceParameter', static::ERR_FATAL, 'You have specified an invalid source ($src) parameter: "%s".', $src);
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

    public static function loadConfigFile ($file, $fail_safe = FALSE) {
        $file = PATH_CONF. $file. INC;
        $fail = FALSE;
        is_file ($file) && is_readable ($file) || (!$fail_safe && static::report ('API.loadConfigFile', static::ERR_FATAL, 'Configuration file "%s" could not be loaded. Terminating.', $file) || ($fail = TRUE));
        if ($fail) return FALSE;
        
        $file = file ($file);
        return unserialize ($file[1]);
    }

    public static function writeConfigFile ($file, $data) {
        if (!is_array ($data)) static::report ('API.writeConfigFile.invalidConfigData', static::ERR_FATAL, 'Invalid data type to write inside config.');

        $file = PATH_CONF. $file. INC;
        if (is_file ($file) && !is_writeable ($file)) static::report ('API.writeConfigFile.fileIsNotWriteable', static::ERR_FATAL, 'Could not write to file "%s".', $file);

        return file_put_contents ($file, '<?php defined (\'__INCLUDE_SAFE__\') || die (); ?>'. PHP_EOL. serialize ($data));
    }

    public static function dateTimeConvert ($date, $from, $to = NULL) {
        $out = DateTime::createFromFormat ($from, $date);

        if (!$out) return NULL;
        if (!$to) return $out;
        return $out->format ($to);
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
            !is_writable ($log) && static::report ('API.log.nonWritable', static::ERR_FATAL, 'Log file "%s" is not writable.', $log);
        } else {
            !is_writable ($dir = dirname ($log)) && static::report ('API.log.folderNonWritable', static::ERR_FATAL, 'Log directory "%s" is not writable.', $dir);
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

require_once PATH_SYS. '__core_class'. PHP;

?>