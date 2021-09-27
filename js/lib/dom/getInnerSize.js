require.once ("lib/dom/_extend.js", "lib/dom/getOuterSize.js", "lib/dom/relations.js") && window.$.addExtension ("*", {
    getInnerSize: function () {
        if (!this.childOf (document.body) && this !== document.body) throw new Error ("HTMLElement.getInnerSize(): Element is not inserted into document hierarchy!");

        var padding = this.getPadding (),
            border = this.getBorderSize (),
            size = {
                width: this.offsetWidth - padding.left - padding.right - border.left - border.right,
                height: this.offsetHeight - padding.top - padding.bottom - border.top - border.bottom
            };

        size.width < 0 && (size.width = 0);
        size.height < 0 && (size.height = 0);

        return size;
    }
});