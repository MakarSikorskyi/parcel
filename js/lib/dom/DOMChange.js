document.DOMChange || require.once ("lib/core/type.js") && (document.DOMChange = (function () {
    var ce = document.createElement, cdf = document.createDocumentFragment, cb = {add: [], remove: []},
        applyEvent = function (add, data) {
            add = add ? "add" : "remove";

            for (var i = 0; i < cb[add].length; i++) cb[add][i] (data);
        },
        prepare = function (o) {
            var f = {
                appendChild: o.appendChild,
                insertBefore: o.insertBefore,
                removeChild: o.removeChild,
                replaceChild: o.replaceChild,
                cloneNode: o.cloneNode
            };

            o.appendChild = function (node) {
                var rm = false, pn = node.parentNode, r;

                pn && pn.nodeType === 1 && (rm = true);
                r = f.appendChild.call (this, node);

                rm && applyEvent (false, {type: "appendchild", target: node, src: pn});
                applyEvent (true, {type: "appendchild", target: node, src: o});

                return r;
            };

            o.insertBefore = function (newNode, srcNode) {
                var rm = false, pn = newNode.parentNode, r;

                pn && pn.nodeType === 1 && (rm = true);
                r = f.insertBefore.call (this, newNode, srcNode);

                rm && applyEvent (false, {type: "insertbefore", target: newNode, src: pn});
                applyEvent (true, {type: "insertbefore", target: newNode, src: o});

                return r;
            };

            o.removeChild = function (node) {
                var r;
                r = f.removeChild.call (this, node);
                applyEvent (false, {type: "removechild", target: node, src: o});
                return r;
            };

            o.replaceChild = function (newNode, srcNode) {
                var rm = false, pn = newNode.parentNode, r;

                pn && pn.nodeType === 1 && (rm = true);
                r = f.replaceChild.call (this, newNode, srcNode);
                rm && applyEvent (false, {type: "replacechild", target: newNode, src: pn});
                applyEvent (false, {type: "replacechild", target: srcNode, src: o});
                applyEvent (true, {type: "replacechild", target: newNode, src: o});

                return r;
            };

            o.cloneNode = function (deep) {
                return $ (prepare (f.cloneNode.call (this, deep)));
            };

            return o;
        };

    document.createElement = function (nodeName) {
        return prepare (ce.call (this, nodeName));
    };
    
    document.createDocumentFragment = function (){
        return prepare (cdf.call (this));
    };

    prepare (document.body);

    return {
        add: function (f, ev) {
            if (!/^(add|remove)$/i.test (ev)) throw new Error ('document.DOMChange.add(): invalid event type: "' + ev + '", should be one of "add" or "remove"');
            if (type (f) !== "function") throw new Error ('document.DOMChange.add(): invalid handler "' + f + '" for "' + ev + '" event');

            for (var i = 0; i < cb[ev].length; i++) if (cb[ev][i] === f) {
                throw new Error ('document.DOMChange.add(): "' + ev + '" already has "' + f + '" handler');
            }

            cb[ev].push (f);
            return true;
        },
        remove: function (f, ev) {
            if (!/^(add|remove)$/i.test (ev)) throw new Error ('document.DOMChange.remove(): Invalid event: "' + ev + '", should be one of "add" or "remove"');
            if (type (f) !== "function") throw new Error ('document.DOMChange.remove(): Invalid handler "' + f + '" for "' + ev + '" event');

            for (var i = 0; i < cb[ev].length; i++) if (cb[ev][i] === f) {
                cb[ev].splice (i, 1);
                return true;
            }

            throw new Error ('document.DOMChange.remove(): handler "' + f + '" is not attached to "' + ev + '" event');
        }
    }
}) ());