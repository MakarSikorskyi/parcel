require.once ("lib/core/type.js", "lib/dom/addText.js", "lib/dom/_extend.js", "lib/dom/getRefParent.js") && window.$.addExtension ("*", {
    $: function () {
        var args = Array.prototype.slice.call (arguments, 0), i, j, f;

        for (i = 0; i < args.length; i++) {
            if (type (args[i]) === "array") {
                f = args[i].shift ();
                switch (f) {
                    case "appendChild":
                        try {
                            for (j = 0; j < args[i].length; j++) {
                                if (/^string|number$/.test (type (args[i][j]))) {
                                    this.addText (args[i][j]);
                                    if (j + 1 in args[i] && type (args[i][j + 1]) === "string") this.appendChild (document.createElement ("br"));
                                } else if (args[i][j] === false) continue;
                                else this.appendChild (args[i][j]);
                            }
                        } catch (e) {
                            throw new Error ("HTMLElement.$(): Invalid node for .appendChild(): " + args[i][j] + ",  on step " + i + ", child " + j + ", " + e.message);
                        }
                    break;
                    
                    case "appCh":
                        try {
                            var frag = document.createDocumentFragment ();
                            for (j = 0; j < args[i].length; j++) {
                                if (/^string|number$/.test (type (args[i][j]))) {
                                    this.addText (args[i][j]);
                                    if (j + 1 in args[i] && type (args[i][j + 1]) === "string"){
                                        this.appendChild (document.createElement ("br"));
                                    }
                                } else if (args[i][j] === false){
                                    continue;
                                } else {
                                    frag.appendChild (args[i][j])
                                    this.appendChild (frag);
                                }
                            }
                        } catch (e) {
                            throw new Error ("HTMLElement.$(): Invalid node for .appendChild(): " + args[i][j] + ",  on step " + i + ", child " + j + ", " + e.message);
                        }
                    break;

                    case "removeChild":
                        try {
                            for (j = 0; j < args[i].length; j++) this.removeChild (args[i][j]);
                        } catch (e) {
                            throw new Error ("HTMLElement.$(): Invalid node for .removeChild(): args[" + i + "][" + j + "]=" + args[i][j]);
                        }
                    break;

                    case "setAttribute":
                        try {
                            args[i] = args[i][0];
                            for (j in args[i]) this.setAttribute (j, args[i][j]);
                        } catch (e) {
                            throw new Error ("HTMLElement.$(): Invalid arguments for .setAttribute(): " + j + ", " + args[i][j] + " on step " + i);
                        }
                    break;

                    case "removeAttribute": for (j = 0; j < args[i].length; j++) this.removeAttribute (args[i][j]); break;

                    case "insertBefore":
                        f = args[i].shift ();

                        if (!f.nodeType) throw new Error ("HTMLElement.$(): Invalid `before` argument for .insertBefore(): " + f + " on step " + i);

//                        try {
                            for (j = 0; j < args[i].length; j++) {
                                if (args[i][j] === false) continue;
                                /^number|string$/i.test (type (args[i][j])) && (args[i][j] = document.createTextNode (args[i][j]));
                                this.insertBefore (args[i][j], f);
                            }
//                        } catch (e) {
//                            throw new Error ("HTMLElement.$(): Invalid `element` argument for .insertBefore(): " + args[i][j] + " on step " + i);
//                        }
                    break;

                    case "insertAfter":
                        f = args[i].shift ();

                        if (f.nodeType !== 1) throw new Error ("HTMLElement.$(): Invalid `after` argument for .insertAfter(): " + f + " on step " + i);

                        try {
                            for (j in args[i]) {
                                if (args[i][j] === false) continue;
                                this.insertAfter (args[i][j], f);
                            }
                        } catch (e) {
                            throw new Error ("HTMLElement.$(): Invalid `element` argument for .insertAfter(): " + args[i][j] + " on step " + i);
                        }
                    break;

                    default:

                        if (!(f in this) || type (this[f]) !== "function") throw new Error ("HTMLElement.$(): Object does not support requested method: " + f);

                        this[f].apply (this, args[i]);
                    break;
                }
            } else if (type (args[i]) === "object") {
                try {
                    for (j in args[i]) {
                        if ("for" === j && /^label$/i.test (this.nodeName)) this.setAttribute (j, args[i][j]);
                        else if ("value" === j && /^(option|select|input|textarea)$/i.test (this.nodeName)) this.Value (args[i][j]);
                        else if ("readOnly" === j && /^input$/i.test (this.nodeName)) this.ReadOnly (args[i][j]);
                        else if ("disabled" === j && /^(input|select|textarea|option|optgroup)$/i.test (this.nodeName)) this.Disabled (args[i][j]);
                        else if ("selected" === j && /^option$/i.test (this.nodeName)) this.Selected (args[i][j]);
                        else if ("checked" === j && /^input$/i.test (this.nodeName)) this.Checked (args[i][j]);
                        else if ("autocomplete" === j && /^input$/i.test (this.nodeName)) this.setAttribute (j, args[i][j]);
                        else if ("sandbox" === j && /^iframe/i.test (this.nodeName)) this.setAttribute (j, args[i][j]);
                        else this[j] = args[i][j];
                    }
                } catch (e) {
                    throw new Error ('HTMLElement.$(): Can not set property: "' + j + '" to "' + args[i][j] + '", on step ' + i + ', error: ' + e.message);
                }
            } else {
                throw new Error ("HTMLElement.$(): Invalid argument `" +args[i] + "` on step " + i);
            }
        }

        return this;
    }
});