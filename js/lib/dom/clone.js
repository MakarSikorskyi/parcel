require.once ("lib/dom/_batch.js", "lib/dom/_extend.js", "lib/style/applyStyle.js", "lib/style/copyStyle.js", "lib/dom/mkNode.js", "lib/ui/castType.js") && window.$.addExtension ("*", {clone: function (deep) {
    if ("documentMode" in document) return $ (this.cloneNode (deep));
    
    if (typeof deep === "undefined") deep = false;
    var node = mkNode (this.nodeName).applyStyle (this.style), child;
    try {
        for (var j in this.attributes) {
            if (typeof this.attributes[j].nodeName === "undefined" || this.attributes[j].nodeName === "style") continue;
            node.setAttribute (this.attributes[j].nodeName, this.attributes[j].nodeValue);
        }
    } catch (e) {
        throw new Error ('HTMLElement.$(): Can not set property: "' + j + '" to "' + this.attributes[j] + ', error: ' + e.message);
    }
    if (this.__castType__) node.castType (this.__castType__[0], this.__castType__[1]);
    if (this.childNodes && this.childNodes.length > 0 && deep === true) {
        for (var i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] instanceof Text) node.addText (this.childNodes[i].nodeValue);
            else {
                child = this.childNodes[i].clone (deep);
                node.appendChild (child);
            }
        }
    }

    return node;
}})

