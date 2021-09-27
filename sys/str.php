<?php

final class STR {
    const
        FLAG_TRIM_LEFT = 1,
        FLAG_TRIM_RIGHT = 2,
        FLAG_TRIM = 3,
        FLAG_TRIM_EXTRA = 4,
        FLAG_NULL_IF_BLANK = 8,
        FLAG_NULL_IF_WHITESPACES = 16,
        FLAG_ALL = 31,

        CASE_UPPER = 'U',
        CASE_LOWER = 'L',
        CASE_TITLE = 'T',
        CASE_FIRST_UPPER = 'FU';
    
    final public static function trim ($str, $flags = self::FLAG_TRIM) {
        (static::FLAG_TRIM_LEFT & $flags) && $str = preg_replace ('/^[\s\r\n\t\x{200B}-\x{200D}]*/ui', '', $str);
        (static::FLAG_TRIM_RIGHT & $flags) && $str = preg_replace ('/[\s\r\n\t\x{200B}-\x{200D}]*$/ui', '', $str);
        (static::FLAG_TRIM_EXTRA & $flags) && $str = preg_replace ('/\s{2,}/ui', ' ', $str);

        if (((static::FLAG_NULL_IF_BLANK & $flags) && $str === '') || ((static::FLAG_NULL_IF_WHITESPACES & $flags) && preg_match ('/^\s*$/ui', $str))) $str = NULL;
        return $str;
    }
    
    final public static function fixName ($str, $charcase = NULL, $encoding = 'UTF-8') {
        return str_replace (array ('"', '’', '`'), '\'', self::us2ua ($str, $charcase, $encoding));
    }

    final public static function checkTaxCode ($code, $type = 0) {
        $chk = FALSE;
        if ($type === -1) {
            if (preg_match ('/^[0-9]{8}$/', $code)) $type = 1;
        }
        switch ($type) {
            case 1:
                if (preg_match ('/^0{8}$/', $code) || !preg_match ('/^[0-9]{8}$/', $code)) break;
                $c = array (1, 2, 3, 4, 5, 6, 7);
                if (preg_match ('/^[3-5]/', $code)) $c = array (7, 1, 2, 3, 4, 5, 6);
                $code = str_split ($code);
                $chknum = array_pop ($code);
                $chksumm = (array_sum (array_map (function ($x, $y) {return $x * $y;}, $code, $c)) % 11) % 10;
                if ($chksumm === 0 && $chksumm !== (int) $chknum) $chksumm = (array_sum (array_map (function ($x, $y) {return $x * ($y + 2);}, $code, $c)) % 11) % 10;
                if ($chksumm === (int) $chknum) $chk = TRUE;
            default: case 0:
                if (preg_match ('/^0{10}$/', $code) || !preg_match ('/^[0-9]{10}$/', $code)) break;
                $chksumm = (array_sum (array_map (function ($x, $y) {return $x * $y;}, str_split ($code), array (-1, 5, 7, 9, 4, 6, 10, 5, 7, 0))) % 11) % 10;
                if ($chksumm === (int) $code[9]) $chk = TRUE;
            break;
        }
        return $chk;
    }
    
    final public static function validTaxCode ($code, $type = 0) {
        if (self::checkTaxCode ($code, $type) === FALSE) $code = NULL;
        return $code;
    }

    final public static function levenshtein ($str1, $str2, $encoding = 'UTF-8') {
        $length1 = mb_strlen ($str1, $encoding);
        $length2 = mb_strlen ($str2, $encoding);
        if ($length1 < $length2) return self::levenshtein ($str2, $str1);
        if ($length1 == 0) return $length2;
        if ($str1 === $str2) return 0;
        $prevRow = range (0, $length2);
        $currentRow = array ();
        for ($i = 0; $i < $length1; $i++) {
            $currentRow = array ();
            $currentRow[0] = $i + 1;
            $c1 = mb_substr ($str1, $i, 1, $encoding);
            for ($j = 0; $j < $length2; $j++) {
                $c2 = mb_substr ($str2, $j, 1, $encoding);
                $insertions = $prevRow[$j + 1] + 1;
                $deletions = $currentRow[$j] + 1;
                $substitutions = $prevRow[$j] + (($c1 != $c2) ? 1 : 0);
                $currentRow[] = min ($insertions, $deletions, $substitutions);
            }
            $prevRow = $currentRow;
        }
        return $prevRow[$length2];
    }
    
    final public static function cxLevenshtein ($str1, $str2, $encoding = 'UTF-8') {
        $str1 = explode (' ', preg_replace (array ('/\s{2,}/', '/^\s*/', '/\s*$/'), array (' ', ''), $str1));
        $str2 = explode (' ', preg_replace (array ('/\s{2,}/', '/^\s*/', '/\s*$/'), array (' ', ''), $str2));
        $cx = 0;
        if (count ($str1) < count ($str2)) {
            $t = $str1; $str1 = $str2; $str2 = $t;
        }
        foreach ($str1 as $s1) {
            $kt = 0; $cxt = FALSE;
            if (count ($str2)) foreach ($str2 as $k => $s2) {
                $cxl = self::levenshtein ($s1, $s2, $encoding);
                if ($cxt === FALSE || $cxl < $cxt) {$kt = $k; $cxt = $cxl;}
            } else $cxt = mb_strlen ($s1, $encoding);
            $cx += $cxt;
            unset ($str2[$kt]);
        }
        return $cx;
    }

    final public static function translit ($text) {
        preg_match_all ('/./u', $text, $text);
        $text = $text[0];
        $simplePairs = array (
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'h', 'ґ' => 'g', 'д' => 'd', 'е' => 'e', 'є' => 'ie',
            'з' => 'z', 'и' => 'y', 'і' => 'i', 'ї' => 'i', 'й' => 'i', 'к' => 'k', 'л' => 'l', 'м' => 'm',
            'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f',
            'ю' => 'iu', 'я' => 'ya', 'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'H', 'Ґ' => 'G', 'Д' => 'D',
            'Е' => 'E', 'Є' => 'Ie', 'З' => 'Z', 'И' => 'Y', 'І' => 'I', 'Ї' => 'I', 'Й' => 'I', 'К' => 'K',
            'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
            'У' => 'U', 'Ф' => 'F', 'Ю' => 'Iu', 'Я' => 'Ia'
        );
        $complexPairs = array (
            'є' => 'ye', 'ж' => 'zh', 'ї' => 'yi', 'й' => 'y', 'х' => 'kh', 'ц' => 'ts', 'ч' => 'ch',
            'ш' => 'sh', 'щ' => 'shch', 'ю' => 'yu', 'я' => 'ya', 'Є' => 'Ye', 'Ж' => 'Zh', 'Ї' => 'Yi',
            'Й' => 'Y', 'Х' => 'Kh', 'Ц' => 'Ts', 'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Shch', 'Ю' => 'Yu',
            'Я' => 'Ya', 'Ь' => '', 'Ъ' => '', 'ъ' => '', 'ь' => ''
        );
        $specialSymbols = array (
            '_' => '-', '\'' => '', '`' => '', '^' => '',
            '.' => '', ',' => '', ':' => '', '"' => '',
            '\'' => '', '<' => '', '>' => '', '«' => '',
            '»' => '', '№' => '#', 'ы' => 'y', 'Ы' => 'Y',
            'ё' => 'e', 'Ё' => 'E', 'э' => 'e', 'Э' => 'E'
//            ' ' => '-',
        );
        $specialSymbolsProb = array (' ' => ' ');
        $translitLatSymbols = array (
            'a', 'l', 'u', 'b', 'm', 't', 'v', 'n', 'y', 'g', 'o', 'f', 'd', 'p', 'i', 'r', 'z', 'c', 'k', 'e', 's', 'q', 'w', 'h', 'j', 'x',
            'A', 'L', 'U', 'B', 'M', 'T', 'V', 'N', 'Y', 'G', 'O', 'F', 'D', 'P', 'I', 'R', 'Z', 'C', 'K', 'E', 'S', 'Q', 'W', 'H', 'J', 'X'
        );
        $simplePairsFlip = array_flip ($simplePairs);
        $complexPairsFlip = array_flip ($complexPairs);
        $specialSymbolsFlip = array_flip ($specialSymbols);
        $result = '';
        $nonTranslitArea = FALSE;
        $specTranslitArea = TRUE;
        foreach ($text as $char) {
            if ($specTranslitArea) {
                $charsToTranslit = array_merge (array_keys ($simplePairs), array_keys ($complexPairs), array_keys ($specialSymbols));
                $translitTable = array_merge ($simplePairs, $complexPairs, $specialSymbols, $specialSymbolsProb);
            } else {
                $charsToTranslit = array_merge (array_keys ($complexPairs), array_keys ($simplePairs), array_keys ($specialSymbols));
                $translitTable = array_merge ($complexPairs, $simplePairs, $specialSymbols, $specialSymbolsProb);
            }
            if (in_array ($char, array_keys ($specialSymbolsProb))) {
                $result .= $translitTable[$char];
                $specTranslitArea = TRUE;
            } elseif (in_array ($char, $charsToTranslit)) {
                if ($nonTranslitArea) {
                    $result .= '';
                    $nonTranslitArea = FALSE;
                }
                $specTranslitArea = FALSE;
                $result .= $translitTable[$char];
            } elseif (in_array ($char, $translitLatSymbols)){
                if (!$nonTranslitArea) {
                    $result .= '';
                    $nonTranslitArea = TRUE;
                }
                $specTranslitArea = FALSE;
                $result .= $char;
            } else {
                $result .= '';
                $nonTranslitArea = TRUE;
            }           
        }
        return $result;
    }
    
    final public static function charcase ($text, $charcase = NULL, $charset = 'UTF-8') {
        if (!$text) return $text;
        switch ($charcase) {
            case 'U':
                $string = mb_strtoupper ($text, $charset);
            break;
            case 'L':
                $string = mb_strtolower ($text, $charset);
            break;
            case 'FU':
                $string = mb_strtoupper (mb_substr ($text, 0, 1, $charset), $charset) . mb_strtolower (mb_substr ($text, 1, mb_strlen ($text), $charset), $charset);
            break;
            case 'T':
                $string = mb_convert_case ($text, MB_CASE_TITLE, $charset);
            break;
            default:
                $string = $text;
            break;
        }
        return $string;
    }
    
    final public static function us2ua ($text, $charcase = NULL, $charset = 'UTF-8') {
        if (!$text) return $text;
        $string = STR::charcase ($text, $charcase, $charset);
           
        return str_replace (
            array ('i','c','p','e','y','u','o','a','k','x','b','m','t','h','I','C','P','E','Y','U','O','A','K','X','B','M','T','H'),
            array ('і','с','р','е','у','и','о','а','к','х','ь','м','т','н','І','С','Р','Е','У','И','О','А','К','Х','В','М','Т','Н'),
            $string
        );
    }

    final public static function ua2us ($text, $charcase = NULL, $charset = 'UTF-8') {
        if (!$text) return $text;
        $string = STR::charcase ($text, $charcase, $charset);
           
        return str_replace (
            array ('і','с','р','е','у','и','о','а','к','х','ь','м','т','н','І','С','Р','Е','У','И','О','А','К','Х','В','М','Т','Н'),
            array ('i','c','p','e','y','u','o','a','k','x','b','m','t','h','I','C','P','E','Y','U','O','A','K','X','B','M','T','H'),
            $string
        );
    }

    final public static function array2json ($mixed, $const_off = NULL) {
        $jc = JSON_FORCE_OBJECT | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_TAG | 256;
        switch (gettype ($const_off)) {
            default:
            break;
            case 'integer':
                $jc = $jc ^ $const_off;
            break;
            case 'array':
                foreach ($const_off as $k) {$jc = $jc ^ $k;}
            break;
        }
        return preg_replace_callback ('/\\\\u([0-9a-fA-F]{4})/', function ($match) {
            return mb_convert_encoding (pack ('H*', $match[1]), 'UTF-8', 'UCS-2BE');
        }, json_encode ($mixed, $jc));
    }
    
    final public static function json2array ($json) {
        return json_decode ($json, TRUE);
    }
    
    // Returns hex string dump
    final public static function hex ($str, $spacing = TRUE) {
        return preg_replace ('/[\s\r\n\t]/', $spacing === TRUE ? ' ' : '', substr (preg_replace ('/./se', 'sprintf (\'%02x \', ord ("$0"))', $str), 0, -1));
    }
    
    // Returns string from hex dump
    final public static function hex2str ($str) {
        $str = preg_replace ('/[\s\r\n\t]/', '', static::trim ($str, static::FLAG_ALL));
        return preg_replace ('/.{2}/e', 'chr (hexdec ("$0"))', $str);
//        return preg_replace ('/.{2}/e', 'var_dump (chr (hexdec ("$0")))', $str);
//        var_dump ($str);
//        return preg_replace ('/(.{2})/e', 'var_dump ("$0")', $str);
    }
    
    final public static function uuid () {
        if (function_exists ('com_create_guid')) {
            return strtolower (trim (com_create_guid (), '{}'));
        }
        $data = openssl_random_pseudo_bytes (16);
        $data[6] = chr (ord ($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr (ord ($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf ('%s%s-%s-%s-%s-%s%s%s', str_split (bin2hex ($data), 4));
    }
    
    final public static function pad ($str, $pad_length, $pad_string = ' ', $pad_type = STR_PAD_RIGHT, $encoding = 'UTF-8') {
        $encoding = $encoding === NULL ? mb_internal_encoding () : $encoding;
        $padBefore = $pad_type === STR_PAD_BOTH || $pad_type === STR_PAD_LEFT;
        $padAfter = $pad_type === STR_PAD_BOTH || $pad_type === STR_PAD_RIGHT;
        $pad_length -= mb_strlen ($str, $encoding);
        $targetLen = $padBefore && $padAfter ? $pad_length / 2 : $pad_length;
        $strToRepeatLen = mb_strlen ($pad_string, $encoding);
        $repeatTimes = ceil ($targetLen / $strToRepeatLen);
        $repeatedString = str_repeat ($pad_string, max (0, $repeatTimes)); // safe if used with valid unicode sequences (any charset)
        $before = $padBefore ? mb_substr ($repeatedString, 0, (int) floor ($targetLen), $encoding) : '';
        $after = $padAfter ? mb_substr ($repeatedString, 0, (int) ceil ($targetLen), $encoding) : '';
        return $before . $str . $after;
    }
}

class Encoding {
    const ICONV_TRANSLIT = "TRANSLIT";
    const ICONV_IGNORE = "IGNORE";
    const WITHOUT_ICONV = "";
    protected static $win1252ToUtf8 = array(
          128 => "\xe2\x82\xac",
          130 => "\xe2\x80\x9a",
          131 => "\xc6\x92",
          132 => "\xe2\x80\x9e",
          133 => "\xe2\x80\xa6",
          134 => "\xe2\x80\xa0",
          135 => "\xe2\x80\xa1",
          136 => "\xcb\x86",
          137 => "\xe2\x80\xb0",
          138 => "\xc5\xa0",
          139 => "\xe2\x80\xb9",
          140 => "\xc5\x92",
          142 => "\xc5\xbd",
          145 => "\xe2\x80\x98",
          146 => "\xe2\x80\x99",
          147 => "\xe2\x80\x9c",
          148 => "\xe2\x80\x9d",
          149 => "\xe2\x80\xa2",
          150 => "\xe2\x80\x93",
          151 => "\xe2\x80\x94",
          152 => "\xcb\x9c",
          153 => "\xe2\x84\xa2",
          154 => "\xc5\xa1",
          155 => "\xe2\x80\xba",
          156 => "\xc5\x93",
          158 => "\xc5\xbe",
          159 => "\xc5\xb8"
    );
      protected static $brokenUtf8ToUtf8 = array(
          "\xc2\x80" => "\xe2\x82\xac",
          "\xc2\x82" => "\xe2\x80\x9a",
          "\xc2\x83" => "\xc6\x92",
          "\xc2\x84" => "\xe2\x80\x9e",
          "\xc2\x85" => "\xe2\x80\xa6",
          "\xc2\x86" => "\xe2\x80\xa0",
          "\xc2\x87" => "\xe2\x80\xa1",
          "\xc2\x88" => "\xcb\x86",
          "\xc2\x89" => "\xe2\x80\xb0",
          "\xc2\x8a" => "\xc5\xa0",
          "\xc2\x8b" => "\xe2\x80\xb9",
          "\xc2\x8c" => "\xc5\x92",
          "\xc2\x8e" => "\xc5\xbd",
          "\xc2\x91" => "\xe2\x80\x98",
          "\xc2\x92" => "\xe2\x80\x99",
          "\xc2\x93" => "\xe2\x80\x9c",
          "\xc2\x94" => "\xe2\x80\x9d",
          "\xc2\x95" => "\xe2\x80\xa2",
          "\xc2\x96" => "\xe2\x80\x93",
          "\xc2\x97" => "\xe2\x80\x94",
          "\xc2\x98" => "\xcb\x9c",
          "\xc2\x99" => "\xe2\x84\xa2",
          "\xc2\x9a" => "\xc5\xa1",
          "\xc2\x9b" => "\xe2\x80\xba",
          "\xc2\x9c" => "\xc5\x93",
          "\xc2\x9e" => "\xc5\xbe",
          "\xc2\x9f" => "\xc5\xb8"
    );
    protected static $utf8ToWin1252 = array(
         "\xe2\x82\xac" => "\x80",
         "\xe2\x80\x9a" => "\x82",
         "\xc6\x92"     => "\x83",
         "\xe2\x80\x9e" => "\x84",
         "\xe2\x80\xa6" => "\x85",
         "\xe2\x80\xa0" => "\x86",
         "\xe2\x80\xa1" => "\x87",
         "\xcb\x86"     => "\x88",
         "\xe2\x80\xb0" => "\x89",
         "\xc5\xa0"     => "\x8a",
         "\xe2\x80\xb9" => "\x8b",
         "\xc5\x92"     => "\x8c",
         "\xc5\xbd"     => "\x8e",
         "\xe2\x80\x98" => "\x91",
         "\xe2\x80\x99" => "\x92",
         "\xe2\x80\x9c" => "\x93",
         "\xe2\x80\x9d" => "\x94",
         "\xe2\x80\xa2" => "\x95",
         "\xe2\x80\x93" => "\x96",
         "\xe2\x80\x94" => "\x97",
         "\xcb\x9c"     => "\x98",
         "\xe2\x84\xa2" => "\x99",
         "\xc5\xa1"     => "\x9a",
         "\xe2\x80\xba" => "\x9b",
         "\xc5\x93"     => "\x9c",
         "\xc5\xbe"     => "\x9e",
         "\xc5\xb8"     => "\x9f"
      );
    static function toUTF8($text){
    /**
     * Function \ForceUTF8\Encoding::toUTF8
     *
     * This function leaves UTF8 characters alone, while converting almost all non-UTF8 to UTF8.
     *
     * It assumes that the encoding of the original string is either Windows-1252 or ISO 8859-1.
     *
     * It may fail to convert characters to UTF-8 if they fall into one of these scenarios:
     *
     * 1) when any of these characters:   ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß
     *    are followed by any of these:  ("group B")
     *                                    ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶•¸¹º»¼½¾¿
     * For example:   %ABREPRESENT%C9%BB. «REPRESENTÉ»
     * The "«" (%AB) character will be converted, but the "É" followed by "»" (%C9%BB)
     * is also a valid unicode character, and will be left unchanged.
     *
     * 2) when any of these: àáâãäåæçèéêëìíîï  are followed by TWO chars from group B,
     * 3) when any of these: ðñòó  are followed by THREE chars from group B.
     *
     * @name toUTF8
     * @param string $text  Any string.
     * @return string  The same string, UTF8 encoded
     *
     */
      if(is_array($text))
      {
        foreach($text as $k => $v)
        {
          $text[$k] = self::toUTF8($v);
        }
        return $text;
      }
      if(!is_string($text)) {
        return $text;
      }
      $max = self::strlen($text);
      $buf = "";
      for($i = 0; $i < $max; $i++){
          $c1 = $text{$i};
          if($c1>="\xc0"){ //Should be converted to UTF8, if it's not UTF8 already
            $c2 = $i+1 >= $max? "\x00" : $text{$i+1};
            $c3 = $i+2 >= $max? "\x00" : $text{$i+2};
            $c4 = $i+3 >= $max? "\x00" : $text{$i+3};
              if($c1 >= "\xc0" & $c1 <= "\xdf"){ //looks like 2 bytes UTF8
                  if($c2 >= "\x80" && $c2 <= "\xbf"){ //yeah, almost sure it's UTF8 already
                      $buf .= $c1 . $c2;
                      $i++;
                  } else { //not valid UTF8.  Convert it.
                      $cc1 = (chr(ord($c1) / 64) | "\xc0");
                      $cc2 = ($c1 & "\x3f") | "\x80";
                      $buf .= $cc1 . $cc2;
                  }
              } elseif($c1 >= "\xe0" & $c1 <= "\xef"){ //looks like 3 bytes UTF8
                  if($c2 >= "\x80" && $c2 <= "\xbf" && $c3 >= "\x80" && $c3 <= "\xbf"){ //yeah, almost sure it's UTF8 already
                      $buf .= $c1 . $c2 . $c3;
                      $i = $i + 2;
                  } else { //not valid UTF8.  Convert it.
                      $cc1 = (chr(ord($c1) / 64) | "\xc0");
                      $cc2 = ($c1 & "\x3f") | "\x80";
                      $buf .= $cc1 . $cc2;
                  }
              } elseif($c1 >= "\xf0" & $c1 <= "\xf7"){ //looks like 4 bytes UTF8
                  if($c2 >= "\x80" && $c2 <= "\xbf" && $c3 >= "\x80" && $c3 <= "\xbf" && $c4 >= "\x80" && $c4 <= "\xbf"){ //yeah, almost sure it's UTF8 already
                      $buf .= $c1 . $c2 . $c3 . $c4;
                      $i = $i + 3;
                  } else { //not valid UTF8.  Convert it.
                      $cc1 = (chr(ord($c1) / 64) | "\xc0");
                      $cc2 = ($c1 & "\x3f") | "\x80";
                      $buf .= $cc1 . $cc2;
                  }
              } else { //doesn't look like UTF8, but should be converted
                      $cc1 = (chr(ord($c1) / 64) | "\xc0");
                      $cc2 = (($c1 & "\x3f") | "\x80");
                      $buf .= $cc1 . $cc2;
              }
          } elseif(($c1 & "\xc0") == "\x80"){ // needs conversion
                if(isset(self::$win1252ToUtf8[ord($c1)])) { //found in Windows-1252 special cases
                    $buf .= self::$win1252ToUtf8[ord($c1)];
                } else {
                  $cc1 = (chr(ord($c1) / 64) | "\xc0");
                  $cc2 = (($c1 & "\x3f") | "\x80");
                  $buf .= $cc1 . $cc2;
                }
          } else { // it doesn't need conversion
              $buf .= $c1;
          }
      }
      return $buf;
    }
    static function toWin1252($text, $option = self::WITHOUT_ICONV) {
      if(is_array($text)) {
        foreach($text as $k => $v) {
          $text[$k] = self::toWin1252($v, $option);
        }
        return $text;
      } elseif(is_string($text)) {
        return static::utf8_decode($text, $option);
      } else {
        return $text;
      }
    }
    static function toISO8859($text, $option = self::WITHOUT_ICONV) {
      return self::toWin1252($text, $option);
    }
    static function toLatin1($text, $option = self::WITHOUT_ICONV) {
      return self::toWin1252($text, $option);
    }
    static function toWin1251($text, $option = self::WITHOUT_ICONV) {
      if (gettype ($text) === 'string' && !preg_match('/^\d$/', $text)) {
          if ($option == self::WITHOUT_ICONV || !function_exists('iconv')) {
            $o = mb_convert_encoding ($text, 'Windows-1251', 'utf-8');
          } else {
            $o = iconv("UTF-8", "Windows-1251" . ($option == self::ICONV_TRANSLIT ? '//TRANSLIT' : ($option == self::ICONV_IGNORE ? '//IGNORE' : '')), $text);
          }
          return $o;
      } else {
          return $text;
      }
    }
    static function fixUTF8($text, $option = self::WITHOUT_ICONV){
      if(is_array($text)) {
        foreach($text as $k => $v) {
          $text[$k] = self::fixUTF8($v, $option);
        }
        return $text;
      }
      if(!is_string($text)) {
        return $text;
      }
      $last = "";
      while($last <> $text){
        $last = $text;
        $text = self::toUTF8(static::utf8_decode($text, $option));
      }
      $text = self::toUTF8(static::utf8_decode($text, $option));
      return $text;
    }
    static function UTF8FixWin1252Chars($text){
      // If you received an UTF-8 string that was converted from Windows-1252 as it was ISO8859-1
      // (ignoring Windows-1252 chars from 80 to 9F) use this function to fix it.
      // See: http://en.wikipedia.org/wiki/Windows-1252
      return str_replace(array_keys(self::$brokenUtf8ToUtf8), array_values(self::$brokenUtf8ToUtf8), $text);
    }
    static function removeBOM($str=""){
      if(substr($str, 0,3) == pack("CCC",0xef,0xbb,0xbf)) {
        $str=substr($str, 3);
      }
      return $str;
    }
    protected static function strlen($text){
      return (function_exists('mb_strlen') && ((int) ini_get('mbstring.func_overload')) & 2) ?
             mb_strlen($text,'8bit') : strlen($text);
    }
    public static function normalizeEncoding($encodingLabel)
    {
      $encoding = strtoupper($encodingLabel);
      $encoding = preg_replace('/[^a-zA-Z0-9\s]/', '', $encoding);
      $equivalences = array(
          'ISO88591' => 'ISO-8859-1',
          'ISO8859'  => 'ISO-8859-1',
          'ISO'      => 'ISO-8859-1',
          'LATIN1'   => 'ISO-8859-1',
          'LATIN'    => 'ISO-8859-1',
          'UTF8'     => 'UTF-8',
          'UTF'      => 'UTF-8',
          'WIN1252'  => 'ISO-8859-1',
          'WINDOWS1252' => 'ISO-8859-1'
      );
      if(empty($equivalences[$encoding])){
        return 'UTF-8';
      }
      return $equivalences[$encoding];
    }
    public static function encode($encodingLabel, $text)
    {
      $encodingLabel = self::normalizeEncoding($encodingLabel);
      if($encodingLabel == 'ISO-8859-1') return self::toLatin1($text);
      return self::toUTF8($text);
    }
    protected static function utf8_decode($text, $option = self::WITHOUT_ICONV)
    {
      if ($option == self::WITHOUT_ICONV || !function_exists('iconv')) {
         $o = utf8_decode(
           str_replace(array_keys(self::$utf8ToWin1252), array_values(self::$utf8ToWin1252), self::toUTF8($text))
         );
      } else {
         $o = iconv("UTF-8", "Windows-1252" . ($option == self::ICONV_TRANSLIT ? '//TRANSLIT' : ($option == self::ICONV_IGNORE ? '//IGNORE' : '')), $text);
      }
      return $o;
    }
  }

?>