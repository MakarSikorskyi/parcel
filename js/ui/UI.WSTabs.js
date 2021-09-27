(window.UI || (window.UI = {})) && window.UI.WSTabs || require.once ("lib/dom/_batch.js", "lib/dom/classname.js", "lib/dom/mkNode.js", "ui/UI.WorkSpace.js") && (window.UI.WSTabs = function () {
    var th1s = {div: null, tr: null, td: {}}, ws = UI.WorkSpace.current ();

    th1s.div = mkNode ("div").$ (["appendChild", mkNode ("table").$ (["appendChild", mkNode ("tbody").$ (["appendChild", th1s.tr = mkNode ("tr")])])]).classname ("+ui-box-wstabs");

    ws.$ ([ws.firstChild ? "insertBefore" : "appendChild", ws.firstChild || th1s.div, th1s.div]);

    return {
        active: function (id) {
            if (!/number|string/.test (type (id))) throw new Error ("UI.WSTabs.active(): Invalid ID to activate: " + id);
            if (!th1s.td.hasOwnProperty (id)) throw new Error ("UI.WSTabs.active(): Requested tab was not found, ID: " + id);
            for (var i in th1s.td) th1s.td[i].classname ((i === id ? "+" : "-") + "active");
            return true;
        },
        name: function (id) {
            if (!/number|string/.test (type (id))) throw new Error ("UI.WSTabs.active(): Invalid ID: " + id);
            if (!th1s.td.hasOwnProperty (id)) throw new Error ("UI.WSTabs.active(): Requested tab was not found, ID: " + id);
            return th1s.td[id].__name;
        },
        exists: function (id) {
            if (!th1s.td.hasOwnProperty (id)) return false;
            else return true;
        },
        add: function () {
            for (var i = 0, tab; i < arguments.length; i++) {
                tab = arguments[i];
                if (type (tab) !== "object") throw new Error ("UI.WSTabs.add(): Invalid tab object: " + tab);
                if (!tab.name) throw new Error ("UI.WSTabs.add(): Tab object without name, on step " + i);
                if (!tab.url) throw new Error ("UI.WSTabs.add(): Tab object without URL, on step " + i);
                if (!tab.id) throw new Error ("UI.WSTabs.add(): Tab object without ID, on step " + i);
                if (th1s.td.hasOwnProperty (tab.id)) throw new Error ("UI.WSTabs.add(): Tab with the same ID already exists: " + tab.id);

                th1s.tr.$ (["appendChild", th1s.td[tab.id] = mkNode ("td").$ ({__name: tab.name}, ["appendChild", mkNode ("a").addText (tab.name).$ ({title: tab.desc || "", href: tab.url})])]);
            }
            return true;
        },
        del: function (id) {
            if (!/number|string/.test (type (id)) || !th1s.td.hasOwnProperty (id)) throw new Error ("UI.WSTabs.del(): Invalid ID to delete: " + id);
            th1s.tr.removeChild (th1s.td[id]);
            delete th1s.td[id];
        },
        destroy: function () {
            ws.removeChild (th1s.div);
            th1s = null;
            return true;
        },
        count: function () {
            var i, j = 0;
            for (i in th1s.td) j++;
            return j;
        },
        rename: function (id, name) {
            if (!/number|string/.test (type (id)) || !th1s.td.hasOwnProperty (id)) throw new Error ("UI.WSTabs.del(): Invalid ID to delete: " + id);
            th1s.td[id].__name = name;
//            console.log(th1s.td[id].firstChild.tagName)
            th1s.td[id].firstChild.innerHTML = name;
        }
    }
});