<?php defined ('__INCLUDE_SAFE__') || die ();

final class PwHash {
            /** Number of iterations for encoding */
    const   ITERATIONS = 8;

    private static  $itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
                    $iteration = PwHash::ITERATIONS,
                    $random;
    
    final public static function getRandomString ($length, $regexp = '/^[a-z0-9\s]$/ui') {
        $r = NULL;
        do {
            $l = html_entity_decode ('&#x00'. bin2hex (openssl_random_pseudo_bytes (1)). ';', ENT_COMPAT, 'UTF-8');
            if (preg_match ($regexp, $l)) {$r .= $l; $length--;}
        } while ($length > 0);
        return $r;
    }
    
    final public static function getRandomPassword ($length) {
        $r = NULL;
        do {
            $l = html_entity_decode ('&#x00'. bin2hex (openssl_random_pseudo_bytes (1)). ';', ENT_COMPAT, 'UTF-8');
            if ($r === NULL) {
                if (preg_match ('/^[a-z]$/ui', $l)) {$r .= $l; $length--;}
                continue;
            }
            if (preg_match ('/^[a-z()\[\]:;\^<>=?@!#\$%&\*+\-_,\.{}0-9]$/ui', $l)) {$r .= $l; $length--;}
        } while ($length > 0);
        return $r;
    }

    final private static function encode64 ($input) {
        $output = '';
        $i = 0;
        do
        {
            $value = ord ($input[$i++]);
            $output .= static::$itoa64[$value & 0x3f];

            if ($i < 16) {
                $value |= ord ($input[$i]) << 8;
            }

            $output .= static::$itoa64[($value >> 6) & 0x3f];

            if ($i++ >= 16) {
                break;
            }

            if ($i < 16) {
                $value |= ord ($input[$i]) << 16;
            }

            $output .= static::$itoa64[($value >> 12) & 0x3f];

            if ($i++ >= 16) {
                break;
            }

            $output .= static::$itoa64[($value >> 18) & 0x3f];
        } while ($i < 16);

        return $output;
    }

    final private static function crypt ($password, $setting) {
        $output = '*0';
        if (substr ($setting, 0, 2) == $output) {
            $output = '*1';
        }

        $id = substr ($setting, 0, 3);

        if ($id != '$P$' && $id != '$H$') {
            return $output;
        }

        $count_log2 = strpos (static::$itoa64, $setting[3]);
        if ($count_log2 < 7 || $count_log2 > 30) {
            return $output;
        }

        $count = 1 << $count_log2;

        $salt = substr ($setting, 4, 8);
        if (strlen ($salt) != 8) {
            return $output;
        }

        $hash = md5 ($salt . $password, TRUE);
        do {
            $hash = md5 ($hash . $password, TRUE);
        } while (--$count);

        $output = substr ($setting, 0, 12). static::encode64 ($hash);

        return $output;
    }

    final private static function blowfish () {
        if (is_readable ('/dev/urandom') && ($fh = @fopen ('/dev/urandom', 'rb'))) {
            $input = fread ($fh, 16);
            fclose ($fh);
        }

        if (!isset ($input) || strlen ($input) < 16) {
            static::$random = md5 (microtime (). static::$random);
            $input = substr (pack ('H*', md5 (static::$random)), 0, 16);
        }

        $itoa64 = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        $output = '$2a$'. chr (ord ('0') + static::$iteration / 10). chr (ord ('0') + static::$iteration % 10). '$';

        $i = 0;
        do {
            $c1 = ord ($input[$i++]);
            $output .= $itoa64[$c1 >> 2];
            $c1 = ($c1 & 0x03) << 4;
            if ($i >= 16) {
                $output .= $itoa64[$c1];
                break;
            }

            $c2 = ord ($input[$i++]);
            $c1 |= $c2 >> 4;
            $output .= $itoa64[$c1];
            $c1 = ($c2 & 0x0f) << 2;

            $c2 = ord ($input[$i++]);
            $c1 |= $c2 >> 6;
            $output .= $itoa64[$c1]. $itoa64[$c2 & 0x3f];
        } while (TRUE);

        return $output;
    }
    /**
     * Create hash of given password using specified number of iterations
     *
     * @access public
     * @static
     * @param string $password Source password
     * @param int $iterations Number of iterations for encoding
     * @return string
     */
    final public static function hash ($password, $iterations = PwHash::ITERATIONS) {
        # Update iterations number if specified
        static::$iteration = $iterations;
        # Minimum of allowed iterations is 4, maximum 31
        if (static::$iteration < 4 || static::$iteration > 31) {
            static::$iteration = 8;
        }
        # Generate random seed
        static::$random = microtime ();
        # Append pid (if applicable)
        if (function_exists ('getmypid')) {
            static::$random .= getmypid ();
        }
        # Encrypt password
        $hash = crypt ($password, static::blowfish ());
        # Check hash integrity (it should be 60 symbols long)
        if (strlen ($hash) === 60) {
            return $hash;
        }
        return NULL;
    }
    /**
     * Check password against previously stored hash
     *
     * @access public
     * @static
     * @param string $password
     * @param string $stored_hash
     * @return boolean
     */
    final public static function check ($password, $stored_hash) {
        $hash = static::crypt ($password, $stored_hash);

        if ($hash[0] == '*') {
            $hash = crypt ($password, $stored_hash);
        }

        return $hash == $stored_hash;
    }
}

?>