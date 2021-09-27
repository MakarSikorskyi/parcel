<?php
if (defined ('__INCLUDE_SAFE__')) {
    //
} else {
    define ('SYS_INIT', FALSE);
    require_once '..'. DIRECTORY_SEPARATOR. 'sys'. DIRECTORY_SEPARATOR. 'core.php';
    $ukey = Core::getInputVar (INPUT_GET, NULL, 'k');
    $_ukey = Core::getInputVar (INPUT_SESSION, NULL, 'sys', 'ukey');

    function formatRawSize ($bytes) {
        if (!$bytes) return FALSE;
        $s = array('bytes', 'KB', 'MB', 'GB', 'TB', 'PB');
        $e = floor (log ($bytes) / log (1024));

        return sprintf ('%.2f '. $s[$e], ($bytes / pow (1024, floor ($e))));
   }
   function saveUploadedFile (&$file) {
        if (!isset ($file)) {
            Core::log (Core::LOG_SYSTEM, '[upload] File was not transfered');
            throw new Exception ('Помилка при завантаженні файлу (3)!');
        }

        if (!is_uploaded_file ($file['tmp_name'])) {
            Core::log (Core::LOG_SYSTEM, '[upload] File does not passing is_uploaded_file test ', $file['tmp_name']);
            throw new Exception ('Помилка при завантаженні файлу (6)!');
        }

        if ($file['error']) {
            Core::log (Core::LOG_SYSTEM, '[upload] Client-side error while file uploading');
            throw new Exception ('Помилка при завантаженні файлу (4)!');
        }

        if (!move_uploaded_file ($file['tmp_name'], $t = PATH_UL. uniqid ())) {
            Core::log (Core::LOG_SYSTEM, '[upload] Failed to move file from "', $file['tmp_name'], '" to "', $t, '"');
            throw new Exception ('Помилка при завантаженні файлу (5)!');
        }
        $file['tmp_name'] = $t;
   }


    try {
        if (!$ukey || !$_ukey) {
            Core::log (Core::LOG_SYSTEM, '[upload] Trying to upload file without ukey');
            throw new Exception ('Помилка при завантаженні файлу (1)!');
        }

        $_ukey = strrev (substr ($_ukey, 0, 7)). strrev (substr ($_ukey, 7));

        if ($ukey !== $_ukey) {
            Core::log (Core::LOG_SYSTEM, '[upload] Trying to upload file using invalid ukey');
            throw new Exception ('Помилка при завантаженні файлу (2)!');
        }
        
        foreach ($_FILES as $k => $file) {
            break;
        }
        $file = $files = $_FILES[$k];
        isset ($_SESSION['sys']['ul'][$k]) && is_array ($_SESSION['sys']['ul'][$k]) || $_SESSION['sys']['ul'][$k] = array ();
        $s = &$_SESSION['sys']['ul'][$k];
        if (is_array ($files['name'])) {
            foreach ($files['name'] as $k => $v) {
                $file = array (
                    'name' => $files['name'][$k],
                    'tmp_name' => $files['tmp_name'][$k],
                    'size' => $files['size'][$k],
                    'error' => $files['error'][$k],
                    'type' => $files['type'][$k]
                );
                saveUploadedFile ($file);
                $s[$k] = $file;
            }
        } else {
            saveUploadedFile ($file);
            $s = $file;
        }

    } catch (Exception $e) {}

    header ('Content-Type: text/html; charset=UTF-8');
    echo '
<!DOCTYPE HTML>
<HTML>
<HEAD>
<TITLE>File uploading</TITLE>
</HEAD><BODY>
<SCRIPT type="text/javascript">';
    if (isset ($e)) {
        echo 'if (window.parent) {
    window.upload = {status: false, error: ', json_encode ($e->getMessage ()), '};
} else {
    document.write (', json_encode ($e->getMessage ()), ');
}';
    } else {
        echo 'window.upload = {status: true, file: {name: "', $file['name'], '", size: "'. formatRawSize ($file['size']). '"}};';
    }
    echo '</SCRIPT>
</BODY>
</HTML>';
}
?>