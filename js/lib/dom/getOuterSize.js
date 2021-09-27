require.once ("lib/dom/_extend.js", "lib/style/getStyle.js") && window.$.addExtension ("*", {
    getPadding: function () {
        var s = this.getStyle ("paddingTop", "paddingBottom", "paddingRight", "paddingLeft");
        s = {
            left: s.paddingLeft ? Math.ceil (parseFloat (s.paddingLeft)) : 0,
            right: s.paddingRight ? Math.ceil (parseFloat (s.paddingRight)) : 0,
            bottom: s.paddingBottom ? Math.ceil (parseFloat (s.paddingBottom)) : 0,
            top: s.paddingTop ? Math.ceil (parseFloat (s.paddingTop)) : 0
        };

        return {
            left: isNaN (s.left) ? 0 : s.left,
            right: isNaN (s.right) ? 0 : s.right,
            bottom: isNaN (s.bottom) ? 0 : s.bottom,
            top: isNaN (s.top) ? 0 : s.top
        }
    },

    getMargin: function () {
        var s = this.getStyle ("marginTop", "marginBottom", "marginRight", "marginLeft");
        s = {
            left: s.marginLeft ? Math.ceil (parseFloat (s.marginLeft)) : 0,
            right: s.marginRight ? Math.ceil (parseFloat (s.marginRight)) : 0,
            bottom: s.marginBottom ? Math.ceil (parseFloat (s.marginBottom)) : 0,
            top: s.marginTop ? Math.ceil (parseFloat (s.marginTop)) : 0
        };

        return {
            left: isNaN (s.left) ? 0 : s.left,
            right: isNaN (s.right) ? 0 : s.right,
            bottom: isNaN (s.bottom) ? 0 : s.bottom,
            top: isNaN (s.top) ? 0 : s.top
        }
    },
    getBorderSize: function () {
        var s = this.getStyle ("borderTopWidth", "borderBottomWidth", "borderRightWidth", "borderLeftWidth");
        s = {
            left: s.borderLeftWidth ? Math.ceil (parseFloat (s.borderLeftWidth)) : 0,
            right: s.borderRightWidth ? Math.ceil (parseFloat (s.borderRightWidth)) : 0,
            bottom: s.borderBottomWidth ? Math.ceil (parseFloat (s.borderBottomWidth)) : 0,
            top: s.borderTopWidth ? Math.ceil (parseFloat (s.borderTopWidth)) : 0
        };

        return {
            left: isNaN (s.left) ? 0 : s.left,
            right: isNaN (s.right) ? 0 : s.right,
            bottom: isNaN (s.bottom) ? 0 : s.bottom,
            top: isNaN (s.top) ? 0 : s.top
        }
    }
});