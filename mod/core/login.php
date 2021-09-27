<?php

define ('LOGIN', 0);
isset ($_GET['do']) || define ('NO_UKEY', TRUE);
require_once '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'sys' . DIRECTORY_SEPARATOR . 'core.php';
require_once PATH_SYS . 'struct' . PHP;
$re = Core::loadConfigFile ('regexp');
$msg = Core::loadMessageFile ('core.login');
AJAX::set ('MSG', $msg);
$step = Core::getInputVar (INPUT_POST, NULL, 'step');
$struct1 = Core::getInputVar (INPUT_POST, NULL, 'struct');
$struct1 = Struct::getParent ($struct1);

if ($step) {
    switch ($step) {
        case 'struct':
            if ($struct1) {
                if (!$struct1) break;
                $i = 0;
                $struct1 = array ($s[$i] = $struct1);
                $chk = 0;
                while ($chk < 1) {
                    $s[$i + 1] = Struct::getParent ($s[$i]->parent);
                    if ($s[$i + 1]->id != 3) {
                        $struct1[] = $s[$i + 1];
                        $i++;
                    } else {
                        $chk++;
                    }
                }

                $s = new stdClass;
                $s->id = '';
                $s->name = 'Управління інформаційного обслуговування клієнтів';
                $struct1[] = $s;

                $s = DBD::get ()->prepare ('SELECT `id`, `name`,`type`, `parent` FROM `sb_struct` WHERE `parent`=? ORDER BY `name`DESC');
                $s->execute (array ($struct1[0]->id)) or Core::report ('register.php:' . __LINE__);
                AJAX::set ('child', $s->fetchAll ());

                $struct1 = array_reverse ($struct1);
            } else {
                $s = DBD::get ()->prepare ('SELECT `id`, `name`,`type`, `parent` FROM `sb_struct` WHERE `parent`=3  ORDER BY `name` DESC');
                $s->execute () or Core::report ('register.php:' . __LINE__);
                AJAX::set ('child', $s->fetchAll ());

                $struct1 = new stdClass;
                $struct1->id = '';
                $struct1->name = 'Управління інформаційного обслуговування клієнтів';
                $struct1 = array ($struct1);
            }
            AJAX::set ('doo', '2');
            AJAX::set ('struct', $struct1);
        break;

        case 'position':
            if (!$struct1) {
                break;
            }
            $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `id`, `name` FROM `sb_employee_position` WHERE `id` IN (SELECT DISTINCT `position` FROM `sb_employee_link` WHERE `struct`=? OR `type`=?)');
            $s->execute (array ($struct1->id, $struct1->type)) or Core::report ('register.php:' . __LINE__);
            AJAX::set ('position', $s->fetchAll ());
        break;
            
        case 'module':
            $position = Core::getInputVar (INPUT_POST, NULL, 'position');
            if (!$struct1 || !$position) {
                break;
            }
            $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `module` FROM `sb_employee_link` WHERE (`struct`=? OR `type`=?) AND `position`=?');
            $s->execute (array ($struct1->id, $struct1->type, $position)) or Core::report ('register.php:' . __LINE__);
            $s0 = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `id`, `name` FROM `sb_employee_module` WHERE `id`=?');
            $module = array ();
            while ($r = $s->fetchColumn ()) {
                $r = explode (';', $r);
                foreach ($r as $id) {
                    if (!$id) {
                        continue;
                    }
                    $s0->execute (array ($id)) or Core::report ('register.php:' . __LINE__);
                    $r0 = $s0->fetch () or Core::report ('register.php:' . __LINE__);
                    if (!isset ($module[$id])) {
                        $module[$id] = $r0;
                    }
                }
            }

            AJAX::set ('module', $module);
        break;
        
        default:
        break;
    }
} else {
    $do = Core::getInputVar (INPUT_GET, Core::FLAG_TRIM_RIGHT | Core::FLAG_TRIM_LEFT | Core::FLAG_TRIM_EXTRA | Core::FLAG_NULL_IF_WHITESPACES, 'do');
    $flag = array (
        'username' => 0x00001, 'struct' => 0x00002, 'position' => 0x00004,
        'module' => 0x00008, 'access' => 0x00010, 'learning' => 0x00020,
        'lastname' => 0x00040, 'firstname' => 0x00080, 'middlename' => 0x00100,
        'inn' => 0x00200, 'c_id' => 0x00400, 'bday' => 0x00800, 'phone' => 0x01000,
        'phone_int' => 0x02000, 'email' => 0x04000, 'een' => 0x08000,
        'join_date' => 0x10000, 'busyness' => 0x20000, 'extra' => 0x40000
    );
    switch ($do) {
        case 'login':
            if (!User::get ('auth')) {
                $data = array (
                    'username' => Core::getInputVar (INPUT_POST, Core::FLAG_TRIM_LEFT | Core::FLAG_TRIM_RIGHT | Core::FLAG_NULL_IF_WHITESPACES, 'username'),
                    'password' => Core::getInputVar (INPUT_POST, Core::FLAG_NULL_IF_WHITESPACES, 'password')
                );

                try {
                    if ($data['username'] === NULL) {
                        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $data['username']));
                        throw new Exception ($msg['login']['username-empty']);
                    }

                    if (!preg_match ('/' . $re['username'] . '/i', $data['username'])) {
                        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_USERNAME, 'username' => $data['username']));
                        throw new Exception ($msg['login']['username-invalid']);
                    }

                    if ($data['password'] === NULL) {
                        Log::addEvent (Log::EVENT_AUTH, array ('type' => Log::AUTH_WRONG_PASSWORD, 'username' => $data['username']));
                        throw new Exception ($msg['login']['password-empty']);
                    }
                    if (User::authTry ($data['username'], $data['password'])) {
                        Core::message (Core::MSG_INFO, 'Ви успішно увійшли до системи!');
                    } else {
                        throw new Exception ();
                    }
                } catch (Exception $e) {
                    if ($e->getMessage ()) Core::message (Core::MSG_ERROR, $e->getMessage ());
                    AJAX::send ();
                }
            }

            if (User::get ('auth') && User::get ('id') != 0) {
                $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `firstname`, `lastname`, `middlename`, `een` FROM `sb_employee_data` WHERE `id`=?');
                $s->execute (array (User::get ('id'))) or Core::report ('Login.login.getSbEmployeeDataRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                if ($r = $s->fetch ()) {
                    $s = DBD::get ()->prepare ('SELECT `parent`, `name` FROM `sb_struct` WHERE `id`=?');
                    $i = 0;
                    $struct = array ();
                    $sr = User::get ('struct');
                    do {
                        $s->execute (array ($sr));
                        if ($sr = $s->fetch ()) {
                            $struct[] = $sr->name;
                            $sr = $sr->parent;
                        } else break;
                    } while (++$i < 3 && $sr);

                    $struct = array_reverse ($struct);

                    $r->struct = $struct;
                    $r->username = User::get ('username');
                    Log::checkEmployeeData (User::get ('id'), $r->username, $r->een, $r->lastname, $r->firstname, $r->middlename);
                    $_SESSION['user']['data'] = $r;
                } else {
                    Core::report ('Login.login.fetchSbEmployeeDataRecord', Core::ERR_FATAL, 'User "' . User::get ('username') . '/' . User::get ('id') . '" profile data missing.');
                }
                
                User::setState ();
                User::get ('sumode') || (User::FLAG_LDAP_USER & User::get ('flag')) || User::get ('expires') <= 7 && AJAX::redirect (URL_MOD. 'core/login.php?do=expires');
                User::get ('sumode') || User::get ('struct') == 2 && User::get ('learning') <= 0 && AJAX::redirect (URL_MOD. 'core/login.php?do=learning');
            } else if (User::get ('id') == 0) {
                $r = new stdClass ();
                $r->struct = array ('Не зареєстрований користувач');
                $r->username = User::get ('username');
                $r->displayname = $_SESSION['user']['displayname'];
                unset ($_SESSION['user']['displayname']);
                $_SESSION['user']['data'] = $r;
                
                User::setState ();
                AJAX::redirect (URL_MOD. 'core/register.php');
            }
        break;

        case 'learning':
            User::get ('auth') or AJAX::send ();
            User::get ('learning') > 0 && AJAX::send ();
            User::setState ();
            $step = Core::getInputVar (INPUT_POST, NULL, 'step');
            $struct1 = Core::getInputVar (INPUT_POST, NULL, 'struct');
            $struct1 = Struct::getParent ($struct1);
            if (REQUEST_METHOD === POST) {
                $data['s_list'] = Core::getInputVar (INPUT_POST, NULL, 's_list');
                $data['struct'] = Core::getInputVar (INPUT_POST, NULL, 'struct');
                $data['position'] = Core::getInputVar (INPUT_POST, NULL, 'position');
                $data['module'] = Core::getInputVar (INPUT_POST, NULL, 'module');
                $data['join_date'] = Core::getInputVar (INPUT_POST, NULL, 'join_date');
                $data['learning'] = Core::getInputVar (INPUT_POST, NULL, 'learn');
                $data['busyness'] = Core::getInputVar (INPUT_POST, NULL, 'busyness');
                $data['een'] = Core::getInputVar (INPUT_POST, NULL, 'een');
                $data['inn'] = Core::getInputVar (INPUT_POST, NULL, 'inn');
                $data['email'] = Core::getInputVar (INPUT_POST, NULL, 'email');
                $data['phone_int'] = Core::getInputVar (INPUT_POST, NULL, 'phone_int');
                $data['phone_1'] = Core::getInputVar (INPUT_POST, NULL, 'phone_1');
                $data['phone_2'] = Core::getInputVar (INPUT_POST, NULL, 'phone_2');
                $data['phone_3'] = Core::getInputVar (INPUT_POST, NULL, 'phone_3');
                try {
                    $cf = 0x0;
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY `sb_employee`.*, `sb_employee_data`.*, `sb_cisco_team`.`id` AS `team`, `sb_cisco_group`.`id` AS `group`,
                            `sb_cisco_workflow`.`id` AS `workflow`
                        FROM `sb_employee` LEFT JOIN `sb_employee_data` USING (`id`)
                        LEFT JOIN `sb_cisco_team` USING (`struct`)
                        LEFT JOIN `sb_cisco_group` ON (`sb_cisco_group`.`id`=`sb_cisco_team`.`group`)
                        LEFT JOIN `sb_cisco_workflow` ON (`sb_cisco_workflow`.`id`=`sb_cisco_team`.`workflow`)
                        WHERE `sb_employee`.`id`=? LIMIT 1');
                    $s->execute (array (User::get ('id'))) or Core::report ('staff.php:'. __LINE__);
                    $r = $s->fetch ();
                    if ($r->extra != NULL) $r->extra = unserialize ($r->extra);
                    else $r->extra = array ();
                    
                    if ($data['s_list'] !== '-1' || !$data['struct']) {
                        throw new Exception ('Необхідно повністю обрати підрозділ!');
                    }
                    if ($data['struct'] != 2) {
                        if (!preg_match ('/' . $re['date'] . '/', $data['join_date'])) {
                            throw new Exception ('Необхідно вказати дату прийняття на роботу!');
                        }
                        if ($data['busyness'] === NULL || !in_array ($data['busyness'], array (0, 1, 2, 3))) {
                            throw new Exception ('Ви не вказали зайнятість!');
                        } else {
                            if ($data['busyness'] === '2') {
                                $data['een'] = NULL;
                            } else if (!preg_match ('/^[0-9]+$/', $data['een'])) {
                                throw new Exception ('Ви не вказали табельний номер!');
                            } else {
                                $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `een` FROM `sb_employee_data` WHERE `een`=?');
                                $s->execute (array ($data['een'])) or Core::report ('register.php:' . __LINE__);
                                if ($s->fetch ()) {
                                    throw new Exception ('Вказаний табельний номер вже зареєстровано в системі! Перевірте правильність вказаного номеру, і якщо Він вірний, зверніться до адміністратора використовуючи функцію "Підтримка користувачів"!');
                                }
                            }
                        }
                        if (!$data['position']) {
                            throw new Exception ('Ви не вказали посаду!');
                        }
                        if ($data['module'] === '') {
                            throw new Exception ('Ви не вказали модуль!');
                        }
                        $data['struct'] && ($data['struct'] = Struct::getParent ($data['struct']));
                        $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `position` FROM `sb_employee_link` WHERE (`struct`=? OR `type`=?) AND `position`=? AND (`module` LIKE ? OR "0"=?)');
                        $s->execute (array ($data['struct']->id, $data['struct']->type, $data['position'], '%;' . $data['module'] . ';%', $data['module'])) or Core::report ('register.php:' . __LINE__);
                        if (!$s->fetch ()) {
                            throw new Exception ('Невірно вказано посаду і/або модуль!');
                        }

                        if (!preg_match ('/' . $re['inn'] . '/', $data['inn'])) {
                            throw new Exception ('Ви невірно вказали ІПН.');
                        }

                        $s = DBD::prepare ('SELECT HIGH_PRIORITY `inn` FROM `sb_employee_data` WHERE `inn`=?');
                        $s->execute (array ($data['inn'])) or Core::report ('register.php:' . __LINE__);
                        if ($s->fetch ()) {
                            throw new Exception ('Вказаний Вами ІПН вже зареєстрований в системі. Звірте ІПН, і якщо вказано вірно, зверніться до адміністратора використовуючи функцію "Підтримка користувачів"!');
                        }
                        ($data['phone_1'] === '(___)___-__-__') && $data['phone_1'] = NULL;
                        ($data['phone_2'] === '(___)___-__-__') && $data['phone_2'] = NULL;
                        ($data['phone_3'] === '(___)___-__-__') && $data['phone_3'] = NULL;
                        if ($data['phone_1'] && !preg_match ('/' . $re['phone'] . '/', $data['phone_1'])) {
                            throw new Exception ('Невірно вказано номер мобільного телефону 1!');
                        }
                        if ($data['phone_2'] && !preg_match ('/' . $re['phone'] . '/', $data['phone_2'])) {
                            throw new Exception ('Невірно вказано номер мобільного телефону 2!');
                        }
                        if ($data['phone_3'] && !preg_match ('/' . $re['phone'] . '/', $data['phone_3'])) {
                            throw new Exception ('Невірно вказано номер стаціонарного телеофну!');
                        }
                        if ($data['position'] === '7') {
                            $data['email'] = $data['phone_int'] = NULL;
                            if (!$data['phone_1'] && !$data['phone_2'] && !$data['phone_3']) {
                                throw new Exception ('Необхідно вказати хоча б один контактний номер телефону!');
                            }
                        } else {
                            if (!preg_match ('/[0-9]{4,}/', $data['phone_int'])) {
                                throw new Exception ('Невірно вказано (або невказано взагалі) внутрішній телефон!');
                            }
                            if ($data['busyness'] !== '2' || $data['email']) {
                                if (!preg_match ('/' . $re['email'] . '/i', $data['email'])) {
                                    throw new Exception ('Невірно вказано поштову скриньку!');
                                }
                                $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `email` FROM `sb_employee_data` WHERE `email`=?');
                                $s->execute (array ($data['email'])) or Core::report ('register.php:' . __LINE__);
                                if ($s->fetch ()) {
                                    throw new Exception ('Вказану електронну поштову скриньку вже зареєстровано в нашій системі!');
                                }
                            } else {
                                $date['email'] = NULL;
                            }
                        }
                        foreach ($data as $field => $value) {
                            switch ($field) {
                                case 'locked': case 'attempts': case 'expires': case 's_list':
                                break;
                                case 'phone_1': case 'phone_2': case 'phone_3':
                                    if ($flag['phone'] & $cf) break;
                                    if ($data[$field] != $r->$field) $cf = $cf | $flag['phone'];
                                break;
                                default:
                                    if ($data[$field] != $r->$field) $cf = $cf | $flag[$field];
                                break;
                            }
                        }
                        if (!isset ($r->extra['group'])) $r->extra['group'] = $r->group;
                        if (!isset ($r->extra['team'])) $r->extra['team'] = $r->team;
                        if (!isset ($r->extra['workflow'])) $r->extra['workflow'] = $r->workflow;
                        $s1 = DBD::prepare ('SELECT HIGH_PRIORITY MAX(`c_id`) FROM `sb_employee_data`');
                        $s2 = DBD::prepare ('SELECT HIGH_PRIORITY MAX(`c_id`) FROM `sb_cisco_ecr`');
                        $s1->execute () or Core::report ('staff.php:'. __LINE__); $s2->execute () or Core::report ('staff.php:'. __LINE__);
                        $r1 = $s1->fetchColumn (); $r2 = $s2->fetchColumn ();
                        if ($r1 > $r2) $data['c_id'] = $r1 + 1;
                        else $data['c_id'] = $r2 + 1;
                        

                        $s = DBD::prepare ('INSERT INTO `sb_cisco_ecr` (`employee`, `c_id`, `group`, `team`, `workflow`, `type`, `employee_issuer`) VALUES (?, ?, ?, ?, ?, ?, ?)');
                        $sh = DBD::prepare ('INSERT INTO `sb_cisco_ecr_history` (`id`, `date`, `employee`, `c_id`, `group`, `team`, `workflow`, `type`, `employee_issuer`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                        $s->execute (array (User::get ('id'), $data['c_id'], $r->extra['group'], $r->extra['team'], $r->workflow, 1, User::get ('id'))) or Core::report ('staff.php:' . __LINE__);
                        $sh->execute (array (DBD::get ()->lastInsertId (), date ('Y-m-d H:i:s'), User::get ('id'), $data['c_id'], $r->extra['group'], $r->extra['team'], $r->workflow, 1, User::get ('id'))) or Core::report ('staff.php:' . __LINE__);
                    } else {
                        $now = new DateTime ();
                        $date_learn = Core::dateTimeConvert ($data['learning'], FORMAT_DATE, DBD::FORMAT_DATE);
                        if (!preg_match ('/' . $re['date'] . '/', $data['learning']) || $date_learn < $now->format ('Y-m-d')) {
                            throw new Exception ('Невірно вказано срок навчання!');
                        }
                        $cf = $cf | $flag['learning'];
                        $data['struct'] && ($data['struct'] = Struct::getParent ($data['struct']));
                    }
                    if (!count ($r->extra)) $r->extra = NULL;
                    if ($r->extra != NULL) $r->extra = serialize ($r->extra);
                    $data['extra'] = $r->extra;

                    if ($data['struct']->id == 2) {
                        $ss = DBD::get ()->prepare ('UPDATE `sb_employee` SET `learning`=? WHERE `sb_employee`.`id`=?;');
                        $ss->execute (array (Core::dateTimeConvert ($data['learning'], FORMAT_DATE, DBD::FORMAT_DATE), User::get ('id'))) or Core::report ('register.php:' . __LINE__);
                    } else {
                        DBD::get ()->prepare ('UPDATE `sb_employee` SET `struct`=?, `position`=?,`module`=?, `learning`=?, `locked`=? WHERE `sb_employee`.`id`=?')->execute (
                            array ($data['struct']->id, $data['position'], $data['module'], NULL, -1, User::get ('id'))
                        ) or Core::report ('register.php:' . __LINE__);

                        $data['phone_1'] = preg_replace ('/[^0-9]/', '', $data['phone_1']);
                        $data['phone_2'] = preg_replace ('/[^0-9]/', '', $data['phone_2']);
                        $data['phone_3'] = preg_replace ('/[^0-9]/', '', $data['phone_3']);
                        DBD::get ()->prepare ('UPDATE `sb_employee_data` SET `inn`=?, `c_id`=?, `phone_1`=?, `phone_2`=?, `phone_3`=?, `phone_int`=?, `email`=?, `een`=?, `join_date`=?, `busyness`=?
                        WHERE `sb_employee_data`.`id`=?')->execute (array (
                            $data['inn'], $data['c_id'], $data['phone_1'], $data['phone_2'],
                            $data['phone_3'], $data['phone_int'], $data['email'], $data['een'], Core::dateTimeConvert ($data['join_date'], FORMAT_DATE, DBD::FORMAT_DATE), $data['busyness'], User::get ('id'))
                        ) or Core::report ('register.php:' . __LINE__);
                    }

                    Core::message (Core::MSG_INFO, 'Новий підрозділ успішно збережено!');
                    AJAX::set ('success', true);
                    
                    $s = DBD::prepare ('SELECT HIGH_PRIORITY * FROM `sb_employee` LEFT JOIN `sb_employee_data` USING (`id`) WHERE `id`=? LIMIT 1');
                    $s->execute (array (User::get ('id')));
                    DBD::prepare ('INSERT INTO `sb_employee_history` (`id`, `employee`, `date`, `flag`, `username`, `struct`, `position`, `module`, `access`, `lastname`,
                        `firstname`, `middlename`, `inn`, `c_id`, `bday`, `phone_1`, `phone_2`, `phone_3`, `phone_int`, `email`, `een`, `join_date`, `busyness`, `extra`)
                    VALUES (?, ?, ?, ?, LCASE(?), ?, ?, ?, ?, UCASE(?), UCASE(?), UCASE(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute (array (
                        User::get ('id'), User::get ('id'), date ('Y-m-d H:i:s'), $cf, $r->username, $r->struct, $r->position, $r->module, $r->access, $r->lastname,
                        $r->firstname, $r->middlename, $r->inn, $r->c_id, $r->bday, $r->phone_1, $r->phone_2,
                        $r->phone_3, $r->phone_int, $r->email, $r->een, $r->join_date, $r->busyness, $r->extra
                    )) or Core::report ('staff.php:' . __LINE__);
                    User::authCheck ();
                    User::setState ();
//                    AJAX::redirect (URL_MOD . 'core/login.php');
                } catch (Exception $e) {
                    Core::message (Core::MSG_ERROR, $e->getMessage ());
                    break;
                }
            }
        break;

        case 'expires':
            User::get ('auth') or AJAX::send ();
            User::get ('expires') > 7 && AJAX::send ();
            User::FLAG_LDAP_USER & User::get ('flag') && AJAX::send ();
            User::setState ();

            if (REQUEST_METHOD === POST) {
                $data = array ('password' => Core::getInputVar (INPUT_POST, 0, 'password'), 'rpassword' => Core::getInputVar (INPUT_POST, 0, 'rpassword'));

                if (!preg_match ('/' . $re['password'] . '/u', $data['password'])) {
                    Core::message (Core::MSG_ERROR, $msg['expires']['password-invalid']);
                    AJAX::send ();
                }

                if ($data['password'] !== $data['rpassword']) {
                    Core::message (Core::MSG_ERROR, $msg['expires']['password-different']);
                    AJAX::send ();
                }

                $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `password` FROM `sb_employee` WHERE `id`=?');
                $s->execute (array (User::get ('id'))) or Core::report ('Login.expires.getSbEmployeePassword', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                ($r = $s->fetch ()) or Core::report ('Login.expires.fetchSbEmployeePassword', Core::ERR_FATAL, 'User "'. User::get ('username'). '/'. User::get ('id'). '" not found.');
                require_once PATH_SYS . 'pwhash' . PHP;
                if (PwHash::check ($data['password'], $r->password)) {
                    Core::message (Core::MSG_ERROR, 'Не можна використовувати старий пароль!');
                    AJAX::send ();
                }

                $s = DBD::get ()->prepare ('UPDATE `sb_employee` SET `password`=?, `expires`=? WHERE `id`=?');
                $s->execute (array (PwHash::hash ($data['password']), date (DBD::FORMAT_DATE, time () + 5184000), User::get ('id'))) or Core::report (Core::ERR_FATAL, 'u1newpwstore');

                Core::message (Core::MSG_INFO, 'Новий пароль успішно збережено!');
                AJAX::set ('success', true);

                User::authCheck ();
                User::setState ();
            }
            break;

        case 'su':
            User::get ('auth') or AJAX::send ();

            if (User::get ('sumode')) {
                User::su ();
                Core::message (Core::MSG_INFO, 'Ви вийшли із режиму SU.');
                AJAX::redirect (URL_MOD . 'core/login.php?do=login');
            } else if (User::access ('admin', 'su')) {
                if (REQUEST_METHOD === POST) {
                    $data = array (
                        'id' => (int) Core::getInputVar (INPUT_POST, Core::FLAG_NULL_IF_WHITESPACES | Core::FLAG_TRIM_LEFT | Core::FLAG_TRIM_RIGHT, 'id'),
                        'username' => Core::getInputVar (INPUT_POST, Core::FLAG_NULL_IF_WHITESPACES | Core::FLAG_TRIM_LEFT | Core::FLAG_TRIM_RIGHT, 'username')
                    );

                    if ($data['id']) {
                        User::su ($data['id']) or AJAX::send ();
                    } else {
                        $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY `id` FROM `sb_employee` WHERE `username`=?') or Core::report ('Login.expires.getSbEmployeeRecord', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
                        $s->execute (array ($data['username']));
                        if ($r = $s->fetch ()) {
                            User::su ($r->id) or AJAX::send ();
                        } else {
                            Core::message (0, 'Користувача з вказанним логіном не існує в БД!');
                            AJAX::send ();
                        }
                    }

                    AJAX::redirect (URL_MOD . 'core/login.php?do=login');
                }
            } else {
                AJAX::send ();
            }
        break;

        case 'logout':
            User::logout ();
            AJAX::redirect (URL_MOD . 'core/login.php');
        break;
    }
}
if (User::get ('auth')) {
    isset ($_SESSION['user']['data']) && AJAX::set ('user', $_SESSION['user']['data']);
} else {
    $s = DBD::get ()->prepare ('SELECT HIGH_PRIORITY COUNT(*) AS `count` FROM `sb_employee` WHERE `locked`<>3 AND `locked`<>-1');
    $s->execute () or Core::report ('Login.getSbEmployeeCount', Core::ERR_FATAL, vsprintf ('[%s][%s] %s', $s->errorInfo ()));
    AJAX::set ('registered', $s->fetch ()->count);
}

AJAX::send (URL_MOD . 'core/login.js');
?>