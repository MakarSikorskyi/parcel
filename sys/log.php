<?php defined ('__INCLUDE_SAFE__') || die ();

defined ('LOG_CLIENT') || define ('LOG_CLIENT', TRUE);

/* Click event cookie variable hash prefix */
defined ('LOG_CPFX') || define ('LOG_CPFX', 'ce');
/* UI.report event cookie variable hash prefix */
defined ('LOG_RPFX') || define ('LOG_RPFX', 're');

/* Log Error Types Class */
final class LET {
    const E_ERROR = 'Fatal [run-time]',
          E_RECOVERABLE_ERROR = 'RFatal [run-time]',
          E_WARNING = 'Warning [run-time]',
          E_PARSE = 'Parse [compile-time]',
          E_NOTICE = 'Notice [run-time]',
          E_STRICT = 'Strict [run-time]',
          E_DEPRECATED = 'Deprecated [run-time]',
          E_COMPILE_ERROR = 'Fatal [compile-time]',
          E_COMPILE_WARNING = 'Warning [compile-time]',
          E_USER_ERROR = 'Fatal [user-generated]',
          E_USER_WARNING = 'Warning [user-generated]',
          E_USER_NOTICE = 'Notice [user-generated]',
          E_USER_DEPRECATED = 'Deprecated [user-generated]';
    
    public static function get ($type) {
        switch ($type) {
            case E_ERROR: return self::E_ERROR; break;
            case E_RECOVERABLE_ERROR: return self::E_RECOVERABLE_ERROR; break;
            case E_WARNING: return self::E_WARNING; break;
            case E_PARSE: return self::E_PARSE; break;
            case E_NOTICE: return self::E_NOTICE; break;
            case E_STRICT: return self::E_STRICT; break;
            case E_DEPRECATED: return self::E_DEPRECATED; break;
            case E_COMPILE_ERROR: return self::E_COMPILE_ERROR; break;
            case E_COMPILE_WARNING: return self::E_COMPILE_WARNING; break;
            case E_USER_ERROR: return self::E_USER_ERROR; break;
            case E_USER_WARNING: return self::E_USER_WARNING; break;
            case E_USER_NOTICE: return self::E_USER_NOTICE; break;
            case E_USER_DEPRECATED: return self::E_USER_DEPRECATED; break;
            default: return 'Unknown [unknown]';
        }
    }
}

final class Log {
    public static $decookie = FALSE;
    private static $conf = array (),
        $c = FALSE, $time, $ip = array ('new' => NULL, 'old' => NULL, 'modified' => FALSE), $eid = NULL, $pid = NULL, $url = NULL, $_get, $_post,
        $employee = -1, $data = array ('msg' => array (), 'error' => array (), 'auth' => NULL), $_carried_event = 0,
        $q = array ();

    const
        DATETIME_FORMAT = 'Y-m-d H:i:s',

        EVENT_NONE = 0x0,

        EVENT_MSG = 0x0001,           // 1
        EVENT_ERROR = 0x0002,         // 2
        EVENT_IP = 0x0004,            // 4
        EVENT_REQUEST = 0x0008,       // 8
        EVENT_SESSION = 0x0010,       // 16
        EVENT_AUTH = 0x0020,          // 32
        EVENT_APPEND = 0x0040,        // 64
        EVENT_DB_PROCEDURE = 0x0080,  // 128

        AUTH_LOGIN = 0x01,
        AUTH_LOGOUT = 0x02,
        AUTH_WRONG_USERNAME = 0x04,
        AUTH_WRONG_PASSWORD = 0x08,
        AUTH_SU = 0x10,
        AUTH_SU_EXIT = 0x20;
    
    public static function getEvent () {return self::$eid;}

    public static function init () {
        if (!self::loadConfigFile ()) return FALSE;
        defined ('LOG_LEVEL') || define ('LOG_LEVEL', self::$conf['level']);
        if (!defined ('LOG_ACTIVE') || LOG_ACTIVE === FALSE) return FALSE;
        if (!NO_DATABASE && defined ('LOG_USE_DBD_CONNECTION') && LOG_USE_DBD_CONNECTION === TRUE) {
            self::$c = DBD::get ();
        } else {
            try {
                # Connect to DB
                self::$c = @new PDO (self::$conf['db']['dsn'], self::$conf['db']['user'], self::$conf['db']['pass'], self::$conf['db']['options']);
                # Set connection charset/collation
                self::$c->query (sprintf ('SET NAMES `%s` COLLATE `%s`', self::$conf['db']['charset'], self::$conf['db']['collation']));
            } catch (PDOException $e) {
                defined ('__coreClass') && UniversalCore::report ('db.connect.failure', UniversalCore::ERR_FATAL, 'An error occured while trying to establish connection with database server');
                return FALSE;
            }
        }
        self::$time = new DateTime ();
        defined ('SYS_CLI') || (self::$_post = $_POST);
        defined ('SYS_CLI') || (self::$_get = $_GET);
        defined ('SYS_CLI') || (self::$ip['new'] = $_SERVER['REMOTE_ADDR']);
        defined ('SYS_CLI') && (self::$url = __ARGV0__) || (self::$url = $_SERVER['REQUEST_URI']);
        self::$url = explode ('?', self::$url);
        self::$url = self::$url[0];
        isset (self::$conf['suid']) && self::$employee = self::$conf['suid'];
        
        self::$q['msg'] = self::$c->prepare (sprintf ('INSERT INTO `%smsg` (`id`, `event`, `type`, `text`) VALUES (?, ?, ?, ?)', self::$conf['db']['pfx']));
        self::$q['error'] = self::$c->prepare (sprintf ('INSERT INTO `%serror` (`id`, `event`, `type`, `file`, `line`, `text`) VALUES (?, ?, ?, ?, ?, ?)', self::$conf['db']['pfx']));
        
        if (LOG_LEVEL > 0) {
            if (!(Log::EVENT_APPEND & LOG_LEVEL)) {
                self::$c->prepare (sprintf ('INSERT INTO `%sevent` (`employee`, `dt`, `event`) VALUES (?, ?, ?)', self::$conf['db']['pfx']))->execute (array (
                    self::$employee, self::$time->format (self::DATETIME_FORMAT), 0
                ));
                self::$eid = self::$c->lastInsertID ();

                if (!count (self::$_get)) self::$_get = NULL; else self::$_get = serialize (self::$_get);
                if (!count (self::$_post)) self::$_post = NULL; else {
                    if (array_key_exists ('password', self::$_post)) unset (self::$_post['password']);
                    if (array_key_exists ('rpassword', self::$_post)) unset (self::$_post['rpassword']);
                    self::$_post = serialize (self::$_post);
                }
                self::$c->prepare (sprintf ('INSERT INTO `%srequest` (`event`, `url`, `eqc`, `_get`, `_post`, `runtime`) VALUES (?, ?, ?, ?, ?, ?)', self::$conf['db']['pfx']))->execute (array (
                    self::$eid, self::$url, 0, self::$_get, self::$_post, 0
                ));
            } else if (!defined ('SYS_CLI')) {
                $s = self::$c->prepare (sprintf ('SELECT `id`, `event` FROM `%sevent` WHERE `employee` = ? ORDER BY `id` DESC LIMIT 1', self::$conf['db']['pfx']));
                $s->execute (array (self::$employee));
                $r = $s->fetch ();
                self::$eid = $r->id;
                self::$_carried_event = $r->event;
            }
        }
        return TRUE;
    }
    
    public static function addEvent ($event, array $data) {
        if (!defined ('LOG_ACTIVE') || LOG_ACTIVE === FALSE || !defined ('LOG_LEVEL')) return FALSE;
        if (Log::EVENT_MSG & LOG_LEVEL && $event === Log::EVENT_MSG) {
            self::$_carried_event |= Log::EVENT_MSG;
            if (isset (self::$q['msg'])) self::$q['msg']->execute (array (STR::uuid (), self::$eid, $data['type'], $data['text']));
        }
        if (Log::EVENT_ERROR & LOG_LEVEL && $event === Log::EVENT_ERROR) {
            self::$_carried_event |= Log::EVENT_ERROR;
            if (isset (self::$q['error'])) self::$q['error']->execute (array (STR::uuid (), self::$eid, $data['type'], $data['file'], $data['line'], $data['text']));
        }
        if (Log::EVENT_AUTH & LOG_LEVEL && $event === Log::EVENT_AUTH) {
            if ($data !== NULL && is_array ($data) && isset ($data['type'])) {
                self::$_carried_event |= Log::EVENT_AUTH;
                
                isset ($data['su']) || ($data['su'] = NULL);
                isset ($data['username']) || ($data['username'] = NULL);
                self::$c->prepare (sprintf ('REPLACE INTO `%sauth` (`event`, `type`, `su`, `username`) VALUES (?, ?, ?, ?)', self::$conf['db']['pfx']))->execute (array (
                    self::$eid, $data['type'], $data['su'], $data['username']
                ));
            }
        }
    }
    
    public static function complete ($runtime) {
        if (!defined ('LOG_ACTIVE') || LOG_ACTIVE === FALSE || !defined ('LOG_LEVEL')) return FALSE;
        defined ('SYS_CLI') || (self::$employee = ((!class_exists ('User') || User::get ('id') === NULL) ? 0 : User::get ('id')));

        if (!(Log::EVENT_APPEND & LOG_LEVEL) && (Log::EVENT_REQUEST & LOG_LEVEL || self::$_carried_event & Log::EVENT_ERROR || self::$_carried_event & Log::EVENT_MSG || self::$_carried_event & Log::EVENT_AUTH)) self::$_carried_event |= Log::EVENT_REQUEST;
        
        if (self::$_carried_event === 0) return;
        if (self::$c === FALSE) return;
        self::$c->prepare (sprintf ('UPDATE `%sevent` SET `employee` = ?, `event` = ? WHERE `id` = ?', self::$conf['db']['pfx']))->execute (array (self::$employee, self::$_carried_event, self::$eid));
        if (!(Log::EVENT_APPEND & LOG_LEVEL) && self::$_carried_event & Log::EVENT_REQUEST) {
            $eqc = NULL;
            if (class_exists ('xPDO')) $eqc = xPDO::$eqc;
            self::$c->prepare (sprintf ('UPDATE `%srequest` SET `eqc` = ?, `runtime` = ? WHERE `event` = ?', self::$conf['db']['pfx']))->execute (array (
                $eqc, $runtime, self::$eid
            ));
        }
    }
    
    public static function client () {
        if (!defined ('LOG_ACTIVE') || LOG_ACTIVE === FALSE || !defined ('LOG_LEVEL')) return FALSE;
        if (!defined ('SYS_CLI')) {
            if (LOG_CLIENT === TRUE && class_exists('User') && User::get ('id') > 0) {
                $sl = self::$c->prepare ('SELECT `id` FROM `sb_log_event` WHERE `employee` = ? ORDER BY `id` DESC LIMIT 1');
                $sl->execute (array (User::get ('id')));
                self::$pid = $sl->fetchColumn ();
            }
            
            $re = Core::getInputVar (INPUT_COOKIE, NULL, LOG_RPFX);
            self::$decookie = array ();
            $p3 = self::$c->prepare (sprintf ('INSERT INTO `%smsg` (`event`, `type`, `text`) VALUES (?, ?, ?)', self::$conf['db']['pfx']));
            if (is_array ($re)) {
                foreach ($re as $k => $msg) {
                    if (LOG_CLIENT === TRUE && Log::EVENT_MSG & LOG_LEVEL && class_exists('User') && User::get ('id') > 0 && !!self::$pid) {
                        $_msg = preg_split ('/;/', $msg);
                        if (count ($_msg) > 2) {
                            $_msg[1] = implode (';', array_slice ($_msg, 1));
                            $_msg = array ($_msg[0], $_msg[1]);
                        }
                        count ($_msg) == 2 && $p3->execute (array (
                            self::$pid, $_msg[0], $_msg[1]
                        ));
                    }
                    self::$decookie[] = LOG_RPFX. '['. $k. ']';
                    unset ($_COOKIE[LOG_RPFX][$k]);
                }
                if (!count ($_COOKIE[LOG_RPFX])) unset ($_COOKIE[LOG_RPFX]);
            }
            
            $ce = Core::getInputVar (INPUT_COOKIE, NULL, LOG_CPFX);
            if (is_array ($ce)) {
                foreach ($ce as $k => $click) {
                    if (LOG_CLIENT === TRUE && class_exists('User') && User::get ('id') > 0 && !!self::$pid) {
                        $_data = explode (';', $click);
                        $data = array ();
                        foreach ($_data as $c) {
                            $_c = preg_split ('/:/', $c);
                            if (count ($_c) > 2) {
                                $_c[1] = implode (':', array_slice ($_c, 1));
                                $_c = array ($_c[0], $_c[1]);
                            }
                            $data[$_c[0]] = $_c[1];
                        }
                        if (isset ($data['pos'])) {
                            list ($data['posx'], $data['posy']) = explode (',', $data['pos']);
                            unset ($data['pos']);
                        }
                        if (isset ($data['time'])) {
                            list ($data['time'], $data['msec']) = explode ('.', $data['time']);
                        }
                        if (!isset ($data['target'])) $data['target'] = NULL;
                        if (!isset ($data['source'])) $data['source'] = NULL;
                        if (!isset ($data['mouseButton'])) $data['mouseButton'] = NULL;
                        if (!isset ($data['posx'])) $data['posx'] = NULL;
                        if (!isset ($data['posy'])) $data['posy'] = NULL;
                        if (!isset ($data['time'])) $data['target'] = NULL;
                        if (!isset ($data['msec'])) $data['target'] = NULL;
                        count ($data) && self::$c->prepare (sprintf ('INSERT INTO `%sclient` (`event`, `target`, `source`, `button`, `pos.x`, `pos.y`, `time`, `msec`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', self::$conf['db']['pfx']))->execute (array (
                            self::$pid, $data['target'], $data['source'], $data['mouseButton'], $data['posx'], $data['posy'], $data['time'], $data['msec']
                        ));
                    }
                    self::$decookie[] = LOG_CPFX. '['. $k. ']';
                    unset ($_COOKIE[LOG_CPFX][$k]);
                }
                if (!count ($_COOKIE[LOG_CPFX])) unset ($_COOKIE[LOG_CPFX]);
            }
        }
        self::$decookie !== FALSE && !count (self::$decookie) && (self::$decookie = FALSE);
        return self::$decookie;
    }
    
    public static function checkEmployeeData ($id, $username, $een, $lastname, $firstname, $middlename) {
        if (!defined ('LOG_ACTIVE') || LOG_ACTIVE === FALSE || !defined ('LOG_LEVEL')) return FALSE;
        if (empty ($id) || empty ($username) || empty ($lastname) || empty ($firstname) || empty ($middlename) || !self::$c || defined ('SYS_CLI')) return FALSE;
        if (Log::EVENT_IP & LOG_LEVEL) {
            $s = self::$c->prepare (sprintf ('SELECT `ip` FROM `%semployee` WHERE `id` = ?', self::$conf['db']['pfx']));
            $s->execute (array ($id));
            if ($r = $s->fetch ()) self::$ip['old'] = $r->ip;
            if (!empty (self::$ip['old']) && self::$ip['old'] != self::$ip['new']) {
                self::$_carried_event |= Log::EVENT_IP;
                self::$c->prepare (sprintf ('INSERT INTO `%sip` (`event`, `old`, `new`) VALUES (?, ?, ?)', self::$conf['db']['pfx']))->execute (array (self::$eid, self::$ip['old'], self::$ip['new']));
            }
        }
        self::$c->prepare (sprintf ('REPLACE INTO `%semployee` (`id`, `username`, `een`, `lastname`, `firstname`, `middlename`, `ip`) VALUES (?, LCASE(?), ?, UCASE(?), UCASE(?), UCASE(?), ?)', self::$conf['db']['pfx']))->execute (array (
            $id, $username, $een, $lastname, $firstname, $middlename, self::$ip['new']
        ));
        self::$employee = $id;
        return TRUE;
    }

    private static function loadConfigFile () {
        $file = PATH_CONF. 'log'. INC;
        $fail = FALSE;
        is_file ($file) && is_readable ($file) || ($fail = TRUE);
        if ($fail) return FALSE;
        
        $file = file ($file);
        $data = unserialize ($file[1]);
        if (!self::checkConfigData ($data)) return FALSE;
        self::$conf = $data;
        return TRUE;
    }
    
    private static function checkConfigData ($data) {
        return TRUE;
    }

    public static function writeConfigFile ($data) {
        if (!is_array ($data)) return FALSE;

        $file = PATH_CONF. 'log'. INC;
        if (is_file ($file) && !is_writeable ($file)) return FALSE;
        
        if (!self::checkConfigData ($data)) return FALSE;

        return file_put_contents ($file, '<?php defined (\'__INCLUDE_SAFE__\') || die (); ?>'. PHP_EOL. serialize ($data));
    }
    
    public static function errorHandler ($type, $text, $file, $line) {
        self::addEvent (self::EVENT_ERROR, array ('type' => $type, 'text' => $text, 'file' => $file, 'line' => $line));
    }
    
    public static function fatalErrorHandler () {
        $err = error_get_last ();
        if (!empty ($err)) switch ($err['type']) {
            case E_ERROR: case E_PARSE: case E_COMPILE_ERROR: case E_USER_ERROR: case E_COMPILE_WARNING:
                self::addEvent (self::EVENT_ERROR, array ('type' => $err['type'], 'text' => $err['message'], 'file' => $err['file'], 'line' => $err['line']));
                ExecTimer::$timer instanceof ExecTimer && ExecTimer::$timer->__destruct () || self::complete (0);
            break;
            default: break;
        }
        if (isset ($_SESSION)) session_write_close ();
    }
}

set_error_handler ('Log::errorHandler');
register_shutdown_function ('Log::fatalErrorHandler');
?>
