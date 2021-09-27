CSSStyleRule.prototype.copyStyle || (CSSStyleRule.prototype.copyStyle = function (o) {
    if (type (o) !== "object" || !(o instanceof CSSStyleRule)) throw new Error ("CSSStyleRule.copyStyle(): Invalid source rule given: " + o);
    for (var i = 1; i < arguments.length; i++) if (o.style[i]) this.style[i] = o.style[i];
    return this;
})