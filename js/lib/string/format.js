String.prototype.format || require.once ("lib/core/type.js") && (String.prototype.format = function (format) {
    if (type (format) !== "string") throw new Error ("String.format(): Invalid format type: " + type (format));
    if (!format) return this;
    var out = format, i = 0, th1s = this;

    if (!th1s) return th1s;

    while (out.indexOf ("_") !== -1) {
        if (i > th1s.length - 1) break;
        out = out.replace (/_/, th1s.substring (i, ++i));
    }
    return out;
});