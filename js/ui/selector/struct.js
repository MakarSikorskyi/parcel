(window.UI || (window.UI = {})) && (window.UI.selector || (window.UI.selector = {})) && window.UI.selector.struct || require.once (
    "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/getPosition.js", "lib/dom/getScrollPos.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/window/getSize.js", "lib/core/Delayed.js"
) && (window.UI.selector.struct = (function () {
    var f = function () {
        var s = mkNode ("select");
        s.mode = arguments[0] || "struct";
        s.filter = arguments[1] || {parent: null};
        s.silent = arguments[2] || true;
        s.list = {};
        
        s.load = function () {
            if (!/(type|struct)/.test (s.mode)) s.mode = "struct";
            s.list = sapi (s.mode, "list");
        };
        
        s.refresh = function () {
            if (!/(type|struct)/.test (s.mode)) s.mode = "struct";
            var rq = new AJAX (sapi ("URL_ROOT") + "sys/contrib/struct.php", "get=" + s.mode, "POST", s.silent);
            for (f in s.filter) rq.data += "&filter[" + f + "]=" + s.filter[f];
            rq.onAct = s.load;
            rq.send ();
        };
        return s;
    };
    return f;
}) ());