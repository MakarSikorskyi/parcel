(window._Prototype || (window._Prototype = {__wrapper__: true})) &&
(window._Prototype.cloneNode || require.once ("lib/dom/_batch.js", "lib/dom/_extend.js", "lib/style/applyStyle.js") && (window._Prototype.cloneNode = Node.prototype.cloneNode) && (Node.prototype.cloneNode = (function () {
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
            if (arguments.length) {
                (arguments[0] === null || arguments[0] === undefined) && (arguments[0] = "");
                this.value = arguments[0];
                type (this.onValue) === "function" && this.onValue ();
                return this;
            }

            return this.value;
        },
        readonly: function () {
            if (!/^(textarea|text|password)$/i.test (this.type)) {
                throw new Error ('Trying to get/set "readOnly" property on unsupported element type: "' + this.type + '". Read-only supported only by text/password/textarea fields!');
            }
            if (arguments.length) {
                this.readOnly = !!arguments[0];
                type (this.onReadOnly) === "function" && this.onReadOnly ();
                return this;
            }

            return this.readOnly;
        },
        checked: function () {
            if (!/^(checkbox|radio)$/i.test (this.type)) {
                throw new Error ('Trying to get/set "checked" property on unsupported element type: "' + this.type + '". Checking supported only by checkbox/radio elements!');
            }
            if (arguments.length) {
                this.checked = !!arguments[0];
                type (this.onChecked) === "function" && this.onChecked ();
                return this;
            }

            return this.checked;
        },
        selected: function () {
            if (!/^option$/i.test (this.nodeName)) {
                throw new Error ('Trying to get/set "selected" property on non-option element: "' + this.nodeName + '"!');
            }
            if (arguments.length) {
                this.selected = !!arguments[0];
                type (this.onSelected) === "function" && this.onSelected ();
                return this;
            }

            return this.selected;
        }
    }
    
    return function () {
        var o = window._Prototype.cloneNode.apply (this, Array.prototype.slice.call (arguments, 0));
        if (/^br$/i.test (o.nodeName)) {
            return o;
        } else if (/^button$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "button", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^radio$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "radio", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^checkbox$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "checkbox", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^password$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "password", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^text$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "text", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^submit$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "submit", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^hidden/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "hidden", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^reset$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "reset", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^file$/i.test (o.nodeName)) {
            return $ (o).$ ({"type": "file", "Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^textarea/i.test (o.nodeName)) {
            return $ (o).$ ({"Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked});
        } else if (/^input/i.test (o.nodeName)) {
            return $ (o).$ ({"Disabled": f.disabled, "Value": f.value, "ReadOnly": f.readonly, "Checked": f.checked, "autocomplete": "off"});
        } else if (/^select$/i.test (o.nodeName)) {
            return $ (o).$ ({"Disabled": f.disabled, "Value": f.value});
        } else if (/^option$/i.test (o.nodeName)) {
            return $ (o).$ ({"Disabled": f.disabled, "Value": f.value, "Selected": f.selected});
        } else if (/^optgroup/i.test (o.nodeName)) {
            return $ (o).$ ({"Disabled": f.disabled});
        } else if (/^span$/i.test (o.nodeName)) {
            return o;
        } else {
            return $(document.createElement (o.nodeName));
        }
    }
}) ()))

