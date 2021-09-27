window.func || (window.func = function (f) {
    if (!(f instanceof Function) && typeof f !== "function") throw new Error ("func(): Invalid function for wrapping: " + f)
    var a = Array.prototype.slice.call (arguments, 1);
    return function () {
        return f.apply (this, a);
    }
});