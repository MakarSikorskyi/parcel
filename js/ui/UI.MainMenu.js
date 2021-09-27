(window.UI || (window.UI = {})) && window.UI.MainMenu || require.once (
    "lib/core/AJAX.js", "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/classname.js", "lib/dom/empty.js", "lib/dom/mkNode.js", "lib/event/eventHandler.js", "lib/event/getEvent.js",
    "sys/AJAX.events.js", "sys/urlTrack.js", "ui/UI.lock.js", "ui/UI.WorkSpace.js", "ui/UI.User.js"
) && (window.UI.MainMenu = (function () {
    var ul = $ ("#ui-list-mainmenu"), ula = $ ("#ui-list-mainmenu-alt"), mainmenu = {dom: {}, act: {
        click: function (g, i) {
            var e = getEvent (false).preventDefault (), pos;
            if (arguments.length === 2) mainmenu.act.active (g, i, true);
            else if (arguments.length === 1) {
                if (g in mainmenu.dom.gul) {
                    if (sapi ("SYS_ALTERNATE")) e.stopBubble ();
                    pos = e.target.parentNode.getPosition ();
                    pos.x--;
                    mainmenu.act.open (g);
                    this.scrollIntoView (true);
                    document.getElementsByTagName ("html")[0].scrollTop -= 80;
                } else mainmenu.act.active (g, null, true);
            } else throw new Error ("UI.MainMenu.click(): No group and item id given");

            return true;
        },
        open: function (g) {
            if (!g) throw new Error ("UI.MainMenu.open(): Trying to open group without ID");
            if (!(g in mainmenu.dom.gul)) throw new Error ("UI.MainMenu.open(): Trying to open non-grouped item");
            if (mainmenu.state.open === g) return true;

            mainmenu.state.open = g;
            mainmenu.act.close ();
            mainmenu.dom.gul[g].style.display = "block";
            if (sapi ("SYS_ALTERNATE") && mainmenu.dom.gul[g].getRefParent ("ul") == ul) {
                ula && ula._ && ula.$ ({_: false}).applyStyle ({display: "none"})
                var e = getEvent (true), pos = e.target.parentNode.getPosition ();
                pos.x = pos.x - 1;
                mainmenu.dom.gul[g].applyStyle ({left: pos.x + "px"});
                document.addEventHandler (func (function (g) {
                    mainmenu.dom.gul[g].applyStyle ({display: "none"});
                    document.removeEventHandler (arguments.callee.caller, "click");
                }, g), "click");
            }
            document.update ();
            return true;
        },
        close: function () {
            if (!mainmenu.state.open) return true;
            for (var i in mainmenu.dom.gul) if ((mainmenu.state.active[0] !== i || (sapi ("SYS_ALTERNATE") && mainmenu.dom.gul[i].getRefParent ("ul") == ul)) && mainmenu.state.open !== i) mainmenu.dom.gul[i].style.display = "none";

            mainmenu.state.open = null;
            document.update ();
            return true;
        },
        nocacheActive: function (v, g, i) {
            try {
                if (typeof (v) !== "boolean") throw new Error ("UI.MainMenu.nocacheActive(): First item is not a boolean: " + v);
                if (g && !(g in mainmenu.dom.ga)) throw new Error ("UI.MainMenu.nocacheActive(): Requested item not found: " + g);
                if (g && i && !(g in mainmenu.dom.gul)) throw new Error ("UI.MainMenu.nocacheActive(): Trying to activate item inside non-group element: " + i);
                if (g && i && !(i in mainmenu.dom.ia[g])) throw new Error ("UI.MainMenu.nocacheActive(): Requested item not found: " + g + "/" + i);
                if (g && !i) mainmenu.dom.ga[g].nocache = v; 
                else if (g && i) mainmenu.dom.ia[g][i].nocache = v; 
                return true;
            } catch (e) {
                window.UI.report (0, e.message);
                return false;
            }
        },
        active: function (g, i, click) {
            if (UI.lock ()) return false;
            if (g && !(g in mainmenu.dom.ga)) throw new Error ("UI.MainMenu.active(): Requested item not found: " + g);
            if (g && i && !(g in mainmenu.dom.gul)) throw new Error ("UI.MainMenu.active(): Trying to activate item inside non-group element: " + i);
            if (g && i && !(i in mainmenu.dom.ia[g])) throw new Error ("UI.MainMenu.active(): Requested item not found: " + g + "/" + i);
            if (mainmenu.state.open !== g) mainmenu.state.open = null;
            if (mainmenu.state.active.length) {
                var ag, ai;
                ag = mainmenu.state.active[0];
                ai = mainmenu.state.active[1];
                mainmenu.state.active = [null, null];
                if (ai && ag !== g) mainmenu.act.close ();

                if (ag && !ai) {
                    ag in mainmenu.dom.gul || mainmenu.dom.ga[ag].$ (mainmenu.dom.ga[ag].nocache ? {} : {href: mainmenu.dom.ia[ag] ? "#" : window.location.hash});
                    mainmenu.dom.ga[ag].classname ("-active");
                } else if (ag && ai) mainmenu.dom.ia[ag][ai].$ (mainmenu.dom.ia[ag][ai].nocache ? {} : {href: !ai && mainmenu.dom.ia[ag] ? "#" : window.location.hash}).classname ("-active");

            }
            if (g) {
                if (i) {
                    ai = mainmenu.dom.ia[g][i];
                    !sapi ("SYS_ALTERNATE") && mainmenu.act.open (g);
                } else ai = mainmenu.dom.ga[g];

                if (i || !mainmenu.dom.ia[g]) {
                    if (click) {
                        UI.lock (true);
                        window.location.hash = ai.getAttribute ("href");
                        urlTrack (window.location.hash);
                        UI.lock (false);
                    }
                    if ((!ai.init || (ai.nocache)) && click) {
                        var ax = new AJAX;
                        if (ai.nocache) ax.silent = true;
                        ax.url = window.location.hash.replace (/^#?/, "");
                        ax.onError = function (o) {
                            UI.lock (false);
                            ai.init = false;
                            AJAX.onError && AJAX.onError (o);
                        };
                        ax.onComplete = function () {
                            UI.lock (false);
                        };
                        ax.onAct = function () {
                            ai.init = true;
                        };
                        ax.send ();
                        UI.lock (true);
                    } else if (ai.init && click) {
                        i && window.UI.WorkSpace.active (g, i) || window.UI.WorkSpace.active (g);
                        window.UI.WorkSpace.show (true);
                    } else if (!click) ai.init = true;
                }

                ai.classname ("+active");
                i ? mainmenu.state.active = [g, i] : mainmenu.state.active = [g];
            }

            return true;
        }
    }, state: {}},
    f = function () {
        var data = sapi ("mods");
        f.nocache = false;
        ul.empty (); ula && ula.empty ();
        mainmenu.dom = {ga: {}, ia: {}, gul: {}};
        mainmenu.state = {open: null, active: [null, null]};

        var g, i, gli, ga, gul, ic, iter = 0;
        for (g in data) {
            if (!data[g].id) throw new Error ("UI.MainMenu(): Group ID is not specified. Group #" + g);
            else if (!data[g].name) throw new Error ("UI.MainMenu(): Group name is not specified: " + data[g].id);
            else if (data[g].auth === 1 && !sapi ("user", "auth") || data[g].auth === -1 && sapi ("user", "auth")) continue;
            else if (data[g].access && !window.UI.User.access (data[g].id)) continue;
            gli = mkNode ("li").applyStyle ({display: (data[g].invisible ? "none" : "")}).$ (["appendChild", ga = mkNode ("a").addEventHandler (func (mainmenu.act.click, data[g].id), "click").$ ({title: sapi ("SYS_ALTERNATE") && iter < 11 ? data[g].name : (data[g].desc || ""), nocache: data[g].nocache})]);

            if (data[g].ico) {
                if (!("x" in data[g].ico) || !("y" in data[g].ico) || type (data[g].ico.x) !== "number" || type (data[g].ico.y) !== "number") throw new Error ("UI.MainMenu(): Invalid icon coords for group " + data[g].id + ": (" + data[g].ico.x + ":" + data[g].ico.x + ")");
                ga.$ (["appendChild", mkIco (data[g].ico.x, data[g].ico.y)])
            }
            ga.appendChild(mkNode ("span").classname ("+mm-name").addText (data[g].name));
            mainmenu.dom.ga[data[g].id] = ga.$ ({href: data[g].url || "#", onclick: data[g].url ? function () {} : null});
            //mainmenu.dom.ga[data[g].id] = ga.$ ({href: data[g].url || "#", onclick: data[g].url ? function () {} : null}).addText (data[g].name);

            i = ic = 0;
            if (i in data[g]) {
                gli.$ (["appendChild", gul = mkNode ("ul")]);
                do {
                    if (!data[g][i].id) throw new Error ("UI.MainMenu(): Item ID is not specified. Group: " + data[g].id + ", item #" + i);
                    else if (!data[g][i].name) throw new Error ("UI.MainMenu(): Item name is not specified: " + data[g].id + "/" + data[g][i].id);
                    else if (!data[g][i].url) continue;
                    else if (data[g][i].auth === 1 && !sapi ("user", "auth") || data[g][i].auth === -1 && sapi ("user", "auth")) continue;
                    else if (data[g][i].access && !window.UI.User.access (data[g].id, data[g][i].id)) continue;
                    data[g].id in mainmenu.dom.ia || (mainmenu.dom.ia[data[g].id] = {});
                    gul.$ (["appendChild", mkNode ("li").applyStyle ({display: (data[g][i].invisible ? "none" : "")}).$ (["appendChild",
                        mainmenu.dom.ia[data[g].id][data[g][i].id] = mkNode ("a").addText (data[g][i].name).$ ({href: data[g][i].url, title: data[g][i].desc || "", nocache: data[g][i].nocache, onclick: function () {}}).addEventHandler (func (mainmenu.act.click, data[g].id, data[g][i].id), "click")
//                        mkNode ("div").applyStyle ({cssFloat: "right"}).addText (sapi ("req", "active"))
                    ])]);
                    mainmenu.dom.gul[data[g].id] = gul;
                    ic++;
                } while (++i in data[g]);
            }
            if (ic && data[g].url && !data[g].invisible) throw new Error ("UI.MainMenu(): Not an empty group with URL - " + data[g].id);
            else if (!ic && !data[g].url) continue;
            if (sapi ("SYS_ALTERNATE")) {
                if (iter == 11) {
                    ul.$ (["appendChild", mkNode ("li").$ (["appendChild", mkNode ("a").$ ({title: "Інші пункти меню"}, ["appendChild",
                        mkIco (8, 10)
                    ]).addEventHandler (function () {
                        var e = getEvent (true), pos = e.target.parentNode.getPosition ();
                        pos.x--;
                        ula && (ula._ && ula.$ ({_: false}).applyStyle ({display: "none"}) || ula.$ ({_: true}).applyStyle ({display: "block", left: pos.x + "px"}));
                        mainmenu.state.open = "none";
                        mainmenu.act.close ();
                        mainmenu.state.open = null;
                        document.addEventHandler (function () {
                            ula && ula.$ ({_: false}).applyStyle ({display: "none"});
                            document.update ();
                            document.removeEventHandler (arguments.callee, "click");
                        }, "click");
                    }, "click")])]);
                }
                if (iter >= 11) ula && ula.$ (["appendChild", gli]);
                else ul.$ (["appendChild", gli]);
                iter++;
            } else ul.$ (["appendChild", gli]);
        }
        document.update ();
        return true;
    };

    f.active = function (g, i) {
        return mainmenu.act.active (g, i, false);
    };
    
    f.click = function (g, i) {
//        var data = sapi ("mods");
//        alert (g + ":" + i);
//        if (i) alert(mainmenu.dom.ia[g][i].href);
//        if (i) return mainmenu.dom.ia[g][i];
//        else return mainmenu.dom.ia[g];
//        alert (window.location.hash);
//        window.location.hash = sapi ("URL_MOD") + "outeractivity/activity.php";
//        window.urlTrack (sapi ("URL_MOD") + "outeractivity/activity.php");
//        window.GV.set ({hash: sapi ("URL_MOD") + "outeractivity/activity.php"});
        mainmenu.act.click (g, i);
//        window.GV.set ({hash: "/dev/salesbase2/mod/outeractivity/activity.php"});
//        alert (window.location.hash);
    };
    
    
    f.nocacheActive = function (v, g, i) {
        return mainmenu.act.nocacheActive (v, g, i);
    };

    return f;
}) ());