(window.UI || (window.UI = {})) && window.UI.WorkSpace || require.once (
    "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/classname.js", "lib/dom/empty.js", "lib/core/type.js", "lib/event/eventHandler.js",
    "lib/event/getEvent.js", "lib/style/applyStyle.js", "ui/mkIco.js", "ui/UI.User.js"
) && (window.UI.WorkSpace = (function () {
    var workspace = {active: [null, null], dom: {}, loader: mkNode ("div").$ ({id: "ui-box-loader"})}, workzone = $ ("#ui-box-workzone"), f = function () {
        var data = sapi ("mods");
        document.title = "The best way for sales « SalesBase";
        workzone.empty ();
        workspace.dom = {};
        var g, i, ic;
        for (g in data) {
            if (!data[g].id) throw new Error ("UI.WorkSpace(): Group ID is not specified. Group #" + g);
            else if (!data[g].name) throw new Error ("UI.WorkSpace(): Group name is not specified: " + data[g].id);
            else if (data[g].auth === 1 && !sapi ("user", "auth") || data[g].auth === -1 && sapi ("user", "auth")) continue;
            else if (data[g].access && !UI.User.access (data[g].id)) continue;
            i = ic = 0;
            if (i in data[g]) {
                do {
                    if (!data[g][i].id) throw new Error ("UI.WorkSpace(): Item ID is not specified. Group: " + data[g].id + ", item #" + i);
                    else if (!data[g][i].name) throw new Error ("UI.WorkSpace(): Item name is not specified: " + data[g].id + "/" + data[g][i].id);
                    else if (data[g].invisible && data[g].url) continue;
                    else if (!data[g][i].url) continue;
                    else if (data[g][i].auth === 1 && !sapi ("user", "auth") || data[g][i].auth === -1 && sapi ("user", "auth")) continue;
                    else if (data[g][i].access && !window.UI.User.access (data[g].id, data[g][i].id)) continue;
                    arguments.callee.add (data[g][i].url, data[g].id, data[g][i].id);
                    ic++;
                } while (++i in data[g]);
            }
            if (ic && data[g].url && !data[g].invisible) throw new Error ("UI.WorkSpace(): Not an empty group with URL - " + data[g].id);
            else if (!ic && !data[g].url) continue;
            else if (!ic && data[g].url) arguments.callee.add (data[g].url, data[g].id);
            else if (data[g].invisible) arguments.callee.add (data[g].url, data[g].id);
        }
    };

    f.add = function (url, g, i) {
        if (type (url) !== "string") throw new Error ("UI.WorkSpace.add(): URL not specified for " + g + (arguments.length === 2 ? "/" + i : ""));
        if (!g) throw new Error ("UI.WorkSpace.add(): No group/item specified");
        if (g in workspace.dom) {
            if (arguments.length === 3) {
                if ("__host__" in workspace.dom[g]) throw new Error ("UI.WorkSpace.add(): Trying to override workspace with group: " + g);
                else if (i in workspace.dom[g]) return true;
            } else if (arguments.length === 2) {
                if (!("__host__" in workspace.dom[g])) throw new Error ("UI.WorkSpace.add(): Trying to override group with workspace: " + g);
                return true;
            }
        } else workspace.dom[g] = {};
        var ws = arguments.length === 3 ? (workspace.dom[g][i] = {}) : workspace.dom[g];
        workzone.$ (["appendChild",
            ws.__host__ = mkNode ("div").$ (["appendChild",
                mkNode ("div").$ (["appendChild",
                    mkNode ("a").$ (["appendChild", mkIco (16, 7)], {href: url, title: "Оновити вікно"}),
                    ws.__legend__ = mkNode ("span")
                ]).classname ("+ui-box-workspace-legend").addEventHandler (function () {
                    getEvent (false).preventDefault ();
                }, "selectstart", "mousedown"),
                ws.__content__ = mkNode ("div").classname ("+ui-box-workspace-content")
            ]).classname ("+ui-box-workspace")
        ]);
        ws.url = url;
        return true;
    };
    f.active = function (g, i) {
        if (arguments.length === 0) {
            workspace.active = [null, null];
            return true;
        } else if (arguments.length === 1 && !(g in workspace.dom)) throw new Error ("UI.WorkSpace.active(): " + g);
        else if (arguments.length === 2 && !(i in workspace.dom[g])) throw new Error ("UI.WorkSpace.active(): Non-existent workspace requested: " + g + "/" + i);
        workspace.active = arguments.length === 2 ? [g, i] : [g, null];
        return true;
    };
    f.getActive = function () {
        return workspace.active;
    };
    f.current = function () {
        var ws;
        if (workspace.active[1]) ws = workspace.dom[workspace.active[0]][workspace.active[1]];
        else if (workspace.active[0]) ws = workspace.dom[workspace.active[0]];
        else throw new Error ("UI.WorkSpace.current(): No active workspace");
        return ws.__content__;
    };
    f.url = function () {
        var ws;
        if (workspace.active[1]) ws = workspace.dom[workspace.active[0]][workspace.active[1]];
        else if (workspace.active[0]) ws = workspace.dom[workspace.active[0]];
        else throw new Error ("UI.WorkSpace.url(): No active workspace");
        return ws.url;
    };
    f.legend = function (legend, append) {
        if (!/^number|string$/.test (type (legend))) throw new Error ("UI.WorkSpace.legend(): Invalid legend: " + legend);
        var ws;
        if (workspace.active[1]) ws = workspace.dom[workspace.active[0]][workspace.active[1]];
        else if (workspace.active[0]) ws = workspace.dom[workspace.active[0]];
        else throw new Error ("UI.WorkSpace.legend(): No active workspace");
        append || ws.__legend__.empty ();
        ws.__legend__.addText ((append && ws.__legend__.firstChild ? " | " : "") + legend);
        legend = ws.__legend__.firstChild.nodeValue.split (/\s*\|\s*/);
        legend.reverse ();
        legend.push ("SalesBase");
        document.title = legend.join (" « ");
        return true;
    };
    f.loader = function (show) {
        if (show === true) show = "Завантаження...";
        if (/^number|string$/.test (type (show))) workspace.loader.applyStyle ({display: "block"}).empty ().addText (show);
        else workspace.loader.applyStyle ({display: "none"});
        return true;
    };
    f.getWorkzone = function () {
        return workzone;
    };
    f.show = function (show) {
        var i, j;
        for (i in workspace.dom) {
            if ("__host__" in workspace.dom[i]) workspace.dom[i].__host__.applyStyle ({display: "none"});
            else for (j in workspace.dom[i]) workspace.dom[i][j].__host__.applyStyle ({display: "none"});
        }

        if (show) {
            var ws, legend;
            if (workspace.active[1]) ws = workspace.dom[workspace.active[0]][workspace.active[1]];
            else if (workspace.active[0]) ws = workspace.dom[workspace.active[0]];
            else throw new Error ("UI.WorkSpace.show(): No active workspace");

            ws.__host__.applyStyle ({display: "block"});
            legend = ws.__legend__.firstChild.nodeValue.split (/\s*\|\s*/);
            legend.reverse ();
            legend.push ("SalesBase");
            document.title = legend.join (" « ");

            document.lastChild.scrollTop = 0;
        } else {
            document.title = "SalesBase";
        }

        return true;
    };

    $ (document.body).$ (["appendChild", workspace.loader]);
    return f;
}) ());