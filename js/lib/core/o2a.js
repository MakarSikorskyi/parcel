window.o2a || (window.o2a = function (o, preserveKeys) {
    var a = [], i;

    preserveKeys === false || (preserveKeys = true);

    if (!o) throw new Error ("o2a(): Invalid object given!");

    if (!("propertyIsEnumerable" in o) && o.length) for (i = 0; i < o.length; i++) {
        if (/object/.test (type (o[i]))) o2a (o[i]);
        else a.push (o[i]);
    } else for (i in o) {
        if (/object/.test (type (o[i]))) o2a (o[i]);
        else /^[0-9]+$/.test (i) && (preserveKeys ? a[i] = o[i] : a.push (o[i])) || (!preserveKeys && a.push (o[i]));
    }

    return a;
});