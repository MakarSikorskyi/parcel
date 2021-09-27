window.$ || require.once ("lib/array/indexOf.js", "lib/core/o2a.js", "lib/core/type.js", "lib/string/escapeRegExp.js") && (window.$ = (function () {
    var exts = {"*": {}}, ver = {"*": 0}, applyExtension = function (o) {
        if (type (o) === "null") return null;
        if (type (o) !== "object" || o.nodeType !== 1 || o.tagName !== o.nodeName) throw new Error ("$:applyExtension(): Passed object is not valid HTML DOM node: " + o);

        var tagName = o.tagName.toLowerCase (), i;
        if (o.$ver === ver["*"] + (ver[tagName] ? ver[tagName] : 0)) return o;

        for (i in exts["*"]) o[i] = exts["*"][i];
        if (exts[tagName]) for (i in exts[tagName]) o[i] = exts[tagName][i];

        return o;
    }, f;

    f = function () {
        var i = 0, out = [], o;

        if (!arguments.length) return null;

        if (type (arguments[0]) === "string") {
            o = arguments[1];

            if (o) {
                if (type (o) !== "object" || o.nodeType !== 1 || o.tagName !== o.nodeName) throw new Error ("$(): Passed parent node for selector is of invalid type: " + o);
            } else o = document;
            var parent = o, rules = arguments[0].split (/\s*,\s*/), match = {id: /^#[a-z_][a-z0-9_-]*$/i, cls: /^\.[a-z_][a-z0-9_-]*$/i, tag: /^[a-z][a-z0-9]*$/i}, tmp, j;

            for (; i < rules.length; i++) {
                if (match.id.test (rules[i])) out.push (applyExtension (document.getElementById (rules[i].substr (1))))
                else if (match.cls.test (rules[i])) {
                    tmp = parent.getElementsByTagName ("*");
                    for (j = 0; j < tmp.length; j++) {
                        if (!tmp[j].className || out.indexOf (tmp[j]) !== -1) continue;
                        if (new RegExp ("(^|\\s)" + rules[i].substr (1).escapeRegExp () + "(\\s|$)").test (tmp[j].className)) out.push (tmp[j]);
                    }
                } else if (match.tag.test (rules[i])) out.push (window.$.apply (window, o2a (parent.getElementsByTagName (rules[i]))));
                else throw new Error ("$(): Invalid selector: " + rules[i]);
            }

            if (rules.length === 1 && match.id.test (rules[0])) return out[0];
        } else {
            for (; i < arguments.length; i++) {
                o = arguments[i];

                if (type (o) === "object" && o.nodeType === 1 && o.tagName === o.nodeName) out.push (applyExtension (o));
                else throw new Error ("$(): Invalid object type: " + o);

                if (arguments.length === 1) return out[0];
            }
        }

        return out;
    };
    f.addExtension = function (tagName, extension) {
        var i;

        if (type (tagName) === "array") for (i = 0; i < tagName.length; i++) arguments.callee (tagName[i], extension);
        else {
            if (!/([a-z][a-z0-9]+|\*)/i.test (tagName)) throw new Error ('$.addExtension(): Invalid tag name specified: "' + tagName + '"');
            if (type (extension) !== "object") throw new Error ('$.addExtension(): Invalid extensions object: "' + extension + '"');

            tagName = tagName ? tagName.toLowerCase () : "*";

            if (!(tagName in exts)) exts[tagName] = {};
            if (!(tagName in ver)) ver[tagName] = 0;

            for (i in extension) {
                if (type (extension[i]) !== "function") throw new Error ('$.addExtension(): Invalid "method" inside extension object: ' + extension[i] + ", on step " + i);
                exts[tagName][i] = extension[i];
                ver[tagName][i]++;
            }
        }
    };

    return f;
}) ());