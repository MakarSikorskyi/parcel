window.GV || require.once ("lib/core/type.js") && (window.GV = (function () {
    var vars = {};

    return {
        set: function (o) {
            if (type (o) !== "object") throw new Error ("window.GV.add(): Invalid object to add");
            vars = (function (vars, o) {
                for (var i in o) {
                    if (/^array|object$/i.test (type (o[i])) && i in vars) vars[i] = arguments.callee (vars[i], o[i]);
                    else vars[i] = o[i];
                }
                return vars;
            }) (vars, o);
            return true;
        },
        get: function () {
            for (var i = 0, v = vars; i < arguments.length; i++) {
                if (v && arguments[i] in v) v = v[arguments[i]];
                else return null;
            }
            return v;
        },
        unset: function () {
            for (var i = 0, v = vars; i < arguments.length - 1; i++) {
                if (v && arguments[i] in v) v = v[arguments[i]];
                else return false;
            }
            delete v[arguments[arguments.length - 1]];
            return true;
        }
    };
}) ());