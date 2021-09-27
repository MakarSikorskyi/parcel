String.prototype.pad || require.once ("lib/core/type.js") && (String.prototype.pad = function (len, chr) {
    var left = len >= 0, th1s = this;
    if (chr === undefined || chr === null) chr = " ";
    if (/string|number/.test (type (chr))) throw new Error ('String.pad(): Invalid padding character "' + chr + '", should be string or number');
    if (chr.length === 0) throw new Error ('String.pad(): Pad string should contain at least 1 character');
    chr = chr.toString ().charAt (0);
    while (th1s.length < len) th1s = left ? chr.concat (th1s) : th1s.concat (chr);
    return th1s;
});