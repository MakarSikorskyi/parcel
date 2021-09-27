<?php
defined ('__INCLUDE_SAFE__') || die ();

if (!function_exists('imagecreatefrombmp')) { function imagecreatefrombmp($filename) {
if (!($fh = fopen($filename, 'rb'))) {
    trigger_error('imagecreatefrombmp: Can not open ' . $filename, E_USER_WARNING);
    return false;
}
$meta = unpack('vtype/Vfilesize/Vreserved/Voffset', fread($fh, 14));
if ($meta['type'] != 19778) {
    trigger_error('imagecreatefrombmp: ' . $filename . ' is not a bitmap!', E_USER_WARNING);
    return false;
}
$meta += unpack('Vheadersize/Vwidth/Vheight/vplanes/vbits/Vcompression/Vimagesize/Vxres/Vyres/Vcolors/Vimportant', fread($fh, 40));
if ($meta['bits'] == 16) $meta += unpack('VrMask/VgMask/VbMask', fread($fh, 12));
$meta['bytes'] = $meta['bits'] / 8;
$meta['decal'] = 4 - (4 * (($meta['width'] * $meta['bytes'] / 4)- floor($meta['width'] * $meta['bytes'] / 4)));
if ($meta['decal'] == 4) $meta['decal'] = 0;

if ($meta['imagesize'] < 1) {
    $meta['imagesize'] = $meta['filesize'] - $meta['offset'];
    if ($meta['imagesize'] < 1) {
        $meta['imagesize'] = @filesize($filename) - $meta['offset'];
        if ($meta['imagesize'] < 1) {
            trigger_error('imagecreatefrombmp: Can not obtain filesize of ' . $filename . '!', E_USER_WARNING);
            return false;
        }
    }
}
$meta['colors'] = !$meta['colors'] ? pow(2, $meta['bits']) : $meta['colors'];
$palette = array();
if ($meta['bits'] < 16) {
    $palette = unpack('l' . $meta['colors'], fread($fh, $meta['colors'] * 4));
    if ($palette[1] < 0) {
        foreach ($palette as $i => $color) $palette[$i] = $color + 16777216;
    }
}
$im = imagecreatetruecolor($meta['width'], $meta['height']);
$data = fread($fh, $meta['imagesize']);
$p = 0;
$vide = chr(0);
$y = $meta['height'] - 1;
$error = 'imagecreatefrombmp: ' . $filename . ' has not enough data!';
while ($y >= 0) {
    $x = 0;
    while ($x < $meta['width']) {
        switch ($meta['bits']) {
            case 32:
            case 24:
                if (!($part = substr($data, $p, 3))) {
                        trigger_error($error, E_USER_WARNING);
                        return $im;
                }
                $color = unpack('V', $part . $vide);
                break;
            case 16:
                if (!($part = substr($data, $p, 2))) {
                        trigger_error($error, E_USER_WARNING);
                        return $im;
                }
                $color = unpack('v', $part);
                $color[1] = (($color[1] & 0xf800) >> 8) * 65536 + (($color[1] & 0x07e0) >> 3) * 256 + (($color[1] & 0x001f) << 3);
                break;
            case 8:
                $color = unpack('n', $vide . substr($data, $p, 1));
                $color[1] = $palette[ $color[1] + 1 ];
                break;
            case 4:
                $color = unpack('n', $vide . substr($data, floor($p), 1));
                $color[1] = ($p * 2) % 2 == 0 ? $color[1] >> 4 : $color[1] & 0x0F;
                $color[1] = $palette[ $color[1] + 1 ];
                break;
            case 1:
                $color = unpack('n', $vide . substr($data, floor($p), 1));
                switch (($p * 8) % 8) {
                    case 0: $color[1] = $color[1] >> 7; break;
                    case 1: $color[1] = ($color[1] & 0x40) >> 6; break;
                    case 2: $color[1] = ($color[1] & 0x20) >> 5; break;
                    case 3: $color[1] = ($color[1] & 0x10) >> 4; break;
                    case 4: $color[1] = ($color[1] & 0x8) >> 3; break;
                    case 5: $color[1] = ($color[1] & 0x4) >> 2; break;
                    case 6: $color[1] = ($color[1] & 0x2) >> 1; break;
                    case 7: $color[1] = ($color[1] & 0x1); break;
                }
                $color[1] = $palette[ $color[1] + 1 ];
                break;
            default:
                trigger_error('imagecreatefrombmp: ' . $filename . ' has ' . $meta['bits'] . ' bits and this is not supported!', E_USER_WARNING);
                return false;
        }
        imagesetpixel($im, $x, $y, $color[1]);
        $x++;
        $p += $meta['bytes'];
    }
    $y--;
    $p += $meta['decal'];
}
fclose($fh);
return $im;
}}

class Img {
    var $i,$z;
    function load($f){
        $d = getimagesize($f);
        $this->z = $d[2];
        if ($this->z==2) $this->i = imagecreatefromjpeg($f);
        elseif ($this->z == 1) $this->i = imagecreatefromgif ($f);
        elseif ($this->z == 3) $this->i = imagecreatefrompng($f);
        elseif ($this->z == 6) $this->i = imagecreatefrombmp ($f);
    }
    function save($f,$z=2,$c=80) {
        if ($z == 2) imagejpeg ($this->i,$f,$c);
        elseif ($z == 1) imagegif ($this->i,$f);
        elseif ($z == 3) imagepng ($this->i,$f);
    }
    function output ($z = 2) {
        if ($z == 2) imagejpeg ($this->i);
        elseif ($z == 1) imagegif ($this->i);
        elseif ($z == 3) imagepng ($this->i);
    }
    function getWidth () {
        return imagesx ($this->i);
    }
    function getHeight () {
        return imagesy ($this->i);
    }
    function resizeToHeight ($h) {
        $r = $h/$this->getHeight ();
        $w = $this->getWidth ()*$r;
        $this->resize ($w, $h);
    }
    function resizeToWidth ($w) {
        $r = $w/$this->getWidth ();
        $h = $this->getheight () * $r;
        $this->resize ($w, $h);
    }
    function scale ($s) {
        $w=$this->getWidth ()*$s/100;
        $h=$this->getheight ()*$s/100;
        $this->resize ($w, $h);
    }
    function resize ($w, $h){
        $x = imagecreatetruecolor ($w,$h);
        imagecopyresampled ($x, $this->i, 0, 0, 0, 0, $w, $h, $this->getWidth (), $this->getHeight ());
        $this->i = $x;
    }
}

?>