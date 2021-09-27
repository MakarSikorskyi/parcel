require.once ("lib/dom/_extend.js", "lib/core/type.js") && window.$.addExtension ("*", {applyStyle: function () {
    for (var i = 0, j; i < arguments.length; i++) {
        if (type (arguments[i]) !== "object") throw new Error ("HTMLElement.applyStyle(): Invalid style argument " + arguments[i] + ", on step " + i);
        for (j in arguments[i]) {
            if (/(function|object)/.test (type (this.style[j])) || /^([0-9]+|length)$/.test (j) || this.style[j] === null) continue;
            if (type (arguments[i][j]) === "undefined") arguments[i][j] = "";
            if ("documentMode" in document && /^(float|cssFloat)$/.test (j)) this.style.styleFloat = arguments[i][j];
            else if (document && /^(float|cssFloat)$/.test (j)) this.style.cssFloat = arguments[i][j];
            else this.style[j] = arguments[i][j];
        }
    }
    return this;
}});