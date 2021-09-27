<?php

define ('LOGIN', 0);
require_once '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'sys' . DIRECTORY_SEPARATOR . 'core.php';

$exec = URL_MOD . 'core/register.js';
$re = Core::loadConfigFile ('regexp');

$step = Core::getInputVar (INPUT_GET, NULL, 'step');
switch ($step) {
    case 'reg':
        if (REQUEST_METHOD === POST) {
            $data['username'] = Core::getInputVar (INPUT_POST, NULL, 'username');
            $data['password'] = Core::getInputVar (INPUT_POST, NULL, 'password');
            $data['lastname'] = Core::getInputVar (INPUT_POST, NULL, 'lastname');
            $data['firstname'] = Core::getInputVar (INPUT_POST, NULL, 'firstname');
            $data['middlename'] = Core::getInputVar (INPUT_POST, NULL, 'middlename');
            $data['phone_1'] = Core::getInputVar (INPUT_POST, NULL, 'phone_1');
            $data['email'] = Core::getInputVar (INPUT_POST, NULL, 'email');

            try {
                if (!preg_match ('/' . $re['username'] . '/i', $data['username'])) {
                    throw new Exception ('Невірно вказане ім\'я користувача. Мінімальна довжина: 3 символи, допустимі лише латинські літери та цифри!');
                }
                if (User::get ('auth') === FALSE && !preg_match ('/' . $re['password'] . '/i', $data['password'])) {
                    throw new Exception ('Пароль не відповідає вказаним вимогам!');
                }
                $data['position'] = 285;
                $data['struct'] = 1;
                $data['module'] = 0;
//                $data['phone_1'] = NULL;
                $data['phone_2'] = NULL;
                $data['phone_3'] = NULL;
                $data['phone_int'] = NULL;
//                $data['email'] = NULL;
                $data['een'] = NULL;
                $data['inn'] = NULL;
                $data['busyness'] = 0;
                $data['c_id'] = NULL;
                $locked = 0;

                $s = DBD::prepare ('SELECT `username` FROM `sb_employee` WHERE `username`=?');
                $s->execute (array ($data['username'])) or Core::report ('register.php:' . __LINE__);
                if ($s->fetch ()) throw new Exception ('Вказане Вами ім\'я користувача вже зареєстровано в системі!');

                require_once PATH_SYS . 'pwhash' . PHP;
                $data['password'] = PwHash::hash ($data['password']);

                DBD::prepare ('INSERT INTO `sb_employee` (`username`, `password`, `struct`, `position`, `module`, `locked`, `attempts`, `access`, `expires`,`dt_reg`,`learning`,`flag`) VALUES (LCASE(?), ?, ?, ?, ?, ?, 0, NULL, ?, ?,?,1)')
                    ->execute (array ($data['username'], $data['password'], $data['struct'], $data['position'], $data['module'],  $locked, date (DBD::FORMAT_DATETIME, time () + 5184000), date ('Y-m-d'),$data['learn'])) or Core::report ('register.php:' . __LINE__);

                $data['id'] = DBD::get ()->lastInsertId ();
                
                $q = DBD::get ()->prepare ('INSERT INTO `sb_employee_data` (
                        `id`, 
                        `lastname`, 
                        `firstname`, 
                        `middlename`, 
                        `inn`, 
                        `c_id`, 
                        `bday`, 
                        `phone_1`, 
                        `phone_2`, 
                        `phone_3`, 
                        `phone_int`, 
                        `email`, 
                        `een`, 
                        `join_date`, 
                        `busyness`, 
                        `extra`
                    ) VALUES (?, UCASE(?), UCASE(?), UCASE(?), ?, ?, ?, ?, ?, ?, ?, LCASE(?), ?, ?, ?, NULL)');
                        
                $q->execute (array (
                    $data['id'], 
                    $data['lastname'], 
                    $data['firstname'], 
                    $data['middlename'], 
                    $data['inn'], 
                    $data['c_id'], 
                    '1999-09-09', 
                    $data['phone_1'], 
                    $data['phone_2'],
                    $data['phone_3'], 
                    $data['phone_int'], 
                    $data['email'], 
                    $data['een'], 
                    date('Y-m-d'), 
                    $data['busyness']
                )) || Core::message (Core::MSG_ERROR, 'registration.php: '. __LINE__. ' '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
                
                unset ($_SESSION['register']);
            } catch (Exception $e) {
                $exec = NULL;
                Core::message (Core::MSG_ERROR, $e->getMessage ());
                break;
            }

            
            
            unset ($data['password'], $data['rpassword']);
            unset ($_SESSION['register']);
            AJAX::redirect (URL_MOD . 'core/login.php');
        }
        break;
}

if (User::get ('auth')) AJAX::set ('user', $_SESSION['user']['data']);
AJAX::set ('regexp', $re, true);
AJAX::send ($exec);
?>