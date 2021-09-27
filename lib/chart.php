<?php defined ('__INCLUDE_SAFE__') || die ();

/**
 * Determines Chart's axis parameters
 */
final class ChartAxis {
    const DISPERSION = 5;
    private $grid = FALSE,
            $continuation = TRUE,
            $arrow = TRUE,
            $visible = TRUE,
            $position = array ('x' => 0, 'y' => 0),
            $dispersion = 0,
            $division_space = 0,
            $usable_length = 0,
            $constraint = array ('min' => 0, 'max' => 10, 'scale' => 1, 'label' => array ()),
            $label_font = 1,
            $label_height = 0,
            $label_width = 0,
            $label = array (),
            $label_color = array ();
    
    public $img;
    
    /**
     * Prepares and checks axis base data for chart rendering to canvas
     * 
     * @param array $constraint Array contains data about min (int) and max (int) values places on axis, scale (int) and if needed labels (array) for axis division
     * 
     * @param bool $arrow Render axis arrow<p>Default: TRUE</p>
     * @param bool $continuation Line continuation at the end of min and max constraint calculated value (3% of axis length)<p>Default: TRUE</p>
     * @param bool $grid Render perpendicular to axis grid lines<p>Default: TRUE</p>
     * @param bool $visible Consider axis visibility (this affect axis line and arrow)<p>Default: TRUE</p>
     */
    public function __construct (array $constraint, $arrow = TRUE, $continuation = TRUE, $grid = FALSE, $visible = TRUE) {
        foreach ($constraint as $key => $value) if (in_array ($key, array_keys ($this->constraint))) $this->constraint[$key] = $value;
        if (is_bool ($arrow)) $this->arrow = $arrow;
        if (is_bool ($continuation)) $this->continuation = $continuation;
        if (is_bool ($grid)) $this->grid = $grid;
        if (is_bool ($visible)) $this->visible = $visible;
        
        if (!$this->constraint['scale']) $this->constraint['scale'] = 1;
        if ($this->constraint['max'] - $this->constraint['min'] == 0) {
            $this->constraint['min'] = 0;
            $this->constraint['scale'] = $this->constraint['max'];
        }
        if ($this->constraint['min'] > $this->constraint['max']) {
            $max = $this->constraint['min'];
            $this->constraint['min'] = $this->constraint['max'];
            $this->constraint['max'] = $max;
        }
        if ($this->constraint['min'] > 0) $this->constraint['min'] -= $this->constraint['scale'];
        if ($this->constraint['max'] < 0) $this->constraint['max'] += $this->constraint['scale'];
        if (!count ($this->constraint['label'])) {
            for ($i = $this->constraint['min']; $i <= $this->constraint['max']; $i += $this->constraint['scale']) {
                if ($i > $this->constraint['max']) break;
                $this->constraint['label'][$i] = $i;
            }
        }
        foreach ($this->constraint['label'] as $idx => $label) $this->drawLabel ($idx, $label);
        $this->redrawLabels ();
    }
    
    /**
     * Perform clean up
     */
    public function __destruct () {
        foreach ($this->label as $label) imagedestroy ($label);
        imagedestroy ($this->img);
    }
    
    /**
     * Draws GD2 image resource for specified axis label index number and text
     * 
     * @param int $idx Label index number
     * @param string $str Label text
     * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure
     */
    private function drawLabel ($idx, $str, $color = '#000') {
        $fh = imagefontheight ($this->label_font) + 2;
        if ($fh > $this->label_height) $this->label_height = $fh;
        $fw = imagefontwidth ($this->label_font);
        $size = mb_strlen ($str);
        $fw = $size * $fw + 2;
        if ($fw > $this->label_width) $this->label_width = $fw;
        $this->label[$idx] = imagecreatetruecolor ($fw, $fh);
        imagefill ($this->label[$idx], 0, 0, Chart::allocateColor ('transparent', $this->label[$idx]));
        return imagestring ($this->label[$idx], $this->label_font, 1, 1, $str, Chart::allocateColor ($color, $this->label[$idx]));
    }
    
    /**
     * Redraw all labels according to highest width and height values to match them
     */
    private function redrawLabels () {
        foreach ($this->label as $idx => $label) {
            $fh = imagesy ($this->label[$idx]);
            $fw = imagesx ($this->label[$idx]);
            if ($fh == $this->label_height && $fw == $this->label_width) continue;
            $timg = imagecreatetruecolor ($this->label_width, $this->label_height);
            imagefill ($timg, 0, 0, Chart::allocateColor ('transparent', $timg));
            if ($fh < $this->label_height) $y = floor ($this->label_height / 2 - $fh / 2);
            else $y = 0;
            if ($fw < $this->label_width) $x = floor ($this->label_width / 2 - $fw / 2);
            else $x = 0;
            if ($x == 0 && $y == 0) continue;
            if (!imagecopy ($timg, $label, $x, $y, 0, 0, $fw, $fh)) {
                imagedestroy ($timg);
                continue;
            }
            if (imagedestroy ($label)) {
                $this->label[$idx] = $timg;
            }
        }
    }
    
    /**
     * Perform smart resize with rotation to avoid making text too small (i.e. unreadable)
     * 
     * @param float $ratio Available space in pixels where lable can be placed (this will be doubled due to rotation)
     * @param bool $rotation Whether or not to perform image rotation<p>Default: TRUE</p>
     * @return bool <b>TRUE</b> on success or <b>FALSE</b> on failure
     */
    public function resizeLabels ($ratio, $rotation = FALSE) {
        if (!is_numeric ($ratio)) return FALSE;
        $this->label_width = floor ($this->label_width * $ratio);
        $this->label_height = floor ($this->label_height * $ratio);
        foreach ($this->label as $idx => $label) {
            $timg = imagecreatetruecolor ($this->label_width, $this->label_height);
            imagefill ($timg, 0, 0, Chart::allocateColor ('transparent', $timg));
            if (!imagecopyresized ($timg, $this->label[$idx], 0, 0, 0, 0, imagesx ($timg), imagesy ($timg), imagesx ($this->label[$idx]), imagesy ($this->label[$idx]))) {
                imagedestroy ($timg);
                continue;
            }
            if (imagedestroy ($this->label[$idx])) {
                $this->label[$idx] = $timg;
            } else continue;
            $rotation !== FALSE && ($this->label[$idx] = imagerotate ($this->label[$idx], $rotation, imagecolorat ($this->label[$idx], 0, 0), 0));
        }
        $this->label_width = imagesx ($this->label[$idx]);
        $this->label_height = imagesy ($this->label[$idx]);
    }
    
    /**
     * Renders axis horizontaly
     * 
     * @param int $length Required axis length
     */
    public function drawHorizontal ($length) {
        $fw = $this->getUsableLength ($length);
        $fw += $this->arrow === TRUE && $this->visible === TRUE ? 6 : 0;
        $fw += $this->continuation === TRUE && $this->visible === TRUE ? 2 * (ceil ($length * 0.02) <= 2 ? 2 : ceil ($length * 0.02)) : 0;
        if ($this->label_width > $this->getDivisionSpace ()) $this->resizeLabels (1, 45);
        $fh = $this->visible === TRUE ? ($this->label_height + 7) : 1;
        $this->position = array (
            'x' => $fw - ($this->constraint['max'] > 0 ? $this->getDispersion () * ($this->constraint['max'] - ($this->constraint['min'] > 0 ? $this->constraint['min'] : 0)) + ceil ($this->getDivisionSpace () / 2) : 0)
                - ($this->arrow === TRUE && $this->visible === TRUE ? 6 : 0)
                - ($this->continuation === TRUE && $this->visible === TRUE ? (ceil ($length * 0.02) <= 2 ? 2 : ceil ($length * 0.02)) : 0),
            'y' => $this->visible === TRUE ? 2 : 0
        );
        $this->img = imagecreatetruecolor ($fw, $fh);
        imagefill ($this->img, 0, 0, Chart::allocateColor ('transparent', $this->img));
        $lc = Chart::allocateColor ('#000', $this->img);
        $this->visible === TRUE && imageline ($this->img, $this->constraint['min'] == 0 ? $this->position['x'] - ($this->continuation === TRUE ? 2 * (ceil ($length * 0.02) <= 2 ? 2 : ceil ($length * 0.02)) : 0) : 0, $this->position['y'], $fw, $this->position['y'], $lc);
        if ($this->arrow === TRUE && $this->visible === TRUE) {
            imageline ($this->img, $fw, $this->position['y'], $fw - 6, $this->position['y'] - 2, $lc);
            imageline ($this->img, $fw, $this->position['y'], $fw - 6, $this->position['y'] + 2, $lc);
        }
        if ($this->visible === TRUE) foreach ($this->label as $idx => $label) {
            $sx = $this->position['x'] + round ($idx * $this->getDispersion ()) - ($this->constraint['min'] > 0 ? $this->constraint['min'] * $this->getDispersion () : 0);
            if (($this->constraint['min'] > 0 && $label == $this->constraint['min']) || $this->constraint['label'][$idx] == 0) continue;
            if ($this->constraint['max'] < 0 && $label == $this->constraint['max']) continue;
            $idx !== 0 && imageline ($this->img, $sx, $this->position['y'] - 2, $sx, $this->position['y'] + 2, $lc);
            imagecopy ($this->img, $this->label[$idx], $sx - imagesx ($this->label[$idx]) / 2 + 1, $this->position['y'] + 4, 0, 0, imagesx ($this->label[$idx]), imagesy ($this->label[$idx]));
        }
    }
    
    /**
     * Renders axis verticaly
     * 
     * @param int $length Required axis length
     */
    public function drawVertical ($length) {
        $fh = $this->getUsableLength ($length);
        $fh += $this->arrow === TRUE && $this->visible === TRUE ? 6 : 0;
        $fh += $this->continuation === TRUE && $this->visible === TRUE ? 2 * (ceil ($length * 0.02) <= 2 ? 2 : ceil ($length * 0.02)) : 0;
        $fw = $this->visible === TRUE ? $this->label_width + 7 : 1;
        $this->position = array (
            'x' => $this->visible === TRUE ? $fw - 3 : 0,
            'y' => 0 + ($this->constraint['max'] > 0 ? $this->getDispersion () * ($this->constraint['max'] - ($this->constraint['min'] > 0 ? $this->constraint['min'] : 0)) + ceil ($this->getDivisionSpace () / 2) : 0)
                + ($this->arrow === TRUE && $this->visible === TRUE ? 6 : 0)
        );
        $this->img = imagecreatetruecolor ($fw, $fh);
        imagefill ($this->img, 0, 0, Chart::allocateColor ('transparent', $this->img));
        $lc = Chart::allocateColor ('#000', $this->img);
        $this->visible === TRUE && imageline ($this->img, $this->position['x'], 0, $this->position['x'], $this->constraint['min'] == 0 ? $this->position['y'] + ($this->continuation === TRUE ? 2 * (ceil ($length * 0.02) <= 2 ? 2 : ceil ($length * 0.02)) : 0) : $fh, $lc);
        if ($this->arrow === TRUE && $this->visible === TRUE) {
            imageline ($this->img, $this->position['x'], 0, $this->position['x'] - 2, 6, $lc);
            imageline ($this->img, $this->position['x'], 0, $this->position['x'] + 2, 6, $lc);
        }
        if ($this->visible === TRUE) foreach ($this->label as $idx => $label) {
            $sy = $this->position['y'] - round ($idx * $this->getDispersion ()) + ($this->constraint['min'] > 0 ? $this->constraint['min'] * $this->getDispersion () : 0);
            $sx = $this->position['x'] - imagesx ($this->label[$idx]) - 2;
            if (($this->constraint['min'] > 0 && $idx == $this->constraint['min']) || $this->constraint['label'][$idx] == 0) continue;
            if ($this->constraint['max'] < 0 && $idx == $this->constraint['max']) continue;
            $idx !== 0 && imageline ($this->img, $this->position['x'] - 2, $sy, $this->position['x'] + 2, $sy, $lc);
            imagecopy ($this->img, $this->label[$idx], $sx, $sy - imagesy ($this->label[$idx]) / 2, 0, 0, imagesx ($this->label[$idx]), imagesy ($this->label[$idx]));
        }
    }
    
    /**
     * Returns X cordinate of zero coordinate on the axis
     * 
     * @return int X cordinate
     */
    public function getZeroPositionX () {
        return $this->position['x'];
    }
    
    /**
     * Returns Y cordinate of zero coordinate on the axis
     * 
     * @return int Y cordinate
     */
    public function getZeroPositionY () {
        return $this->position['y'];
    }
    
    /**
     * Calculates how many pixels in one division of axis
     * 
     * @param int $length Total length in pixels that should be divided on axis divisions
     * @return int Axis scale dimension in pixels
     */
    public function getDispersion ($length) {
        if (is_numeric ($length)) $this->dispersion = $length / ($this->constraint['max'] - $this->constraint['min']);
        return $this->dispersion;
    }
    
    /**
     * Calculates space (pixels) required for one division
     * 
     * @param type $length Total length in pixels that should be divided on axis divisions
     * @return int Division space in pixels
     */
    public function getDivisionSpace ($length) {
        if (is_numeric ($length)) $this->division_space = $this->getDispersion ($length) * $this->constraint['scale'];
        return $this->division_space;
    }
    
    /**
     * Calculates usable axis length on which chart whill be rendered
     * 
     * @param type $length Total length in pixels that should be divided on axis divisions
     * @return int Length in pixels where chart should be places
     */
    public function getUsableLength ($length) {
        if (is_numeric ($length)) {
            $additive = 0;
            $this->getDivisionSpace ($length);
            if ($this->constraint['min'] <= 0) $additive += ceil ($this->getDivisionSpace () / 2);
            if ($this->constraint['max'] >= 0) $additive += ceil ($this->getDivisionSpace () / 2);
            $this->usable_length = $length + $additive;
        }
        return $this->usable_length;
    }
    
    /**
     * Returns maximum divisor counter that was provided during class construction (or default if not)
     * 
     * @return int Axis maximum divisor counter
     */
    public function getMaxDivisor () {
        return $this->constraint['max'];
    }
    
    /**
     * Returns minimum divisor counter that was provided during class construction (or default if not)
     * 
     * @return int Axis minimum divisor counter
     */
    public function getMinDivisor () {
        return $this->constraint['min'];
    }
}

/**
 * Determines Chart's canvas parameters
 */
final class ChartCanvas {
    public $width = 100, $height = 100,
           $padding = array ('top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0),
           $background, $img;
    
    private $position = array ('x' => 0, 'y' => 0);
    
    /**
     * Prepares and checks canvas base data for chart collection
     * 
     * @param int $width Chart width (pixel)
     * @param int $height Chart height (pixel)
     * @param mixed $padding Image padding, use array to specify different paddings for left, right, top and bottom sides, if value is integer then it's used for all sides
     * @param string $background - Background color
     */
    public function __construct ($width, $height, $padding, $background) {
        !empty ($width) && ($this->width = $width);
        !empty ($height) && ($this->height = $height);
        !empty ($background) && ($this->background = $background);
        if (!empty ($padding)) {
            if (is_array ($padding)) foreach ($padding as $key => $value) {
                if (in_array ($key, array_keys ($this->padding))) $this->padding[$key] = $value;
            } else $this->padding = array_fill_keys (array_keys ($this->padding), $padding);
        }
    }
    
    /**
     * Perform clean up
     */
    public function __destruct () {
        if ($this->img) imagedestroy ($this->img);
    }
    
    /**
     * Returns image width
     * 
     * @return int Image width
     */
    public function getImageWidth () {
        return $this->width + $this->padding['left'] + $this->padding['right'];
    }
    
    /**
     * Returns image height
     * 
     * @return int Image height
     */
    public function getImageHeight () {
        return $this->height + $this->padding['top'] + $this->padding['bottom'];
    }
    
    /**
     * Sets position of zero coordinate of axes system
     * 
     * @param type $x Position by X coordinate
     * @param type $y Position by Y coordinate
     */
    public function setZeroPosition ($x, $y) {
        $this->position['x'] = $x;
        $this->position['y'] = $y;
    }
    
    /**
     * Returns X cordinate of zero coordinate of axes system
     * 
     * @return int X cordinate
     */
    public function getZeroPositionX () {
        return $this->position['x'];
    }
    
    /**
     * Returns Y cordinate of zero coordinate of axes system
     * 
     * @return int Y cordinate
     */
    public function getZeroPositionY () {
        return $this->position['y'];
    }
}

/**
 * Chart point coordinates data, for pie chart - sector values
 */
final class ChartData {
    private $set = array (),
            $color = '#000',
            $legend = NULL,
            $yindex = FALSE,
            $sort = TRUE,
            $sorted = FALSE,
            $carret = FALSE,
            /* Last retrieved data set index */
            $lidx;
    
    /**
     * Initialize chart data set
     * 
     * @param array $set Array with set of values that will be placed on chart
     * @param type $color Data set color on chart
     * @param type $legend Legend text
     * @param bool $yindex If set to TRUE consider that $set array indexed by Y coordinate
     */
    public function __construct (array $set, $color = '#fff', $legend = NULL, $yindex = FALSE) {
        if (is_bool ($yindex)) $this->yindex = $yindex;
        $this->set = $set;
        $this->color = $color;
        $this->legend = $legend;
    }
    
    /**
     * Disable sorting of data set values
     */
    public function noSort () {
        $this->sort = FALSE;
    }
    
    /**
     * Sort data set array
     * 
     * @param bool $reverse Apply reverse order
     * @return bool Sorted status
     */
    public function xSort ($reverse = FALSE) {
        if ($this->sort === FALSE || $this->sorted === TRUE || !count ($this->set)) return $this->sorted;
        $ar = array_keys ($this->set);
        sort ($ar);
        $reverse && ($ar = array_reverse ($ar));
        $tmp = array ();
        foreach ($ar as $key) $tmp[$key] = $this->set[$key];
        $this->set = $tmp;
        return $this->sorted = TRUE;
    }
    
    /**
     * Returns iteratively X and Y values of a chart point
     * 
     * @param bool $last If set to TRUE last accessed point will be retrieved
     * @return array X, Y point values, or FALSE if finished carret iteration
     */
    public function getPoint ($last = FALSE) {
        if ($this->carret === FALSE) $this->carret = array_keys ($this->set);
        $tmplidx = $this->lidx;
        if (($this->carret === FALSE || $last === FALSE)) $this->lidx = array_shift ($this->carret);
        if ($this->lidx === NULL) {
            $this->lidx = $tmplidx;
            return FALSE;
        }
        return array ('x' => $this->yindex ? $this->set[$this->lidx] : $this->lidx, 'y' => $this->yindex ? $this->lidx : $this->set[$this->lidx]);
    }
    
    
    /**
     * Reset carret key array to get points from the begining of a data set
     */
    public function resetCarret () {
        $this->carret = FALSE;
    }
    
    /**
     * Returns data set color on chart
     * 
     * @return string CSS RGB color format
     */
    public function getColor () {
        return $this->color;
    }
    
    /**
     * Returns data set desciption
     * 
     * @return string Legend text
     */
    public function getLegend () {
        return $this->legend;
    }
}

/**
 * Chart preparation and rendering
 */
final class Chart {
    const TYPE_LINE = 0x01,
          TYPE_SPLINE = 0x02,
          TYPE_DOTS = 0x04,
          TYPE_BAR = 0x08,
          TYPE_AREA = 0x10,
          TYPE_PIE = 0x20,
          TYPE_CIRCLE = 0x40;
    
    private static $collection = array (), $layer = array (),
        /* Data set color */
        $dsc = array ();
    private $axis_x, $axis_y, $canvas, $img;
    
    public function __construct (ChartCanvas $canvas, ChartAxis $axis_x, ChartAxis $axis_y) {
        $args = array_combine (array ('canvas', 'axis_x', 'axis_y'), func_get_args ());
        foreach ($args as $key => $value) $this->$key = $value;
        if ($this->axis_x->getDivisionSpace ($this->canvas->width) <= ChartAxis::DISPERSION) {
            defined ('SYS_CLI') && CLI::report ('Chart.__construct', CLI::EXIT_ERR_WARN, 'Canvas width too small.') || Core::report ('Chart.__construct', Core::ERR_FATAL, 'Canvas width too small.');
        }
        if ($this->axis_y->getDivisionSpace ($this->canvas->height) <= ChartAxis::DISPERSION) {
            defined ('SYS_CLI') && CLI::report ('Chart.__construct', CLI::EXIT_ERR_WARN, 'Canvas height too small.') || Core::report ('Chart.__construct', Core::ERR_FATAL, 'Canvas height too small.');
        }
        $this->drawAxes ();
        static::$collection[] = $this;
    }
    
    /**
     * Perform clean up
     */
    public function __destruct () {
        if ($this->img) imagedestroy ($this->img);
    }
    
    /**
     * CSS like color allocation wrapper
     * 
     * @param string $color Color that should be allocated ('transparent' if needed transparent color)
     * @param resource $img Image resource identifier where color will be allocated
     * @return int A color identifier or <b>FALSE</b> if the allocation failed
     */
    public static function allocateColor ($color, $img) {
        if ($color === 'transparent') {
            $color = imagecolorallocatealpha ($img, 0xff, 0xff, 0xff, 127);
        } else {
            $cm = array ();
            if (!preg_match ('/^#([0-9abcdef]{3}|[0-9abcdef]{6})(\.[0-9]|\.[1-9][0-9]|\.1[0-1][0-9]|\.12[0-7]|)$/i', $color, $cm)) {
                $color = imagecolorallocatealpha ($img, 0xff, 0xff, 0xff, 0);
            } else {
                sscanf ($cm[2], '.%d', $cm[2]);
                if (!$cm[2]) $cm[2] = 0;
                if (preg_match ('/^[0-9abcdef]{3}$/i', $cm[1])) {
                    $color = sscanf (strtolower ($cm[1]), '%1$01x%2$01x%3$01x');
                    $color[0] .= $color[0];
                    $color[1] .= $color[1];
                    $color[2] .= $color[2];
                } else $color = sscanf (strtolower ($cm[1]), '%1$02x%2$02x%3$02x');
                $color = imagecolorallocatealpha ($img, $color[0], $color[1], $color[2], $cm[2]);
            }
        }
        if (!$color) return FALSE;
        return $color;
    }
    
    private function drawAxes () {
        $this->axis_x->drawHorizontal ($this->canvas->width);
        $this->axis_y->drawVertical ($this->canvas->height);
        $adx = 0; $ady = 0;
        if (imagesy ($this->axis_y->img) - $this->axis_y->getZeroPositionY () < imagesy ($this->axis_x->img) - 2) $ady = imagesy ($this->axis_x->img) - 2 - (imagesy ($this->axis_y->img) - $this->axis_y->getZeroPositionY ());
        $this->canvas->height = imagesy ($this->axis_y->img) + $ady;
        if ($this->axis_x->getZeroPositionX () < imagesx ($this->axis_y->img) - 2) $adx = imagesx ($this->axis_y->img) - 3 - $this->axis_x->getZeroPositionX ();
        $this->canvas->width = imagesx ($this->axis_x->img) + $adx;
        $timg = imagecreatetruecolor ($this->canvas->width, $this->canvas->height);
        imagefill ($timg, 0, 0, static::allocateColor ('transparent', $timg));
        imagecopy ($timg, $this->axis_y->img, $adx > 0 ? 0 : $this->axis_x->getZeroPositionX () - imagesx ($this->axis_y->img) + 3, 0, 0, 0, imagesx ($this->axis_y->img), imagesy ($this->axis_y->img));
        imagecopy ($timg, $this->axis_x->img, $adx > 0 ? $adx : 0, $this->axis_y->getZeroPositionY () - 2, 0, 0, imagesx ($this->axis_x->img), imagesy ($this->axis_x->img));
        $this->canvas->setZeroPosition (
            $this->axis_x->getZeroPositionX () > $this->axis_y->getZeroPositionX () ? $this->axis_x->getZeroPositionX () : $this->axis_y->getZeroPositionX (),
            $this->axis_y->getZeroPositionY ()
        );
        $this->canvas->img = $timg;
    }
    
    /**
     * NOT USABLE (Only for filled elipse)
     * 
     * @param type $img
     * @param type $color
     */
    public static function antialias ($img, $color) {
        $aac = imagecolorsforindex ($img, $color);
        $aac0 = imagecolorallocatealpha ($img, $aac['red'], $aac['green'], $aac['blue'], ceil ((127 - $aac['alpha']) / 1.6));
        $aac1 = imagecolorallocatealpha ($img, $aac['red'], $aac['green'], $aac['blue'], ceil ((127 - $aac['alpha']) / 2));
        for ($y = 0; $y < imagesy ($img); $y++) for ($x = 1; $x < imagesx ($img); $x++) {
            $c = array (imagecolorat ($img, $x, $y));
            if ($c[0] !== $color) continue;
            $c[1] = array (imagecolorat ($img, $x, $y - 1), $x, $y - 1);
            $c[2] = array (imagecolorat ($img, $x + 1, $y - 1), $x + 1, $y - 1);
            $c[3] = array (imagecolorat ($img, $x + 1, $y), $x + 1, $y);
            $c[4] = array (imagecolorat ($img, $x + 1, $y + 1), $x + 1, $y + 1);
            $c[5] = array (imagecolorat ($img, $x, $y + 1), $x, $y + 1);
            $c[6] = array (imagecolorat ($img, $x - 1, $y + 1), $x - 1, $y + 1);
            $c[7] = array (imagecolorat ($img, $x - 1, $y), $x - 1, $y);
            $c[8] = array (imagecolorat ($img, $x - 1, $y - 1), $x - 1, $y - 1);
            for ($i = 1; $i <= 8; $i++) {
                $c[$i][0] !== $color && imagesetpixel ($img, $c[$i][1], $c[$i][2], $aac0);
//                if ($i % 2 == 0 && $c[$i][0] === $color) {
//                    $c[$i - 1][0] !== $color && imagesetpixel ($img, $c[$i - 1][1], $c[$i - 1][2], $aac0);
//                    $j = $i + 1 == 9 ? 1 : $i + 1;
//                    $c[$j][0] !== $color && imagesetpixel ($img, $c[$j][1], $c[$j][2], $aac0);
//                }
            }
        }
    }
    
    public function draw ($type, ChartData $data, $to_y = FALSE) {
        $data->xSort ();
        if ($type & self::TYPE_DOTS) {
            $this->layer[self::TYPE_DOTS] = imagecreatetruecolor ($this->canvas->width * 2, $this->canvas->height * 2);
            imagefill ($this->layer[self::TYPE_DOTS], 0, 0, static::allocateColor ('transparent', $this->layer[self::TYPE_DOTS]));
            $this->dsc[self::TYPE_DOTS] = static::allocateColor ($data->getColor (), $this->layer[self::TYPE_DOTS]);
        }
        if ($type & self::TYPE_BAR) {
            $this->layer[self::TYPE_BAR] = imagecreatetruecolor ($this->canvas->width, $this->canvas->height);
            imagefill ($this->layer[self::TYPE_BAR], 0, 0, static::allocateColor ('transparent', $this->layer[self::TYPE_BAR]));
            $this->dsc[self::TYPE_BAR] = static::allocateColor ($data->getColor (), $this->layer[self::TYPE_BAR]);
        }
        $point = array ();
        while ($res = $data->getPoint ()) {
            $x = round ($this->canvas->getZeroPositionX () + $this->axis_x->getDispersion () * $res['x']);
            $y = round ($this->canvas->getZeroPositionY () - $this->axis_y->getDispersion () * $res['y']);
            $point[$x] = $y;
            ($type & self::TYPE_DOTS) && imagefilledellipse ($this->layer[self::TYPE_DOTS], $x * 2, $y * 2, 12, 12, $this->dsc[self::TYPE_DOTS]);
            if ($type & self::TYPE_BAR) {
                if (!$to_y) {
                    imagefilledrectangle($this->layer[self::TYPE_BAR], $x - $this->axis_x->getDivisionSpace () / 2 + 2, $y, $x + $this->axis_x->getDivisionSpace () / 2 - 2, $this->canvas->getZeroPositionY () - 1, $this->dsc[self::TYPE_BAR]);
                    imagerectangle($this->layer[self::TYPE_BAR], $x - $this->axis_x->getDivisionSpace () / 2 + 2, $y, $x + $this->axis_x->getDivisionSpace () / 2 - 2, $this->canvas->getZeroPositionY () - 1, $this->dsc[self::TYPE_BAR]);
                } else {
                    imagefilledrectangle($this->layer[self::TYPE_BAR], $x, $y - $this->axis_y->getDivisionSpace () / 2 - 2, $this->canvas->getZeroPositionX () + 1 , $y + $this->axis_y->getDivisionSpace () / 2 + 2, $this->dsc[self::TYPE_BAR]);
                }
            }
        }
        if ($type & self::TYPE_LINE) {
            $this->layer[self::TYPE_LINE] = imagecreatetruecolor ($this->canvas->width * 2, $this->canvas->height * 2);
            imagefill ($this->layer[self::TYPE_LINE], 0, 0, static::allocateColor ('transparent', $this->layer[self::TYPE_LINE]));
            $this->dsc[self::TYPE_LINE] = static::allocateColor ($data->getColor (), $this->layer[self::TYPE_LINE]);
            imagesetthickness ($this->layer[self::TYPE_LINE], 2.5);
            $ar = array_keys ($point);
            array_shift ($ar);
            array_pop ($ar);
            $ar = array_reverse ($ar);
            $points = array ();
            $pcount = count ($point) + count ($ar);
            foreach ($point as $x => $y) {
                $points[] = $x * 2;
                $points[] = $y * 2;
            }
            foreach ($ar as $x) {
                $points[] = $x * 2;
                $points[] = $point[$x] * 2;
            }
            imagepolygon ($this->layer[self::TYPE_LINE], $points, $pcount, $this->dsc[self::TYPE_LINE]);
            $this->dsc[self::TYPE_LINE] = imagecolorat ($this->layer[self::TYPE_LINE], $points[0], $points[1]);
        }
        if ($type & self::TYPE_AREA) {
            $this->layer[self::TYPE_AREA] = imagecreatetruecolor ($this->canvas->width * 2, $this->canvas->height * 2);
            imagefill ($this->layer[self::TYPE_AREA], 0, 0, static::allocateColor ('transparent', $this->layer[self::TYPE_AREA]));
            $this->dsc[self::TYPE_AREA] = static::allocateColor ($data->getColor (), $this->layer[self::TYPE_AREA]);
            $ar = array_keys ($point);
            $x1 = array_shift ($ar);
            $x2 = array_pop ($ar);
            $points = array ();
            $pcount = count ($point) + 2;
            foreach ($point as $x => $y) {
                $points[] = $x * 2;
                $points[] = $y * 2;
            }
            $points[] = $x2 * 2;
            $points[] = $this->canvas->getZeroPositionY () * 2 - 1;
            $points[] = $x1 * 2;
            $points[] = $this->canvas->getZeroPositionY () * 2 - 1;
            imagefilledpolygon ($this->layer[self::TYPE_AREA], $points, $pcount, $this->dsc[self::TYPE_AREA]);
        }
        $this->layer = array_reverse ($this->layer, TRUE);
        foreach ($this->layer as $type => $layer) {
//            if ($type & self::TYPE_LINE || $type & self::TYPE_AREA || $type & self::TYPE_DOTS) static::antialias ($this->layer[$type], $this->dsc[$type]);
            imagecopyresampled ($this->canvas->img, $this->layer[$type], 0, 0, 0, 0, $this->canvas->width, $this->canvas->height, imagesx ($this->layer[$type]), imagesy ($this->layer[$type]));
            imagedestroy ($this->layer[$type]);
            unset ($this->layer[$type], $this->dsc[$type]);
        }
        return TRUE;
    }
    
    public function render ($type, $filename = NULL) {
        if (!imagetypes () & $type) return FALSE;
        try {
            $this->img = imagecreatetruecolor ($this->canvas->getImageWidth (), $this->canvas->getImageHeight ());
        } catch (Exception $e) {
            return FALSE;
        }
        if ($this->img) {
            imagefill ($this->img, 0, 0, static::allocateColor ($this->canvas->background, $this->img));
        }
        imagecopy ($this->img, $this->canvas->img, $this->canvas->padding['left'], $this->canvas->padding['top'], 0, 0, imagesx ($this->canvas->img), imagesy ($this->canvas->img));
        $type === IMG_PNG && imagepng ($this->img, $filename);
        $type === IMG_GIF && imagegif ($this->img, $filename);
        $type === IMG_JPEG && imagejpeg ($this->img, $filename);
        $type === IMG_JPG && imagejpeg ($this->img, $filename);
        $type === IMG_WBMP && imagewbmp ($this->img, $filename);
    }
}

?>