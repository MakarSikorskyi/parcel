Array.prototype.indexOf || (Array.prototype.indexOf = function (elt) {
    var from = Number (arguments[1]) || 0;
    from = (from < 0) ? Math.ceil (from) : Math.floor (from);
    from < 0 && (from += this.length);

    for (; from < this.length; from++) if (from in this && this[from] === elt) return from;
    return -1;
});