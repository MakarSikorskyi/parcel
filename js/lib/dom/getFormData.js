require.once ("lib/dom/_extend.js") && window.$.addExtension ("form", {
    getFormData: function (include_disabled) {
        var data = [], el, i;

        for (i = 0; i < this.elements.length; i++) {
            el = this.elements[i];

            if (!include_disabled && (el.disabled || /^$/.test (el.name))) continue;

            switch (el.type) {
                case "textarea": case "text": case "range": case "password": case "hidden": data.push (el.name + "=" + encodeURIComponent (el.value)); break;
                case "checkbox": case "radio": el.checked && data.push (el.name + "=" + encodeURIComponent (el.value)); break;
                case "select-one": el.selectedIndex !== -1 && data.push (el.name + "=" + encodeURIComponent (el.options[el.selectedIndex].value)); break;
                case "select-multiple": for (var j = 0; j < el.options.length; j++) el.options[j].selected && data.push (el.name + "=" + encodeURIComponent (el.options[j].value)); break;
            }
        }

        return data;
    },
    validateForm: function (include_disabled) {
        var el, i, valid, check = false;

        for (i = this.elements.length - 1; i >= 0; i--) {
            el = this.elements[i];

            if (!include_disabled && (el.disabled || /^$/.test (el.name))) continue;

            switch (el.type) {
                case "textarea": case "text": case "password": case "hidden": 
                    if( el.material && el.valid )  {
                        valid = el.onValid(true); 
                        if(valid != 0) check = true;
                    }
                break;
            }
        }
        if(check) return false;
        return true;
    }
});