<?php

if (defined ('__INCLUDE_SAFE__')) {
    function download ($path, $name, $clean = TRUE) {
        if (!mb_check_encoding($name, 'UTF-8')) {
            $name = mb_convert_encoding($name, 'utf-8', mb_detect_encoding($name, array('UTF-8', 'Windows-1251')));
        }
        $dl = Core::getInputVar (INPUT_SESSION, NULL, 'sys', 'dl');
        if ($dl && $dl['clean'] && is_file ($dl['path'])) {
            is_writable ($dl['path']) && unlink ($dl['path']) or Core::log (Core::LOG_SYSTEM, 'Downloadable file "', $dl['path'], '" was set for downloading with cleanup ealier, but can not be cleaned up');
        }
        unset ($_SESSION['sys']['dl']);
        
        if (!is_file ($path) || !is_readable ($path)) {
            Core::report ('DL.download.notReadable', Core::ERR_FATAL, 'Downloadable file requested for downloading (named "%s") is missing or not readable: "%s"', $name, $path);
            return FALSE;
        }

        if ($clean && !is_writable ($path)) {
            Core::log (Core::LOG_SYSTEM, 'Downloadable file "', $path, '" set for cleanup but is non-writable.');
            Core::report ('DL.download.cleanButNotWritable', Core::ERR_FATAL, 'Downloadable file requested for downloading (named "%s") and located at "%s" can not be cleaned.', $name, $path);
            return FALSE;
        }

        $_SESSION['sys']['dl'] = array ('path' => $path, 'name' => $name, 'clean' => !!$clean);

        return TRUE;
    }
} else {
    define ('SYS_INIT', FALSE);
    require_once '..'. DIRECTORY_SEPARATOR. 'sys'. DIRECTORY_SEPARATOR. 'core.php';

    ignore_user_abort (true);
    header ('Content-Type: text/plain; charset=UTF-8');

    !isset ($_SESSION['sys']['dl']['path'], $_SESSION['sys']['dl']['name']) && exit ('Немає файлів для завантаження!');
    (!is_file ($_SESSION['sys']['dl']['path']) || !is_readable ($_SESSION['sys']['dl']['path'])) && exit ('Запитуваний файл не знайдено.');

    header ('Content-Description: File Transfer');
    header ('Content-Type: application/octet-stream');
    header ('Content-Disposition: attachment; filename="'. $_SESSION['sys']['dl']['name']. '"');
    header ('Content-length: '. filesize ($_SESSION['sys']['dl']['path']));
    header ('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header ('Content-Transfer-Encoding: binary');
    header ('Expires: 0');
    header ('Pragma: public');
    header ('Cache-Control: max-age=0');

    readfile ($_SESSION['sys']['dl']['path']);
    
    

    $_SESSION['sys']['dl']['clean'] && unlink ($_SESSION['sys']['dl']['path']);
    unset ($_SESSION['sys']['dl']);
}
?>