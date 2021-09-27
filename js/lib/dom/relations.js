require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {
    childOf: function (o, direct) {
        if (type (o) !== "object" || o.nodeType !== 1 || o.tagName !== o.nodeName) throw new Error ('HTMLElement.childOf(): Invalid parent node given: "' + o + '"');
        if (!!direct) return this.parentNode === o;
        else {
            var p = this;
            while ((p = p.parentNode) && p !== o);
            return !!p;
        }
    },
    parentOf: function (o, direct) {
        if (type (o) !== "object" || o.nodeType !== 1 || o.tagName !== o.nodeName) throw new Error ('HTMLElement.parentOf(): Invalid child node given: "' + o + '"');
        if (!!direct) return o.parentNode === this;
        else {
            var p = o;
            while ((p = p.parentNode) && p !== this);
            return !!p;
        }
    }
});