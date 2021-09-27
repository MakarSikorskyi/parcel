window.pages || require.once ("lib/dom/classname.js", "lib/dom/mkNode.js") && (window.pages = function (name, total , data, onAct, current) {
    if (!/string|number/.test (type (name))) throw new Error ('window.pages(): Invalid pages variable name: "' + name + '"');
    else if (type (total) !== "number") throw new Error ('window.pages(): Invalid total pages number: "' + total + '"');

    if (total == 1) return mkNode ("div");

    var a, b, box = mkNode ("div").classname ("+ui-box-pages"), re = new RegExp ("(\\\?|&)" + name + "=(.*?)(&|$)"),
        url = location.hash.replace (/^#/, ""), res = re.exec (url), metod, page, i, append = function (url, page) {
            if (/(\?|&)$/.test (url)) return url + page;
            else if (/\?/.test (url)) return url + "&" + page;
            else return url + "?" + page;
        };

    if (res) {
        page = parseInt (res[2]);
        page = isNaN (page) ? 1 : page;
        page = page < 1 ? 1 : page > total ? total : page;
    } else if (type (current) !== "undefined") {
        page = parseInt (current);
        page = isNaN (page) ? 1 : page;
        page = page < 1 ? 1 : page > total ? total : page;
    }
    else page = 1;

    url = url.replace (re, "$1");
    
    metod = (type (data) === "undefined") ? 'GET' : 'POST';
    
    var rq = new AJAX;
                
    rq.method = metod;
    rq.data = data;
    rq.onComplete = null;
    rq.onAct = (type (onAct) === "undefined") ? null : onAct;

    box.addText ("Сторінки: ").$ (["appendChild", mkNode ("br")]);
    if (page > 1) {
        box.$ (["appendChild", mkNode ("a").addText ("◄").$ ({onclick: func (function (url, name, page) {
            rq.url = append (url, name + "=" + (page - 1));
            rq.send ();
        }, url, name, page)}).applyStyle ({cursor: "pointer"}), " "]);
    }
    for (a = 0, b = 0, i = 1; i <= total; i++) {
        if (i < 4 || (i > page - 4 && i < page - -4) || i > total - 3) {
            box.$ (["appendChild", mkNode ("a").addText (i).$ ({onclick: func (function (url, name, i) {
                rq.url = append (url, name + "=" + i);
                rq.send ();
            }, url, name, i)}).applyStyle ({cursor: "pointer"}).classname ((i === page ? "+" : "-") + "active"), " "]);
        } else if (!b && i > 3 && i <= page - 4) {
            b = 1;
            box.addText ("... ");
        } else if (!a && i <= total - 3 && i >= page - -4) {
            a = 1;
            box.addText ("... ");
        }
    }
    if (page < total) {
        box.$ (["appendChild", mkNode ("a").addText ("►").$ ({onclick: func (function (url, name, page) {
            rq.url = append (url, name + "=" + (page - -1));
            rq.send ();
        }, url, name, page)}).applyStyle ({cursor: "pointer"})]);
    }

    return box;
});