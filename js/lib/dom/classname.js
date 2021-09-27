require.once ("lib/dom/_extend.js", "lib/string/trim.js", "lib/string/escapeRegExp.js") && window.$.addExtension ("*", {classname: function () {
    if (!arguments.length) throw new Error ("HTMLElement.classname(): Empty arguments set!");

    var i = 0, cn;
    if (/^\s*(-|\+)/.test (arguments[0])) {
        for (; i < arguments.length; i++) {
            cn = arguments[i].xtrim ();
            if (!cn) throw new Error ("HTMLElement.classname(): Empty classname on step " + i);
            if (!(cn = cn.match (/^([+-])([a-z][a-z0-9_-]*|\*)/i))) throw new Error ('HTMLElement.classname(): Invalid classname "' + cn + '" on step ' + i);
            if (cn[1] === "-" && cn[2] === "*") this.className = "";
            if (cn[1] === "-") this.className = this.className.replace (new RegExp ("(^|\\s+)" + cn[2].escapeRegExp () + "(\\s+|$)", 'gi'), " ").xtrim ();
            else if (cn[1] === "+") {
                if (this.classname (cn[2])) continue;
                this.className = (this.className + " " + cn[2]).xtrim ();
            } else throw new Error ('HTMLElement.classname(): Invalid action "' + cn + '" (probably rule mixing) on step ' + i);
        }

        return this;
    } else {
        for (; i < arguments.length; i++) {
            cn = arguments[i].xtrim ();
            if (!cn) throw new Error ("HTMLElement.classname(): Empty classname on step " + i);
            if (!(new RegExp ("(^|\\s+)" + cn.escapeRegExp () + "(\\s+|$)", 'gi').test (this.className))) return false;
        }
        return true;
    }
}});