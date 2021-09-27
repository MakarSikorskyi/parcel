require.once ("lib/core/type.js", "lib/dom/_extend.js") && window.$.addExtension ("*", {insertAfter: function (ref, after) {
    if (after.parentNode !== this || type (after) !== "object" || after.nodeType !== 1 || after.tagName !== after.nodeName) throw new Error ("HTMLElement.insertAfter (): Invalid `after` node! Failed to insert object!");
    if (type (ref) !== "object" || ref.nodeType !== 1 || ref.tagName !== ref.nodeName) throw new Error ("HTMLElement.insertAfter(): Invalid reference node given: " + ref);

    if (after.nextSibling) this.insertBefore (ref, after.nextSibling);
    else this.appendChild (ref);

    return ref;
}});