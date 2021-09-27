<?php
if (PHP_OS == 'WINNT') {
    $_REQUEST['AgentID'] = 4854;
    $_REQUEST['AgentName'] = 'MN';
    $_REQUEST['AgentGroup'] = 100;
    $_REQUEST['DialMenu'] = 2.2;
    $_REQUEST['DialNumber'] = '90509548223';
    $_REQUEST['DialName'] = 'MN';
    $_REQUEST['DialAccount'] = 3276516331;
}
define ('LOGIN', 0);
require_once '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'sys' . DIRECTORY_SEPARATOR . 'core.php';
if (isset(
    $_REQUEST['AgentID'], $_REQUEST['AgentName'], $_REQUEST['AgentGroup'], $_REQUEST['DialMenu'],
    $_REQUEST['DialNumber'], $_REQUEST['DialName'], $_REQUEST['DialAccount'])
) {
    !isset ($_SESSION['cad_call_info']) && ($_SESSION['cad_call_info'] = array ());
    foreach ($_REQUEST as $k => $v) $_SESSION['cad_call_info'][$k] = $v;
}

!User::get ('auth') && AJAX::redirect (URL_MOD. 'core/login.php');


AJAX::send (URL_MOD . 'core/main.js');
?>