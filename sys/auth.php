<?php

class Auth implements Authorization  {
    
    private static $data = array ('login' => FALSE, 'auth' => FALSE);
    
    public static function exportVars () {
        return array (
            'id' => static::get ('id'),
            'auth' => static::get ('auth'),
            'access' => static::get ('access'),
            'expires' => static::get ('expires'),
            'login' => static::get ('login'),
            'module' => static::get ('module'),
            'position' => static::get ('position'),
            'struct' => static::get ('struct'),
            'learning' => static::get ('learning'),
            'c_id_prov' => static::get ('c_id_prov'),
            'c_id' => static::get ('c_id'),
            'flag' => static::get ('flag'),
            'username' => static::get ('username'),
            'sumode' => isset ($_SESSION['user']['sumode']),
            'ip' => Core::getInputVar (INPUT_SERVER, 0, 'REMOTE_ADDR')
        );
    }
    
    public static function get () {
        $r = static::$data;
        $args = func_get_args ();

        foreach ($args as $arg) {
            if (isset ($r[$arg])) $r = $r[$arg];
            else return NULL;
        }

        return $r;
    }

    public static function check () {
        
        if ($_SESSION['user']['id'] != 0) {
            if (defined ('SESSION_TIMEOUT_REQUEST') && SESSION_TIMEOUT_REQUEST === FALSE) {
                $s = DBD::prepare ('SELECT HIGH_PRIORITY `sb_employee`.`id`, `username`, `locked`, `struct`, `position`, `module`, `expires`, `dt_reg`, `learning`, `c_id`, `flag` FROM `sb_employee`, `sb_employee_data`
                                    WHERE `sb_employee`.`id`=? AND `sb_employee`.`username`=? AND `sb_employee`.`id`=`sb_employee_data`.`id` LIMIT 1');
                $s->execute (array($_SESSION['user']['id'], $_SESSION['user']['username'])) or Core::report ('Auth.authCheck.getSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                if (($r = $s->fetch ()) === FALSE) {
                    Core::log (Core::LOG_AUTH, '[Auth] Auth::check(): Invalid user in user session ID: ', $_SESSION['user']['id']);
                    User::logout ();
                    return FALSE;
                } else {
                    $_SESSION['user']['locked'] = $r->locked;
                    $_SESSION['user']['struct'] = $r->struct;
                    $_SESSION['user']['position'] = $r->position;
                    $_SESSION['user']['module'] = $r->module;
                    $_SESSION['user']['expires'] = $r->expires;
                    $_SESSION['user']['dt_reg'] = $r->dt_reg;
                    $_SESSION['user']['learning'] = $r->learning;
                    $_SESSION['user']['c_id'] = $r->c_id;
                    $_SESSION['user']['flag'] = $r->flag;
                }
            } else {
                $r = new stdClass ();
                $r->id = $_SESSION['user']['id'];
                $r->locked = $_SESSION['user']['locked'];
                $r->flag = $_SESSION['user']['flag'];
                $r->c_id = $_SESSION['user']['c_id'];
                $r->module = $_SESSION['user']['module'];
                $r->position = $_SESSION['user']['position'];
                $r->struct = $_SESSION['user']['struct'];
                $r->username = $_SESSION['user']['username'];
                $r->expires = $_SESSION['user']['expires'];
                $r->dt_reg = $_SESSION['user']['dt_reg'];
                $r->learning = $_SESSION['user']['learning'];
            }
        } else {
            $r = new stdClass ();
            $r->id = 0;
            $r->locked = '0';
            $r->flag = 0;
            $r->c_id = NULL;
            $r->module = NULL;
            $r->position = 0;
            $r->struct = 0;
            $r->username = $_SESSION['user']['username'];
            $r->expires = new DateTime ();
            $r->expires->add (new DateInterval ('P10D'));
            $r->expires = $r->expires->format (DBD::FORMAT_DATETIME);
            $r->dt_reg = new DateTime ();
            $r->dt_reg = $r->dt_reg->format (DBD::FORMAT_DATE);
            $r->learning = new DateTime ();
            $r->learning->sub (new DateInterval ('P10D'));
            $r->learning = $r->learning->format (DBD::FORMAT_DATE);
        }
        if ($r->locked !== '0') {
            switch ($r->locked) {
                case '-1':
                    $msg = 'Ваш обліковий запис очікує підтвердження реєстрації.';
                break;

                case '1': case '2':
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY `time`, `reason` FROM `sb_employee_lock` WHERE `id`=? ORDER BY `time` DESC LIMIT 1');
                    $s->execute (array ($r->id)) or Core::report ('Auth.check.getSbEmployeeLockRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));

                    if ($lr = $s->fetch ()) {
                        $msg = sprintf ('Ваш обліковий запис заблоковано %s. Причина: %s (%s)',
                            $r->locked === '1' ? 'адміністратором' : 'системою', $lr->reason, Core::dateTimeConvert ($lr->time, DBD::FORMAT_DATETIME, FORMAT_DATETIME));
                    } else {
                         Core::report ('Auth.check.fetchSbEmployeeLockRecord', Core::ERR_FATAL, 'User "%s/%d" is locked, but lock reason is not specified.', $r->username, $r->id);
                    }
                break;

                case '3':
                    $msg = 'Ваш обліковий запис заблоковано. Причина: звільнення.';
                break;
            }
            User::logout ();

            Core::message (Core::MSG_ERROR, $msg);
            return FALSE;
        }
//        ($r->id == 0) || DBD::prepare ('UPDATE `sb_employee` SET `dt_active`=? WHERE `id`=?')->execute (array (date ('Y-m-d H:i:s'), $r->id)) or Core::report ('Auth.check.updateSbEmloyeeDTActive');
        ($r->id == 0) || DBD::prepare ('REPLACE INTO `sb_employee_active`(`dt_active`, `id`) VALUES(?,?)')->execute (array (date ('Y-m-d H:i:s'), $r->id)) or Core::report ('Auth.check.updateSbEmloyeeDTActive');

        $now = new DateTime ();
        $r->expires = Core::dateTimeConvert ($r->expires, DBD::FORMAT_DATETIME);
        $r->dt_reg = Core::dateTimeConvert ($r->dt_reg, DBD::FORMAT_DATE);
        $r->learning = Core::dateTimeConvert ($r->learning, DBD::FORMAT_DATE);
        
        $c_id_prov = in_array ($r->struct, $c_id_prov['struct']);
        
        static::$data = array (
            'access' => isset ($_SESSION['user']['access']) ? $_SESSION['user']['access'] : NULL,
            'auth' => TRUE,
            'expires' => (int) $now->diff ($r->expires)->format ('%R%a'),
            'id' => $r->id,
            'login' => static::get ('login'),
            'module' => $r->module,
            'position' => $r->position,
            'struct' => $r->struct,
            'learning' => ($r->struct == 2 && $r->learning != NULL) ? (int) $now->diff ($r->learning)->format ('%R%a') : 0,
            'c_id' => $r->c_id,
            'flag' => $r->flag,
            'c_id_prov' => $c_id_prov,
            'sumode' => isset ($_SESSION['user']['sumode']),
            'username' => $r->username
        );
        
        return static::$data;
    }

    public static function aTry ($username, $password) {
        
        require_once PATH_SYS. 'ldap'. PHP;
        
        if (LDAP::authBot ()) LDAP::getData ($username);

        $s = DBD::prepare ('SELECT HIGH_PRIORITY `id`, `username`, `password`, `attempts`, `locked`, `struct`, `flag`, `expires` FROM `sb_employee` WHERE `username`=? LIMIT 1');
        $s->execute (array ($username)) or Core::report ('Auth.aTry.getSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if (($r = $s->fetch ()) === FALSE && !LDAP::get ('samaccountname')) {
            Core::message (0, 'Ви ввели невірне ім\'я користувача! (1)');
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $username));
            Core::log (Core::LOG_AUTH, '[Auth] Auth::aTry(): Trying to authenticate with invalid username: "', $username, '".');
            static::$data['auth'] = FALSE;
            return static::$data;
        } else if ($r !== FALSE && ($r->struct == 2 || User::FLAG_BOT & $r->flag)) {
            if (++$r->attempts > 5 && $r->locked === '0') {
                DBD::prepare ('UPDATE `sb_employee` SET `locked`=2, `attempts`=? WHERE `id`=?')->execute (array ($r->attempts, $r->id))
                    or Core::report ('Auth.aTry.writeSbEmployeeLocked', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                DBD::prepare ('INSERT INTO `sb_employee_lock` (`id`, `reason`, `time`) VALUES (?, "Багаторазово введено невірний пароль.", ?)')->execute (array ($r->id, date ('Y-m-d H:i:s')))
                    or Core::report ('Auth.aTry.writeSbEmployeeLockReason', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                $r->locked = '2';
            }

            require_once PATH_SYS. 'pwhash'. PHP;
            $s = DBD::prepare ('UPDATE `sb_employee` SET `attempts`=? WHERE `id`=?');
            if (PwHash::check ($password, $r->password)) {
                $s->execute (array (0, $r->id)) or Core::report ('Auth.aTry.writeSbEmployeeAttemts0', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
            } else {
                Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_PASSWORD, 'username' => $username));
                Core::log (Core::LOG_LOCK, '[Auth] Auth::aTry(): Trying to authenticate with username "', $username, '" and invalid password.');
                $s->execute (array ($r->attempts, $r->id)) or Core::report ('User.authTry.writeSbEmployeeAttempts', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                Core::message (0, 'Введено невірний пароль (Спроба '. $r->attempts. '/5)!');
                static::$data['auth'] = FALSE;
                return static::$data;
            }
        } else if (LDAP::get ('samaccountname')) {
            if (!LDAP::auth ($username, $password)) {
                Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_PASSWORD, 'username' => $username));
                Core::log (Core::LOG_LOCK, '[Auth] Auth::aTry(): Trying to authenticate with active directory username "', $username, '" and invalid password.');
                
                if (LDAP::get ('badpwdcount') + 1 > 5) {
                    Core::log (Core::LOG_LOCK, '[Auth] Auth::aTry(): Trying to login with locked account: "', $username, '/', $r->id, '".');
                    Core::message (Core::MSG_ERROR, 'Ваш обліковий запис заблоковано системою. Причина: багаторазово введено невірний пароль ('. LDAP::convertTimestamp (LDAP::get ('badpasswordtime'), FORMAT_DATETIME).').');
                } else {
                    Core::message (0, 'Введено невірний пароль (Спроба '. (LDAP::get ('badpwdcount') + 1). '/5)!');
                }
                if ($r !== FALSE) {
                    DBD::prepare ('UPDATE `sb_employee` SET `attempts`=? WHERE `id`=?')->execute (array (LDAP::get ('badpwdcount') + 1, $r->id))
                        or Core::report ('User.authTry.writeSbEmployeeAttempts', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                }
                static::$data['auth'] = FALSE;
                return static::$data;
            } else {
                $__pwdexpires = new DateTime (LDAP::convertTimestamp (LDAP::get ('pwdlastset'), DBD::FORMAT_DATETIME));
                $__pwdexpires->add (new DateInterval ('P60D'));
                $__pwdexpires = $__pwdexpires->format (DBD::FORMAT_DATETIME);
                if ($r === FALSE) {
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY `sb_employee`.`id`, `sb_employee`.`username`, `sb_employee`.`locked`, `sb_employee`.`struct`
                        FROM `sb_employee` LEFT JOIN `sb_employee_data` USING (`id`)
                        WHERE `sb_employee_data`.`een`=? AND `sb_employee_data`.`lastname` LIKE UCASE(?) LIMIT 1');
                    $s->execute (array (LDAP::get ('employeeid'), LDAP::get ('sn'))) or Core::report ('User.authTry.searchSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    if (($r = $s->fetch ()) !== FALSE) {
                        DBD::prepare ('UPDATE `sb_employee` SET `username`=LCASE(?), `flag`=?, `expires`=? WHERE `id`=?')->execute (array ($username, User::get ('flag') | User::FLAG_LDAP_USER, $__pwdexpires, $r->id))
                            or Core::report ('User.authTry.writeSbEmployeeUsername', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                        $r->username = $username;
                    } else {
                        $r = new stdClass;
                        $r->id = 0;
                        $r->locked = '0';
                        $r->username = $username;
                        $r->displayname = LDAP::get ('displayname');
                        if (!isset ($r->displayname)) $r->displayname = 'Active Directory Bot';
                    }
                } else if (!(User::FLAG_LDAP_USER & $r->flag)) {
                    DBD::prepare ('UPDATE `sb_employee` SET `flag`=?, `expires`=?, `locked`=0 WHERE `id`=?')->execute (array (User::get ('flag') | User::FLAG_LDAP_USER, $__pwdexpires, $r->id))
                        or Core::report ('Auth.aTry.writeSbEmployeeStatus', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                } else if ($__pwdexpires != $r->expires) {
                    DBD::prepare ('UPDATE `sb_employee` SET `expires`=?, `locked`=0 WHERE `id`=?')->execute (array ($__pwdexpires, $r->id))
                        or Core::report ('Auth.aTry.writeSbEmployeeStatus', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                } else {
                    DBD::prepare ('UPDATE `sb_employee` SET `locked`=0 WHERE `id`=?')->execute (array ($r->id))
                        or Core::report ('Auth.aTry.updateLockedStatus', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                }
            }
        } else {
            Core::message (0, 'Ви ввели невірне ім\'я користувача! (2)');
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $username));
            Core::log (Core::LOG_AUTH, '[Auth] Auth::aTry(): Trying to authenticate with invalid active directory username: "', $username, '".');
            static::$data['auth'] = FALSE;
            return static::$data;
        }

        if ($r->locked !== '0') {
            Core::log (Core::LOG_LOCK, '[Auth] Auth::aTry(): Trying to login with locked account: "', $username, '/', $r->id, '".');
            $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username);
            return static::check ();
        }
        $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username, 'access' => static::accessCalc ($r->id));
        if (isset ($r->displayname)) $_SESSION['user']['displayname'] = $r->displayname;
        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_LOGIN, 'username' => $r->username));
        return static::check ();
        
    }

    public static function accessCalc ($uid) {
        if ($uid == 0) return array ('register' => TRUE);
        $s = DBD::get()->prepare ('SELECT HIGH_PRIORITY `access`, `struct`, `position`, `module` FROM `sb_employee` WHERE `id`=? LIMIT 1');
        $s->execute (array ($uid)) or Core::report ('Auth.accessCalc.getSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if (!($r = $s->fetch ())) Core::report ('Auth.accessCalc.fetchSbEmployeeRecord', Core::ERR_FATAL, 'Failed to fetch employee record for id "%s"', $uid);

        $s = DBD::prepare ('SELECT `type`, `parent` FROM `sb_struct` WHERE `id`=?');
        $s->execute (array ($r->struct)) or Core::report ('User.accessCalc.getSbStructRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if (!($rs = $s->fetch ())) Core::report ('Auth.accessCalc.fetchSbStructRecord', Core::ERR_FATAL, 'Failed to fetch struct for id "%s"', $r->struct);
        
        $access = array ();
        $s = DBD::prepare ('
            SELECT HIGH_PRIORITY `access` FROM `sb_employee_access_map` LEFT JOIN `sb_employee_access_template` ON `sb_employee_access_map`.`template`=`sb_employee_access_template`.`id`
            WHERE `sb_employee_access_map`.`id` = ?
        ');
        $s->execute (array ($uid)) || UniversalCore::report ('User.accessCalc.getSbEmployeeAccessMap', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if ($ra = $s->fetch ()) {
            $access[] = !!$ra->access ? unserialize ($ra->access) : array ();
            while ($ra = $s->fetch ()) {
                $access[] = !!$ra->access ? unserialize ($ra->access) : array ();
            };
        }

        // $access = array ();
        $s = DBD::prepare ('
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` IS NULL AND `module` IS NULL LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` IS NULL AND `module` IS NULL LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` IS NULL AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` IS NULL AND `position` IS NULL AND `module` LIKE :module LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` IS NULL AND `module` LIKE :module LIMIT 1) UNION
            (SELECT HIGH_PRIORITY `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` IS NULL AND `module` LIKE :module LIMIT 1)
        ');
        $s->execute (array (':type' => $rs->type, ':struct' => $r->struct, ':position' => $r->position, ':module' => $r->module))
            or Core::report ('Auth.accessCalc.getSbEmployeeAccessRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        while ($ra = $s->fetch ()) {
            $access[] = !!$ra->access ? unserialize ($ra->access) : array ();
        };
        $access[] = !!$r->access ? unserialize ($r->access) : array ();

        return call_user_func_array ('array_replace_recursive', $access);
    }

    public static function su ($id) {
        $s = DBD::prepare ('SELECT HIGH_PRIORITY `id`, `username`, `access` FROM `sb_employee` WHERE `id`=?');
        $s->execute (array ($id)) or Core::report ('Auth.su.getSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        $r = $s->fetch ();

        if (!$r) {
            Core::message (Core::MSG_ERROR, 'Заданого користувача не знайдено.');
            return FALSE;
        }

        $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username, 'access' => static::accessCalc ($r->id), 'sumode' => $_SESSION['user']);
        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_SU, 'username' => $r->username, 'su' => $_SESSION['user']['sumode']['id']));
        Core::log (Core::LOG_AUTH, '[su] User "', $_SESSION['user']['sumode']['username'], '/', $_SESSION['user']['sumode']['id'], '" su to "', $_SESSION['user']['username'], '/', $_SESSION['user']['id'], '"');
        
//        return static::check ();
        
        return $_SESSION['user'];

    }

}

?>
