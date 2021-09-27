Date.prototype.getDayOfYear || (Date.prototype.getDayOfYear = function() {
    var onejan = new Date (this.getFullYear (), 0, 1);
    return Math.ceil ((this - onejan) / 86400000);
});