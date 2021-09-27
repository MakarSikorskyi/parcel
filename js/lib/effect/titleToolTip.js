window.titleToolTip || require.once (
    "lib/core/func.js", "lib/core/o2a.js", "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/addText.js", "lib/dom/DOMChange.js", "lib/dom/getPosition.js", "lib/dom/mkNode.js", "lib/dom/empty.js",
    "lib/event/eventHandler.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/window/getSize.js"
) && (window.titleToolTip = (function () {
    var TTBox = mkNode ("div").$ ({id: "ui-box-tooltip"}),
        TTHide = function () {
            TTBox.applyStyle ({display: "none", visibility: "hidden", top: 0, left: 0, width: "auto"}).empty ();
        }, TTShow = function (title) {
            TTHide ();

            var t = this.title || this.getAttribute ("title");
            if (t) {
                title = t;
                this.removeEventHandler (arguments.callee.caller, "mouseover", "focus").addEventHandler (func (TTShow, t), "mouseover", "focus").removeAttribute ("title");
            }

            TTBox.addText.apply (TTBox, title.split ("||")).applyStyle ({display: "block", width: wsz});
            var wsz = window.getSize ().width;
            wsz / 5 < TTBox.offsetWidth && TTBox.applyStyle ({width: wsz / 5 + "px"});
            TTMove ();
        },
        TTMove = function () {
            var wsz = window.getSize (), e = getEvent (true), pos = e.pos, ua = window.navigator.userAgent.toLowerCase();
            if ((/trident/gi).test(ua) || (/msie/gi).test(ua) || /WebKit/gi.test(ua)) {
                e.target.focus();
            }
            if (e.type === "focus") pos = e.target.getPosition ();

            TTBox.applyStyle ({
                left: pos.x - ((wsz.width + document.documentElement.scrollLeft > pos.x + TTBox.offsetWidth + 25) ? -10 : (TTBox.offsetWidth + 10)) + "px",
                top: pos.y - ((wsz.height + document.documentElement.scrollTop > pos.y + TTBox.offsetHeight + 5) ? -10 : (TTBox.offsetHeight + 5)) + "px",
                visibility: "visible"
            });
        };

    document.body.appendChild (TTBox);
    document.addEventHandler (TTHide, "mouseover", "mouseout", "click", "mousedown", "blur", "focus", "keydown");

    document.DOMChange.add (function (e) {
        if (e.target.nodeType !== 1 || /^(option|optgroup)$/i.test (e.target.nodeName)) return;

        var title = e.target.title || e.target.getAttribute ("title");
        if (!title) return;

        $ (e.target).addEventHandler (func (TTShow, title), "mouseover", "focus").addEventHandler (TTHide, "mouseout", "blur", "click").addEventHandler (TTMove, "mousemove").removeAttribute ("title");
    }, "add");

    return true;
}) ());