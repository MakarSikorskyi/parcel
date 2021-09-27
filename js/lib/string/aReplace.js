String.prototype.aReplace || require.once ("lib/core/type.js") && (String.prototype.aReplace = function (haystack, replacement) {
    if (type (haystack) !== "array") throw new Error ('String.aReplace(): Invalid haystack: "' + haystack + '"');
    if (type (replacement) !== "array") throw new Error ('String.aReplace(): Invalid replacement: "' + replacement + '"');

    var i, th1s = this;

    for (i = 0; i < haystack.length; i++) {
        if (!/regexp|number|string/.test (type (haystack[i]))) throw new Error ('String.aReplace(): Invalid haystack element "' + haystack[i] + '" on step ' + i);
        if (!/string|number/.test (type (replacement[i]))) throw new Error ('String.aReplace(): Invalid replacement element "' + haystack[i] + '" on step ' + i);
        th1s = th1s.replace (haystack[i], replacement[i]);
    }

    return th1s;
});