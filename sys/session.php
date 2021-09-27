<?php defined ('SYS_DEF') && (SYS_DEF === TRUE) && defined ('NO_DATABASE') && (NO_DATABASE === FALSE) || die ();

// Maybe it was good idea at first, but it's not :)
// Harder to handle API-Key and Token auth methods at once
// ...So let's go the hard way!

require_once PATH_SYS. 'pwhash'. PHP;

session_name ('__salesbase');
session_set_cookie_params (0, URL_ROOT, URL_HOST, FALSE);

final class Session {
    const
        ID_HASH_ALGO = 'haval256,5',
        ID_HASH_SALT = 'G!r7M1Z(D+ZC=p6k';

    private static
        $handler = NULL,
            
        $__secured = FALSE,
        $__initialized = FALSE;
    
    public final function __construct () {
        if (static::$__initialized === TRUE || static::$__secured === FALSE) $this->__destruct ();
    }
    
    public static final function ID () {
        return session_id ();
    }
    
    public static final function setUser ($id) {
        if (!preg_match ('/^[1-9][0-9]*$/', $id)) return FALSE;
        UniversalCore::DB ()->exec ('DELETE FROM `sb_session` WHERE `employee` = '. $id. ' AND `uuid` != \''. static::hashSessionID (static::ID ()). '\'');
        $s = UniversalCore::DB ()->exec ('UPDATE `sb_session` SET `employee` = '. $id. ' WHERE `uuid` = \''. static::hashSessionID (static::ID ()). '\'');
        return ($s === FALSE ? FALSE : TRUE);
    }
    
    private static final function hashSessionID ($session) {
        if (empty ($session)) return NULL;
        return hash (static::ID_HASH_ALGO, strrev ($session). static::ID_HASH_SALT);
    }


    public static final function init () {
        if (!(static::$handler instanceof static)) {
            static::$__secured = TRUE;
            static::$handler = new static ();
            defined ('SESSION_HANDLER_DB') || define ('SESSION_HANDLER_DB', TRUE);
            SESSION_HANDLER_DB === TRUE && session_set_save_handler (
                array (static::$handler, 'open'),
                array (static::$handler, 'close'),
                array (static::$handler, 'read'),
                array (static::$handler, 'write'),
                array (static::$handler, 'destroy'),
                array (static::$handler, 'gc')
            );
            static::$__secured = FALSE;
            static::$__initialized = TRUE;
            return session_start ();
        }
        return FALSE;
    }

    public function open ($save, $name) {return TRUE;}
    
    public function close () {return TRUE;}
    
    public function read ($session) {
        $s = UniversalCore::DB ()->prepare ('SELECT HIGH_PRIORITY `data` FROM `sb_session` WHERE `uuid` = ?');
        $s->execute (array (static::hashSessionID ($session)));
        if ($r = $s->fetch ()) {
            return $r->data;
        } else return NULL;
    }
    
    public function write ($session, $data) {
        if (empty ($session)) return FALSE;
/* Рекурсивно проверяет массив сессии на правильность кодировки и если надо меняет ее. Если что закомментировать*/        
        session_decode ($data);
        array_walk_recursive ($_SESSION, function (&$item) {
            if (is_string ($item) && !empty ($item)) {
                if (!mb_check_encoding ($item, 'UTF-8')) {
                    $item = mb_convert_encoding ($item, 'utf-8', mb_detect_encoding ($item, array ('UTF-8', 'Windows-1251')));
                }
            }
        });
        $data = session_encode ();
/* ------------------------------------------------------------------------------------------------------------*/         
        $dt = new DateTime ();
        $dtf = $dt->format (DBD::FORMAT_DATETIME);
        $s = UniversalCore::DB ()->prepare ('SELECT HIGH_PRIORITY `dtc` FROM `sb_session` WHERE `uuid` = ?');
        $s->execute (array (static::hashSessionID ($session)));
        if ($r = $s->fetch ()) {
            $s = UniversalCore::DB ()->prepare ('UPDATE `sb_session` SET `dte` = ?, `data` = ? WHERE `uuid` = ?');
            return (bool) $s->execute (array ($dtf, $data, static::hashSessionID ($session)));
        }
        $s = UniversalCore::DB ()->prepare ('INSERT INTO `sb_session` (`uuid`, `dtc`, `dte`, `data`) VALUES (?, ?, ?, ?)');
        return (bool) $s->execute (array (static::hashSessionID ($session), $dtf, $dtf, $data));
    }
    
    public function destroy ($session) {
        $s = UniversalCore::DB ()->exec ('DELETE FROM `sb_session` WHERE `uuid` = \''. static::hashSessionID ($session). '\'');
        return ($s === FALSE ? FALSE : TRUE);
    }
    
    public function gc ($lifetime) {return TRUE;}
    
    public function create () {}
    
    public function __destruct () {session_write_close ();}
}

Session::init ();

?>