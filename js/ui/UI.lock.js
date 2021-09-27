(window.UI || (window.UI = {})) && window.UI.lock || require.once ("lib/core/type.js", "ui/UI.report.js") && (window.UI.lock = (function () {
    var lock = false;

    return function () {
        if (arguments[0] || arguments[0] === false) {
            if (type (arguments[0]) === "string") {
                UI.report (1, arguments[0]);
                lock = true;
            } else if (type (arguments[0] === "boolean")) lock = arguments[0];
            else throw new Error ("UI.lock(): Invalid locking type: " + arguments[0]);
            return true;
        } else return lock;
    }
}) ());