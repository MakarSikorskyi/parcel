window.cloneObject || (window.cloneObject = function (o) {
        var r = {};
        for (var i in o) if (type (o[i]) === "object") r[i] = cloneObject (o[i]); else r[i] = o[i];
        return r;
});