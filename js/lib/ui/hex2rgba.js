window.hex2rgba || (window.hex2rgba = (function () {
    var rxf = function (e, r, g, b) {return r + r + g + g + b + b;};
    return function (hex, opacity, invert, brightness) {
        if (!brightness) brightness = 1;
        if (invert !== true) invert = false;
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (hex)) throw new Error ("String.hex2rgba (): Provided HEX is not valid CSS color value.");
        if (opacity === undefined) opacity = 1;
        else if (/^(100|[1-9][0-9]|[0-9])%$/.test (opacity)) opacity = opacity.match (/^(100|[1-9][0-9][.]{0,1}[0-9]*|[0-9][.]{0,1}[0-9]*)%$/)[1] / 100;
        else opacity = parseFloat (opacity);
        if (opacity > 1) opacity = 1;
        var result = hex.replace (/^#{0,1}([a-f\d])([a-f\d])([a-f\d])$/i, rxf).match (/^#{0,1}([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (invert) return 'rgba(' + Math.floor ((255 - parseInt (result[1], 16)) * brightness) + "," + Math.floor ((255 - parseInt (result[2], 16)) * brightness) + "," + Math.floor ((255 - parseInt (result[3], 16)) * brightness) + "," + opacity + ")";
        else return 'rgba(' + Math.floor (parseInt (result[1], 16) * brightness) + "," + Math.floor (parseInt (result[2], 16) * brightness) + "," + Math.floor (parseInt (result[3], 16) * brightness) + "," + opacity + ")";
    }
}) ()) ;