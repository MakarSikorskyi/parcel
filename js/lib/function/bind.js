Function.prototype.bind || (Function.prototype.bind = function (context) {
    var f = this, c = context;
    return function () {f.apply (c, arguments);}
});