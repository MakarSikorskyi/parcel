require.once ("lib/core/type.js", "lib/dom/_extend.js", "lib/string/aReplace.js") && window.$.addExtension ("*", {
    /**
     * This extension allows get current element styles (assigned via inline style attribute, internal or external css file).
     * Return object with all fetched requested style properties.
     *
     * @return object
     */
    getStyle: function () {
        var css = {}, i, th1s = this, args = arguments;
        // Run througth all given arguments
        for (i = 0; i < args.length; i++) {
            if (type (args[i]) !== "string") throw new Error ("HTMLElement.getStyle(): Invalid style property requested: " + arguments[i] + ", on step " + i);
            css[args[i]] = (function () {
                if (args[i] in th1s.style && th1s.style[args[i]] !== "") return th1s.style[args[i]];
                if (th1s.currentStyle) return th1s.currentStyle[args[i]];
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    return (document.defaultView.getComputedStyle (th1s, null) && document.defaultView.getComputedStyle (th1s, null).getPropertyValue (
                        args[i].aReplace ([/cssFloat/, /([A-Z])/g], ["float", "-$1"]).toLowerCase ()
                    ));
                }
                return "";
            }) ();
        }
        // Return collected CSS
        return css;
    }
});