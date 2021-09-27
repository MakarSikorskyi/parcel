String.prototype.escapeRegExp || (String.prototype.escapeRegExp = function () {
    return this.replace (/([\-\/\]\[\?\.\\\*\^\$])/g, "\\$1");
});