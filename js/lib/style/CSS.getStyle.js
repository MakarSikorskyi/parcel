CSSStyleRule.prototype.getStyle || (CSSStyleRule.prototype.getStyle = function () {
    var _css = {}, i, th1s = this, args = arguments;
    // Run througth all given arguments
    for (i = 0; i < args.length; i++) {
        if (type (args[i]) !== "string") throw new Error ("CSSStyleRule.getStyle(): Invalid style property requested: " + arguments[i] + ", on step " + i);
        _css[args[i]] = (function () {
            if (args[i] in th1s.style && th1s.style[args[i]] !== "") return th1s.style[args[i]];
            return "";
        }) ();
    }
    // Return collected CSS
    return _css;
});