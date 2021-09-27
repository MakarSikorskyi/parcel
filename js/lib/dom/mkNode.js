window.mkNode || require.once ("lib/dom/_batch.js", "lib/dom/_extend.js", "lib/style/applyStyle.js") && (window.mkNode = (function () {
    var f = {
        disabled: function () {
            if (arguments.length) {
                this.disabled = !!arguments[0];
                type (this.onDisabled) === "function" && this.onDisabled ();
                return this;
            }
            return this.disabled;
        },
        value: function () {
            if (/^select$/i.test (this.nodeName) && /select-multiple/i.test (this.type)) {
                var opt = [], i;
                if (arguments.length) {
                    (arguments[0] === null || arguments[0] === undefined) && (arguments[0] = "");
                    for (i = 0; i < this.options.length; i++) {
                        this.options[i].selected = false;
                        if (type (arguments[0]) === "array") {
                            if (arguments[0].indexOf (this.options[i].value) !== -1) this.options[i].selected = true;
                        } else {
                            if (arguments[0] === this.options[i].value) this.options[i].selected = true;
                        }
                    }
                    type (this.onValue) === "function" && this.onValue ();
                    return this;
                }
                for (i = 0; i < this.options.length; i++) {
                    if (this.options[i].selected) {
                        opt.push (this.options[i].value);
                    }
                }
                return opt;
            }
            if (arguments.length) {
                (arguments[0] === null || arguments[0] === undefined) && (arguments[0] = "");
                // TODO:: добавлять атрибут value при изменении свойства value в INPUT / TEXTAREA после чего будет работать корректно проверка ниже
                // if (this.value === undefined || !this.hasAttribute('value') || this.getAttribute('value') != arguments[0]) {
                    this.value = arguments[0];
                    this.setAttribute('value', this.value);
                    type (this.onValue) === "function" && this.onValue ();
                // }
                return this;
            }
            return this.value;
        },
        readonly: function () {
            if (!/^(textarea|text|password)$/i.test (this.type)) throw new Error ('Trying to get/set "readOnly" property on unsupported element type: "' + this.type + '". Read-only supported only by text/password/textarea fields!');
            if (arguments.length) {
                this.readOnly = !!arguments[0];
                type (this.onReadOnly) === "function" && this.onReadOnly ();
                return this;
            }
            return this.readOnly;
        },
        checked: function () {
            if (!/^(checkbox|radio)$/i.test (this.type)) throw new Error ('Trying to get/set "checked" property on unsupported element type: "' + this.type + '". Checking supported only by checkbox/radio elements!');
            if (arguments.length) {
                this.checked = !!arguments[0];
                type (this.onChecked) === "function" && this.onChecked ();
                return this;
            }
            return this.checked;
        },
        selected: function () {
            if (!/^option$/i.test (this.nodeName)) throw new Error ('Trying to get/set "selected" property on non-option element: "' + this.nodeName + '"!');
            if (arguments.length) {
                this.selected = !!arguments[0];
                type (this.onSelected) === "function" && this.onSelected ();
                return this;
            }
            return this.selected;
        }
    }

    return function (nodeName) {
        if (/^br$/i.test (nodeName)) return document.createElement ("br");
        else if (/^button$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "button", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^radio$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "radio", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^range$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "range", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^checkbox$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "checkbox", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^password$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "password", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^text$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "text", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^submit$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "submit", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^hidden/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "hidden", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^reset$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "reset", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^file$/i.test (nodeName)) return $ (document.createElement ("input")).$ ({type: "file", Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^textarea/i.test (nodeName)) return $ (document.createElement (nodeName)).$ ({Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked});
        else if (/^input/i.test (nodeName)) return $ (document.createElement (nodeName)).$ ({Disabled: f.disabled, Value: f.value, ReadOnly: f.readonly, Checked: f.checked, autocomplete: "off"});
        else if (/^select$/i.test (nodeName)) return $ (document.createElement ("select")).$ ({Disabled: f.disabled, Value: f.value});
        else if (/^option$/i.test (nodeName)) return $ (document.createElement (nodeName)).$ ({Disabled: f.disabled, Value: f.value, Selected: f.selected});
        else if (/^optgroup/i.test (nodeName)) return $ (document.createElement (nodeName)).$ ({Disabled: f.disabled});
        else return $ (document.createElement (nodeName));
    }
}) ());