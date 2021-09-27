require.once ("lib/dom/_extend.js", "lib/core/type.js") && window.$.addExtension ("*", {addText: function () {
    for (var i = 0; i < arguments.length; i++) {
        if (!/^(string|number)$/.test (type (arguments[i]))) this.appendChild (document.createTextNode (" "))
        else this.appendChild (document.createTextNode (arguments[i]));
        this.appendChild (document.createElement ("br"));
    }
    i > 0 && this.removeChild (this.lastChild);

    return this;
}});