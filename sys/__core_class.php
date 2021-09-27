<?php

defined ('SYS_CLI') && define ('__coreClass', 'CLI');
defined ('SYS_API') && define ('__coreClass', 'API');
defined ('__coreClass') || define ('__coreClass', 'Core');
defined ('VERSION') || define ('VERSION', 0);
defined ('__ARGV0__') || define ('__ARGV0__', __FILE__);

class UniversalCore {
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

        ERR_FATAL = 1,
        ERR_WARN = 2,

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

        VERSION = VERSION,
        SCRIPT = __ARGV0__;

    private static
        $lock = FALSE,
        $logs = array ('system', 'auth', 'crossmaster', 'lock'),
        $dbd = FALSE;
    
    public static function setSalesBaseDB ($dbd) {static::$dbd = $dbd;}
    
    public static function DB () {return static::$dbd;}
    
    public static function __callStatic ($method, $arguments) {
        return call_user_func_array (array (__coreClass, $method), $arguments);
    }
}

?>