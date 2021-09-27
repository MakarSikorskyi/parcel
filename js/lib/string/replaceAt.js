String.prototype.replaceAt || (String.prototype.replaceAt = function (start, len) {
    while (start < 0) start += this.length;
    if (start >= this.length) throw new Error ('String.replaceAt(): Invalid start position: "' + start + '/' + this.length + '"');
    if (len < 0) throw new Error ('String.replaceAt(): Length can not be negative');

    var out = new RegExp ("^(.{" + start + "}).{" + len + "}(.*)$").exec (this);
    return out[1] + Array.prototype.slice.call (arguments, 2).join ("") + out[2];
});