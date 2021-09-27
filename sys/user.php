<?php defined ('__INCLUDE_SAFE__') || die ();

require_once PATH_SYS. 'session'. PHP;

final class User {
    const
        FLAG_BOT = 0x01,
        FLAG_LDAP_USER = 0x02,
        FLAG_GOSU = 0x04,
        FLAG_API_ONLY = 0x08,
        
        PASS_NTLM = '~/NTLM';

    private static $data = array ('login' => FALSE, 'auth' => FALSE);

    public static function exportProfileVars () {
        return array (
            'id' => static::get ('id'),
            'auth' => static::get ('auth'),
            'access' => static::get ('access'),
            'ntlm' => static::get ('ntlm'),
            'expires' => static::get ('expires'),
            'login' => static::get ('login'),
            'module' => static::get ('module'),
            'position' => static::get ('position'),
            'struct' => static::get ('struct'),
            'group' => static::get ('group'),
            'learning' => static::get ('learning'),
            'c_id_prov' => static::get ('c_id_prov'),
            'c_id' => static::get ('c_id'),
            'phone_int' => static::get ('phone_int'),
            'phone_3' => static::get ('phone_3'),
            'email' => static::get ('email'),
            'flag' => static::get ('flag'),
            'username' => static::get ('username'),
            'een' => static::get ('een'),
            'sumode' => isset ($_SESSION['user']['sumode']),
            'ip' => $_SERVER['REMOTE_ADDR']
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

    public static function access ($g, $i = NULL, $warn = TRUE) {
        if ($i !== NULL) {
            if (static::get ('access', $g, $i) === FALSE || !static::get ('access', $g, $i) && !static::get ('access', 'admin', 'su')) {
                $warn && UniversalCore::message (UniversalCore::MSG_INFO, 'Ви не маєте прав доступу до даного розділу');

                return FALSE;
            }

            return TRUE;
        } else {
            if (static::get ('access', $g) === FALSE || !static::get ('access', $g) && !static::get ('access', 'admin', 'su')) {
                $warn && UniversalCore::message (UniversalCore::MSG_INFO, 'Ви не маєте прав доступу до даного розділу');

                return FALSE;
            }

            return TRUE;
        }
    }

    public static function authCheck () {
        $c_id_prov = UniversalCore::loadConfigFile ('c_id');
        if (!isset ($_SESSION['user']['username'], $_SESSION['user']['id'])) {
            return FALSE;
        }

        if ($_SESSION['user']['id'] != 0) {
            if (defined ('SESSION_TIMEOUT_REQUEST') && SESSION_TIMEOUT_REQUEST === FALSE) {
                $s = DBD::prepare ('
                    SELECT HIGH_PRIORITY `sb_employee`.`id`, `username`, `locked`, `struct`, `position`, `module`, `tg` AS `group`, `ntlm`, `expires`, `dt_reg`, `learning`, `c_id`,
                        `phone_int`, `phone_3`, `email`, `een`, `flag`
                    FROM `sb_employee`, `sb_employee_data` WHERE `sb_employee`.`id` = ? AND `sb_employee`.`username` = ? AND `sb_employee`.`id` = `sb_employee_data`.`id` LIMIT 1
                ');
                $s->execute (array ($_SESSION['user']['id'], $_SESSION['user']['username'])) ||
                    UniversalCore::report ('User.authCheck.getSbEmployeeRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                if (($r = $s->fetch ()) === FALSE) {
                    UniversalCore::log (UniversalCore::LOG_AUTH, '[user] User::authCheck(): Invalid user in user session ID: ', $_SESSION['user']['id']);
                    User::logout ();
                    return FALSE;
                } else {
                    $_SESSION['user']['locked'] = $r->locked;
                    $_SESSION['user']['struct'] = $r->struct;
                    $_SESSION['user']['group'] = $r->group;
                    $_SESSION['user']['position'] = $r->position;
                    $_SESSION['user']['module'] = $r->module;
                    $_SESSION['user']['een'] = $r->een;
                    $_SESSION['user']['ntlm'] = $r->ntlm;
                    $_SESSION['user']['expires'] = $r->expires;
                    $_SESSION['user']['dt_reg'] = $r->dt_reg;
                    $_SESSION['user']['learning'] = $r->learning;
                    $_SESSION['user']['c_id'] = $r->c_id;
                    $_SESSION['user']['phone_int'] = $r->phone_int;
                    $_SESSION['user']['email'] = $r->email;
                    $_SESSION['user']['phone_3'] = $r->phone_3;
                    $_SESSION['user']['flag'] = $r->flag;
                }
            } else {
                $r = new stdClass ();
                $r->id = $_SESSION['user']['id'];
                $r->locked = $_SESSION['user']['locked'];
                $r->flag = $_SESSION['user']['flag'];
                $r->c_id = $_SESSION['user']['c_id'];
                $r->phone_int = $_SESSION['user']['phone_int'];
                $r->phone_3 = $_SESSION['user']['phone_3'];
                $r->email = $_SESSION['user']['email'];
                $r->module = $_SESSION['user']['module'];
                $r->position = $_SESSION['user']['position'];
                $r->struct = $_SESSION['user']['struct'];
                $r->group = $_SESSION['user']['group'];
                $r->username = $_SESSION['user']['username'];
                $r->een = $_SESSION['user']['een'];
                $r->ntlm = $_SESSION['user']['ntlm'];
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
            $r->phone_int = NULL;
            $r->phone_3 = NULL;
            $r->email = NULL;
            $r->module = NULL;
            $r->position = 0;
            $r->struct = 0;
            $r->group = NULL;
            $r->username = $_SESSION['user']['username'];
            $r->een = NULL;
            $r->ntlm = NULL;
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
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY `time`, `reason` FROM `sb_employee_lock` WHERE `id` = ? ORDER BY `time` DESC LIMIT 1');
                    $s->execute (array ($r->id)) || UniversalCore::report ('User.authCheck.getSbEmployeeLockRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));

                    if ($lr = $s->fetch ()) {
                        $msg = sprintf ('Ваш обліковий запис заблоковано %s. Причина: %s (%s)',
                            $r->locked === '1' ? 'адміністратором' : 'системою', $lr->reason, UniversalCore::dateTimeConvert ($lr->time, DBD::FORMAT_DATETIME, FORMAT_DATETIME));
                    } else UniversalCore::report ('User.authCheck.fetchSbEmployeeLockRecord', UniversalCore::ERR_FATAL, 'User "%s/%d" is locked, but lock reason is not specified.', $r->username, $r->id);
                break;

                case '3':
                    $msg = 'Ваш обліковий запис заблоковано. Причина: звільнення.';
                break;
            }
            User::logout ();

            UniversalCore::message (UniversalCore::MSG_ERROR, $msg);
            return FALSE;
        }
        $dt = new DateTime ();
        $dt = $dt->format (DBD::FORMAT_DATETIME);
        if ($r->id != 0) {
            $s = DBD::prepare ('REPLACE INTO `sb_employee_active` (`dt_active`, `id`) VALUES (?, ?)');
            $s->execute (array ($dt, $r->id)) || UniversalCore::report ('User.authCheck.updateSbEmloyeeDTActive', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        }

        $now = new DateTime ();
        $r->expires = UniversalCore::dateTimeConvert ($r->expires, DBD::FORMAT_DATETIME);
        $r->dt_reg = UniversalCore::dateTimeConvert ($r->dt_reg, DBD::FORMAT_DATE);
        $r->learning = UniversalCore::dateTimeConvert ($r->learning, DBD::FORMAT_DATE);
        $c_id_prov = in_array ($r->struct, $c_id_prov['struct']);
        static::$data = array (
            'access' => isset ($_SESSION['user']['access']) ? $_SESSION['user']['access'] : NULL,
            'auth' => TRUE,
            'ntlm' => $r->ntlm,
            'expires' => (int) $now->diff ($r->expires)->format ('%R%a'),
            'id' => $r->id,
            'login' => static::get ('login'),
            'module' => $r->module,
            'position' => $r->position,
            'struct' => $r->struct,
            'group' => $r->group,
            'learning' => ($r->struct == 2 && $r->learning != NULL) ? (int) $now->diff ($r->learning)->format ('%R%a') : 0,
            'c_id' => $r->c_id,
            'phone_int' => $r->phone_int,
            'phone_3' => $r->phone_3,
            'email' => $r->email,
            'flag' => $r->flag,
            'c_id_prov' => $c_id_prov,
            'sumode' => isset ($_SESSION['user']['sumode']),
            'username' => $r->username,
            'een' => $r->een
        );

        return TRUE;
    }

    public static function authTry ($username, $password = self::PASS_NTLM) {
        if (static::authCheck ()) return TRUE;

        require_once PATH_SYS. 'ldap'. PHP;

        if (LDAP::authBot ()) LDAP::getData ($username);

        $s = DBD::prepare ('SELECT HIGH_PRIORITY `id`, `username`, `password`, `attempts`, `locked`, `struct`, `flag`, `expires` FROM `sb_employee` WHERE `username` = ? LIMIT 1');
        $s->execute (array ($username)) || UniversalCore::report ('User.authTry.getSbEmployeeRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if (($r = $s->fetch ()) === FALSE && !LDAP::get ('samaccountname')) {
            UniversalCore::message (UniversalCore::MSG_ERROR, 'Ви ввели невірне ім\'я користувача! (1)');
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $username));
            UniversalCore::log (UniversalCore::LOG_AUTH, '[user] User::authTry(): Trying to authenticate with invalid username: "', $username, '".');
            return static::$data['auth'] = FALSE;
        } else if ($r !== FALSE && ($r->struct == 2 || User::FLAG_BOT & $r->flag)) {
            if (++$r->attempts > 5 && $r->locked === '0') {
                $s = DBD::prepare ('UPDATE `sb_employee` SET `locked` = 2, `attempts` = ? WHERE `id` = ?');
                $s->execute (array ($r->attempts, $r->id)) || UniversalCore::report ('User.authTry.writeSbEmployeeLocked', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                $s = DBD::prepare ('INSERT INTO `sb_employee_lock` (`id`, `reason`, `time`) VALUES (?, "Багаторазово введено невірний пароль.", ?)');
                $s->execute (array ($r->id, date ('Y-m-d H:i:s'))) || UniversalCore::report ('User.authTry.writeSbEmployeeLockReason', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                $r->locked = '2';
            }

            if (!($password === self::PASS_NTLM && class_exists ('APIKey') && APIKey::auth ())) {
                require_once PATH_SYS. 'pwhash'. PHP;
                if (!PwHash::check ($password, $r->password)) {
                    Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_PASSWORD, 'username' => $username));
                    UniversalCore::log (UniversalCore::LOG_LOCK, '[user] User::authTry(): Trying to authenticate with username "', $username, '" and invalid password.');
                    $s = DBD::prepare ('UPDATE `sb_employee` SET `attempts` = ? WHERE `id` = ?');
                    $s->execute (array ($r->attempts, $r->id)) || UniversalCore::report ('User.authTry.writeSbEmployeeAttempts', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    UniversalCore::message (UniversalCore::MSG_ERROR, 'Введено невірний пароль (Спроба '. $r->attempts. '/5)!');
                    return static::$data['auth'] = FALSE;
                }
            }
        } else if (LDAP::get ('samaccountname')) {
            $__pwdexpires = new DateTime (LDAP::convertTimestamp (LDAP::get ('pwdlastset'), DBD::FORMAT_DATETIME));
            $__pwdexpires->add (new DateInterval ('P180D'));
            $__pwdnow = new DateTime ();
            if ($__pwdexpires < $__pwdnow) {
                UniversalCore::message (UniversalCore::MSG_ERROR, 'Термін дії Вашого паролю закінчився. Вам необхідно змінити Ваш пароль до робочої станції.');
                return static::$data['auth'] = FALSE;
            }
            $__pwdexpires = $__pwdexpires->format (DBD::FORMAT_DATETIME);
            
            $_atry = FALSE;
            if ($password === self::PASS_NTLM && class_exists ('APIKey') && APIKey::auth ()) $_atry = TRUE;
            else if ($password !== self::PASS_NTLM || !isset ($_SESSION['_NTLM'])) $_atry = LDAP::auth ($username, $password);
            else $_atry = TRUE;
            if (!$_atry) {
                Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_PASSWORD, 'username' => $username));
                UniversalCore::log (UniversalCore::LOG_LOCK, '[user] User::authTry(): Trying to authenticate with active directory username "', $username, '" and invalid password.');

                if (LDAP::get ('badpwdcount') + 1 > 5) {
                    UniversalCore::log (UniversalCore::LOG_LOCK, '[user] User::authTry(): Trying to login with locked account: "', $username, '/', $r->id, '".');
                    UniversalCore::message (UniversalCore::MSG_ERROR, 'Ваш обліковий запис заблоковано системою. Причина: багаторазово введено невірний пароль ('. LDAP::convertTimestamp (LDAP::get ('badpasswordtime'), FORMAT_DATETIME).').');
                } else UniversalCore::message (0, 'Введено невірний пароль (Спроба '. (LDAP::get ('badpwdcount') + 1). '/5)!');
                if ($r !== FALSE) {
                    $s = DBD::prepare ('UPDATE `sb_employee` SET `attempts` = ? WHERE `id` = ?');
                    $s->execute (array (LDAP::get ('badpwdcount') + 1, $r->id)) ||
                        UniversalCore::report ('User.authTry.writeSbEmployeeAttempts', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                }
                return static::$data['auth'] = FALSE;
            } else {
                if ($r === FALSE) {
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY `sb_employee`.`id`, `sb_employee`.`username`, `sb_employee`.`locked`, `sb_employee`.`struct`
                        FROM `sb_employee` LEFT JOIN `sb_employee_data` USING (`id`)
                        WHERE `sb_employee_data`.`een` = ? AND `sb_employee_data`.`lastname` LIKE UCASE(?) LIMIT 1');
                    $s->execute (array (LDAP::get ('employeeid'), LDAP::get ('sn'))) || UniversalCore::report ('User.authTry.searchSbEmployeeRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    if (($r = $s->fetch ()) !== FALSE) {
                        $s = DBD::prepare ('UPDATE `sb_employee` SET `username` = LCASE(?), `flag` = ?, `expires` = ? WHERE `id` = ?');
                        $s->execute (array ($username, User::get ('flag') | User::FLAG_LDAP_USER, $__pwdexpires, $r->id)) ||
                            UniversalCore::report ('User.authTry.writeSbEmployeeUsername', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                        $r->username = $username;
                    } else {
                        $r = new stdClass;
                        $r->id = 0;
                        $r->locked = '0';
                        $r->username = $username;
                        $r->displayname = LDAP::get ('displayname');
                        if (!isset ($r->displayname)) $r->displayname = 'Active Directory Bot';
                    }
                } else {
                    if (!(User::FLAG_LDAP_USER & $r->flag)) {
                        $s = DBD::prepare ('UPDATE `sb_employee` SET `flag` = ?, `expires` = ?, `locked` = 0 WHERE `id` = ?');
                        $s->execute (array (User::get ('flag') | User::FLAG_LDAP_USER, $__pwdexpires, $r->id)) ||
                            UniversalCore::report ('User.authTry.writeSbEmployeeStatus', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    } else if ($__pwdexpires != $r->expires) {
                        $s = DBD::prepare ('UPDATE `sb_employee` SET `expires` = ?, `locked` = 0 WHERE `id` = ?');
                        $s->execute (array ($__pwdexpires, $r->id)) || UniversalCore::report ('User.authTry.writeSbEmployeeStatus', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    } else {
                        $s = DBD::prepare ('UPDATE `sb_employee` SET `locked` = 0 WHERE `id` = ?');
                        $s->execute (array ($r->id)) || UniversalCore::report ('User.authTry.updateLockedStatus', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                    }
                    $sp = DBD::prepare ('SELECT HIGH_PRIORITY `phone_int`, `phone_3`, `email` FROM `sb_employee_data` WHERE `id` = ? LIMIT 1');
                    $sp->execute (array ($r->id)) || UniversalCore::report ('User.authTry.getPhoneInt', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $sp->errorInfo ()));
                    $rph = $sp->fetch ();
                    $r->phone_int = $rph->phone_int;
                    $r->phone_3 = $rph->phone_3;
                    $r->email = $rph->email;
                    $ipphone = trim (LDAP::get ('ipphone'));
                    if (preg_match ('/[,]/', $ipphone)) {
                        $ipphone = explode (',', $ipphone);
                        if (isset($ipphone[count ($ipphone) - 1])) $ipphone = trim ($ipphone[count ($ipphone) - 1]);
                        else $ipphone = NULL;
                    }
                    $mobile = trim (LDAP::get ('mobile'));
                    if (preg_match ('/[,]/', $mobile)) {
                        $mobile = explode (',', $mobile);
                        if (isset($mobile[count ($mobile) - 1])) $mobile = trim ($mobile[count ($mobile) - 1]);
                        else $mobile = NULL;
                    }
                    if (!empty ($mobile)) $mobile = preg_replace ('/(\+38)|( )/', '', $mobile);
                    else $mobile = NULL;
                    $email = trim (LDAP::get ('mail'));
                    if (empty ($email)) $email = NULL;
                    if ($ipphone !== $r->phone_int || $mobile !== $r->phone_3 || $email !== $r->email) {
                        $sp = DBD::prepare ('UPDATE `sb_employee_data` SET `phone_int` = ?,`phone_3` = ?, `email` = ? WHERE `id` = ?');
                        $sp->execute (array ($ipphone, $mobile, $email, $r->id)) || UniversalCore::report ('User.authTry.updPhoneInt', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $sp->errorInfo ()));
                    }
                }
            }
        } else {
            UniversalCore::message (0, 'Ви ввели невірне ім\'я користувача! (2)');
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $username));
            UniversalCore::log (UniversalCore::LOG_AUTH, '[user] User::authTry(): Trying to authenticate with invalid active directory username: "', $username, '".');
            return static::$data['auth'] = FALSE;
        }
//        UniversalCore::message (UniversalCore::MSG_DEBUG, 'SESSION_HANDLER='. (defined ('SESSION_HANDLER_DB') && SESSION_HANDLER_DB === TRUE ? 'DB' : 'FILES'));
//        UniversalCore::message (UniversalCore::MSG_DEBUG, 'user'. $r->id);
        defined ('SESSION_HANDLER_DB') && SESSION_HANDLER_DB === TRUE && Session::setUser ($r->id);
        if ($r->locked !== '0') {
            UniversalCore::log (UniversalCore::LOG_LOCK, '[user] User::authTry(): Trying to login with locked account: "', $username, '/', $r->id, '".');
            $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username);
            return static::authCheck ();
        }
        if ($r !== FALSE && $r->id != 0) {
            $s = DBD::prepare ('UPDATE `sb_employee` SET `attempts` = ? WHERE `id` = ?');
            $s->execute (array (0, $r->id)) || UniversalCore::report ('User.authTry.writeSbEmployeeAttempts0', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        }
        $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username, 'access' => static::accessCalc ($r->id));
        if (isset ($r->displayname)) $_SESSION['user']['displayname'] = $r->displayname;
        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_LOGIN, 'username' => $r->username));
        return static::authCheck ();
    }

    public static function accessCalc ($uid) {
        if ($uid == 0) return array ('register' => TRUE);
        $s = DBD::prepare ('SELECT HIGH_PRIORITY `access`, `struct`, `position`, `module` FROM `sb_employee` WHERE `id` = ? LIMIT 1');
        $s->execute (array ($uid)) || UniversalCore::report ('User.accessCalc.getSbEmployeeRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        if (!($r = $s->fetch ())) UniversalCore::report ('User.accessCalc.fetchSbEmployeeRecord', UniversalCore::ERR_FATAL, 'Failed to fetch employee record for id "%s"', $uid);

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
        if ($r->struct != 0) {
            $s = DBD::prepare ('SELECT `type`, `parent` FROM `sb_struct` WHERE `id` = ?');
            $s->execute (array ($r->struct)) || UniversalCore::report ('User.accessCalc.getSbStructRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
            if (!($rs = $s->fetch ())) UniversalCore::report ('User.accessCalc.fetchSbStructRecord', UniversalCore::ERR_FATAL, 'Failed to fetch struct for id "%s"', $r->struct);
        } else {
            $rs = new stdClass;
            $rs->type = 0;
        }

        $s = DBD::prepare ('
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` IS NULL AND `module` IS NULL LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` IS NULL AND `module` IS NULL LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` IS NULL AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` LIKE :position AND `module` IS NULL LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` IS NULL AND `position` IS NULL AND `module` LIKE :module LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` LIKE :type AND `struct` IS NULL AND `position` IS NULL AND `module` LIKE :module LIMIT 1) UNION
            (SELECT `sb_employee_access_template`.`access` FROM `sb_employee_access`, `sb_employee_access_template` WHERE `sb_employee_access_template`.`id`=`template_id` AND `type` IS NULL AND `struct` LIKE :struct AND `position` IS NULL AND `module` LIKE :module LIMIT 1)
        ');
        $s->execute (array (':type' => $rs->type, ':struct' => $r->struct, ':position' => $r->position, ':module' => $r->module)) ||
            UniversalCore::report ('User.accessCalc.getSbEmployeeAccessRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
        while ($ra = $s->fetch ()) {
            $access[] = !!$ra->access ? unserialize ($ra->access) : array ();
        };
        $access[] = !!$r->access ? unserialize ($r->access) : array ();

        return call_user_func_array ('array_replace_recursive', $access);
    }

    public static function su ($id = NULL) {
        if (isset ($_SESSION['user']['sumode'])) {
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_SU_EXIT, 'username' => $_SESSION['user']['username'], 'su' => $_SESSION['user']['sumode']['id']));
            UniversalCore::log (UniversalCore::LOG_AUTH, '[su] User "', $_SESSION['user']['sumode']['username'], '/', $_SESSION['user']['sumode']['id'], '" exit su from "', $_SESSION['user']['username'], '/', $_SESSION['user']['id'], '"');
            $_SESSION['user'] = $_SESSION['user']['sumode'];
            unset ($_SESSION['user']['sumode']);
            static::setState ();
        }

        if ($id) {
            $s = DBD::prepare ('SELECT `id`, `username`, `access` FROM `sb_employee` WHERE `id` = ?');
            $s->execute (array ($id)) || UniversalCore::report ('User.su.getSbEmployeeRecord', UniversalCore::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
            $r = $s->fetch ();

            if (!$r) {
                UniversalCore::message (UniversalCore::MSG_ERROR, 'Заданого користувача не знайдено.');
                return FALSE;
            }

            $_SESSION['user'] = array ('id' => $r->id, 'username' => $r->username, 'access' => static::accessCalc ($r->id), 'sumode' => $_SESSION['user']);
            Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_SU, 'username' => $r->username, 'su' => $_SESSION['user']['sumode']['id']));
            UniversalCore::log (UniversalCore::LOG_AUTH, '[su] User "', $_SESSION['user']['sumode']['username'], '/', $_SESSION['user']['sumode']['id'], '" su to "', $_SESSION['user']['username'], '/', $_SESSION['user']['id'], '"');
        }

        return static::authCheck ();
    }

    public static function setState () {static::$data['login'] = TRUE;}

    public static function logout () {
        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_LOGOUT, 'username' => isset ($_SESSION['user']) ? $_SESSION['user']['username'] : NULL));
        setcookie ('__ntlm', base64_encode ('logout/'. microtime (TRUE)), time () - 1209600, URL_ROOT, URL_HOST);
        unset ($_SESSION['user'], $_SESSION['sys'], $_SESSION['timeout'], $_SESSION['notify'], $_SESSION['refresh']);
        static::$data = array ('auth' => FALSE, 'login' => TRUE);
        return TRUE;
    }
}

?>
