require.once ("lib/core/AJAX.js", "lib/core/o2a.js", "sys/AJAXLinks.js", "ui/UI.lock.js", "ui/UI.report.js", "ui/UI.MainMenu.js", "ui/UI.WorkSpace.js", "ui/UI.User.js") && (AJAX.onError = function (o) {
    o.silent || UI.WorkSpace.loader (false);
    _Request && _Request.kill ();
    UI.report (3, o.xhr.status + ". " + o.xhr.statusText + " @ " + o.url);
}) && (AJAX.onBeforeSend = function (o) {
    if (!o.lockIgnore && UI.lock ()) return false;

    o.silent || UI.WorkSpace.loader ("Завантаження ...");
    o.addHeaders ({"X-UKey": sapi ("req", "hash")});

    return true;
}) && (AJAX.onSuccess = function (o) {
    if (!o.xhr.responseText) {
        UI.report (2, "AJAX.onSuccess(): Empty response data. You should avoid such situations!");
        return;
    }
    var response = (new Function ("return " + o.xhr.responseText + ";")) (), sys = response.sys, decookie = response.decookie;

    if (decookie) Cookie.del (o2a (decookie));

    delete response.sys, response.decookie;
    response.req.hash = response.req.hash.slice (0, 7).split ("").reverse ().join ("") + response.req.hash.slice (7).split ("").reverse ().join ("");

    if (sys.redirect) {
        sapi (response);

        var rq = new AJAX ();
        rq.url = sys.redirect;
        rq.send ();
        return;
    }

    for (var i in sys.msg) {
        sys.msg[i] = o2a (sys.msg[i], false);

        if (!sys.msg[i].length) {
            continue;
        }
        sys.msg[i].splice (0, 0, i);
        UI.report.skip_log = true;
        UI.report.apply (UI, sys.msg[i]);
        UI.report.skip_log = false;
    }

    sapi (response);

    !sapi ("sys", "redirect") && _Request && !_Request.running () && _Request.refresh ();
    sys.exec && UI.lock (true) && (location.hash = sapi ("req", "url")) && urlTrack (location.hash) && UI.lock (false);
    
    if (sapi ("user", "auth") && GV.get ("user", "auth")) {
        GV.set ({hash: location.hash});
    }

    if (sapi ("user", "login") || GV.get ("user", "auth") !== sapi ("user", "auth")) {
        GV.unset ("user", "data");
        GV.set ({user: {auth: sapi ("user", "auth"), data: sapi ("data", "user")}});
        UI.User.panel ();
        UI.MainMenu ();
        UI.WorkSpace ();
    }

    sys.exec && require.cache (sys.exec);

    if ($("#ui-box-rotator")) {
        $("#ui-box-rotator").empty ();
        if (sapi ("user", "auth")) {
//            $("#ui-box-rotator").$(["appendChild", "Кількість користувачів: ", mkNode ("span").addText (sapi ("req", "registered")).classname ("+c-white", "+bold"),
//                " Активних на даний момент: ", mkNode ("span").addText (sapi ("req", "active")).classname ("+c-white", "+bold")
//                (UI.User.access('training', 'extra'))? (" Заявки на участь ", mkNode ("span").addText (" Заявки на участь "+ sapi ("req", "applic")).classname ("+c-white", "+bold")): false
//            ]);
        } else {
            $("#ui-box-rotator").$(["appendChild",
                mkNode ("span").$ (["appendChild", "Отримай доступ до Web-додатку SalesBase та приєднуйся до найкращої команди. Нас вже: ", mkNode ("span").addText (sapi ("req", "registered")).classname ("+c-white", "+bold")]).applyStyle ({display: "block"})
            ]);
        }
        $("#ui-box-rotator").$(["appendChild",
            mkNode ("span").addText (sapi ("_srv", "env_msg")).applyStyle ({fontSize: "140%", fontWeight: "bold", display: "block"}),
            mkNode ("span").addText (sapi ("_srv", "db_msg")).applyStyle ({fontSize: "140%", fontWeight: "bold", display: "block"})
        ]);
    }

    type (o.onAct) === "function" && o.onAct ();

}) && (AJAX.onDone = function (o) {
    o.silent || UI.WorkSpace.loader (false);
});