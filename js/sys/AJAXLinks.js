window.AJAXLinks || require.once ("lib/core/type.js", "lib/dom/DOMChange.js", "lib/event/eventHandler.js", "lib/event/getEvent.js", "sys/goTo.js") && (window.AJAXLinks = (function () {
    var handle = function () {
        if (type (this.onclick) === "function" || /^(javascript:|mailto:|\s*$|#$)/i.test (this.getAttribute ("href"))) return;

        getEvent (false).preventDefault ();

        var href = this.getAttribute ("href").replace (/^#/, "");
        if (this.rel === "external") window.open (href);
        else (goTo (href)) ();
    };

    document.DOMChange.add (function (e) {
        if (e.target.nodeType !== 1 || !/^a$/i.test (e.target.nodeName) || $(e.target).haveEventHandler (handle, "click") || !e.target.hasAttribute ("href")) return;

        var href = e.target.getAttribute ("href");
        e.target.addEventHandler (handle, "click").$ ({href: (/^(javascript:|#|mailto:)/.test (href) ? href : "#" + href)});
    }, "add");

    return {};
}) ());