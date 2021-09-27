require.once (
    "lib/array/indexOf.js", "lib/core/type.js", "lib/dom/_extend.js", "lib/event/eventHandler.js", "lib/event/getEvent.js", "lib/string/format.js", "lib/ui/selection.js"
) && window.$.addExtension (["input", "textarea"], {castType: (function () {
    var event = function () {
        var e = getEvent (false);
        if (!this.__castType__[0] || this.readOnly) return;

        if (this.__castType__[1]) {
            switch (e.type) {
                case "paste":
                    var sel = $ (this).getSelection (), v = this.value.indexOf ("_"), f = this.__castType__[1], i, j;
                    sel.len = f.replace (/[^_]/g, "").length;
                    f = f.split ("");
                    if (v === -1 && (sel.start === sel.end || f.slice (sel.start, sel.end).indexOf ("_") === -1)) {
                        e.preventDefault ();
                        return;
                    }
                    if (v !== -1 && sel.start > v) sel.start = v;
                    if (v !== -1 && sel.end > v + 1) sel.end = v;

                    v = this.value.split ("");
                    for (i = sel.start; i < sel.end; i++) v[i] = f[i];
                    for (i = 0, j = []; i < v.length; i++) {
                        if (v[i] === f[i]) sel.start -= i < sel.start;
                        else j.push (v[i]);
                    }
                    this.$ ({value: ""}).removeAttribute ("maxlength");

                    window.setTimeout (func (function (th1s, sel, ov, f) {
                        var v = th1s.value.split (""), re = th1s.__castType__[0], i;
                        for (i = 0; i < v.length && ov.length < sel.len; i++) if (re.test (v[i])) ov.splice (sel.start++, 0, v[i]);
                        ov = ov.join ("").format (th1s.__castType__[1]);
                        for (i = 0; i <= ov.length && i < sel.start; i++) {
                            if (ov[i] === "_") break;
                            if (f[i] === ov[i]) sel.start++;
                        }

                        th1s.$ ({value: ov, maxlength: th1s.__castType__[1].length}).setSelection (sel.start);
                        th1s.value.indexOf ("_") === -1 && th1s.applyEvent ("change");
                    }, this, sel, j, f), 0);
                break;

                case "keypress":
                    if (e.mkey.ctrl || e.mkey.alt) return;
                    if (!("documentMode" in document) && /^(9|13|35|36|37|38|39|40)$/.test (e.keyCode)) return;
                    e.preventDefault ();
                    var chr = String.fromCharCode (e.charCode), f = this.__castType__[1].split (""), v = this.value.split (""), re = this.__castType__[0], sel = this.getSelection (), i, j;
                    if (!re.test (chr)) return;
                    i = v.indexOf ("_");
                    if (i !== -1 && sel.start > i) sel.start = i;
                    if (i !== -1 && sel.end > i) sel.end = i;
                    if (sel.start !== sel.end && f.slice (sel.start, sel.end).indexOf ("_") === -1) {
                        sel.end = sel.start;
                        this.setSelection (sel.start);
                    }
                    if (sel.start === sel.end && f.indexOf ("_") === -1) return;
                    outer: for (i = sel.start, j = i + sel.end - sel.start; i < v.length; i++) {
                        if (f[i] !== "_") {
                            v[i] = f[i];
                            continue;
                        }
                        for (; j < v.length; j++) {
                            if (f[j] !== "_") continue;
                            v[i] = v[j++];
                            continue outer;
                        }
                        v[i] = f[i];
                    }
                    if (v.indexOf ("_") === -1) return;
                    while (f[sel.start] !== "_") sel.start++;
                    if (v[sel.start] === "_") v[sel.start++] = chr;
                    else {
                        for (i = v.indexOf ("_"), j = i - 1; i > sel.start; i--) {
                            if (f[i] !== "_") {
                                v[i] = f[i];
                                continue;
                            }
                            while (f[j] !== "_" && j >= 0) j--;
                            v[i] = v[j--];
                        }
                        v[i] = chr;
                        sel.start = ++i;
                    }
                    this.$ ({value: v.join ("")}).setSelection (sel.start);
                    this.value.indexOf ("_") === -1 && this.applyEvent ("change");
                break;

                case "keydown":
                    if (e.keyCode === 8 || e.keyCode === 46) {
                        e.preventDefault ();

                        var sel = this.getSelection (), v = this.value.split (""), f = this.__castType__[1].split (""), i, j;
                        if (e.keyCode === 8) sel.start -= (sel.start === sel.end);
                        else {
                            if (sel.start !== sel.end && f.slice (sel.start, sel.end).indexOf ("_") === -1) {
                                this.setSelection (sel.start);
                                return;
                            }
                            while (f[sel.start] !== "_" && sel.start <= v.length) {
                                sel.start++;
                                sel.start - 1 === sel.end && (sel.end = sel.start);
                            }
                            sel.end += (sel.start === sel.end);
                        }
                        outer: for (i = sel.start, j = i + sel.end - sel.start; i < v.length; i++) {
                            if (f[i] !== "_") {
                                v[i] = f[i];
                                continue;
                            }
                            for (; j < v.length; j++) {
                                if (f[j] !== "_") continue;
                                v[i] = v[j++];
                                continue outer;
                            }
                            v[i] = f[i];
                        }
                        this.$ ({value: v.join ("")}).setSelection (sel.start);
                    } else if (e.keyCode === 39) {
                        var sel = this.getSelection (), v = this.value.split ("");
                        if (sel.end >= this.value.length || v[sel.end] === "_") {
                            e.preventDefault ();
                            return;
                        }
                    } else if (e.keyCode === 35) {
                        e.preventDefault ();
                        if (e.mkey.shift) {
                            var sel = this.getSelection ();
                            var v = this.value.indexOf ("_");
                            if (v !== -1 && sel.end > v) sel.end = v;
                            this.setSelection (sel.end, v === -1 ? this.value.length : v);
                        } else {
                            var v = this.value.indexOf ("_");
                            this.setSelection (v === -1 ? this.value.length : v);
                        }
                        return;
                    } else if (e.mkey.ctrl && e.keyCode === 90) e.preventDefault ();
                    if (e.mkey.alt || e.mkey.ctrl) return;
                break;

                case "cut": e.preventDefault (); break;

                case "click": case "focus": case "change":
                    var sel = this.getSelection (), f = this.__castType__[1].split (""), v = this.value.split (""), re = this.__castType__[0], i, j = [];
                    for (i = 0; i < v.length; i++) if (v[i] !== f[i] && re.test (v[i])) j.push (v[i]);
                    this.value = j.join ("").format (this.__castType__[1]);
                    v = this.value.indexOf ("_");
                    if (v !== -1 && sel.start > v) sel.start = v;
                    if (v !== -1 && sel.end > v) sel.end = v;
                    this.setSelection (sel.start, sel.end);
                break;

                case "drop":
                    window.setTimeout (func (function (th1s) {
                        var v = th1s.value.split (""), a = th1s.__castType__[0], f = th1s.__castType__[1].split (""), i, o = [];
                        for (i = 0; i < v.length; i++) a.test (v[i]) && (f[i] !== v[i]) && (o.push (v[i]));
                        th1s.value = o.join ("").format (f.join (""));
                    }, this), 10);
                break;
            }
        } else {
            switch (e.type) {
                case "paste":
                    var ml = this.maxLength;
                    this.removeAttribute ("maxlength");

                    window.setTimeout (func (function (th1s, ml) {
                        for (var i = 0, re = th1s.__castType__[0], chr = th1s.value.split (""); i < chr.length; i++) if (!re.test (chr[i])) chr.splice (i--, 1);
                        th1s.value = chr.join ("").substr (0, (ml === -1 || type (ml) === "undefined")? th1s.value.length : ml);
                        (type (ml) !== "undefined" && ml !== -1) && th1s.setAttribute ("maxlength", ml);
                    }, this, ml), 1);
                break;

                case "keypress":
                    if (e.mkey.ctrl || e.mkey.alt) return;
                    var isFirefox = typeof InstallTrigger !== 'undefined';
                    if (isFirefox) {
                        if (!("documentMode" in document) && /^(8|9|13|35|36|37|38|39|40|46)$/.test(e.keyCode))return;
                    } else {
                        if (!("documentMode" in document) && /^(13)$/.test(e.keyCode)) return;
                    }
                    if (!this.__castType__[0].test (String.fromCharCode (e.charCode))) e.preventDefault ();
                break;
            }
        }
    }

    return function (allowed, format) {
        if (/^(text|textarea)^/i.test (this.type)) throw new Error ('HTMLInpuElement.castType(): Invalid input type: "' + this.type + '", should add castType to "text" only inputs!');
        if (type (allowed) !== "regexp") throw new Error ('HTMLInputElement.castType(): Invalid allowed symbols regexp: "' + allowed + '"!');
        if (format && type (format) !== "string") throw new Error ('HTMLInputElement.castType(): Invalid format for field: "' + format + '"!');
        this.__castType__ = [allowed, format];

        if (format) {
            var v = this.value.split (""), j = [], i, f = format.split ("");
            for (i = 0; i < v.length; i++) if (v[i] !== f[i] && allowed.test (v[i])) j.push (v[i]);
            this.$ ({value: j.join ("").format (format), defaultValue: format, maxLength: format.length});
        }
        this.haveEventHandler (event, "keypress") || this.addEventHandler (event, "keypress", "keydown", "paste", "cut", "focus", "click", "drop", "change");
        return this;
    }
}) ()});