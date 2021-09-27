require.once ("lib/dom/_extend.js", "lib/core/type.js") && window.$.addExtension ("*", {copyStyle: function (o) {
    if (type (o) !== "object" || o.nodeType !== 1 || o.tagName !== o.nodeName) throw new Error ("HTMLElement.copyStyle(): Invalid source node given: " + o);
    for (var i = 1; i < arguments.length; i++) if (o.style[i]) this.style[i] = o.style[i];
    return this;
}});