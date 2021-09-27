window.Cookie || require.once ("lib/core/type.js", "lib/string/escapeRegExp.js") && (window.Cookie = (function () {
    var __base = {
            __encode: function (str) {
                return encodeURIComponent (str.toString ());
            },
            __decode: function (str) {
                return decodeURIComponent (str).toString ();
            },
            __set: function (name, data) {
                var value, option;
                if (type (data) === "object") {
                    value = data.value;
                    option = data.option;
                } else value = data;
                
                var c = name + "=" + __base.__encode (value);
                if (type (option) === "object") {
                    if (type (option.expires) === "number") {
                        var d = new Date ();
                        d.setSeconds (d.getSeconds () + option.expires);
                        c += "; expires=" + d.toGMTString ();
                    }
                    if (type (option.expires) === "date") c += "; expires=" + option.expires.toGMTString ();
                    if (option.path) c += "; path=" + encodeURIComponent (option.path).replace (/%2f/ig, "/");
                    if (option.domain) c += "; domain=" + encodeURIComponent (option.domain);
                    if (type (option.secure) === "boolean") option.secure === true && (c += "; secure");
                    else c += "; secure";
                }
                document.cookie = c;
            },
            __get: function (name) {
                var c = document.cookie.match (new RegExp ("(^|;)?" + name.escapeRegExp () + "=([^;]*)(;|$)"));
                if (c) return (__base.__decode (c[2]));
                else return null;
            },
            __getAll: function () {
                var c = {}, a = document.cookie.split (";"), m;
                for (var i = 0; i < a.length; i++) if (m = a[i].match (new RegExp ("(^|;)?(.*)=([^;]*)(;|$)"))) if (!/(expires|path|domain|secure)/.test (m[2])) c[m[2].replace (/[\s\r\n ]/g, "")] = __base.__decode (m[3]);
                return c;
            },
            __del: function (name) {
                var d = new Date ();
                d.setSeconds (d.getSeconds () - 1);
                if (type (name) === "regexp") {
                    var m = __base.__getAll ();
                    for (var i in m) if (name.test (i)) __base.__del (i);
                } else document.cookie = name + "=; expires=" + d.toGMTString ();
            }
        },
        f = function () {
            if (arguments.length > 1) return f.set.apply (f, Array.prototype.slice.call (arguments, 0));
            if (arguments.length == 1 && (type (arguments[0]) === "array" && /^-/.test (arguments[0]) || /^-/.test (arguments[0]))) return f.del.call (f, arguments[0]);
            if (arguments.length == 1) return f.get.call (f, arguments[0]);
            return f.getAll ();
        };

    f.set = function () {
        if (arguments.length == 2) __base.__set.call (f, arguments[0], arguments[1]);
        if (type (arguments[0]) === "object") for (var i in arguments[0]) __base.__set.call (f, i, arguments[0][i]);
    }
    f.get = function () {
        if (type (arguments[0]) === "array") {
            var c = {};
            for (var i = 0; i < arguments[0].length; i++) c[arguments[0][i]] = __base.__get.call (f, arguments[0][i]);
            return c;
        } else return __base.__get (arguments[0]);
    }
    f.del = function () {
        if (type (arguments[0]) === "array") for (var i = 0; i < arguments[0].length; i++) __base.__del.call (f, arguments[0][i].replace (/^-/, ""));
        else if (type (arguments[0]) === "regexp") __base.__del (arguments[0]);
        else __base.__del (arguments[0].replace (/^-/, ""));
    }
    f.getAll = __base.__getAll;
    
    return f;
}) ());