(window.UI || (window.UI = {})) && window.UI.DialogBox || require.once (
    "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/getPosition.js", "lib/dom/getScrollPos.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/window/getSize.js", "ui/UI.WorkSpace.js"
) && (window.UI.DialogBox = (function () {
    var o = {length: 0, index: 0};
    return function (title, w, h, workzone) {
        if (type (title) !== "string") throw new Error ("UI.DialogBox(): Invalid title: " + title);
        if (!workzone) workzone = window.UI.WorkSpace.current ();
        var win, offset, sp = document.getScrollPos (),
            dbxstyle = _CSS (".ui-box-dialog").getStyle ("paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth"),
            top = _CSS (".ui-box-workspace-legend").getStyle ("height"),
            ltdef = (sapi ("SYS_ALTERNATE") ? [0, 50] :
                [($ ("#ui-left-div") && $ ("#ui-left-div").offsetWidth) ? $ ("#ui-left-div").offsetWidth : 0,
                $ ("#ui-panel-top").offsetHeight + parseInt (top["height"].replace ("px", ""))]),
            wsdef = [ltdef[0] + parseInt (dbxstyle["paddingLeft"].replace ("px", "")) + parseInt (dbxstyle["paddingRight"].replace ("px", "")) + parseInt (dbxstyle["borderLeftWidth"].replace ("px", "")) + parseInt (dbxstyle["borderRightWidth"].replace ("px", "")),
                    ltdef[1] + parseInt (dbxstyle["borderTopWidth"].replace ("px", "")) + parseInt (dbxstyle["paddingTop"].replace ("px", "")) + parseInt (dbxstyle["borderBottomWidth"].replace ("px", "")) + parseInt (dbxstyle["paddingBottom"].replace ("px", ""))],
            btmdef = (($ ("#ui-panel-bottom") && $ ("#ui-panel-bottom").offsetHeight) ? $ ("#ui-panel-bottom").offsetHeight : 0),
            ws = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}, ci = o.index;

        if (/null|undefined/.test (type (w))) w = Math.floor ((ws.width - wsdef[0]) / 3);
        if (/null|undefined/.test (type (h))) h = Math.floor ((ws.height - wsdef[1]) / 3);
        if (type (w) !== "number" || type (h) !== "number") throw new Error ("UI.DialogBox(): Invalid width/height value given: " + w + "x" + h);

        (ws.height - wsdef[1] - btmdef < h) && (h = ws.height - wsdef[1] - btmdef);
        (ws.width - wsdef[0] < w) && (w = ws.width - wsdef[0]);
        (h < 50) && (h = 50);
        (w < 30) && (w = 30);

        offset = {x: sp.x + Math.floor (ltdef[0] + (ws.width - wsdef[0] - w) / 2), y: sp.y + Math.floor (ltdef[1] + ((h < ws.height - wsdef[1] - btmdef) ? (ws.height - wsdef[1] - btmdef - h) / 2 : 0))};

        ws = {width: 0, height: 0};
        o.length++; o.index++;
        o[ci] = {
            close: function () {
                if (type (o[ci].onClose) === "function" && !o[ci].onClose ()) return false;
                win.parentNode.removeChild (win);
                win = null;
                delete o[ci];
                o.length--;

                return true;
            }, startMove: function () {
                o[ci].focus ();
                var e = getEvent (false).preventDefault (), pos = win.getPosition (win.parentNode);
                
                offset = {x: e.pos.x - pos.x, y: e.pos.y - pos.y};
                ws = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
                sp = document.getScrollPos ();

                !document.haveEventHandler (o[ci].doMove, "mousemove") && document.addEventHandler (o[ci].doMove, "mousemove");
                !document.haveEventHandler (o[ci].stopMove, "mouseup") && document.addEventHandler (o[ci].stopMove, "mouseup");
            }, doMove: function () {
                var e = getEvent (false).preventDefault ();

                ((e.pos.y -= offset.y) + win.offsetHeight - sp.y > ws.height - btmdef) && (e.pos.y = ws.height + sp.y - btmdef - win.offsetHeight);
                ((e.pos.x -= offset.x) + win.offsetWidth - sp.x > ws.width) && (e.pos.x = ws.width + sp.x - win.offsetWidth);
                (e.pos.y - sp.y < ltdef[1]) && (e.pos.y = sp.y + ltdef[1]);
                (e.pos.x - sp.x < ltdef[0]) && (e.pos.x = sp.x + ltdef[0]);

                win.applyStyle ({top: e.pos.y + "px", left: e.pos.x + "px"});
            }, stopMove: function () {
                document.removeEventHandler (o[ci].doMove, "mousemove");
                document.removeEventHandler (o[ci].stopMove, "mouseup");
                offset = {x: 0, y: 0};
                ws = {width: 0, height: 0};
            }, startResize: function () {
                o[ci].focus ();
                getEvent (false).preventDefault ();

                offset = win.getPosition ();
                ws = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
                sp = document.getScrollPos ();

                !document.haveEventHandler (o[ci].doResize, "mousemove") && document.addEventHandler (o[ci].doResize, "mousemove");
                !document.haveEventHandler (o[ci].stopResize, "mouseup") && document.addEventHandler (o[ci].stopResize, "mouseup");
            }, doResize: function () {
                var e = getEvent (false).preventDefault ();

                (e.pos.y - sp.y > ws.height - btmdef) && (e.pos.y = sp.y + ws.height - btmdef);
                (e.pos.x - sp.x > ws.width) && (e.pos.x = sp.x + ws.width);
                e.pos.y -= (offset.y + (wsdef[1] - ltdef[1]) - 1);
                e.pos.x -= (offset.x + (wsdef[0] - ltdef[0]) - 1);
                (e.pos.y < 50) && (e.pos.y = 50);
                (e.pos.x < 30) && (e.pos.x = 30);

                win.applyStyle ({width: e.pos.x + "px", height: e.pos.y + "px"});
            }, stopResize: function () {
                document.removeEventHandler (o[ci].doResize, "mousemove");
                document.removeEventHandler (o[ci].stopResize, "mouseup");
                offset = {x: 0, y: 0};
                ws = {width: 0, height: 0};
            }, focus: function () {
                win && win.parentNode.lastChild !== win && win.parentNode.$ (["removeChild", win], ["appendChild", win]);
            }, maxmin: function () {
                if (o[ci].prevh && o[ci].prevw) {   // restore
                    win.applyStyle ({height: o[ci].prevh, width: o[ci].prevw, top: o[ci].prevt, left: o[ci].prevl});
                    o[ci].prevt = o[ci].prevl = o[ci].prevh = o[ci].prevw = null;
                    win.childNodes[1].applyStyle ({display: ""});
                    win.childNodes[0].childNodes[0].applyStyle ({display: ""});
                    win.childNodes[0].childNodes[1].applyStyle ({display: "none"});
                } else {    // maximize
                    o[ci].prevt = win.style.top;
                    o[ci].prevl = win.style.left;
                    o[ci].prevh = win.style.height;
                    o[ci].prevw = win.style.width;
                    win.applyStyle ({top: sp.y + ltdef[1] + "px", left: sp.x + ltdef[0] + "px",
                    height: document.documentElement.clientHeight - wsdef[1] - btmdef + "px",
                    width: document.documentElement.clientWidth - wsdef[0] + "px"});
                    win.childNodes[1].applyStyle ({display: "none"});
                    win.childNodes[0].childNodes[0].applyStyle ({display: "none"});
                    win.childNodes[0].childNodes[1].applyStyle ({display: ""});
                }
            },
            prevt: null, prevl: null, prevh: null, prevw: null,
            onClose: null
        };
        
        o[ci].box = (function () {
            return workzone.appendChild (
                win = mkNode ("div").classname ("+ui-box-dialog").$ (["appendChild",
                    mkNode ("div").$ (["appendChild",
                        mkNode ("span").addText ("□").$ ({title: "Розгорнути", onclick:o[ci].maxmin}),
                        mkNode ("span").addText ("▼").$ ({title: "Відновити розмір", onclick:o[ci].maxmin}).applyStyle ({display: "none"}),
                        mkNode ("span").addText ("×").$ ({title: "Закрити", onclick: o[ci].close})]).addText (title).addEventHandler (o[ci].startMove, "mousedown").addEventHandler (o[ci].focus, "click"),
                    mkNode ("div").addEventHandler (o[ci].startResize, "mousedown")
                ]).applyStyle ({height: h + "px", width: w + "px", top: offset.y + "px", left: offset.x + "px"})
            ).appendChild (mkNode ("div"));
        }) ();

        offset = {x: 0, y: 0};
        sp = {x: 0, y: 0};
        
        return o[ci];
    };
}) ());