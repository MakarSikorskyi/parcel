<?php defined ('__INCLUDE_SAFE__') || die ();

final class AJAX {
    private static $data = array (
        'data' => array (),
        'sys' => array (),
        'req' => array ()
    );

    final public static function send ($exec = NULL) {

        $exec && (static::$data['sys']['exec'] = $exec);
        
        static::$data['LOG_CLIENT'] = LOG_CLIENT;
        static::$data['decookie'] = Log::client ();

        if (isset ($_SESSION['sys']['msg'])) {
            static::$data['sys']['msg'] = $_SESSION['sys']['msg'];
            $_SESSION['sys']['msg'] = array ();
        }
        
        (!NO_UKEY || !isset ($_SESSION['sys']['ukey'])) && ($_SESSION['sys']['ukey'] = uniqid ());

        static::$data['SYS_DEBUG'] = SYS_DEBUG;
        static::$data['user'] = User::exportProfileVars ();
        $cDate = new DateTime ();
        $cDate->sub (new DateInterval ('PT1M'));
        if (!User::get ('auth')) {
            $s = DBD::get (1)->prepare ('SELECT HIGH_PRIORITY COUNT(*) AS `count`, COUNT(CASE WHEN `sb_employee_active`.`dt_active` >= ? THEN 1 ELSE NULL END) AS `active` FROM `sb_employee` LEFT JOIN `sb_employee_active` USING (`id`) WHERE `locked` NOT IN (-1, 3)');
            $s->execute (array ($cDate->format ('Y-m-d H:i:s'))) or Core::report ('ajaxSend.getSbEmployeeCount', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
            $r = $s->fetch ();
            static::$data['req'] = array (
                'url' => $_SERVER['REQUEST_URI'],
                'hash' => $_SESSION['sys']['ukey'],
                '_GET' => &$_GET,
                'registered' => $r->count,
                'active' => $r->active
            );
        } else {
            static::$data['req'] = array (
                'url' => $_SERVER['REQUEST_URI'],
                'hash' => $_SESSION['sys']['ukey'],
                '_GET' => &$_GET,
                'method' => REQUEST_METHOD
            );
        }

        header ('Content-Type: application/json; charset=UTF-8');
        echo json_encode (static::$data, JSON_FORCE_OBJECT | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG);
        exit (0);
    }
    
    final public static function set ($n, $v, $flag = false) {
        if($flag) {
            static::$data[$n] = $v;
        } else {
            static::$data['data'][$n] = $v;
        }

        return TRUE;
    }
    
    final public static function setEnv ($s, $v) {
        if (!preg_match ('/(mods|regexp|URL_JS|URL_MOD|URL_PUB|URL_ROOT|URL_IMG|URL_LIB|__session|__cookie)/', $s)) return FALSE;
        static::$data[$s] = $v;
        
        return TRUE;
    }

    final public static function redirect ($url) {
        header ('Content-Type: application/json; charset=UTF-8');
        
        (!NO_UKEY || !isset ($_SESSION['sys']['ukey'])) && ($_SESSION['sys']['ukey'] = uniqid ());

        echo json_encode (
            array ('sys' => array ('redirect' => $url), 'req' => array ('url' => $_SERVER['REQUEST_URI'], 'hash' => $_SESSION['sys']['ukey'])),
            JSON_FORCE_OBJECT | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG
        );

        exit ();
    }
}

?>