<?php

defined ('__INCLUDE_SAFE__') or die ();
require_once PATH_SYS. 'str'. PHP;
require_once PATH_LIB. 'xml'. PHP;

class HTTPRequest {
    const
        METHOD_GET = 'GET',
        METHOD_POST = 'POST';
    
    private static $curl_options = array (
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_HEADER => TRUE,
        CURLOPT_FOLLOWLOCATION => TRUE,
        CURLOPT_ENCODING => 'UTF-8',
        CURLOPT_AUTOREFERER => TRUE,
        CURLOPT_CONNECTTIMEOUT => 190,
        CURLOPT_TIMEOUT => 190,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_SSL_VERIFYHOST => FALSE,
        CURLOPT_SSL_VERIFYPEER => FALSE,
        CURLOPT_FAILONERROR => TRUE
    );
    private static $get_options = array (
        'http' => array (
            'follow_location' => 1,
            'timeout' => 190,
            'max_redirects' => 10
        )
    );
    private static $header = array ();
    private static $conf;
    private static $curl;
    private static $getRaw = FALSE;
    private static $responseRaw;
    private static $responseHeader;
    private static $responseData;
    private static $response;
    private static $responseContentType;
    private static $responseContentLength;
    
    private static function responseClean ($response) {
        if (!defined('SYS_CLI')) {
            $pattern = "/^content-type\s*:\s*(.*)$/i";
            if (($header = preg_grep ($pattern, $response['header'])) && (preg_match ($pattern, array_shift (array_values ($header)), $match) !== FALSE)) {
                self::$responseContentType = explode (';', STR::charcase ($match[1], STR::CASE_LOWER));
                self::$responseContentType = STR::trim (self::$responseContentType[0], STR::FLAG_ALL);
            }
            self::$responseHeader = implode (PHP_EOL, $response['header']);
            self::$responseData = $response['data'];
            self::$responseRaw = implode (PHP_EOL, array (self::$responseHeader, self::$responseData));
            $comt_len = strlen ($response['data']);
            self::$responseContentLength = (isset ($comt_len) ? $comt_len : (-1));
        } else {
            self::$responseRaw = $response;
            self::$responseContentType = explode (';', STR::charcase (curl_getinfo (self::$curl, CURLINFO_CONTENT_TYPE), STR::CASE_LOWER));
            self::$responseContentType = STR::trim (self::$responseContentType[0], STR::FLAG_ALL);
            self::$responseContentLength = (int)curl_getinfo (self::$curl, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
            self::$responseData = mb_strcut ($response, -self::$responseContentLength);
            self::$responseHeader = str_replace (self::$responseData, '', self::$responseRaw);
        }
        switch (self::$responseContentType) {
            case 'application/json': case 'text/json':
                self::$response = json_decode (self::$responseData);
                break;
            case 'application/xml': case 'text/xml':
                self::$response = XML::unserialize (self::$responseData);
                break;
            default: self::$response = self::$responseData; break;
        }
        return self::$response;
    }
    
    public static function setOption ($option) {
        if (gettype ($option) !== 'array') return FALSE;
        if (array_key_exists ('curl', $option)) {
            foreach ($option['curl'] as $k => $v) {
                self::$curl_options[$k] = $v;
            }
        }
        if (array_key_exists ('get', $option)) {
            foreach ($option['get'] as $g => $o) {
                self::$get_options['http'][$g] = $o;
            }
        }
        if (array_key_exists ('header', $option)) {
            foreach ($option['header'] as $h) {
                array_push (self::$header, $h);
            }
        }
        if (array_key_exists ('raw', $option)) {
            self::$getRaw = $option['raw'];
        }
    }

    /**
     * Future option. Does nothing now
     */
    public static function loadConfig ($config = NULL) {
        
        if (isset ($config)) {
            !defined ('SYS_CLI') && (self::$conf = Core::loadConfigFile ($config)) || (self::$conf = CLI::loadConfigFile ($config));
        }
    }
    
    public static function curlExec ($url, $method, $data, $content_type = NULL) {
        if (is_string ($content_type) && !empty ($content_type)) {
            array_push (self::$header, 'Accept: ' . $content_type, 'Content-Type: ' . $content_type);
        }
        $url = preg_replace ('|^/|', '', $url);
        switch ($method) {
            case self::METHOD_GET:
                if (isset ($data) && is_array ($data)) {
                    $url. '?'. implode ('&', array_map (function ($k, $v) {return $k. '='. urlencode ($v);}, array_keys ($data), $data));
                }
                $options = array (
                    CURLOPT_URL => $url,
                    CURLOPT_POST => FALSE,
                    CURLOPT_POSTFIELDS => NULL,
                    CURLOPT_HTTPHEADER => self::$header,
                    CURLOPT_CUSTOMREQUEST => $method
                );
            break;
            case self::METHOD_POST:
                $options = array (
                    CURLOPT_URL => $url,
                    CURLOPT_POST => TRUE,
                    CURLOPT_POSTFIELDS => $data,
                    CURLOPT_HTTPHEADER => self::$header
                );
            break;
            default:
                $options = array (
                    CURLOPT_URL => $url,
                    CURLOPT_CUSTOMREQUEST => $method,
                    CURLOPT_POSTFIELDS => $data,
                    CURLOPT_HTTPHEADER => self::$header
                );
            break;
        }
        $options += self::$curl_options;
        self::$curl = curl_init ();
        curl_setopt_array (self::$curl, $options);

        $execute = curl_exec (self::$curl);
        if ($execute === FALSE) {
            $response = new stdClass;
            $response->HTTP_REQUEST_ERROR_CODE = '000';
            $response->HTTP_REQUEST_ERROR_MESSAGE = curl_error (self::$curl);
            $response->HTTP_REQUEST_ERROR_DESCRIPTION = curl_getinfo (self::$curl);
        }
        else $response = (self::$getRaw ? $execute : self::responseClean ($execute));
        curl_close (self::$curl); 
        return $response;
    }
    
    public static function getContent ($url, $method, $data, $content_type = NULL) {
         if (is_string ($content_type) && !empty ($content_type)) {
            array_push (self::$header, 'Accept: ' . $content_type, 'Content-Type: ' . $content_type);
        }
        $url = preg_replace ('|^/|', '', $url);
        switch ($method) {
            case self::METHOD_GET:
                if (isset ($data) && is_array ($data)) {
                    $url .= '?'. implode ('&', array_map (function ($k, $v) {return $k. '='. urlencode ($v);}, array_keys ($data), $data));
                }
                $options = array (
                    'http' => array (
                        'method' => $method,
                        'header' => self::$header
                    )
                );
                break;
            case self::METHOD_POST:
                $options = array (
                    'http' => array (
                        'method' => $method,
                        'content' => $data,
                        'header' => self::$header
                    )
                );
                break;
            default:
                $options = array (
                    'http' => array (
                        'method' => $method,
                        'content' => $data,
                        'header' => self::$header
                    )
                );
                break;
        }
        $options['http'] = array_merge (self::$get_options['http'], $options['http']);
        $context = stream_context_create ($options);
        if ($execute = @file_get_contents ($url, FALSE, $context)){
            $response = (self::$getRaw ? array ('data' => $execute, 'header' => $http_response_header) : self::responseClean (array ('data' => $execute, 'header' => $http_response_header)));
        } else {
            $error = error_get_last ();
            if (self::$getRaw) {
                return $error;
            }
            if (is_string ($error['message'])) {
                $response = new stdClass ();
                $response->HTTP_REQUEST_ERROR_CODE = '000';
                $response->HTTP_REQUEST_ERROR_MESSAGE = $error['message'];
            } else {
                $response = new stdClass ();
                $response->HTTP_REQUEST_ERROR_CODE = '000';
                $response->HTTP_REQUEST_ERROR_MESSAGE = 'Error to file_get_contents';
            }
        }
        return $response;
    }

    public static function request ($url, $method, $data, $content_type = NULL) {
        if (!defined('SYS_CLI')) return self::getContent ($url, $method, $data, $content_type);
        else return self::curlExec ($url, $method, $data, $content_type);
    }
}

HTTPRequest::loadConfig ();

?>