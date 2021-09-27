/*@cc_on require.once ("lib/core/type.js");
(function (f) {
    window.setTimeout = f (window.setTimeout);
    window.setInterval = f (window.setInterval);
}) (function (f) {
    return function (c, t) {
        var a = Array.prototype.slice.call (arguments, 2);
        if (type (c) !== "function") c = new Function (c);
        return f (function () {c.apply (this, a)}, t);
    };
}); @*/