window.NTLM || require.once ("lib/core/AJAX.js", "lib/core/Timer.js", "sys/AJAX.events.js", "ui/UI.lock.js", "lib/core/__uid.js", "lib/core/Cookie.js") && (window.NTLM = (function () {
    var __port = 443, __ntlm_id = Cookie ("__ntlm") || __uid ();
    if (/^[1-9][0-9]{0,4}$/.test (sapi ("NTLM_PORT"))) __port = sapi ("NTLM_PORT");
    var frame = mkNode ("iframe").$ ({src: "https://" + sapi ("SERVER") + ":" + __port + sapi ("URL_ROOT") + "ntlm.php?__session=" + Cookie ("__salesbase") + "&__id=" + __ntlm_id, onload: function () {
        frame.contentWindow.postMessage ("__ntlm", "https://" + sapi ("SERVER") + ":" + __port);
    }}).applyStyle ({display: "none", visibility: "hidden"}), o = {
        auth: function () {
            if (sapi ("NTLM_AUTH") === false) return;
            UI.WorkSpace.loader ("Завантаження ...");
            //Cookie ("__salesbase", {value: Cookie ("__salesbase"), option: {path: sapi ("URL_ROOT"), domain: sapi ("SERVER")}, secure: true});
            window.haveEventHandler (o.post, "message") || window.addEventHandler (o.post, "message");
            document.body.appendChild (frame);
//            if (console !== undefined) console.log ("NTLM Auth processing...");
        }, post: function () {
            var ev = getEvent (), data = JSON.parse (ev.data);
            NTLM.state = data.__ntlm;
            if (NTLM.state.auth === true) {
//                if (console !== undefined) console.log ("NTLM Auth successful");
                Cookie ("__ntlm", {value: __ntlm_id, option: {path: sapi ("URL_ROOT"), domain: sapi ("URL_HOST"), expires: 604800, secure: true}});
                Cookie ("__salesbase", {value: Cookie ("__salesbase"), option: {path: sapi ("URL_ROOT"), domain: sapi ("URL_HOST"), expires: 604800, secure: true}});
//                if (console !== undefined) console.log (Cookie ("__ntlm"));
            }
            document.body.removeChild (frame);
            window.haveEventHandler (o.post, "message") && window.removeEventHandler (o.post, "message");
            window.location.hash = "#" + sapi ("URL_MOD") + "core/login.php?" + __ntlm_id;
        },
        state: {auth: false}
    };
    return o;
}) ());