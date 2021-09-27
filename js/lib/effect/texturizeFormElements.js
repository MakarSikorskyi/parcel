window.texturizeFormElements || require.once (
    "lib/core/type.js", "lib/dom/classname.js", "lib/dom/empty.js", "lib/dom/DOMChange.js", "lib/dom/getPosition.js", "lib/dom/getRefParent.js", "lib/dom/getScrollPos.js", "lib/dom/clone.js", "lib/dom/relations.js",
    "lib/event/eventHandler.js", "lib/event/applyEvent.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/style/copyStyle.js", "lib/style/opacity.js", "lib/window/getSize.js"
) && (window.texturizeFormElements = (function () {
    var change = function () {
            if (!this.__texture__ || this.parentNode !== this.__texture__) this.removeEventHandler (arguments.callee, "focus", "blur");

            switch (this.type) {
                case "file": type (this.onValue) === "function" && this.onValue (); break;
                case "checkbox": case "radio": type (this.onChecked) === "function" && this.onChecked (); break;
            }
        }, focus = function () {
            if (!this.__texture__ || this.parentNode !== this.__texture__) this.removeEventHandler (arguments.callee, "focus", "blur");

            this.__texture__.classname ((getEvent (false).type === "focus" ? "+" : "-") + "focus");
        }, render = function (o) {
            switch (o.type) {
                case "file":
                    while (o.nextSibling) o.parentNode.removeChild (o.nextSibling);
                    o.__texture__.classname ((o.Disabled () ? "+" : "-") + "disabled").$ (["appendChild",
                        mkNode ("span").addText (o.Value ().replace (/.*?([^\/\\]+)$/, "$1")), mkIco (10, 0 + (o.Disabled () ? 10 : 0))
                    ]);
                break;

                case "checkbox": o.__texture__.classname ((o.Checked () ? "+" : "-") + "checked", (o.Disabled () ? "+" : "-") + "disabled"); break;

                case "radio":
                    for (var i = 0; i < radio.length; i++) {
                        if (!radio[i].__texture__ || radio[i].__texture__ !== radio[i].parentNode) {
                            radio.splice (i--, 1);
                            continue;
                        }
                        radio[i].__texture__.classname ((radio[i].Checked () ? "+" : "-") + "checked", (radio[i].Disabled () ? "+" : "-") + "disabled");
                    }
                break;

                case "select-one":
                    var v = "";
                    if (o.selectedIndex != -1) {
                        v = o.options[o.selectedIndex].text;
                        if (o.getAttribute('value') != o.options[o.selectedIndex].value) {
                            o.setAttribute('value', o.options[o.selectedIndex].value);
                        }
                    }
                    o.__texture__.classname ((o.Disabled () ? "+" : "-") + "disabled").$ (o.Disabled () ? ["removeAttribute", "href"] : ["setAttribute", {href: "javascript:"}]).firstChild.empty ().addText (v);
                break;
            case "select-multiple":
                if (!o.searchOption) return;
                for (var counted = 0, v = "", i = 0; i < o.options.length; i++) {
                    if (o.options[i].Selected ()) {
                        counted++;
                        if (counted > 1) v = "Обрано (" + counted + ")";
                        else v = o.options[i].text;
                    }
                }
                o.__texture__.classname ((o.Disabled () ? "+" : "-") + "disabled").$ (o.Disabled () ? ["removeAttribute", "href"] : ["setAttribute", {href: "javascript:"}]).firstChild.empty ().addText (v);
                break;
            }
        }, style = {
            required: [
                "cssFloat", "styleFloat", "float", "display", "visibility", "position", "padding", "margin", "top", "left", "right", "bottom", "border", "borderTop", "borderBottom", "borderLeft",
                "borderRight", "marginLeft", "marginRight", "marginTop", "marginBottom", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom"
            ],
            copy: function (from, to) {
                for (var i = 0; i < this.required.length; i++) {
                    if (from.style[this.required[i]]) {
                        to.style[this.required[i]] = from.style[this.required[i]];
                        from.style[this.required[i]] = "";
                    }
                }
            }
        }, radio = [], selectOne = {
            owner: null,
            value: null,
            state: false,
            list: document.body.appendChild (mkNode ("ul").$ ({id: "ui-list-select"})).addEventHandler (function () {
                getEvent (true).preventDefault ();
            }, "click", "mousedown", "selectstart", "mouseup"),
            searchOption: mkNode ("li").appendChild (mkNode ("text").$ ({placeholder: "Пошук..."}).classname ("+option-search").applyStyle ({width: "82%"}).addEventHandler (func (function () {
                var e = getEvent (true).preventDefault ();
                switch (e.type) {
                    case "click":
                        this.focus ();
                        break;
                     case "blur":
                        this.Value ("");
                        break;
                    case "keyup":
                        var i, li, list;
                        list = $(".option", selectOne.list);
                        for (i = 0; i < list.length; i++) {
                            li = list[i].applyStyle ({display: "none"}); 
                            if (li.textContent.toLowerCase().indexOf (this.value.toLowerCase()) !== -1) { 
                                li.applyStyle ({display: "block"}); 
                            }
                        }
                        break;
                }
            }), "click", "keyup", "blur")),
            eh: {
                w: function () {
                    selectOne.owner && selectOne.show (false);
                },
                d: function () {
                    var e = getEvent (false);

                    if (!selectOne.owner || e.target !== this && selectOne.owner.__texture__.parentOf (e.target)) return;

                    selectOne.show (false);
                    selectOne.apply ();
                }
            },
            apply: function (force) {
                if (selectOne.owner.Value () !== selectOne.value || force) {
                    selectOne.owner.applyEvent ("change");
                    selectOne.value = selectOne.owner.Value ();
                }

                return true;
            }, build: function () {
                var i, j, opt, grp, tmp;
                selectOne.list.empty ();
                selectOne.list.$ ({className: (selectOne.owner.className) ?  selectOne.owner.className : false});
                !/undefined/.test (typeof selectOne.owner.searchOption) && (selectOne.list.appendChild (selectOne.searchOption));
                for (i = 0; i < selectOne.owner.childNodes.length; i++) {
                    opt = selectOne.owner.childNodes[i];
                    if (/^optgroup$/i.test (opt.nodeName)) {
                        grp = opt;
                        selectOne.list.appendChild (mkNode ("li").addText (grp.label).classname ("+optgroup", (grp.Disabled () ? "+" : "-") + "disabled")).$ (["appendChild",
                            (tmp = mkNode ("small")).addText.apply (tmp, grp.title && grp.title.split ("||") || [])
                        ]);
                        for (j = 0; j < grp.childNodes.length; j++) {
                            opt = grp.childNodes[j];
                            selectOne.list.appendChild (
                                tmp = mkNode ("li").addText (opt.text).classname ("+option", (grp.Disabled () || opt.Disabled () ? "+" : "-") + "disabled", (opt.Selected () ? "+" : "-") + "selected").$ (["appendChild",
                                    (tmp = mkNode ("small")).addText.apply (tmp, opt.title && opt.title.split ("||") || [])
                                ])
                            );
                            !opt.Disabled () && !grp.Disabled () && tmp.addEventHandler (func (function (v) {
                                selectOne.owner.Value (v);
                                selectOne.show (false);
                                selectOne.apply (true);
                                selectOne.owner.__texture__.focus ();
                            }, opt.Value ()), "click");
                        }
                    } else {
                        selectOne.list.appendChild (
                            tmp = mkNode ("li").addText (opt.text).classname ("+option", (opt.Disabled () ? "+" : "-") + "disabled", (opt.Selected () ? "+" : "-") + "selected").$ (["appendChild",
                                (tmp = mkNode ("small")).addText.apply (tmp, opt.title && opt.title.split ("||") || [])
                            ]).applyStyle ({color: opt.style.color || "inherit", fontWeight: opt.style.fontWeight, fontFamily: opt.style.fontFamily || "inherit", backgroundColor: opt.style.backgroundColor})
                        );
                        !opt.Disabled () && tmp.addEventHandler (func (function (v) {
                            selectOne.owner.Value (v);
                            selectOne.show (false);
                            selectOne.apply (true);
                            selectOne.owner.__texture__.focus ();
                        }, opt.Value ()), "click")
                    }
                }

                return true;
            }, event: function () {
                if (this.__texture__.Disabled ()) return;

                var e = getEvent (false);

                switch (e.type) {
                    case "focus":
                        selectOne.focus (this.__texture__);
                        this.__focus__ = true;
                    break;

                    case "keydown":
                        switch (e.keyCode) {
                            case 9:
                                selectOne.apply ();
                                selectOne.show (false);
                            break;

                            case 13:
                                e.preventDefault ();
                                selectOne.state ? selectOne.apply (true) : selectOne.build ();
                                selectOne.show (!selectOne.state);
                            break;

                            case 27:
                                e.preventDefault ();
                                selectOne.revert ();
                                selectOne.show (false);
                            break;

                            case 35:
                                e.preventDefault ();
                                var o = selectOne.owner.options, i;
                                for (i = o.length - 1; i >= 0; i--) {
                                    if (!o[i].Disabled () && !o[i].parentNode.Disabled ()) {
                                        selectOne.owner.Value (o[i].Value ());
                                        break;
                                    }
                                }
                                selectOne.state && selectOne.build ();
                            break;

                            case 36:
                                e.preventDefault ();
                                var o = selectOne.owner.options, i;
                                for (i = 0; i < o.length; i++) {
                                    if (!o[i].Disabled () && !o[i].parentNode.Disabled ()) {
                                        selectOne.owner.Value (o[i].Value ());
                                        break;
                                    }
                                }
                                selectOne.state && selectOne.build ();
                            break;

                            case 38:
                                e.preventDefault ();
                                var o = selectOne.owner.options, i, j = false;
                                for (i = o.length - 1; i >= 0; i--) {
                                    if (!j) j = o[i].value === selectOne.owner.value;
                                    else if (!o[i].Disabled () && !o[i].parentNode.Disabled ()) {
                                        selectOne.owner.Value (o[i].Value ());
                                        break;
                                    }
                                }
                                selectOne.state && selectOne.build ();
                            break;

                            case 40:
                                e.preventDefault ();
                                var o = selectOne.owner.options, i, j = false;
                                for (i = 0; i < o.length; i++) {
                                    if (!j) j = o[i].Value () === selectOne.owner.Value ();
                                    else if (!o[i].Disabled () && !o[i].parentNode.Disabled ()) {
                                        selectOne.owner.Value (o[i].Value ());
                                        break;
                                    }
                                }
                                selectOne.state && selectOne.build ();
                            break;
                        }
                    break;

                    case "keypress":
                        if (!("documentMode" in document) && /^(13|27|35|36|38|40)$/i.test (e.keyCode)) break;
                        var c = String.fromCharCode (e.charCode), i, o = selectOne.owner.options, j = null, k;
                        for (k = i = 0; i < o.length + (j || 0); i++, k = (i >= o.length) ? i - o.length : i) {
                            if (j === null && o[i].Value () === selectOne.owner.Value ()) j = i;
                            else if (!o[k].Disabled () && !o[k].parentNode.Disabled () && new RegExp ("^" + c, "i").test (o[k].text)) {
                                selectOne.owner.Value (o[k].Value ());
                                j = -1;
                                break;
                            }
                        }
                        selectOne.state && selectOne.build ();
                    break;

                    case "click":
                        if (!this.__focus__) return;

                        !selectOne.state && selectOne.build ();
                        selectOne.show (!selectOne.state);
                    break;

                    case "blur": delete this.__focus__; break;
                }
            }, focus: function (el) {
                if (selectOne.owner === el) return true;
                else if (selectOne.owner) selectOne.apply ();

                selectOne.owner = el;
                selectOne.value = el.Value ();
                return true;
            }, revert: function () {
                selectOne.owner.Value (selectOne.value);
            }, show: function (show) {
                if (show && !selectOne.state) {
                    var tex = selectOne.owner.__texture__, pos = tex.getPosition (), ds = document.getScrollPos (), ws = window.getSize (), size = {width: tex.offsetWidth, height: "auto"},
                        list = selectOne.list.applyStyle ({display: "block", left: pos.x - 1 + "px", width: size.width - 2 + "px", height: size.height});

                    pos.y += tex.offsetHeight;
                    if (ws.height + ds.y < list.offsetHeight + pos.y + 75) {
                        if ((ds.y + ws.height - 75 - pos.y) < (pos.y - tex.offsetHeight - ds.y - 30)) {
                            pos.y -= tex.offsetHeight + 1;
                            if (list.offsetHeight > ws.height - 110) {
                                size.height = ws.height - 110;
                                pos.y = ds.y + 35;
                                size.height += "px";
                            } else {
                                pos.y -= list.offsetHeight + 1;
                                if (pos.y < ds.y + 35) pos.y = ds.y + 35;
                            }
                        } else {
                            size.height = (ds.y + ws.height - 75 - pos.y) + "px";
                        }
                    }

                    list.applyStyle ({top: pos.y + "px", height: size.height, visibility: "visible"});
                    selectOne.state = true;

                    (tex = $ (".selected", list)) && tex.length && (list.scrollTop = tex[0].offsetTop);

                    document.addEventHandler (selectOne.eh.d, "click", "mousedown", "mouseup");
                    window.addEventHandler (selectOne.eh.w, "resize");
                } else if (!show && selectOne.state) {
                    selectOne.list.applyStyle ({top: 0, left: 0, width: "auto", height: "auto", display: "none", visibility: "hidden"}).empty ();
                    selectOne.state = false;
                    document.removeEventHandler (selectOne.eh.d, "click", "mousedown", "mouseup");
                    window.removeEventHandler (selectOne.eh.w, "resize");
                }
            }
        }, selectMultiple = {
            owner: null,
            value: [],
            state: false,
            list: document.body.appendChild (mkNode ("ui").$ ({id: "ui-list-select"})).addEventHandler (function () {
                getEvent (true);
            }, "click", "mousedown", "selectstart", "mouseup"),
            eh: {
                w: function () {
                    selectMultiple.owner && selectMultiple.show (false);
                },
                d: function () {
                    var e = getEvent (false);

                    if (!selectMultiple.owner || e.target !== this && selectMultiple.owner.__texture__.parentOf (e.target)) return;

                    selectMultiple.show (false);
                    selectMultiple.apply ();
                }
            },
            getSelected: function () {
                var i, optsel = [];
                for (i = 0; i < selectMultiple.owner.options.length; i++) {
                    if (selectMultiple.owner.options[i].Selected ()) {
                        optsel.push (selectMultiple.owner.options[i].value);
                    }
                }
                return optsel;
            },
            apply: function (force) {
                if (selectMultiple.getSelected ().length > 0 || force) {
                    selectMultiple.value = selectMultiple.getSelected ();
                    selectMultiple.owner.applyEvent ("change");
                }
                return true;
            }, build: function () {
                var i, opt, tmp;
                selectMultiple.list.empty ();
                selectMultiple.list.$ ({className: (selectMultiple.owner.className) ? selectMultiple.owner.className : false});
                if (!/undefined/.test (typeof selectMultiple.owner.searchOption)) {
                    /*@MultipleTools*/
                    selectMultiple.list.$ (["appendChild",
                        mkNode ("li").$ (["appendChild", 
                            mkNode ("button").Value ("Всі").addEventHandler (func (function () {
                                var i, li, list;
                                list = $(".option", selectMultiple.list);
                                for (i = 0; i < list.length; i++) {
                                    li = list[i];
                                    if (/hidde/i.test (li.className)) li.classname ("-hidde").applyStyle ({display: "block"});
                                    if (!/selected/i.test (li.className)) li.applyEvent ("click");
                                }
                                $ (".option-search") && $ (".option-search")[0].Value ("");
                            }), "click"), 
                            mkNode ("button").Value ("Скасувати").addEventHandler (func (function () {
                                var i, li, list;
                                list = $(".option", selectMultiple.list);
                                for (i = 0; i < list.length; i++) {
                                    li = list[i];
                                    if (/hidde/i.test (li.className)) li.classname ("-hidde").applyStyle ({display: "block"});
                                    if (/selected/i.test (li.className)) li.applyEvent ("click");
                                }
                                $ (".option-search") && $ (".option-search")[0].Value ("");
                            }), "click")
                        ]).classname ("+ta-center"),
                        mkNode ("li").$ (["appendChild", 
                            mkNode ("text").$ ({placeholder: "Пошук..."}).classname ("+option-search").applyStyle ({width: "82%"}).addEventHandler (func(function () {
                                var i, li, list;
                                list = $(".option", selectMultiple.list);
                                for (i = 0; i < list.length; i++) {
                                    li = list[i].classname ("+hidde").applyStyle ({display: "none"}); 
                                    if (li.textContent.toLowerCase().indexOf (this.value.toLowerCase()) !== -1) { 
                                        li.classname ("-hidde").applyStyle ({display: "block"}); 
                                    }
                                }
                            }), "keyup")
                        ]).classname ("+ta-center")
                    ]).applyStyle ({overflow: "auto"});
                }
                for (i = 0; i < selectMultiple.owner.childNodes.length; i++) {
                    opt = selectMultiple.owner.childNodes[i];
                    if (/^option$/i.test (opt.nodeName)) {
                        selectMultiple.list.appendChild (
                            tmp = mkNode ("li").addText (opt.text).classname ("+option", (opt.Disabled () ? "+" : "-") + "disabled", (opt.Selected () ? "+" : "-") + "selected").$ (["appendChild",
                                (tmp = mkNode ("small")).addText.apply (tmp, opt.title && opt.title.split ("||") || [])
                            ]).applyStyle ({color: opt.style.color || "inherit", fontWeight: opt.style.fontWeight, fontFamily: opt.style.fontFamily || "inherit", backgroundColor: opt.style.backgroundColor})
                        );
                        !opt.Disabled () && tmp.addEventHandler (func (function (opt, tmp) {
                            if (opt.Selected()) { 
                                opt.Selected(false);
                            } else if (selectMultiple.owner.maxSelected != undefined) { 
                                selectMultiple.owner.Value ().length < selectMultiple.owner.maxSelected && opt.Selected(true);
                            } else {
                                opt.Selected(true);
                            }
                            
                            tmp.classname((opt.Selected () ? "+" : "-") + "selected");
                            selectMultiple.show (true);
                            selectMultiple.apply (true);
                            selectMultiple.owner.__texture__.focus ();
                        }, opt, tmp), "click");
                    }
                }

                return true;
            }, event: function () {
                if (this.__texture__.Disabled ()) return;

                var e = getEvent (false);

                switch (e.type) {
                    case "focus":
                        selectMultiple.focus (this.__texture__);
                        this.__focus__ = true;
                    break;
                    
                    case "click":
                        if (!this.__focus__) return;
                        !selectMultiple.state && selectMultiple.build ();
                        selectMultiple.show (!selectMultiple.state);
                    break;

                    case "blur": delete this.__focus__; break;
                }
            }, focus: function (el) {
                if (selectMultiple.owner === el) return true;
                else if (selectMultiple.owner) selectMultiple.apply ();

                selectMultiple.owner = el;
                return true;
            }, show: function (show) {
                if (show && !selectMultiple.state) {
                    var tex = selectMultiple.owner.__texture__, pos = tex.getPosition (), ds = document.getScrollPos (), ws = window.getSize (), size = {width: tex.offsetWidth, height: "auto"},
                        list = selectMultiple.list.applyStyle ({display: "block", left: pos.x - 1 + "px", width: size.width - 2 + "px", height: size.height});
                        
                    pos.y += tex.offsetHeight;
                    if (ws.height + ds.y < list.offsetHeight + pos.y + 75) {
                        if ((ds.y + ws.height - 75 - pos.y) < (pos.y - tex.offsetHeight - ds.y - 30)) {
                            pos.y -= tex.offsetHeight + 1;
                            if (list.offsetHeight > ws.height - 110) {
                                size.height = ws.height - 110;
                                pos.y = ds.y + 35;
                                size.height += "px";
                            } else {
                                pos.y -= list.offsetHeight + 1;
                                if (pos.y < ds.y + 35) pos.y = ds.y + 35;
                            }
                        } else {
                            size.height = (ds.y + ws.height - 75 - pos.y) + "px";
                        }
                    }

                    list.applyStyle ({top: pos.y + "px", height: size.height, visibility: "visible"});
                    selectMultiple.state = true;

                    (tex = $ (".selected", list)) && tex.length && (list.scrollTop = tex[0].offsetTop);

                    document.addEventHandler (selectMultiple.eh.d, "click", "mousedown", "mouseup");
                    window.addEventHandler (selectMultiple.eh.w, "resize");
                } else if (!show && selectMultiple.state) {
                    selectMultiple.list.applyStyle ({top: 0, left: 0, width: "auto", height: "auto", display: "none", visibility: "hidden"}).empty ();
                    selectMultiple.state = false;
                    document.removeEventHandler (selectMultiple.eh.d, "click", "mousedown", "mouseup");
                    window.removeEventHandler (selectMultiple.eh.w, "resize");
                }
            }
        };

    window.document.DOMChange.add (function (o) {
        var th1s = o.target;

        if (th1s.nodeType !== 1 || !/^(select-one|select-multiple|checkbox|radio|file)$/i.test (th1s.type) || !/^(select|input)$/i.test (th1s.nodeName)) return;

        switch (th1s.type) {
            case "file":
                if (th1s.__texture__ === th1s.parentNode) return;

                (th1s.$ ({onValue: function () {
                    render (this);
                }, onDisabled: function () {
                    render (this);
                }}).opacity (0).__texture__ = o.src.insertBefore (mkNode ("span").$ ({className: th1s.className}).classname ("+input-file").$ ({__texture__: th1s}), th1s)).appendChild (th1s);

                th1s.haveEventHandler (change, "change") || th1s.addEventHandler (change, "change");
                th1s.haveEventHandler (focus, "focus") || th1s.addEventHandler (focus, "focus", "blur");
            break;

            case "select-one":
                if (th1s.__texture__ === th1s.parentNode) return;

                if(th1s.defaultOption) {
                    if (th1s.firstChild) {
                        th1s.$(['insertBefore', th1s.firstChild, mkNode('option').addText('Оберіть').Value(null) ]);
                        th1s.Value(null);
                    } else {
                        th1s.$(['appendChild', mkNode('option').addText('Оберіть').Value(null) ]);
                        th1s.Value(null);
                    }
                }

                (th1s.opacity (0).$ ({onValue: function () {
                    render (this);
                }, onDisabled: function () {
                    render (this);
                }, onfocus: function () {
                    this.__texture__.focus ();
                }}).__texture__ = o.src.insertBefore (mkNode ("a").$ ({className: th1s.className, tabIndex: th1s.tabIndex, title: th1s.title}).classname ("+select-one").$ ({__texture__: th1s,
                onselectstart: function () {
                    return false;
                }, onmousedown: function () {
                    this.focus ();
                    return false;
                }}, ["removeAttribute", "href"], ["appendChild",
                    mkNode ("span"), mkNode ("span")
                ]).addEventHandler (selectOne.event, "keypress", "keydown", "click", "focus", "blur"), th1s)).appendChild (th1s.$ ({tabIndex: -1}));

                th1s.haveEventHandler (change, "change") || th1s.addEventHandler (change, "change");
                th1s.haveEventHandler (focus, "focus") || th1s.addEventHandler (focus, "focus", "blur");
            break;

            case "select-multiple":
                if (th1s.__texture__ === th1s.parentNode) return;
                if (!th1s.searchOption) return;
                (th1s.opacity (0).$ ({onValue: function () {
                    render (this);
                }, onDisabled: function () {
                    render (this);
                }, onfocus: function () {
                    this.__texture__.focus ();
                }}).__texture__ = o.src.insertBefore (mkNode ("a").$ ({className: th1s.className, tabIndex: th1s.tabIndex, title: th1s.title}).classname ("+select-one").$ ({__texture__: th1s,
                onselectstart: function () {
                    return false;
                }, 
                onmousedown: function () {
                    this.focus ();
                    return false;
                }}, ["removeAttribute", "href"], ["appendChild",
                    mkNode ("span"), mkNode ("span")
                ]).addEventHandler (selectMultiple.event, "click", "focus", "blur"), th1s)).appendChild (th1s.$ ({tabIndex: -1}));

                th1s.haveEventHandler (change, "change") || th1s.addEventHandler (change, "change");
                th1s.haveEventHandler (focus, "focus") || th1s.addEventHandler (focus, "focus", "blur");
            break;

            case "checkbox":
                if (th1s.__texture__ === th1s.parentNode) return;

                (th1s.$ ({onChecked: function () {
                    render (this);
                }, onDisabled: function () {
                    render (this);
                }}).opacity (0).__texture__ = o.src.insertBefore (mkNode ("span").$ ({className: th1s.className}).classname ("+input-checkbox").$ ({__texture__: th1s}), th1s)).appendChild (th1s);

                th1s.haveEventHandler (change, "click") || th1s.addEventHandler (change, "click");
                th1s.haveEventHandler (focus, "focus") || th1s.addEventHandler (focus, "focus", "blur");
            break;

            case "radio":
                if (th1s.__texture__ === th1s.parentNode) return;

                (th1s.$ ({onChecked: function () {
                    render (this);
                }, onDisabled: function () {
                    render (this);
                }}).opacity (0).__texture__ = o.src.insertBefore (mkNode ("span").$ ({className: th1s.className}).classname ("+input-radio").$ ({__texture__: th1s}), th1s)).appendChild (th1s);

                radio.push (th1s);
                th1s.haveEventHandler (change, "click") || th1s.addEventHandler (change, "click");
                th1s.haveEventHandler (focus, "focus") || th1s.addEventHandler (focus, "focus", "blur");
            break;
        }

        style.copy (th1s, th1s.__texture__);

        render (th1s);
    }, "add");

    document.DOMChange.add (function (o) {
        var th1s = o.target;
        if (th1s.nodeType !== 1 || !/^(select-one|select-multiple|checkbox|radio|file)$/i.test (th1s.type) || !/^(select|input)$/i.test (th1s.nodeName) || !th1s.__texture__ || th1s.__texture__ === th1s.parentNode) return;

        style.copy (th1s.__texture__, th1s);
        th1s.tabIndex = th1s.__texture__.tabIndex;

        var pn = th1s.__texture__.parentNode;
        pn && pn.nodeType === 1 && pn.removeChild (th1s.__texture__);
        delete th1s.__texture__;
    }, "remove");

    document.DOMChange.add (function (o) {
        var th1s = o.target;
        if (th1s.nodeType !== 1 || !/^option$/i.test (th1s.nodeName)) return;
        th1s.onSelected = function () {
            if (this.parentNode) {
                var sel = this.getRefParent ("select");
                sel && render (sel);
            }
        };

        th1s = th1s.getRefParent ("select");
        th1s && th1s.__texture__ && render (th1s);
    }, "add");

    document.DOMChange.add (function (o) {
        var th1s = o.target;
        if (th1s.nodeType !== 1 || !/^option$/i.test (th1s.nodeName)) return;
        delete th1s.onSelected;
        th1s = o.src;
        if (!/^select$/.test (th1s.nodeName)) th1s = th1s.getRefParent ("select");
        th1s && th1s.__texture__ && render (th1s);
    }, "remove");

    return true;
}) ());