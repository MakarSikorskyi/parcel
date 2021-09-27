<?php

defined ('SYS_DEF') && exit (1);

define('NO_LDAP', TRUE);

define ('VERSION_IDX', 'dev');
define ('VERSION_DB_IDX', 'dev');
define ('VERSION_NUMBER', '0.5.5');

define ('VERSION_TXT_DEV', '[ Alpha / Development ]');
define ('SRV_ENV_MSG_DEV', 'Середовище для розробки');
define ('SRV_DB_MSG_DEV', 'Development Database');
define ('VERSION_TXT_TEST', '[ Beta / Test ]');
define ('SRV_ENV_MSG_TEST', 'Середовище для тестування');
define ('SRV_DB_MSG_TEST', 'Test Database');
define ('VERSION_TXT_PROD', '[ Stable / Production ]');
define ('SRV_ENV_MSG_PROD', '');
define ('SRV_DB_MSG_PROD', 'Production Database');

define ('VERSION', VERSION_NUMBER. ' '. (VERSION_IDX == 'prod' ? VERSION_TXT_PROD : (VERSION_IDX == 'test' ? VERSION_TXT_TEST : (VERSION_IDX == 'dev' ? VERSION_TXT_DEV : ''))));

defined ('PHP_CR') or define ('PHP_CR', "\r");

define ('SYS_OS', strtoupper (substr (PHP_OS, 0, 3)));
defined ('SYS_DEBUG') or define ('SYS_DEBUG', TRUE);
defined ('API_DEBUG') or define ('API_DEBUG', FALSE);
defined ('SYS_INIT') or define ('SYS_INIT', 'init');
defined ('SYS_DBR_ACCESS') or define ('SYS_DBR_ACCESS', FALSE);

defined ('LOG_ACTIVE') || define ('LOG_ACTIVE', TRUE);
defined ('LOG_CLIENT') || define ('LOG_CLIENT', FALSE);
defined ('LOG_USE_DBD_CONNECTION') || define ('LOG_USE_DBD_CONNECTION', TRUE);

define ('FORMAT_DATE', 'd/m/Y');
define ('FORMAT_DATETIME', 'd/m/Y H:i:s');
define ('FORMAT_TIME', 'H:i:s');
define ('FORMAT_STIME', 'H:i');

defined ('NO_DATABASE') or define ('NO_DATABASE', FALSE);
defined ('NO_LOCK') or define ('NO_LOCK', FALSE);
defined ('NO_UKEY') or define ('NO_UKEY', FALSE);
defined ('SESSION_HANDLER_DB') or define ('SESSION_HANDLER_DB', FALSE);
defined ('SESSION_TIMEOUT') or define ('SESSION_TIMEOUT', TRUE);
defined ('SESSION_TIMEOUT_REQUEST') or define ('SESSION_TIMEOUT_REQUEST', FALSE);
defined ('SESSION_REFRESH') or define ('SESSION_REFRESH', 0);
defined ('REQUEST_NOTIFY') or define ('REQUEST_NOTIFY', TRUE);
defined ('LOGIN') or define ('LOGIN', 1);
defined ('NTLM_AUTH') or define ('NTLM_AUTH', FALSE);
defined ('NTLM_PORT') or define ('NTLM_PORT', 8443);

define ('INC', '.inc');
define ('LOG', '.log');
define ('PHP', '.php');
define ('JS', '.js');
define ('HTML', '.html');
define ('SQL', '.sql');

define ('DIR_INSTALL', 'salesbase');
define ('DIR_SYS', 'sys');
define ('DIR_DBC', 'dbc');
define ('DIR_CLI', 'cli');
define ('DIR_CONF', 'conf');
define ('DIR_DATA', 'data');
define ('DIR_FB', 'fb');
define ('DIR_UL', 'ul');
define ('DIR_DL', 'dl');
define ('DIR_TMP', 'tmp');
define ('DIR_JS', 'js');
define ('DIR_LIB', 'lib');
define ('DIR_LOG', 'log');
define ('DIR_MOD', 'mod');
define ('DIR_API', 'api');
define ('DIR_MSG', 'msg');
define ('DIR_PUB', 'pub');
define ('DIR_SQL', 'sql');

define ('_', DIRECTORY_SEPARATOR);
define ('PATH_CHROOT', _. 'chroot'. _. 'web'. _);
define ('PATH_ROOT', str_replace (PATH_CHROOT, _, dirname (__DIR__). _));
define ('PATH_SYS', PATH_ROOT. DIR_SYS. _);
define ('PATH_DBC', PATH_SYS. DIR_DBC. _);
define ('PATH_CLI', PATH_ROOT. DIR_CLI. _);
define ('PATH_CONF', PATH_ROOT. DIR_CONF. _);
define ('PATH_DATA', PATH_ROOT. DIR_DATA. _);
define ('PATH_TMP', PATH_DATA. DIR_TMP. _);
define ('PATH_FB', PATH_DATA. DIR_FB. _);
define ('PATH_UL', PATH_DATA. DIR_UL. _);
define ('PATH_DL', PATH_DATA. DIR_DL. _);
define ('PATH_JS', PATH_ROOT. DIR_JS. _);
define ('PATH_LIB', PATH_ROOT. DIR_LIB. _);
define ('PATH_LOG', PATH_ROOT. DIR_LOG. _);
define ('PATH_MOD', PATH_ROOT. DIR_MOD. _);
defined ('SYS_API_VERSION') && define ('PATH_API', PATH_ROOT. DIR_API. _. SYS_API_VERSION. _);
define ('PATH_MSG', PATH_ROOT. DIR_MSG. _);
define ('PATH_PUB', PATH_ROOT. DIR_PUB. _);
define ('PATH_SQL', PATH_ROOT. DIR_SQL. _);

##----------------------------------------------------------------------------##
##    Deprecated recognition of URL_ROOT, badly working with CLI              ##
##                                                                            ##
    $url_parts = explode ('/', dirname ($_SERVER['PHP_SELF']));             ##
    $path_parts = explode (_, PATH_ROOT);                                   ##
    $URL_ROOT = array ();                                                   ##
    $i = $j = 0;                                                            ##
    $found = FALSE;                                                         ##
    while (1) {                                                             ##
        if ($j >= count ($url_parts) || $i >= count ($path_parts)) {        ##
            break;                                                          ##
        }                                                                   ##
        if ($path_parts[$i] === '') {                                       ##
            $i++;                                                           ##
            continue;                                                       ##
        }                                                                   ##
        if ($url_parts[$j] === '') {                                        ##
            $j++;                                                           ##
            continue;                                                       ##
        }                                                                   ##
        if ($found) {                                                       ##
            if ($path_parts[$i] != $url_parts[$j]) {                        ##
                break;                                                      ##
            }                                                               ##
            $URL_ROOT[] = $url_parts[$j++];                                 ##
            $i++;                                                           ##
        } else {                                                            ##
            if ($path_parts[$i] === $url_parts[$j]) {                       ##
                $found = TRUE;                                              ##
                continue;                                                   ##
            }                                                               ##
            $i++;                                                           ##
        }                                                                   ##
    }                                                                       ##
    define ('URL_ROOT', implode ('/', $URL_ROOT). '/');                ##
    unset ($URL_ROOT, $i, $j, $url_parts, $path_parts);                     ##
##----------------------------------------------------------------------------##

// $path_parts = array_reverse (explode (_, PATH_ROOT));
// $URL_ROOT = array ();
// $i = 0;
// while (TRUE) {
//     if ($path_parts[$i] == '') {
//         $i++; continue;
//     }
//     if (preg_match ('/^('. DIR_INSTALL. ')$/iu', $path_parts[$i])) break;
//     $URL_ROOT[] = $path_parts[$i]; $i++;
// }
// define ('URL_ROOT', '/'. (count($URL_ROOT) > 0 ? implode ('/', array_reverse ($URL_ROOT)). '/' : ''));
// unset ($URL_ROOT, $i, $j, $url_parts, $path_parts);

define ('URL_LIB', URL_ROOT. DIR_LIB. '/');
define ('URL_PUB', URL_ROOT. DIR_PUB. '/');
define ('URL_JS', URL_ROOT. DIR_JS. '/');
define ('URL_MOD', URL_ROOT. DIR_MOD. '/');
defined ('SYS_API_VERSION') && define ('URL_API', URL_ROOT. DIR_API. '/'. SYS_API_VERSION. '/');

if (!defined ('STDIN')) {
    define ('URL_HOST', $_SERVER['HTTP_HOST']);
    if ($_SERVER['SERVER_NAME'] && $_SERVER['SERVER_NAME'] != URL_HOST) define ('SERVER', $_SERVER['SERVER_NAME']);
    else define ('SERVER', URL_HOST);
    define ('REQUEST_METHOD', $_SERVER['REQUEST_METHOD']);
    define ('GET', 'GET');
    define ('POST', 'POST');
    define ('PUT', 'PUT');
} else {
    // Requires to add entry in etc/hosts to work properly
    SYS_OS === 'LIN' && define ('URL_HOST', gethostname ());
    SYS_OS === 'WIN' && define ('URL_HOST', gethostbyaddr (gethostbyname (gethostname ())));
    define ('SERVER', URL_HOST);

    define ('REQUEST_METHOD', NULL);
    define ('GET', NULL);
    define ('POST', NULL);
    define ('PUT', NULL);
}

define ('SYS_DEF', TRUE);

?>
