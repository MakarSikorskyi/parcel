require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {
    getPosition: function (from) {
        var p = this, pos = {x: 0, y: 0};
        // Get offset from parent nodes one by one
        do {
            if (p === from) break;
            pos.x += p.offsetLeft + p.clientLeft - (p.offsetParent ? p.offsetParent.scrollLeft : 0);
            pos.y += p.offsetTop + p.clientTop - (p.offsetParent ? p.offsetParent.scrollTop : 0);
        } while (p = p.offsetParent);

        return pos;
    }
});