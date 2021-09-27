require.once ("lib/dom/_extend.js", "lib/dom/empty.js", "lib/string/aReplace.js") && window.$.addExtension ("*", {innerXHTML: function (code, mode) {
    var cn, i, j, result = "", ee = /^(br|hr|input|img|area|link|col|base|param|meta)$/i, att;
    if (arguments.length) {
        mode !== 1 && mode !== -1 && (mode = 0);
        !mode && $(this).empty ();

        var parseCode = function (code) {
            var tmp, el, cns, atts, att, attn, attv;
            if (tmp = /^<([a-z][a-z0-9]*)/i.exec (code)) {
                el = document.createElement (tmp[1]);
                code = code.replace (/^<[a-z][a-z0-9]*/i, "");

                atts = [];
                do {
                    code = code.replace (/^\s*/, "");
                    att = /^[a-z][a-z1-9-]*=(?:"[^"]*"|'[^']*')/i.exec (code);

                    if (att) {
                        att = att[0];
                        atts.push (att);
                        code = code.replace (att, "");
                        attn = /^([^=]+)/.exec (att)[1].toLowerCase ();
                        att = att.replace (attn, "");
                        attv = att.replace (/^='([^']*)'$/, "$1").replace (/^="([^"]*)"$/, "$1");

                        if (attn === "style") {
                            attv = attv.split (/\s*;\s*/);
                            for (var i = 0, cs; i < attv.length; i++) {
                                cs = attv[i].split (/\s*:\s*/);
                                cs[0] = cs[0].toLowerCase ().replace (/-[a-z]/, function (find) {
                                    return find.substr (1).toUpperCase ();
                                });
                                cs[0] === "float" && (cs[0] === "cssFloat");
                                el.style[cs[0]] = cs[1];
                            }
                        } else if (attn === "class") el.className = attv;
                        else if (attn === "value") el.value = attv;
                        else if (attn === "name") el.name = attn;
                        else if (/^on/.test (attn)) {
                            try {
                                el[attn] = new Function (attv);
                            } catch (e) {
                                throw new Error ('HTMLElement.innerXHTML(): Invalid value "' + attv + '" for event "' + attn + '"');
                            }
                        } else el.setAttribute (attn, attv);

                        att = true;
                    }
                } while (att);

                code = code.replace (/^\s*\/?\s*>/, "");
                if (/^script$/i.test (tmp[1])) {
                    cns = code.exec (/^(.*?)<\/script>$/);
                    if (el.canHaveChildren && !el.canHaveChildren ()) el.text = cns[1];
                    else el.appendChild (document.createTextNode (cns[0]))

                    code = code.replace (/^.*?<\/script>/, "");
                } else if (/^style$/i.test (tmp[1])) {
                    cns = code.exec (/^(.*?)<\/style>$/);
                    if (el.canHaveChildren && !el.canHaveChildren ()) el.cssText = cns[1];
                    else el.appendChild (document.createTextNode (cns[0]))

                    code = code.replace (/^.*?<\/style>/, "");
                } else {
                    /*@cc_on if (document.documentMode <= 8) el = document.createElement (tmp[0] + " " + atts.join (" ") + ">"); @*/
                    if (!ee.test (tmp[1])) {
                        do {
                            cns = arguments.callee (code);
                            code = cns[1];

                            if (cns[0]) el.appendChild (cns[0]);
                        } while (cns[0]);
                    }
                }

                return [$(el), code];
            } else if (tmp = /^<!--(.*?)-->/.exec (code)) {
                tmp = document.createComment ? document.createComment (tmp[1]) : null;
                return [tmp, code.replace (/^<!--.*?-->/, "")];
            } else if (/^<\/[^>]+>/.test (code)) return [null, code.replace (/^<\/[^>]+>/, "")]
            else if (tmp = /^([^<]+)/.exec (code)) return [document.createTextNode (tmp[1].aReplace (["&lt;", "&gt;", "&amp;", "&apos;", "&quot;"], ["<", ">", "&", "'", '"'], "g")), code.replace (/^[^<]+/, "")];
            else return [null, ""];
        };

        i = this.firstChild;
        while (code.length) {
            cn = parseCode (code);
            code = cn[1];
            if (cn[0]) {
                if (mode === -1 && i) this.insertBefore (cn[0], i);
                else {
                    mode === -1 && (i = cn[0]);
                    this.appendChild (cn[0]);
                }
            }
        }

        return this;
    } else {
        for (cn = this.childNodes, i = 0; i < cn.length; i++) {
            switch (cn[i].nodeType) {
                case 3: result += cn[i].nodeValue.aReplace (["<", ">", "&", "'", '"'], ["&lt;", "&gt;", "&amp;", "&apos;", "&quot;"], "g"); break;
                case 8: result += "<!--" + cn[i].nodeValue + "-->"; break;
                default:
                    result += "<" + cn[i].nodeName.toLowerCase ();
                    for (j = 0; j < cn[i].attributes.length; j++) {
                        att = cn[i].attributes[j].nodeName.toLowerCase ();
                        if (att === "style" && cn[i].style.cssText) result += ' style="' + cn[i].style.cssText.toLowerCase () + '"';
                        else if (att !== "contenteditable") result += " " + att + '="' + cn[i].attributes[j].nodeValue + '"';
                    }
                    result += ">" + ee.test (cn[i].nodeName) ? "" : ($(cn[i]).innerXHTML () + "<" + cn[i].nodeName.toLowerCase () + ">");
                break;
            }
        }

        return result;
    }
}});