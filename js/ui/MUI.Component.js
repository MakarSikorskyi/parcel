//@Material.UI.Component
/*
 * 2.0
 */
(window.MUI || (window.MUI = {})) && require.once (
    "lib/core/type.js", 
    "lib/dom/_batch.js", 
    "lib/dom/getPosition.js", 
    "lib/dom/getScrollPos.js", 
    "lib/event/getEvent.js", 
    "lib/style/applyStyle.js", 
    "lib/window/getSize.js", 
    "lib/ui/hex2rgba.js",
    "lib/iconfont/init.js"
);
//@Button
/*
 */
window.MUI.Submit = (function () {
    var f = function (value) {
        /*
        * @value: put in .Value ()
        */
        if (!_CSS (".mui-submit")) {
            _CSS.add ("INPUT[type=submit].mui-submit").applyStyle ({
                display: "inline-block", letterSpacing: "0.5pt", borderRadius: "4px", border: "none", background: "none",
                color: "#6200ee", cursor: "pointer", fontSize: "0.96em", padding: "6px 16px 8px 16px", fontWeight: 400
            });
            _CSS.add ("INPUT[type=submit].mui-submit:hover").applyStyle ({background: hex2rgba ("#6200ee", 0.09)});
            _CSS.add ("INPUT[type=submit].mui-submit:disabled").applyStyle ({background: "none", color: "#adadad"});
        }
        var th1s = mkNode ("submit").$ ({active: false}).classname ("+mui-submit");
        !/undefined/.test (typeof value) && (th1s.Value (value));
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.flat = function () {
        /*
         */
        if (!_CSS (".mui-submit.flat")) {
            _CSS.add ("INPUT[type=submit].mui-submit.flat").applyStyle ({
                background: "#6200ee", color: "#f1f1f1", 
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"});
            _CSS.add ("INPUT[type=submit].mui-submit.flat:hover, INPUT[type=submit].mui-submit.flat:focus").applyStyle ({opacity: 0.78});
            _CSS.add ("INPUT[type=submit].mui-submit.flat.active").applyStyle ({opacity: 0.65});
            _CSS.add ("INPUT[type=submit].mui-submit.flat:disabled").applyStyle ({opacity: 1, boxShadow: "none", color: "#adadad", background: "#e0e0e0"});
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        if (!_CSS (".mui-submit.outline")) {
            _CSS.add ("INPUT[type=submit].mui-submit.outline").applyStyle ({background: "none", color: "#6300ee", border: "1px solid #bdbdbd", boxShadow: "none"});
            _CSS.add ("INPUT[type=submit].mui-submit.outline:hover, INPUT[type=submit].mui-submit.outline:focus").applyStyle ({background: hex2rgba ("#6300ee", 0.09)});
            _CSS.add ("INPUT[type=submit].mui-submit.outline.active").applyStyle ({background: hex2rgba ("#6300ee", 0.09)});
            _CSS.add ("INPUT[type=submit].mui-submit.outline:focus").applyStyle ({border: "1px solid #6300ee"});
            _CSS.add ("INPUT[type=submit].mui-submit.outline:disabled").applyStyle ({background: "none", color: "#adadad"});
        }
        this.classname ("+outline");
        return this;
    },
    f.round = function () {
        if (!_CSS (".mui-submit.round")) {
            _CSS.add ("INPUT[type=submit].mui-submit.round").applyStyle ({borderRadius: "3em"});
        }
        this.classname ("+round");
        return this;
    },
    f.Active = function (state) {
        if (/undefined/.test (state)) {
            return this.active;
        }
        if (this.Disabled ()) {
            return this;
        }
        state && (this.active = true, this.classname ("+active"));
        !state && (this.active = false, this.classname ("-active"));
        return this;
    };
    return f;
}) ();
window.MUI.Button = (function () {
    var f = function (value) {
        /*
        * @value: put in .Value ()
        */
        if (!_CSS (".mui-button")) {
            _CSS.add ("INPUT[type=button].mui-button").applyStyle ({
                display: "inline-block", letterSpacing: "0.5pt", borderRadius: "4px", border: "none", background: "none",
                color: "#6200ee", cursor: "pointer", fontSize: "0.96em", padding: "6px 16px 8px 16px", fontWeight: 400
            });
            _CSS.add ("INPUT[type=button].mui-button:hover").applyStyle ({background: hex2rgba ("#6200ee", 0.09)});
            _CSS.add ("INPUT[type=button].mui-button:disabled").applyStyle ({background: "none", color: "#adadad"});
        }
        var th1s = mkNode ("button").$ ({active: false}).classname ("+mui-button");
        !/undefined/.test (typeof value) && (th1s.Value (value));
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.flat = function () {
        /*
         */
        if (!_CSS (".mui-button.flat")) {
            _CSS.add ("INPUT[type=button].mui-button.flat").applyStyle ({
                background: "#6200ee", color: "#f1f1f1", 
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"});
            _CSS.add ("INPUT[type=button].mui-button.flat:hover, INPUT[type=button].mui-button.flat:focus").applyStyle ({opacity: 0.78});
            _CSS.add ("INPUT[type=button].mui-button.flat.active").applyStyle ({opacity: 0.65});
            _CSS.add ("INPUT[type=button].mui-button.flat:disabled").applyStyle ({opacity: 1, boxShadow: "none", color: "#adadad", background: "#e0e0e0"});
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        if (!_CSS (".mui-button.outline")) {
            _CSS.add ("INPUT[type=button].mui-button.outline").applyStyle ({background: "none", color: "#6300ee", border: "1px solid #bdbdbd", boxShadow: "none"});
            _CSS.add ("INPUT[type=button].mui-button.outline:hover, INPUT[type=button].mui-button.outline:focus").applyStyle ({background: hex2rgba ("#6300ee", 0.09)});
            _CSS.add ("INPUT[type=button].mui-button.outline.active").applyStyle ({background: hex2rgba ("#6300ee", 0.09)});
            _CSS.add ("INPUT[type=button].mui-button.outline:focus").applyStyle ({border: "1px solid #6300ee"});
            _CSS.add ("INPUT[type=button].mui-button.outline:disabled").applyStyle ({background: "none", color: "#adadad"});
        }
        this.classname ("+outline");
        return this;
    },
    f.round = function () {
        if (!_CSS (".mui-button.round")) {
            _CSS.add ("INPUT[type=button].mui-button.round").applyStyle ({borderRadius: "3em"});
        }
        this.classname ("+round");
        return this;
    },
    f.Active = function (state) {
        if (/undefined/.test (state)) {
            return this.active;
        }
        if (this.Disabled ()) {
            return this;
        }
        state && (this.active = true, this.classname ("+active"));
        !state && (this.active = false, this.classname ("-active"));
        return this;
    };
    return f;
}) ();
//@Toggle
/*
 */
window.MUI.Toggle = (function () {
    var f = function (value) {
        /*
        * @value: put in .Value ()
        */
        if (!_CSS (".mui-toggle")) {
            _CSS.add (".mui-toggle").applyStyle ({
                display: "inline-block", letterSpacing: "0.5pt", borderRadius: "4px", border: "none", background: "none",
                color: "#6200ee", cursor: "pointer", fontSize: "0.96em", padding: "3px 8px 3px 8px", margin: "2px 3px 2px 3px", fontWeight: 400
            });
            _CSS.add (".mui-toggle>I.ico").applyStyle ({
                display: "inline-block", verticalAlign: "middle", textAlign: "center", color: "inherit", position: "relative", left: "-1px"
            });
            _CSS.add (".mui-toggle>.label").applyStyle ({
                display: "inline-block", verticalAlign: "middle", textAlign: "center"
            });
            _CSS.add (".mui-toggle:hover, .mui-toggle.active").applyStyle ({background: hex2rgba ("#6200ee", 0.09)});
            _CSS.add (".mui-toggle.disabled").applyStyle ({background: "none", color: "#adadad"});
        }
        var event = function () {
            this.Active (!this.active);
        }, th1s = mkNode ("div").$ ({
            active: false, disabled: false, value: null, conf: {label: null, ico: null}
        }).addEventHandler (func (event), "click").classname ("+mui-toggle");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        !/undefined/.test (typeof value) && (th1s.Value (value));
        return th1s;
    };
    f.Active = function (state) {
        if (/undefined/.test (state)) {
            return this.active;
        }
        if (this.Disabled ()) {
            return this;
        }
        state && (this.active = true, this.classname ("+active"));
        !state && (this.active = false, this.classname ("-active"));
        return this;
    };
    f.Disabled = function (state) {
        if (/undefined/.test (state)) return this.disabled;
        state && (this.disabled = true, this.classname ("+disabled"));
        !state && (this.disabled = false, this.classname ("-disabled"));
        return this;
    },
    f.Value = function (value) {
        if (!/undefined/.test (value)) {
            this.value = value;
            return this;
        }
        return this.value;
    },
    f.label = function (label) {
        if (!/null/.test (this.conf.label)) {
            if (/undefined/.test (typeof label)) return this.conf.label;
        } else {
            this.conf.label = mkNode ("div").classname ("+label");
            this.appendChild (this.conf.label);
        }
        /string|number/.test (typeof label) && (this.conf.label.empty ().addText (label));
        /object/.test (typeof label) && (this.conf.label.empty ().appendChild (label));
        return this;
    },
    f.ico = function (ico) {
        if (/undefined/.test (typeof ico)) return this.conf.ico;
        if (!/null/.test (this.conf.ico)) {
            this.conf.ico.parentNode != null && (
                this.conf.ico.parentNode.removeChild (this.conf.ico),
                this.conf.ico = null
            );
        }
        this.conf.ico = MaterialIcon (ico, 22).classname ("+ico");
        if (this.firstChild != null) this.$ (["insertBefore", this.firstChild, this.conf.ico]);
        else this.$ (["appendChild", this.conf.ico]);
        return this;
    },
    f.flat = function () {
        /*
         */
        if (!_CSS (".mui-toggle.flat")) {
            _CSS.add (".mui-toggle.flat").applyStyle ({
                background: "#6200ee", color: "#f1f1f1", 
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"
            });
            _CSS.add (".mui-toggle.flat:hover, .mui-toggle.flat.active").applyStyle ({opacity: 0.78});
            _CSS.add (".mui-toggle.flat.disabled").applyStyle ({opacity: 1, boxShadow: "none", color: "#adadad", background: "#e0e0e0"});
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        if (!_CSS (".mui-toggle.outline")) {
            _CSS.add (".mui-toggle.outline").applyStyle ({background: "none", color: "#6300ee", border: "1px solid #bdbdbd", boxShadow: "none"});
            _CSS.add (".mui-toggle.outline:hover, .mui-toggle.outline.active").applyStyle ({background: hex2rgba ("#6200ee", 0.09), border: "1px solid #6300ee"});
            _CSS.add (".mui-toggle.outline.disabled").applyStyle ({background: "none", color: "#adadad", border: "1px solid #adadad"});
        }
        this.classname ("+outline");
        return this;
    },
    f.round = function () {
        if (!_CSS (".mui-toggle.round")) {
            _CSS.add (".mui-toggle.round").applyStyle ({borderRadius: "3em"});
        }
        this.classname ("+round");
        return this;
    };
    return f;
}) ();
//@TextField
/*
 */
window.MUI.TextField = (function () {
    var f = function (value) {
        /*
        * @value: put in .Value ()
        */
        if (!_CSS (".mui-txt-field")) {
            _CSS.add (".mui-txt-field").applyStyle ({display: "inline-block", textAlign: "left", background: "inherit", verticalAlign: "middle", margin: "10px 2px 2px 2px",
                position: "relative", minWidth: "175px", height: "18px", border: "1px solid rgba(0,0,0,.4)", borderRadius: "4px", padding: "8px 2px 10px 2px"
            }),
            _CSS.add (".mui-txt-field:hover").applyStyle ({borderColor: "rgba(0,0,0,.87)"}),
            _CSS.add (".mui-txt-field>.txt-input").applyStyle ({
                position: "absolute", width: "90%", background: "none", border: "none", color: "rgba(0,0,0,.87)", 
                fontWeight: 400, top: "10px", left: "11px", margin: 0, padding: "4px 2px 2px 4px"
            }),
            _CSS.add (".mui-txt-field.conf-label.empty>.txt-input").applyStyle ({color: "rgba(0,0,0,.0)"}),
            _CSS.add (".mui-txt-field>.txt-input:focus, .mui-txt-field.conf-label>.txt-input:focus, .mui-txt-field.empty.active>.txt-input, .mui-txt-field.conf-error.empty>.txt-input").applyStyle ({
                border: "none", color: "rgba(0,0,0,.87)"
            }),
            _CSS.add (".mui-txt-field>LABEL.label").applyStyle ({color: "rgba(0,0,0,.6)", fontSize: "1.1em", position: "absolute", pointerEvents: "none", fontWeight: 100,
                left: "14px", top: "12px", transition: "all 0.12s ease", MozTransition: "all 0.12s ease", WebkitTransition: "all 0.12s ease"
            }),
            _CSS.add (".mui-txt-field.conf-ico>.txt-input").applyStyle ({left: "25px", width: "82%"}),
            _CSS.add (".mui-txt-field.conf-ico>LABEL.label, .mui-txt-field.conf-ico>.helper").applyStyle ({left: "28px"}),
            _CSS.add (".mui-txt-field>I.ico").applyStyle ({position: "absolute", color: "rgba(0,0,0,.6)"}),
            _CSS.add (".mui-txt-field.used>LABEL.label").applyStyle ({top: "-6px", padding: "0 3px 0 3px", color: "rgba(0,0,0,.6)", background: "inherit", fontSize: "0.958em"}),
            _CSS.add (".mui-txt-field>.txt-input:focus ~ LABEL.label, .mui-txt-field.active>LABEL.label").applyStyle ({top: "-6px", padding: "0 3px 0 3px", color: "#6200ee", background: "inherit", fontSize: "0.958em"}),
            _CSS.add (".mui-txt-field.used>I.ico, .mui-txt-field.active>I.ico").applyStyle ({color: "#6200ee"}),
            _CSS.add (".mui-txt-field.conf-helper, .mui-txt-field.conf-counter").applyStyle ({marginBottom: "10px"}),
            _CSS.add (".mui-txt-field.conf-counter>.helper").applyStyle ({width: "70%"}),
            _CSS.add (".mui-txt-field.conf-error>.helper.message").applyStyle ({display: "none"}),
            _CSS.add (".mui-txt-field.conf-error>.txt-input:focus ~ LABEL.label, .mui-txt-field.conf-error.active>LABEL.label, .mui-txt-field.conf-error>LABEL.label").applyStyle ({
                top: "-6px", padding: "0 3px 0 3px", color: "#c62828", background: "inherit", fontSize: "0.958em"
            }),
            _CSS.add (".mui-txt-field.conf-error>.helper.error").applyStyle ({color: "#c62828"}),
            _CSS.add (".mui-txt-field.conf-error, .mui-txt-field.conf-error.active, .mui-txt-field.conf-error:focus-within").applyStyle ({borderColor: "#c62828"}),
            _CSS.add (".mui-txt-field>.helper").applyStyle ({width: "90%", position: "relative", color: "rgba(0,0,0,.6)", fontWeight: 100, top: "28px", left: "14px", fontSize: "0.958em"}),
            _CSS.add (".mui-txt-field>.counter").applyStyle ({width: "18%", textAlign: "right", position: "absolute", color: "rgba(0,0,0,.6)", fontWeight: 100, top: "38px", right: "10px", fontSize: "0.958em"}),
            _CSS.add (".mui-txt-field:focus-within, .mui-txt-field.active").applyStyle ({borderColor: "#6200ee"}),
            _CSS.add (".mui-txt-field.disabled, .mui-txt-field>.txt-input:disabled, .mui-txt-field>.txt-input:disabled ~ LABEL.label").applyStyle ({borderColor: "#adadad", color: "#adadad"});
        }
        var input = mkNode ("text").classname ("+txt-input"), th1s = mkNode ("div").$ ({
            active: false, disabled: false, __used: 0, __valid: 0, __message: null, __error: null, __limit: null, event: null,
            conf: {input: input, label: null, ico: null, helper: null, counter: null, error: null}
        }).$ (["appendChild", input]).classname ("+mui-txt-field");
        th1s.event = {
            onUsed: function () {
                this.__used = 0;
                if (this.value) {
                    if (this.__castType__ && this.__castType__[1] != undefined && this.__castType__[1] != this.value) this.__used = 1;
                    else if (this.__castType__ && (this.__castType__[0] == undefined || this.__castType__[1] == undefined) && this.value) this.__used = 2;
                    else if (this.__castType__ == undefined && this.value) this.__used = 3;
                }
                if (!this.value && this.disabled) this.__used = 4;
                this.classname ( (this.__used ? "+" : "-") + "used"), 
                th1s.classname ( (this.__used ? "+" : "-") + "used"), 
                th1s.classname ( (!this.__used ? "+" : "-") + "empty");
                (this.disabled || !this.disabled) && (
                    this.classname ( (this.disabled ? "+" : "-") + "disabled"), th1s.classname ( (this.disabled ? "+" : "-") + "disabled")
                );
                return (this.value ? true : false);
            },
            onCounted: function () {
                var value = this.Value ();
                if (value && this.__castType__) {
                    if (!/undefined/.test (typeof this.__castType__[1])) {
                        /[\W,_]/.test (this.__castType__[1]) && (
                            value = value.replace (/[\W,_]/gi, "")
                        );
                    }
                }
                if (value.length > this.maxLength) {
                    this.Value (this.value.substr (0, this.maxLength));
                }
                if (value.length <= th1s.__limit) {
                    th1s.conf.counter.innerHTML = value.length + (th1s.__limit > 0 ? "/" + th1s.__limit : "");
                }
                return value.length;
            },
            onValid: function (focus) {
                var flag = {
                    0x01: "Обов'язкове поле",
                    0x02: "Невірний формат",
                    0x04: "Мінімум " + this.minLength + " символів"
                }, message = [];
                this.__valid= 0;
                this.valid && this.required && ( this.__valid |= ( !this.value.replace (/\s/g, "") ? 0x01 : 0) );
                this.valid && this.__castType__ && ( this.__valid |= ( /_/.test (this.Value ().toString ()) ? 0x02 : 0) );
                this.valid && this.minLength && this.minLength > 1 && ( this.__valid |= ( this.value.length < this.minLength ? 0x04 : 0) );
                if (this.__valid > 0 && !this.disabled) {
                    for (var i in flag) (this.__valid & i) != 0 && (message.push (flag[i]));
                    th1s.error (message.join (", ")), focus && (this.focus ());
                } else {
                    th1s.error (null);
                }
                th1s.__valid = this.__valid;
                return this.__valid;
            }
        };
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        !/undefined/.test (typeof value) && (th1s.Value (value));
        th1s.event.onUsed.call (th1s.input ()),
        !th1s.input ().haveEventHandler (th1s.event.onUsed, "change") && th1s.input ().addEventHandler (th1s.event.onUsed , "change"),
        !th1s.input ().haveEventHandler (th1s.event.onUsed, "blur") && th1s.input ().addEventHandler (th1s.event.onUsed , "blur");

        !th1s.input ().haveEventHandler (th1s.event.onValid, "change") && th1s.input ().addEventHandler (th1s.event.onValid, "change");
        !th1s.input ().haveEventHandler (th1s.event.onValid, "blur") && th1s.input ().addEventHandler (th1s.event.onValid, "blur");
        return th1s;
    };
    f.input = function () {
        if (!/undefined/.test (typeof arguments[0])) {
            for (var i in arguments[0]) if (arguments[0].hasOwnProperty (i)) this.conf.input[i] = arguments[0][i];
            return this;
        }
        return this.conf.input;
    },
    f.label = function (label) {
        if (!/null/.test (this.conf.label)) {
            if (/undefined/.test (typeof label)) return this.conf.label;
        } else {
            this.conf.label = mkNode ("label").classname ("+label"), this.classname ("+conf-label");
            this.appendChild (this.conf.label);
        }
        /string|number/.test (typeof label) && (this.conf.label.empty ().addText (label));
        /object/.test (typeof label) && (this.conf.label.empty ().appendChild (label));
        return this;
    },
    f.error = function (error) {
        if (/null/.test (error)) {
            if (!/null/.test (this.conf.error)) {
                this.conf.error.parentNode != null && (
                    this.conf.error.parentNode.removeChild (this.conf.error),
                    this.conf.error = null, this.classname ("-conf-error")
                );
            }
            return true;
        }
        if (!/null/.test (this.conf.error)) {
            if (/undefined/.test (typeof error)) return this.conf.error;
        } else {
            this.conf.error = mkNode ("a").classname ("+helper", "+error"), this.classname ("+conf-error");
            this.appendChild (this.conf.error);
        }
        /string|number/.test (typeof error) && (
            this.conf.error.innerHTML = error
        ),
        /null/.test (this.__error) && (
            this.__error = error
        );
        return this;
    },
    f.helper = function (message) {
        if (!/null/.test (this.conf.helper)) {
            if (/undefined/.test (typeof message)) return this.conf.helper;
        } else {
            this.conf.helper = mkNode ("a").classname ("+helper", "+message"), this.classname ("+conf-helper");
            this.appendChild (this.conf.helper);
        }
        /string|number/.test (typeof message) && (
            this.conf.helper.innerHTML = message
        ),
        /null/.test (this.__message) && (
            this.__message = message
        );
        return this;
    },
    f.counter = function (limit) {
        if (!/null/.test (this.conf.counter)) {
            if (/undefined/.test (typeof limit)) return this.conf.counter;
        } else {
            this.conf.counter = mkNode ("a").classname ("+counter"), this.classname ("+conf-counter");
            this.appendChild (this.conf.counter);
        }
        if (!/number/.test (typeof limit)) throw new Error ("MUI.TextField.counter: Invalid typeof limit");
        this.conf.counter.empty ().addText (limit), this.input ().maxLength = limit;
        /null/.test (this.__limit) && (this.__limit = limit);
        this.event.onCounted.call (this.input ()),
        !this.input ().haveEventHandler (this.event.onCounted, "keyup") && this.input ().addEventHandler (this.event.onCounted, "keyup");
        return this;
    },
    // f.onValid = function (focus) {
    //     !this.input ().haveEventHandler (this.event.onValid, "change") && this.input ().addEventHandler (this.event.onValid, "change");
    //     !this.input ().haveEventHandler (this.event.onValid, "blur") && this.input ().addEventHandler (this.event.onValid, "blur");
    //     focus && (this.input ().applyEvent ("blur"));
    //     return this;
    // },
    f.onValid = function (focus) {
        this.Valid(true);

        // Custom validation function

        return this;
    },
    f.Required = function (state) {
        state && (this.input ().$({required: true}));
        !state && (this.input ().$({required: false}));
        return this;
    },
    f.Valid = function (state) {
        state && (this.input ().$({valid: true}));
        !state && (this.input ().$({valid: false}));
        return this;
    },
    f.Template = function (name) {
        switch(name){
            case 'mobile':
                    this.input ().castType(/\d/,'(___)-___-__-__') && this.Valid(true);
                break;
            case 'inn':
                    this.input ().castType(/\d/,'__________') && this.Valid(true);
                break;
        }
        return this;
    },
    f.ico = function (ico) {
        if (/undefined/.test (typeof ico)) return this.conf.ico;
        if (!/null/.test (this.conf.ico)) {
            this.conf.ico.parentNode != null && (
                this.conf.ico.parentNode.removeChild (this.conf.ico),
                this.conf.ico = null
            );
        }
        this.conf.ico = MaterialIcon (ico, 23).classname ("+ico"), this.classname ("+conf-ico");
        this.appendChild (this.conf.ico);
        return this;
    },
    f.Active = function (state) {
        if (/undefined/.test (state)) {
            return this.active;
        }
        if (this.Disabled ()) {
            return this;
        }
        state && (this.active = true, this.classname ("+active"));
        !state && (this.active = false, this.classname ("-active"));
        return this;
    };
    f.Disabled = function (state) {
        if (/undefined/.test (state)) return this.disabled;
        state && (this.disabled = true, this.input ().Disabled (true), this.classname ("+disabled"));
        !state && (this.disabled = false, this.input ().Disabled (false), this.classname ("-disabled"));
        return this;
    },
    f.Value = function (value) {
        if (!/undefined/.test (value)) {
            this.input ().Value (value);
            return this;
        }
        return this.input ().Value ();
    },
    f.outline = function () {
        if (!_CSS (".mui-txt-field.outline")) {
            _CSS.add (".mui-txt-field.outline").applyStyle ({background: "#f1f1f1"});
        }
        this.classname ("+outline");
        return this;
    };
    return f;
}) ();
//@Tabs
/*
 */
window.MUI.Tabs = (function () {
    var o = {index: 0};
    var f = function () {
        /*
        */
        if (!_CSS (".mui-tabs")) {
            _CSS.add (".mui-tabs-collection").applyStyle ({display: "block", borderBottom: "1px solid #e0e0e0"});
            _CSS.add (".mui-tabs-list").applyStyle ({borderCollapse: "collapse"});
            _CSS.add (".mui-tabs").applyStyle ({display: "block", paddingTop: "2px", margin: "auto", position: "relative", bottom: "-3px"});
            _CSS.add (".mui-tabs-ws").applyStyle ({display: "block", paddingTop: "2px", margin: "auto"});
        }
        if (!_CSS (".mui-tabs-list-tab")) {
            _CSS.add (".mui-tabs-list-tab").applyStyle ({
                letterSpacing: "0.5pt", borderRadius: "4px", border: "2px solid rgba(255,255,255,0)", background: "none",
                color: "rgba(0,0,0,.7)", cursor: "pointer", fontSize: "0.96em", padding: "6px 16px 8px 16px", fontWeight: 400
            });
            _CSS.add (".mui-tabs-list-tab:hover").applyStyle ({background: "#f3eaff", color: "#6200ee"});
            _CSS.add (".mui-tabs-list-tab.disabled").applyStyle ({background: "none", color: "#adadad"});
            _CSS.add (".mui-tabs-list-tab.active").applyStyle ({borderBottom: "2px solid #6200ee", color: "#6200ee"});
        }
        o.index++;
        var th1s = mkNode ("div").$ ({index: o.index, tab: null, attr: {collection: null, tabs: null, ws: mkNode ("div")}}).classname ("+mui-tabs");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.add = function () {
        /*
         * @id
         * @label
         * @ico
         */
        for (var i = 0, tb; i < arguments.length; i++) {
            tb = arguments[i];
            if (!/object/.test (typeof tb)) throw new Error ("MUI.Tabs.add: Invalid tab object: " + tb);
            if (!tb.id) throw new Error ("MUI.Tabs.add: Tab object without ID, on step " + i);
            if (!/string/.test (typeof tb.label)) throw new Error ("MUI.Tabs.add: label format must be a string: " + i);
            if (!/undefined/.test (tb.ico) && /null/.test (tb.ico)) throw new Error ("MUI.Tabs.add: ico cannot be empty: " + i);
        }
        if (/null/.test (this.attr.tabs)) {
            this.attr.tabs = mkNode ("div").$ (["appendChild", mkNode ("table").classname ("+mui-tabs-list")]).classname ("+mui-tabs-collection"), 
            this.attr.ws = mkNode ("div").classname ("+mui-tabs-ws"), this.attr.collection = {}; 
            this.attr.tabs.firstChild.$ (["appendChild", mkNode ("tbody").$ (["appendChild", mkNode ("tr")])]);
            this.$ (["appendChild", this.attr.tabs, this.attr.ws]);
        }
        this.attr.collection[tb.id] = mkNode ("td").classname ("+mui-tabs-list-tab");
        tb.label && (this.attr.collection[tb.id].addText (tb.label));
        this.attr.collection[tb.id].tabId = tb.id, this.attr.collection[tb.id].active = function (th1s) {
            if (this.disabled) return;
            if (th1s.tab == this.tabId) return;
            if (!/null/.test (th1s.tab) && !/undefined/.test (typeof th1s.attr.collection[th1s.tab])) th1s.attr.collection[th1s.tab].classname ("-active");
            th1s.tab = this.tabId;
            th1s.attr.collection[tb.id].classname ("+active");
            if (/function/.test (typeof th1s.onAct)) th1s.onAct ();
        }, this.attr.collection[tb.id].$ ({disabled: false}).Disabled = function (flag) {
            if (/undefined/.test (flag)) return this.disabled;
            flag && (this.disabled = true, this.classname ("+disabled"));
            !flag && (this.disabled = false, this.classname ("-disabled"));
            return this;
        };
        this.attr.collection[tb.id].addEventHandler (func (this.attr.collection[tb.id].active, this), "click"),
        this.attr.tabs.firstChild.firstChild.firstChild.appendChild (this.attr.collection[tb.id]);
        return this;
    },
    f.onAct = null,
    f.getTab = function (id) {
        if (/undefined/.test (typeof this.attr.collection[id])) return;
        return this.attr.collection[id];
    },
    f.active = function (id) {
        if (/undefined/.test (typeof this.attr.collection[id])) return;
        this.attr.collection[id].classname ("+active");
        return this;
    },
    f.activate = function (id) {
        if (/undefined/.test (typeof this.attr.collection[id])) return;
        this.attr.collection[id].applyEvent ("click");
    },
    f.tabBox = function (content) {
        if (content) {
            this.attr.ws.empty ().$ (["appendChild", content]);
        }
        return this.attr.ws;
    };
    return f;
}) ();
//@Box
/*
 */
window.MUI.Box = (function () {
    var f = function (value) {
        /*
        */
        if (!_CSS (".mui-box")) {
            _CSS.add (".mui-box").applyStyle ({position: "relative", verticalAlign: "top", margin: "5px", textAlign: "center", padding: "6px 8px 6px 8px", overflow: "auto"});
            _CSS.add (".mui-box>.label").applyStyle ({display: "block", padding: "4px", textAlign: "center", verticalAlign: "top", margin: "4px", borderBottom: "1px solid #e0e0e0"});
        }
        var th1s = mkNode ("div").$ ({conf: {label: null, extension: {context: null, content: null}}}).classname ("+mui-box");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        !/undefined/.test (typeof value) && (th1s.label (value));
        return th1s;
    };
    f.label = function (label) {
        if (!/null/.test (this.conf.label)) {
            if (/undefined/.test (typeof label)) return this.conf.label;
        } else {
            this.conf.label = mkNode ("div").classname ("+label");
            if (this.firstChild != null) this.$ (["insertBefore", this.firstChild, this.conf.label]);
            else this.$ (["appendChild", this.conf.label]);
        }
        !/null/.test (label) && /string|number/.test (typeof label) && (this.conf.label.empty ().addText (label));
        !/null/.test (label) && /object/.test (typeof label) && (this.conf.label.empty ().$ (["appendChild", label]));
        return this;
    },
    f.extension = function (content, label) {
        if (!_CSS (".mui-box.extension")) {
            _CSS.add (".mui-box.extension>.content").applyStyle ({border: "none", width: "32%", height: "100%", position: "absolute", top: 0, margin: 0});
            _CSS.add (".mui-box.extension>.context").applyStyle ({position: "absolute", top: "2px", right: "2px"});
            _CSS.add (".mui-box.extension>.content.position-left").applyStyle ({left: 0});
            _CSS.add (".mui-box.extension>.content.position-right").applyStyle ({right: 0});
            _CSS.add (".mui-box.extension>.content.position-middle").applyStyle ({left: "35%"});
            _CSS.add (".mui-box.extension>.context").applyStyle ({position: "absolute", top: "2px", right: "2px"});
        }
        if (/null/.test (this.conf.extension.context)) {
            var th1s = this, attribute = {
                onPosition: function (pos) {
                    if (!/right|middle|left/.test (pos)) {
                        throw new Error ("MUI.Box.extension.onPosition: Invalid argumenents, possible values [right,middle,left] - " + pos);
                    }
                    th1s.conf.extension.context.pos = pos;
                    return th1s;
                },
                onIco: function (ico) {
                    th1s.conf.extension.context.change (ico);
                    return th1s;
                },
                onShow: function () {
                    if (/null/.test (th1s.conf.extension.content)) {
                        th1s.conf.extension.context.active (true),
                        th1s.conf.extension.content = window.MUI.Context ().classname ("+content"),
                        th1s.conf.extension.context.pos && (th1s.conf.extension.content.classname ("+position-" + th1s.conf.extension.context.pos));
                        th1s.getInnerSize ().height > 0 && (th1s.conf.extension.content.applyStyle ({height: th1s.getInnerSize ().height + "px"})),
                        th1s.conf.extension.content.close.onClose = function () {
                            th1s.conf.extension.context.active (false),
                            th1s.conf.extension.content = null;
                        },
                        th1s.appendChild (th1s.conf.extension.content);
                        th1s.conf.extension.content;
                        
                    }
                    if (!/null/.test (th1s.conf.extension.context.content)) {
                        th1s.conf.extension.content.content (th1s.conf.extension.context.content);
                    }
                    if (!/null/.test (th1s.conf.extension.context.label)) { 
                        th1s.conf.extension.content.label (th1s.conf.extension.context.label);
                    }
                    return th1s;
                },
                onClose: function () {
                    if (!/null/.test (th1s.conf.extension.content)) {
                        if (/function/.test (typeof th1s.conf.extension.context.__onClose__)) th1s.conf.extension.context.__onClose__ ();
                        th1s.conf.extension.content.close.applyEvent ("click");
                    }
                    return th1s;
                }
            };
            this.conf.extension.context = window.MUI.Ico ("more_vert", 22).$ ({content: null, label: null, pos: "right", __onClose__: null, onclick: func (attribute.onShow)}).classname ("+context");
            for (var i in attribute) if (attribute.hasOwnProperty (i)) this.conf.extension.context[i] = attribute[i];
            this.classname ("+extension").appendChild (this.conf.extension.context);
        }
        if (!/undefined/.test (typeof content)) {
            this.conf.extension.context.content = content;
        }
        if (!/undefined/.test (typeof label)) {
            this.conf.extension.context.label = label;
        }
        if (arguments.length == 0) {
            return this.conf.extension.context;
        }
        return this;
    },
    f.flat = function () {
        /*
         */
        if (!_CSS (".mui-box.flat")) {
            _CSS.add (".mui-box.flat").applyStyle ({border: "none", background: "#ffffff", 
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"
            });
            _CSS.add (".mui-box.flat.extension>.content").applyStyle ({
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)", background: "inherit" 
            });
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        if (!_CSS (".mui-box.outline")) {
            _CSS.add (".mui-box.outline").applyStyle ({background: "#f1f1f1", border: "1px solid #bdbdbd"});
            _CSS.add (".mui-box.outline.extension>.content").applyStyle ({borderLeft: "1px solid #bdbdbd", background: "inherit"});
        }
        this.classname ("+outline");
        return this;
    },
    f.round = function () {
        if (!_CSS (".mui-box.round")) {
            _CSS.add (".mui-box.round").applyStyle ({borderRadius: "8px"});
        }
        this.classname ("+round");
        return this;
    },
    f.remove = function () {
        this.parentNode != null && this.parentNode.removeChild (this);
        return true;
    };
    return f;
}) ();
//@Card
/*
 */
window.MUI.Card = (function () {
    var f = function () {
        /*
        */
        if (!_CSS (".mui-card")) {
            _CSS.add (".mui-card>.top").applyStyle ({
                verticalAlign: "middle", display: "block", margin: 0, 
                border: "1px solid #bdbdbd", textAlign: "left", 
                borderTopLeftRadius: "8px", borderTopRightRadius: "8px", position: "relative", 
                bottom: "-1px", padding: "6px", minHeight: "25px"
            });
            _CSS.add (".mui-card>.middle").applyStyle ({
                zIndex: 1, verticalAlign: "middle", display: "block", 
                margin: 0, border: "1px solid #bdbdbd",
                overflow: "auto", padding: "8px", minHeight: "25px"
            });
            _CSS.add (".mui-card>.bottom").applyStyle ({
                verticalAlign: "middle", display: "block", margin: 0, 
                border: "1px solid #bdbdbd", textAlign: "right", 
                borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", position: "relative", 
                top: "-1px", padding: "6px", minHeight: "25px"
            });
        }
        var th1s = mkNode ("div").$ ({element: {top: null, middle: null, bottom: null}}).classname ("+mui-card");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.middle = function (content) {
        if (!/null/.test (this.element.middle)) {
            if (!/undefined/.test (typeof content)) {
                this.element.middle.empty ().$ (["appendChild", content]);
                return this;
            }
            return this.element.middle;
        }
        this.element.middle = mkNode ("div").classname ("+middle");
        if (!/null/.test (this.element.bottom)) this.$ (["insertBefore", this.element.bottom, this.element.middle]);
        else this.$ (["appendChild", this.element.middle]);
        if (!/undefined/.test (typeof content)) {
            this.element.middle.$ (["appendChild", content]);
            return this;
        }
        return this.element.middle;
    },
    f.top = function (content) {
        if (!/null/.test (this.element.top)) {
            if (!/undefined/.test (typeof content)) {
                this.element.top.empty ().$ (["appendChild", content]);
                return this;
            }
            return this.element.top;
        }
        this.element.top = mkNode ("div").classname ("+top");
        if (!/null/.test (this.element.middle)) this.$ (["insertBefore", this.element.middle, this.element.top]);
        else this.$ (["appendChild", this.element.top]);
        if (!/undefined/.test (typeof content)) {
            this.element.top.$ (["appendChild", content]);
            return this;
        }
        return this.element.top;
    },
    f.bottom = function (content) {
        if (!/null/.test (this.element.bottom)) {
            if (!/undefined/.test (typeof content)) {
                this.element.bottom.empty ().$ (["appendChild", content]);
                return this;
            }
            return this.element.bottom;
        }
        this.element.bottom = mkNode ("div").classname ("+bottom");
        this.$ (["appendChild", this.element.bottom]);
        if (!/undefined/.test (typeof content)) {
            this.element.bottom.$ (["appendChild", content]);
            return this;
        }
        return this.element.bottom;
    },
    f.remove = function () {
        this.parentNode != null && this.parentNode.removeChild (this);
        return true;
    };
    return f;
}) ();
//@Sweep
/*
 */
window.MUI.Sweep = (function () {
    var f = function (type, size) {
        /*
        */
        if (!_CSS (".mui-sweep")) {
            _CSS.add (".mui-sweep").applyStyle ({display: "inline-block", textAlign: "center"});
        }
        if (/undefined/.test (typeof type)) type = "down";
        if (/undefined/.test (typeof size)) size = 22;
        var reserved = {
            up: {ico: "keyboard_arrow_up", event: "down"}, down: {ico: "keyboard_arrow_down", event: "up"},
            left: {ico: "keyboard_arrow_left", event: "right"}, right: {ico: "keyboard_arrow_right", event: "left"}
        }, event = function () {
            if (this.disabled ()) return;
            this.active (false);
            this.main == this.type && (this.active (true));
            var __type__ = reserved[this.type].event;
            this.type = __type__;
            this.change (reserved[this.type].ico);
        },
        th1s = window.MUI.Ico (reserved[type].ico, size).$ ({type: type, main: type, onclick: func (event)}).classname ("+mui-sweep");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    return f;
}) ();
//@Drawer
/*
 */
window.MUI.Drawer = (function () {
    var f = function (type) {
        /*
        */
        if (!_CSS (".mui-drawer")) {
            _CSS.add (".mui-drawer").applyStyle ({
                margin: 0, zIndex: 2, position: "absolute", verticalAlign: "top", width: "320px", height: "93.3vh"
            });
        }
        var th1s = window.MUI.Box ().$ ({onClose: null, layer: null}).flat ().classname ("+mui-drawer");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        if (!/undefined/.test (typeof type) && /left|middle|right/.test (type)) th1s.create (type);
        else th1s.create ("left");
        return th1s;
    };
    f.create = function (type) {
        window.UI.WorkSpace.current ().$ (["appendChild", this]);
        var offset = (sapi ("SYS_ALTERNATE") ? 
            [/*left*/0, /*top*/50] : [ /*left*/($ ("#ui-left-div") && $ ("#ui-left-div").offsetWidth) ? $ ("#ui-left-div").offsetWidth : 0, /*top*/50]
        );
        if (/left/.test (type)) this.applyStyle ({left: offset[0] + "px", top: offset[1] + "px"}).classname ("+drawer-left");
        if (/middle/.test (type)) this.applyStyle ({left: "35%", top: offset[1] + "px"}).classname ("+drawer-middle"); 
        if (/right/.test (type)) this.applyStyle ({right: 0, top: offset[1] + "px"}).classname ("+drawer-fight"); 
        return this;
    },
    f.close = function () {
        /function/.test (this.onClose) && (this.onClose ());
        !/null/.test (this.parentNode) && (this.parentNode.removeChild (this)); 
        return this;
    },
    f.layer = function () {
        if (!_CSS (".mui-drawer-layer")) {
            _CSS.add (".mui-drawer-layer").applyStyle ({zIndex: 1, position: "fixed", top: "26px", left: 0, bottom: 0, right: 0, background: "rgba(0, 0, 0, 0.27)"});
        }
        this.layer = mkNode ("div").$ ({onClose: null}).classname ("+mui-drawer-layer");
        this.layer.close = function (th1s) {
            /function/.test (this.onClose) && (this.onClose ());
            !/null/.test (this.parentNode) && (this.parentNode.removeChild (this), th1s.close ()); 
        };
        window.UI.WorkSpace.current ().$ (["appendChild", this.layer.addEventHandler (func (this.layer.close, this), "click")]);
        return this;
    };
    return f;
}) ();
//@Chip
/*
 */
window.MUI.Chip = (function () {
    var f = function (label) {
        /*
        */
        if (!_CSS (".mui-chip")) {
            _CSS.add (".mui-chip").applyStyle ({margin: "4px", display: "inline-block", height: "30px", borderRadius: "16px", padding: 0, color: "#666"});
            _CSS.add (".mui-chip>.label").applyStyle ({
                display: "inline-block", verticalAlign: "middle", textAlign: "center", 
                overflow: "hidden", fontSize: "0.94em", whiteSpace: "nowrap", padding: "8px 20px 8px 20px"
            });
            _CSS.add (".mui-chip:hover, .mui-chip.active").applyStyle ({color: "#6200ee"});
            _CSS.add (".mui-chip.disabled").applyStyle ({color: "#adadad", background: "#eee"});
            
            _CSS.add (".mui-chip>.holder").applyStyle ({
                borderRadius: "3em", display: "inline-block", verticalAlign: "middle", textAlign: "center",  
                overflow: "hidden", margin: "3px -12px 3px 4px", width: "16px", height: "16px", padding: "3px", border: "1px solid #bdbdbd"
            });
            _CSS.add (".mui-chip>.holder>I").applyStyle ({color: "inherit", position: "relative", left: "-1px"});
            _CSS.add (".mui-chip:hover>.holder, .mui-chip.active>.holder").applyStyle ({border: "1px solid #6200ee", background: hex2rgba ("#6200ee", 0.2)});
            _CSS.add (".mui-chip.disabled>.holder").applyStyle ({border: "1px solid #adadad", color: "#adadad", background: "#ccc"});
        }
        var th1s = mkNode ("div").$ ({active: false, disabled: false, attr: {label: null, holder: null}}).classname ("+mui-chip");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        !/undefined/.test (typeof label) && (th1s.label (label));
        return th1s;
    };
    f.Active = function (flag) {
        if (/undefined/.test (flag)) {
            return this.active;
        }
        if (this.Disabled ()) {
            return this;
        }
        flag && (this.active = true, this.classname ("+active"));
        !flag && (this.active = false, this.classname ("-active"));
        return this;
    },
    f.Disabled = function (flag) {
        if (/undefined/.test (flag)) {
            return this.disabled;
        }
        flag && (this.disabled = true, this.classname ("+disabled"));
        !flag && (this.disabled = false, this.classname ("-disabled"));
        return this;
    },
    f.flat = function () {
        if (!_CSS (".mui-chip.flat")) {
            _CSS.add (".mui-chip.flat").applyStyle ({
                border: "none", boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"
            });
            _CSS.add (".mui-chip.flat:hover, .mui-chip.flat.active").applyStyle ({background: "#6200ee", color: "#fff"});
            _CSS.add (".mui-chip.flat.disabled").applyStyle ({color: "#adadad", background: "#eee"});
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        if (!_CSS (".mui-chip.outline")) {
            _CSS.add (".mui-chip.outline").applyStyle ({background: "none", border: "1px solid #bdbdbd", boxShadow: "none"});
            _CSS.add (".mui-chip.outline:hover, .mui-chip.outline.active").applyStyle ({background: hex2rgba ("#6200ee", 0.09), border: "1px solid #6200ee"});
            _CSS.add (".mui-chip.outline.disabled").applyStyle ({border: "1px solid #adadad", color: "#adadad", background: "#eee"});
        }
        this.classname ("+outline");
        return this;
    },
    f.label = function (label, short) {
        if (!/null/.test (this.attr.label)) {
            if (/undefined/.test (typeof label)) return this.attr.label;
        } else {
            this.attr.label = mkNode ("div").classname ("+label");
            this.$ (["appendChild", this.attr.label]);
        }
        if (!/null/.test (label) && /string|number/.test (typeof label)) {
            this.attr.label.empty ().addText (label), short && (this.applyShortLabel ());
        }
        return this;
    },
    f.holder = function (holder) {
        if (!/null/.test (this.attr.holder)) {
            if (/undefined/.test (typeof holder)) return this.attr.holder;
        } else {
            this.attr.holder = mkNode ("div").classname ("+holder");
            if (this.attr.label != null) this.$ (["insertBefore", this.attr.label, this.attr.holder]);
            else this.$ (["appendChild", this.attr.holder]);
        }
        !/null/.test (holder) && /string|number/.test (typeof holder) && (this.attr.holder.empty ().$ (["appendChild", mkNode ("span").addText (holder)]));
        !/null/.test (holder) && /object/.test (typeof holder) && (this.attr.holder.empty ().$ (["appendChild", holder]));
        return this;
    },
    f.applyShortLabel = function () {
        if (!/null/.test (this.attr.label)) {
            if (!/null/.test (this.attr.label.textContent.toString ()) && this.attr.label.textContent.toString ().length > 30) {
                var label = this.attr.label.textContent.toString ().substr (0, 30);
                this.attr.label.$ ({title: this.attr.label.textContent.toString ()}).empty ().addText (label + "...");
                this.$ (["appendChild", this.attr.label]);
            }
        }
        return this;
    };
    return f;
}) ();
//@MatIco
/*
 */
window.MUI.Ico = (function () {
    var f = function (ico, size) {
        if (!size) size = 24;
        if (!_CSS (".mui-ico")) {
            _CSS.add (".mui-ico").applyStyle ({verticalAlign: "middle"}),
            _CSS.add (".mui-ico>I").applyStyle ({borderRadius: "3em", display: "inline-block", cursor: "pointer", verticalAlign: "middle", color: "#777", padding: "2px", margin: "1px"});
            _CSS.add (".mui-ico>I:hover, .mui-ico.active>I").applyStyle ({background: hex2rgba ("#6300ee", 0.09), color: "#6300ee"});
            _CSS.add (".mui-ico.disabled>I").applyStyle ({color: "#adadad", background: "none"});
            _CSS.add (".mui-ico.disabled>I:hover").applyStyle ({background: hex2rgba ("#adadad", 0.09)});
        }
        var th1s = mkNode ("span").$ ({__active: false, __disabled: false, __ico: ico, __size: size}, ["appendChild", 
            MaterialIcon (ico, size)
        ]).classname ("+mui-ico");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.disabled = function (state) {
        /*
         */
        if (/undefined/.test (state)) {
            return this.__disabled;
        }
        state && (this.__disabled = true, this.classname ("+disabled"));
        !state && (this.__disabled = false, this.classname ("-disabled"));
        return this;
    },
    f.active = function (state) {
        /*
         */
        if (/undefined/.test (state)) {
            return this.__active;
        }
        if (this.disabled ()) {
            return this;
        }
        state && (this.__active = true, this.classname ("+active"));
        !state && (this.__active = false, this.classname ("-active"));
        return this;
    },
    f.change = function (ico) {
        this.removeChild (this.firstChild), this.__ico = ico,
        this.$ (["appendChild", MaterialIcon (this.__ico, this.__size)]);
        return this;
    },
    f.flat = function () {
        /*
         */
        if (!_CSS (".mui-ico.flat")) {
            _CSS.add (".mui-ico.flat>I").applyStyle ({
                border: "none", background: "#6300ee", color: "#fff",
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"
            });
            _CSS.add (".mui-ico.flat>I:hover, .mui-ico.flat.active>I").applyStyle ({boxShadow: "0 2px 4px 0 rgba(0,0,0,.1),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)"});
            _CSS.add (".mui-ico.flat.disabled>I").applyStyle ({boxShadow: "none", background: "#eee", color: "#adadad"});
        }
        this.classname ("+flat");
        return this;
    },
    f.outline = function () {
        /*
         */
        if (!_CSS (".mui-ico.outline")) {
            _CSS.add (".mui-ico.outline>I").applyStyle ({background: "none", border: "1px solid #bdbdbd", boxShadow: "none"});
            _CSS.add (".mui-ico.outline>I:hover, .mui-ico.outline.active>I").applyStyle ({background: hex2rgba ("#6200ee", 0.09), border: "1px solid #6200ee"});
            _CSS.add (".mui-ico.outline.disabled>I:hover, .mui-ico.outline.disabled>I").applyStyle ({border: "1px solid #bdbdbd", background: "#f1f1f1"});
        }
        this.classname ("+outline");
        return this;
    };
    return f;
}) ();
//@Table
/*
 */
window.MUI.Table = (function () {
    var f = function (caption) {
        /*
        */
        if (!_CSS (".mui-table")) {
            _CSS.add (".mui-table>TABLE").applyStyle ({borderCollapse: "collapse", margin: "auto", textAling: "center", width: "100%"}),
            _CSS.add (".mui-table>TABLE>TBODY>TR:nth-child(odd)").applyStyle ({background: "#F5F5F5"}),
            _CSS.add (".mui-table>TABLE.spechover>TBODY>TR:hover").applyStyle ({background: hex2rgba ("#6200ee", 0.09)}),
            _CSS.add (".mui-table>TABLE>THEAD>TR>TH").applyStyle ({textAlign: "center", color: "#555", fontWeight: 500, fontSize: "0.97em", padding: "7px"}),
            _CSS.add (".mui-table>TABLE>TBODY>TR>TD").applyStyle ({textAlign: "center", color: "#222", fontWeight: 500, fontSize: "1em", padding: "5px"}),
            _CSS.add (".mui-table>TABLE>TBODY>TR.search-hide, .mui-table>TABLE>TBODY>TR>TD.column-hide, .mui-table>TABLE>THEAD>TR>TH.column-hide, .mui-table>TABLE>TBODY>TR.filter-hide").applyStyle ({display: "none"});
        }
        var th1s = window.MUI.Box (caption).$ ({table: mkNode ("table"), head: null, body: null, extension: {content: null, context: null, element: {}}}).classname ("+mui-table");
        th1s.appendChild (th1s.table);
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        return th1s;
    };
    f.extensionContent = function () {
        /*
         * @extention-content
         */
        if (!/null/.test (this.extension.content)) {
            return this.extension.content;
        }
        this.extension.content = mkNode ("div").classname ("+extention-content").applyStyle ({textAlign: "left"});
        if (!/undefined/.test (typeof this.firstChild)) {
            this.$ (["insertBefore", this.firstChild, this.extension.content]);
        } else this.$ (["appendChild", this.extension.content]);
        
        return this.extension.content;
    },
    f.extensionContext = function () {
        /*
         * @extention-context
         */
        if (!/null/.test (this.extension.context)) {
            return this.extension.context;
        }
        var th1s = this, close = window.MUI.Ico ("close", 14).outline (), action = {
            close: function () {
                if (/function/.test (typeof this.onClose)) this.onClose ();
                if (/null/.test (th1s.extension.context)) return;
                th1s.extension.context.rm ();
            },
            rm: function () {
                th1s.extension.context.remove (), th1s.extension.context = null;
            }
        };
        th1s.extension.context = window.MUI.Card ().top (close).$ ({rm: action.rm, close: close}).applyStyle ({textAlign: "left"}), 
        close.$ ({onClose: null, onclick: func (action.close)}), th1s.extension.context.middle (), th1s.extension.context.bottom ();
        if (!/undefined/.test (typeof th1s.firstChild)) {
            th1s.$ (["insertBefore", th1s.firstChild, th1s.extension.context]);
        } else th1s.$ (["appendChild", th1s.extension.context]);
        
        return th1s.extension.context;
    },
    f.search = function () {
        /*
         * @extention-element
         */
        if (!/undefined/.test (typeof this.extension.element.search)) {
            return this.extension.element.search;
        }
        var th1s = this, event = {
            __close__: function () {
                if (!/null/.test (th1s.extension.element.search.__text__)) return;
                event.__reset__ ();
            },
            __reset__: function () {
                th1s.extension.element.search.__text__ = "", th1s.extension.element.search.checked = [],
                event.__apply__.call (th1s.extension.element.search.text);
                th1s.extension.element.search.active (false);
                !/null/.test (th1s.extension.context) && (
                    th1s.extension.context.rm ()
                );
            },
            __apply__: function () {
                var tbody = th1s.table.querySelectorAll ("tbody > tr"), indexText;
                th1s.extension.element.search.__count__ = 0;
                for (var i in tbody) {
                    var chtr = tbody[i];
                    if (!(chtr instanceof HTMLElement)) continue;
                    if (/undefined/.test (typeof chtr.textContent)) continue;
                    if (/null/.test (chtr.textContent)) continue;
                    if (/filter-hide/.test (chtr.className)) continue;
                    indexText = [], chtr.classname ("-search-hide");
                    if (/null/.test (th1s.extension.element.search.__text__)) continue;
                    for (var t in chtr.childNodes) {
                        if (!(chtr.childNodes[t] instanceof HTMLElement)) continue;
                        if (/column-hide/.test (chtr.childNodes[t].className)) continue;
                        if (th1s.extension.element.search.checked.length > 0) {
                            th1s.extension.element.search.checked.indexOf (parseInt (t)) != -1 && (
                                indexText.push (chtr.childNodes[t].textContent)
                            );
                        } else indexText.push (chtr.childNodes[t].textContent);
                    }
                    if (indexText.length == 0) continue;
                    indexText.join ("").toLowerCase ().indexOf (th1s.extension.element.search.__text__.toLowerCase ()) == -1 && (chtr.classname ("+search-hide"));
                    !/search-hide/.test (chtr.className) && (th1s.extension.element.search.__count__++);
                    th1s.extension.element.search.__text__ == "" && (
                        th1s.extension.element.search.__text__ = null, th1s.extension.element.search.__count__ = 0
                    );
                }    
                th1s.extension.element.search.count.lastChild.empty ().addText (th1s.extension.element.search.__count__);
            },
            checked: function () {
                var pv = th1s.extension.element.search.checked.indexOf (parseInt (this.Value ()));
                if (pv == -1 && this.Active ()) {
                    th1s.extension.element.search.checked.push (parseInt (this.Value ()));
                }
                if (pv != -1 && !this.Active ()) {
                    th1s.extension.element.search.checked.splice (pv, 1);
                }
                return;
            },
            sweep: function () {
                th1s.extension.element.search.column.empty (),
                /null/.test (th1s.extension.element.search.__text__) && (
                    th1s.extension.element.search.checked = []
                );
                if (!th1s.extension.element.search.sweep.active ()) return;
                var thead = th1s.table.querySelectorAll ("thead > tr > th");
                for (var i = 0, chtd; i < thead.length; i++) {
                    chtd = thead[i];
                    if (!(chtd instanceof HTMLElement)) continue;
                    if (/undefined/.test (typeof chtd.textContent)) continue;
                    if (/column-hide/.test (chtd.className)) continue;
                    if (chtd.textContent.trim () == "") continue;
                    th1s.extension.element.search.column.$ (["appendChild", 
                        window.MUI.Toggle (i).label (chtd.textContent).Active (
                           th1s.extension.element.search.checked.indexOf (i) != -1 ? true : false
                        ).$ ({onclick: func (event.checked)})
                    ]);
                }
            },
            use: function () {
                if (!/null/.test (th1s.extension.context)) {
                    th1s.extensionContext ().rm ();
                }
                th1s.extension.element.search.active (true);
                th1s.extension.element.search.text = mkNode ("text").$ ({state: false, placeholder: "Пошук ...", onkeyup: func (function () {
                    th1s.extension.element.search.__text__ = this.Value (), event.__apply__ ();
                })}).applyStyle ({
                    display: "inline-block", minWidth: "150px", width: "88%", verticalAlign: "middle"
                }), 
                th1s.extension.element.search.count = mkNode ("span").$ (["appendChild", 
                    mkNode ("span").addText ("Знайдено записів: ").applyStyle ({color: "#777", fontWeight: 500, fontSize: "0.97em"}),
                    mkNode ("span").addText (0).applyStyle ({color: "#6300ee", fontWeight: 700, fontSize: "1.18em"})
                ]).applyStyle ({float: "left", verticalAlign: "middle"}), 
                !/null/.test (th1s.extension.element.search.__text__) && (th1s.extension.element.search.text.Value (
                    th1s.extension.element.search.__text__
                )),
                th1s.extension.element.search.column = mkNode ("div"),
                th1s.extension.element.search.sweep = window.MUI.Sweep ().addEventHandler (func (event.sweep), "click"),
                th1s.extensionContext ().middle ().$ (["appendChild", 
                    th1s.extension.element.search.text, th1s.extension.element.search.sweep, th1s.extension.element.search.column
                ]),
                !/null/.test (th1s.extension.element.search.__count__) && (
                    th1s.extension.element.search.count.lastChild.empty ().addText (th1s.extension.element.search.__count__)
                ),
                th1s.extensionContext ().bottom ().$ (["appendChild", th1s.extension.element.search.count]),
                th1s.extensionContext ().close.onClose = event.__close__,
                th1s.extensionContext ().bottom ().$ (["appendChild",
                    window.MUI.Button ("СКИНУТИ").$ ({onclick: func (event.__reset__)}).applyStyle ({verticalAlign: "middle"})
                ]),
                th1s.extension.element.search.checked.length > 0 && (
                    th1s.extension.element.search.sweep.applyEvent ("click")
                );
            }
        };
        this.extension.element.search = window.MUI.Ico ("search").$ ({
            column: null, checked: [], text: null, __text__: null, count: null, __count__: 0, onclick: func (event.use)
        });
        this.extensionContent ().$ (["appendChild", this.extension.element.search]);
        return this;
    },
    f.column = function () {
        /*
         * @extention-element
         */
        if (!/undefined/.test (typeof this.extension.element.column)) {
            return this.extension.element.column;
        }
        var th1s = this, event = {
            __close__: function () {
                if (th1s.extension.element.column.checked.length > 0) return;
                event.__reset__ ();
            },
            __reset__: function () {
                th1s.extension.element.column.checked = [], event.applyChecked (), 
                th1s.extension.element.column.active (false),
                !/null/.test (th1s.extension.context) && (
                    th1s.extension.context.rm ()
                );
                return true;
            },
            __apply__: function () {
                event.applyChecked ();
                return true;
            },
            checked: function () {
                var pv = th1s.extension.element.column.checked.indexOf (parseInt (this.Value ()));
                if (pv == -1 && this.Active ()) {
                    th1s.extension.element.column.checked.push (parseInt (this.Value ()));
                }
                if (pv != -1 && !this.Active ()) {
                    th1s.extension.element.column.checked.splice (pv, 1);
                }
            },
            applyChecked: function () {
                var chtr = [
                    th1s.table.querySelectorAll ("thead > tr"), 
                    th1s.table.querySelectorAll ("tbody > tr")
                ];
                for (var o in chtr) {
                    for (var i in chtr[o]) {
                        if (!(chtr[o][i] instanceof HTMLElement)) continue;
                        for (var cn in chtr[o][i].childNodes) {
                            chtd = chtr[o][i].childNodes[cn];
                            if (!(chtd instanceof HTMLElement)) continue;
                            chtd.classname ("-column-hide");
                            if (th1s.extension.element.column.checked.length == 0) continue;
                            if (th1s.extension.element.column.checked.indexOf (parseInt (cn)) == -1) {
                                chtd.classname ("+column-hide");
                            }
                        }
                    }
                }
            },
            use: function () {
                if (!/null/.test (th1s.extension.context)) {
                    th1s.extensionContext ().rm ();
                }
                th1s.extension.element.column.active (true),
                thead = th1s.table.querySelectorAll ("thead > tr > th");
                for (var i = 0, chtd; i < thead.length; i++) {
                    chtd = thead[i];
                    if (!(chtd instanceof HTMLElement)) continue;
                    if (/undefined/.test (typeof chtd.textContent)) continue;
                    if (chtd.textContent.trim () == "") continue;
                    th1s.extensionContext ().middle ().$ (["appendChild", 
                        window.MUI.Toggle (i).label (chtd.textContent).Active (
                           th1s.extension.element.column.checked.indexOf (i) != -1 ? true : false
                        ).$ ({onclick: func (event.checked)})
                    ]);
                }
                th1s.extensionContext ().bottom ().$ (["appendChild",
                    window.MUI.Button ("СКИНУТИ").$ ({onclick: func (event.__reset__)}),
                    window.MUI.Button ("ПРИМІНИТИ").flat ().$ ({onclick: func (event.__apply__)})
                ]),
                th1s.extensionContext ().close.onClose = event.__close__;
            }
        };
        this.extension.element.column = window.MUI.Ico ("view_column").$ ({checked: [], onclick: func (event.use)});
        this.extensionContent ().$ (["appendChild", this.extension.element.column]);
        return this;
    },
    f.filter = function () {
        /*
         * @extention-element
         */
        if (!/undefined/.test (typeof this.extension.element.filter)) {
            return this.extension.element.filter;
        }
        var th1s = this, event = {
            __close__: function () {
                if (th1s.extension.element.filter.checked.length > 0) return;
                event.__reset__ ();
            },
            __reset__: function () {
                th1s.extension.element.filter.checked = [], th1s.extension.element.filter.active (false), event.applyChecked (), 
                !/null/.test (th1s.extension.context) && (
                    th1s.extension.context.rm ()
                );
                return true;
            },
            __apply__: function () {
                event.applyChecked (), event.use ();
                return true;
            },
            checked: function () {
                th1s.extension.element.filter.checked[this.column] = [];
                if (this.Value ().length > 0) {
                    th1s.extension.element.filter.checked[this.column] = this.Value ();
                } else delete th1s.extension.element.filter.checked[this.column];
                if (Object.keys (th1s.extension.element.filter.checked).length == 0) {
                    event.use ();
                }
            },
            applyChecked: function () {
                var chtr, tbody = th1s.table.querySelectorAll ("tbody > tr"), indexText;
                for (var i in tbody) {
                    chtr = tbody[i];
                    if (!(chtr instanceof HTMLElement)) continue;
                    if (/undefined/.test (typeof chtr.textContent)) continue;
                    if (/null/.test (chtr.textContent)) continue;
                    if (/search-hide/.test (chtr.className)) continue;
                    indexText = [], chtr.classname ("-filter-hide");
                    for (var column in th1s.extension.element.filter.checked) {
                        if (/undefined/.test (typeof chtr.childNodes[column])) continue;
                        if (!(chtr.childNodes[column] instanceof HTMLElement)) continue;
                        if (/column-hide/.test (chtr.childNodes[column].className)) continue;
                        if (th1s.extension.element.filter.checked[column].length == 0) continue;
                        th1s.extension.element.filter.checked[column].indexOf (chtr.childNodes[column].textContent.toString ()) == -1 && (
                            chtr.classname ("+filter-hide")
                        );
                    }
                }
                return true;
            },
            use: function () {
                if (!/null/.test (th1s.extension.context)) {
                    th1s.extensionContext ().rm ();
                }
                th1s.extension.element.filter.active (true);
                var chtd_values = {}, chtr = [
                    th1s.table.querySelectorAll ("tbody > tr")
                ], flen = Object.keys (th1s.extension.element.filter.checked).length;
                for (var o in chtr) {
                    for (var i in chtr[o]) {
                        if (!(chtr[o][i] instanceof HTMLElement)) continue;
                        for (var cn in chtr[o][i].childNodes) {
                            chtd = chtr[o][i].childNodes[cn];
                            if (!(chtd instanceof HTMLElement)) continue;
                            if (/search-hide/.test (chtr[o][i].className)) continue;
                            if (/column-hide/.test (chtd.className)) continue;
                            if (chtd.textContent.trim () == "") continue;
                            if (/undefined/.test (typeof chtd_values[cn])) chtd_values[cn] = [];
                            if (chtd_values[cn].indexOf (chtd.textContent) != -1) continue;
                            if (flen > 0) {
                                !/filter-hide/.test (chtr[o][i].className) && chtd_values[cn].push (chtd.textContent);
                            } else chtd_values[cn].push (chtd.textContent);
                        }
                    }
                }
                var thead = th1s.table.querySelectorAll ("thead > tr > th");
                for (var i = 0, chtd; i < thead.length; i++) {
                    chtd = thead[i];
                    if (!(chtd instanceof HTMLElement)) continue;
                    if (/undefined/.test (typeof chtd_values[i])) continue;
                    if (/undefined/.test (typeof chtd.textContent)) continue;
                    if (/column-hide/.test (chtd.className)) continue;
                    if (chtd.textContent.trim () == "") continue;
                    th1s.extensionContext ().middle ().$ (["appendChild", 
                        window.MUI.Box (chtd.textContent).$ (["appendChild",
                            th1s.extension.element.filter.select[i] = mkNode ("select").$ ({column: i, multiple: true, searchOption: true, onchange: func (event.checked)}).applyStyle ({width: "120px"})
                        ]).applyStyle ({display: "inline-block", margin: "1px", padding: "1px"})
                    ]);
                }
                for (var i in chtd_values) {
                    if (/undefined/.test (typeof th1s.extension.element.filter.select[i])) continue;
                    for (var cn in chtd_values[i]) {
                        th1s.extension.element.filter.select[i].$ (["appendChild", 
                            mkNode ("option").Value (chtd_values[i][cn]).addText (chtd_values[i][cn]) 
                        ]);
                    }
                    th1s.extension.element.filter.checked[i] && (
                        th1s.extension.element.filter.select[i].Value (th1s.extension.element.filter.checked[i])
                    );
                }
                th1s.extensionContext ().bottom ().$ (["appendChild",
                    window.MUI.Button ("СКИНУТИ").$ ({onclick: func (event.__reset__)}),
                    window.MUI.Button ("ПРИМІНИТИ").flat ().$ ({onclick: func (event.__apply__)})
                ]),
                th1s.extensionContext ().close.onClose = event.__close__;
            }
        };
        this.extension.element.filter = window.MUI.Ico ("filter_list").$ ({select: {}, checked: {}, onclick: func (event.use)});
        this.extensionContent ().$ (["appendChild", this.extension.element.filter]);
        return this;
    },
    f.hover = function (state) {
        this.table.classname ((
            (state|| /undefined/.test (typeof state)) ? "+" : "-"
        ) + "spechover");
        return this;
    },
    f.createRow = function () {
        var tr = this.appendChild (mkNode ("tr"));
        if (!/undefined/.test (typeof arguments[0])) {
            for (var i = 0, arg; i < arguments[0].length; i++) {
                arg = arguments[0][i];
                if (/array/.test (type (arg))) {
                    tr.$ (["appendChild"].concat (arg));
                } else tr.$ (["appendChild", arg]); 
            }
        }
        return tr;
    },
    f.createHead = function () {
        var th1s = this;
        this.head = mkNode ("thead").$ ({
            createRow: function () {return th1s.createRow.call (this, arguments);}
        });
        this.table.$ (["appendChild", this.head]);
        return this;
    },
    f.createBody = function () {
        var th1s = this;
        this.body = mkNode ("tbody").$ ({
            createRow: function () {return th1s.createRow.call (this, arguments);}
        });
        this.table.$ (["appendChild", this.body]);
        return this;
    };
    return f;
}) ();
//Context
/*
 */
window.MUI.Context = (function () {
    var f = function (content) {
        /*
        */
        if (!_CSS (".mui-context")) {
            _CSS.add (".mui-context").applyStyle ({display: "inline-block", position: "relative", minWidth: "160px", minHeight: "40px", 
                border: "1px solid #bdbdbd", margin: "7px", padding: "6px 0px 6px 0px", overflow: "auto", color: "rgba(0,0,0,.87)"});
            _CSS.add (".mui-context>.close, .mui-context>.label>.close").applyStyle ({position: "absolute", top: "6px", right: "8px", verticalAlign: "top"});
            _CSS.add (".mui-context>.label>.content").applyStyle ({width: "80%", verticalAlign: "top", margin: "2px 3px 2px 3px", textAlign: "left"});
            _CSS.add (".mui-context>.label").applyStyle ({display: "block", height: "25px", padding: "4px 4px 4px 1px", verticalAlign: "top"});
            _CSS.add (".mui-context>.content").applyStyle ({display: "block", background: "inherit", verticalAlign: "middle", margin: "2x"});
        }
        var close = window.MUI.Ico ("close", 14).$ ({onClose: null}).classname ("+close").outline (),
        th1s = mkNode ("div").$ ({close: close, conf: {label: null, content: null}}).$ (["appendChild", 
            close
        ]).classname ("+mui-context"), action = {
            close: function () {
                if (/function/.test (typeof this.onClose)) this.onClose ();
                th1s.remove ();
            }
        };
        close.$ ({onclick: func (action.close)});
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        if (!/undefined/.test (typeof content)) th1s.content (content);
        th1s.label ();
        return th1s;
    };
    f.label = function (label) {
        if (!/null/.test (this.conf.label)) {
            if (/undefined/.test (typeof label)) return this.conf.label;
        } else {
            this.conf.label = mkNode ("div").classname ("+label");
            if (this.firstChild != null) this.$ (["insertBefore", this.firstChild, this.conf.label]);
            else this.$ (["appendChild", this.conf.label]);
        }
        !/null/.test (label) && /string|number/.test (typeof label) && (this.conf.label.empty ().$ (["appendChild", mkNode ("a").addText (label).classname ("+content")]));
        !/null/.test (label) && /object/.test (typeof label) && (this.conf.label.empty ().$ (["appendChild", label.classname ("+content")]));
        return this;
    },
    f.content = function (content) {
        if (!/null/.test (this.conf.content)) {
            if (/undefined/.test (typeof content)) return this.conf.content;
        } else {
            this.conf.content = mkNode ("div").classname ("+content");
            this.$ (["appendChild", this.conf.content]);
        }
        !/null/.test (content) && this.conf.content.empty ().$ (["appendChild", content]);
        return this;
    },
    f.remove = function () {
        this.parentNode != null && this.parentNode.removeChild (this);
        return true;
    };
    return f;
}) ();
//App
/*
 */
window.MUI.App = (function () {
    var f = function () {
        /*
        */
        if (!_CSS (".mui-app")) {
           _CSS.add (".mui-app").applyStyle ({position: "relative", width: "100%", margin: "4px", left: 0, right: 0});
           _CSS.add (".mui-app>.head").applyStyle ({position: "relative", display: "block", width: "100%", minHeight: "55px", marginTop: 0, top: 0, left: 0, right: 0});
           _CSS.add (".mui-app>.head>.tool").applyStyle ({margin: "12px", verticalAlign: "middle", display: "inline-block"});
           _CSS.add (".mui-app>.head>.tool>.btn-drawer").applyStyle ({verticalAlign: "middle", marginLeft: "10x", display: "inline-block"});
           _CSS.add (".mui-app>.head>.tool>.label").applyStyle ({verticalAlign: "middle", display: "inline-block", marginLeft: "10px", fontWeight: 400, color: "rgba(0,0,0,.87)", fontSize: "1.2em"});
           _CSS.add (".mui-app>.middle").applyStyle ({position: "relative", display: "flex", width: "100%", minHeight: "165px", marginTop: 0, top: 0, left: 0, right: 0});
           _CSS.add (".mui-app>.middle>.content").applyStyle ({width: "100%", overflow: "auto"});
           _CSS.add (".mui-app>.footer").applyStyle ({display: "block", width: "100%", minHeight: "55px", bottom: 0, left: 0, right: 0});
        }
        var th1s = mkNode ("div").$ ({head: null, middle: null, footer: null, tool: null, main: null, label: null, content: null, drawer: null}).classname ("+mui-app");
        for (var i in f) if (f.hasOwnProperty (i)) th1s[i] = f[i];
        th1s.$middle ();
        window.UI.WorkSpace.current ().$ (["appendChild", th1s]);
        return th1s;
    };
    f.$main = function (attribute) {
        /*
         */
        if (/undefined/.test (typeof attribute)) {
            attribute = {};
        }
        if (/undefined/.test (typeof attribute.ico) && /undefined/.test (typeof attribute.toggle)) {
            attribute.ico = "menu";
        }
        if (/null/.test (this.main)) {
            if (/null/.test (this.tool)) {
                this.$tool ();
            }
            var button = this.$buttonDrawer (attribute);
            if (!/null/.test (this.label)) {
                this.tool.$ (["insertAfter", this.label, button]);
            } else this.tool.$ (["appendChild", button]);
        }
        return this;
    },
    f.$createButtonDrawerTool = function (attribute) {
        var button = this.$buttonDrawer (attribute);
        if (/null/.test (this.tool)) {
            this.$tool ();
        }
        this.tool.$ (["appendChild", button]);
        return button;
    },
    f.$createButtonDrawerFooter = function (attribute) {
        var button = this.$buttonDrawer (attribute);
        if (/null/.test (this.footer)) {
            this.$footer ();
        }
        this.footer.$ (["appendChild", button]);
        return button;
    },
    f.$buttonDrawer = function (attribute) {
        /*
        */
        if (/undefined/.test (typeof attribute.ico) && /undefined/.test (typeof attribute.toggle)) {
            throw new Error ("MUI.App.buttonTool: toggle or ico - param is undefined");
        }
        if (!/undefined/.test (typeof attribute.ico) && !/undefined/.test (typeof attribute.toggle)) {
            throw new Error ("MUI.App.buttonTool: toggle and ico - cannot be declared together");
        }
        if (/undefined/.test (typeof attribute.position)) {
            attribute.position = "left";
        }
        if (/undefined/.test (typeof attribute.content)) {
            attribute.content = null;
        }
        var button;
        !/undefined/.test (typeof attribute.ico) && (button = window.MUI.Ico (attribute.ico));
        !/undefined/.test (typeof attribute.toggle) && (button = window.MUI.Toggle ().label (attribute.toggle));
        button.$ ({showDrawer: false, drawer: null, content: attribute.content, position: attribute.position});
        var th1s = this, action = {
            onClose: function () {
                button.showDrawer = false;
                if (/function/.test (typeof button.active)) {
                    button.active (button.showDrawer);
                }
                if (/function/.test (typeof button.Active)) {
                    button.Active (button.showDrawer);
                }
            },
            onDrawer: function () {
                this.showDrawer = !this.showDrawer;
                this.showDrawer && (
                    this.drawer = th1s.$drawer (button.position, button.content), 
                    this.drawer.close.onClose = action.onClose
                );
                !this.showDrawer && (
                    this.drawer.remove (),
                    this.drawer = null
                );
                if (/function/.test (typeof this.active)) {
                    this.active (this.showDrawer);
                }
                if (/function/.test (typeof this.Active)) {
                    this.Active (this.showDrawer);
                }
            }
        };
        button.$ ({onclick: func (action.onDrawer)}).classname ("+btn-drawer");
        return button;
    },
    f.$label = function (text) {
        if (/null/.test (this.tool)) {
            this.$tool ();
        }
        if (/null/.test (this.label)) {
            this.label = mkNode ("div").classname ("+label");
            if (this.tool.firstChild) {
                this.tool.$ (["insertAfter", this.tool.firstChild, this.label]);
            } else this.tool.$ (["appendChild", this.label]);
        }
        text && this.label.addText (text);
        return this;
    },
    f.$head = function (content) {
        if (/null/.test (this.head)) {
            this.head = mkNode ("div").classname ("+head");
            if (this.firstChild) {
                this.$ (["insertBefore", this.firstChild, this.head]);
            } else this.$ (["appendChild", this.head]);
        }
        if (!/undefined/.test (content)) {
            this.head.empty ().appendChild (content);
        }
        return this;
    },
    f.$tool = function (content) {
        if (/null/.test (this.head)) {
            this.$head ();
        }
        if (/null/.test (this.tool)) {
            this.tool = mkNode ("div").classname ("+tool");
            if (this.head.firstChild) {
                this.$ (["insertBefore", this.head.firstChild, this.tool]);
            } else this.head.$ (["appendChild", this.tool]);
        }
        if (!/undefined/.test (content)) {
            this.tool.empty ().appendChild (content);
        }
        return this;
    },
    f.$middle = function (content) {
        if (/null/.test (this.middle)) {
            this.middle = mkNode ("div").classname ("+middle");
            if (this.firstChild) {
                this.$ (["insertAfter", this.firstChild, this.middle]);
            } else this.$ (["appendChild", this.middle]);
        }
        if (!/undefined/.test (content)) {
            this.middle.empty ().appendChild (content);
        }
        return this;
    },
    f.$content = function (content) {
        if (/null/.test (this.middle)) {
            this.$middle ();
        }
        if (/null/.test (this.content)) {
            this.content = mkNode ("div").classname ("+content");
            if (this.middle.firstChild) {
                this.middle.$ (["insertAfter", this.middle.firstChild, this.content]);
            } else this.middle.$ (["appendChild", this.content]);
        }
        if (!/undefined/.test (content)) {
            this.content.empty ().appendChild (content);
        }
        return this;
    },
    f.$drawer = function (position, content) {
        /*
         * @position: [left, right]
         */
        if (!/left|right/.test (position)) {
            throw new Error ("MUI.App.$drawer.position: Invalid argumenents, possible values [left,right] - " + position);
        }
        if (/null/.test (this.middle)) {
            this.$middle ();
        }
        var drawer = window.MUI.Context ().$ ({position: position}).classname ("+drawer");
        if (/left/.test (position)) {
            if (this.middle.firstChild) {
                this.middle.$ (["insertBefore", this.middle.firstChild, drawer]);
            } else this.middle.$ (["appendChild", drawer]);
        //outside
        } else if (/right/.test (position)) {
            this.middle.$ (["appendChild", drawer]);
        }
        if (!/undefined/.test (typeof content) && !/null/.test (content)) {
            drawer.content (content);
        }
        return drawer.classname ("+" + position);
    },
    f.$footer = function (content) {
        if (/null/.test (this.footer)) {
            this.footer = mkNode ("div").classname ("+footer");
            this.$ (["appendChild", this.footer]);
        }
        if (!/undefined/.test (content)) {
            this.footer.empty ().appendChild (content);
        }
        return this;
    },
    f.$flat = function (background) {
        /*
         */
        if (!_CSS (".mui-app.flat")) {
            _CSS.add (".mui-app.flat").applyStyle ({
                background: background || "#ffffff", border: "1px solid " + (background || "#ffffff"), 
                boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12), 0px 1px 5px 0px rgba(0,0,0,0.2)"
            });
            _CSS.add (".mui-app.flat>.head").applyStyle ({borderBottom: "1px solid #eee"});
            _CSS.add (".mui-app.flat>.footer").applyStyle ({borderTop: "1px solid #eee"});
            _CSS.add (".mui-app.flat>.middle>.drawer.left").applyStyle ({ 
                position: "relative", margin: 0, width: "25%", minWidth: "180px",
                borderWidth: "0 1px 0 0", borderColor: "#eee", top: 0, bottom: 0, left: "-1px"
            });
            _CSS.add (".mui-app.flat>.middle>.drawer.right").applyStyle ({ 
                position: "relative", margin: 0, width: "25%", minWidth: "180px",
                borderWidth: "0 0 0 1px", borderColor: "#eee", top: 0, bottom: 0, right: "-1px"
            });
        }
        this.classname ("+flat");
        return this;
    },
    f.$outline = function (color) {
        /*
         */
        if (!_CSS (".mui-app.outline")) {
            _CSS.add (".mui-app.outline").applyStyle ({background: "none", border: "1px solid " + (color || "#bdbdbd"), boxShadow: "none"});
            _CSS.add (".mui-app.outline>.head").applyStyle ({borderBottom: "1px solid "+ (color || "#bdbdbd")});
            _CSS.add (".mui-app.outline>.footer").applyStyle ({borderTop: "1px solid "+ (color || "#bdbdbd")});
            _CSS.add (".mui-app.outline>.middle>.drawer.left").applyStyle ({
                position: "relative", margin: 0, width: "25%", minWidth: "180px",
                borderWidth: "0 1px 0 0", borderColor: (color || "#bdbdbd"), top: 0, bottom: 0, left: "-1px"
            });
            _CSS.add (".mui-app.outline>.middle>.drawer.right").applyStyle ({
                position: "relative", margin: 0, width: "25%", minWidth: "180px",
                borderWidth: "0 0 0 1px", borderColor: (color || "#bdbdbd"), top: 0, bottom: 0, right: "-1px"
            });
        }
        this.classname ("+outline");
        return this;
    },
    f.$round = function () {
        /*
         */
        if (!_CSS (".mui-app.round")) {
            _CSS.add (".mui-app.round").applyStyle ({borderRadius: "8px"});
            _CSS.add (".mui-app.round>.middle>.drawer.left").applyStyle ({borderBottomLeftRadius: "8px"});
            _CSS.add (".mui-app.round>.middle>.drawer.right").applyStyle ({borderBottomRightRadius: "8px"});
        }
        this.classname ("+round");
        return this;
    };
    return f;
}) ();
