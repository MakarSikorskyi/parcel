require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {applyEvent: document.applyEvent = function (event) {
    // IE model
    if ("fireEvent" in this) this.fireEvent ("on" + event);
    // DOM model
    else {
        try {
            var ev = document.createEvent("HTMLEvents");
            ev.initEvent(event, false, true);
            this.dispatchEvent(ev);
        } catch (e){}
    }

    return this;
}});