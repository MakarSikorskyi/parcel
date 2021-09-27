window.getEvent || (window.getEvent = function (cancelBubble) {
    var e, o;
    if (window.__event) {
        e = window.__event;
    } else {
        if (window.event) {
            e = window.event;
            if (!e) throw new Error ("window.getEvent(): Can not get event object!");
            e.cancelBubble = !!cancelBubble;
        } else {
            var a = arguments.callee;
            while (a && (a = a.arguments)) {
                if (a[0] instanceof Event) {
                    e = a[0];
                    break;
                }
                a = a.callee.caller;
            }
            if (!e) throw new Error ("window.getEvent(): Can not get event object!");
            (!!cancelBubble) && e.stopPropagation ();
        }
    }
    switch (e.type) {
        case "message":
            o = {
                event: e,
                type: e.type,
                data: e.data,
                origin: e.origin,
                target: e.target || e.srcElement,
                source: e.source,
                stopBubble: function () {
                    window.event ? (e.cancelBubble = true) : e.stopPropagation ();
                    return this;
                },
                preventDefault: function () {
                    if ("preventDefault" in this.event) this.event.preventDefault ();
                    if ("returnValue" in this.event) this.event.returnValue = false;
                    return this;
                }
            };
        break;
        default:
            o = {
                event: e,
                type: e.type,
                mkey: {alt: e.altKey, shift: e.shiftKey, ctrl: e.ctrlKey},
                keyCode: e.keyCode,
                charCode: e.charCode ? e.charCode : e.keyCode,
                mouseButton: e.button,
                target: e.target || e.srcElement,
                source: e.relatedTarget || e.toElement,
                pos: {
                    x: e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop
                },
                stopBubble: function () {
                    window.event ? (e.cancelBubble = true) : e.stopPropagation ();
                    return this;
                },
                preventDefault: function () {
                    if ("preventDefault" in this.event) this.event.preventDefault ();
                    if ("returnValue" in this.event) this.event.returnValue = false;
                    return this;
                }
            };
        break;
    }
    return o;
});