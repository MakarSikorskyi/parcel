String.prototype.rtrim || (String.prototype.rtrim = function () {
    return this.replace (/^\s*/, "");
});

String.prototype.ltrim || (String.prototype.ltrim = function () {
    return this.replace (/\s*$/, "");
});

String.prototype.itrim || (String.prototype.itrim = function () {
    return this.replace (/\s+/g, " ");
});

String.prototype.xtrim || (String.prototype.xtrim = function () {
    return this.ltrim ().rtrim ().itrim ();
});

String.prototype.trim || (String.prototype.trim = function () {
    return this.rtrim ().ltrim ();
});