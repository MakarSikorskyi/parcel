(window.UI || (window.UI = {})) && require.once (
    "lib/array/indexOf.js", "lib/core/func.js", "lib/core/Timer.js", "lib/core/type.js", "lib/dom/addText.js", "lib/dom/classname.js",
    "lib/dom/mkNode.js", "lib/event/eventHandler.js", "lib/event/getEvent.js", "lib/style/applyStyle.js"
) && (window.UI.report = (function () {
    var boxlist = mkNode ("div").$ ({id: "ui-box-messages"}).addEventHandler (function () {
        getEvent (false).preventDefault ();
    }, "selectstart", "mousedown"), classes = ["error", "info", "debug", "error", "special"];
    document.body.appendChild (boxlist);

    return function (eType) {
        var i, box, cnt = 0;
        eType = Number (eType);
        if ([0, 1, 2, 3, 4].indexOf (eType) === -1) throw new Error ("UI.report(): Invalid message type: " + eType);

        box = mkNode ("ul").classname ("+" + classes[eType]).$ ({onclick: function () {
            this.parentNode.removeChild (this);
        }});

        eType === 3 && box.appendChild (mkNode ("li").addText ("Виникла системна помилка:").applyStyle ({listStyle: "none", marginBottom: "10px"}));

        for (i = 1; i < arguments.length; i++) {
            if (arguments[i] === null) arguments[i] = "";
            if (type (arguments[i]) !== "string") throw new Error ("UI.report(): Invalid message: " + arguments[i] + ", on step " + i);
            cnt += arguments[i].split (" ").length;
            box.appendChild (mkNode ("li").addText (arguments[i]));
            sapi ("user", "auth") && parseInt (sapi ("user", "id")) > 0 && !UI.report.skip_log && window.dbg && sapi ("LOG_CLIENT") && dbg.usage.__report (eType, arguments[i]);
        }

        cnt = Math.ceil (cnt / 2 + (cnt > 10 ? 5 : 0)) * 30;
        eType === 1 && Timer.timeout (func (function (box) {
            box.parentNode && box.parentNode.removeChild (box);
        }, box), cnt);
        eType === 3 && box.appendChild (mkNode ("li").addText ("Для початку оновіть сторінку, натиснувши <CTRL+F5>, а якщо це не допомогло, зверніться до адміністратора, використовуючи функцію\
зворотнього зв'язку (що доступна з головного меню системи).").applyStyle ({listStyle: "none", marginTop: "10px"}));

        boxlist.appendChild (box);
    };
}) ());
UI.report.skip_log = false;