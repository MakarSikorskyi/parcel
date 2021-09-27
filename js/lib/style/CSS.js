window._CSS || require.once (
    "lib/core/type.js", "lib/string/escapeRegExp.js", "lib/style/CSS.applyStyle.js", "lib/style/CSS.copyStyle.js", "lib/style/CSS.getStyle.js", "lib/style/CSS.opacity.js"
) && (window._CSS = (function () {
    var css, rules = {}, cr = 0, i, j, k,
        f = function (rule) {
            for (var i in rules) if (new RegExp (new String (rule).escapeRegExp (), "i").test (rules[i].selectorText)) return rules[i];
            return false;
        };
    f.add = function (rule, si) {
        if (type (si) === "undefined") {
            si = 0;
            if (!(css[si] instanceof CSSStyleSheet)) {
                var style = mkNode ("style");
                // WebKit hack
                style.addText ("");
                document.head.appendChild (style);
                css[si] = style.sheet;
            }
        }
        if (type (css[si].insertRule) === "function") {
            var i = css[si].insertRule (rule + " {}", css[si].cssRules.length);
            return rules[cr++] = css[si].cssRules[i];
        }
    };
    /*bugged*/
    f.remove = function (rule, si) {
        var i, j, k, idx;
        for (i = 0; i < css.length; i++) if (css[i] instanceof CSSStyleSheet) for (j in css[i]) if (type (css[i][j]) === "object" && css[i][j] instanceof CSSRuleList)
            for (k = 0; k < css[i][j].length; k++)
                if (type (css[i][j][k]) === "object" && css[i][j][k] instanceof CSSStyleRule && new RegExp (new String (rule).escapeRegExp (), "i").test (css[i][j][k].selectorText)) idx = k;
        
        if (type (si) === "undefined") {
            si = 0;
            if (!(css[si] instanceof CSSStyleSheet)) return false;
        }
        if (type (css[si].deleteRule) === "function") {
            css[si].deleteRule (idx);
            return true;
        }
        return false;
    };
    
    if (document.styleSheets instanceof StyleSheetList) {
        css = document.styleSheets;
        for (i = 0; i < css.length; i++) if (css[i] instanceof CSSStyleSheet) for (j in css[i]) if (type (css[i][j]) === "object" && css[i][j] instanceof CSSRuleList)
            for (k = 0; k < css[i][j].length; k++) if (type (css[i][j][k]) === "object" && css[i][j][k] instanceof CSSStyleRule) rules[cr++] = css[i][j][k];
    }
    
    return f;
}) ());