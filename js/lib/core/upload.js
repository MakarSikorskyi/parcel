window.upload || require.once (
    "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/addText.js", "lib/dom/mkNode.js", "lib/event/eventHandler.js", "lib/style/applyStyle.js", "lib/core/__uid.js"
) && (window.upload = (function () {
    var f = function () {
            busy++;
            var cf = function () {
                    try {
                        frm.contentWindow.stop ();
                    } catch (e) {
                        frm.contentWindow.document.execCommand ("Stop");
                    }
                    form.parentNode.insertBefore (th1s, form);
                    form.parentNode.removeChild (form);

                    document.body.removeChild (frm);
                },
                th1s = this, id = "f" + __uid (), frm = mkNode ("iframe").$ (["setAttribute", {name: id, id: id, onload: "type (this.on1oad) === 'function' && this.on1oad ();"}]).applyStyle ({width: 0, height: 0, border: "0 none"}),
                form = mkNode ("form").$ ({target: id, method: "post", enctype: "multipart/form-data", encoding: "multipart/form-data", action: sapi ("URL_LIB") + "ul.php?k=" + sapi ("req", "hash")}).applyStyle ({
                    position: "relative", display: "inline-block", verticalAlign: "bottom"
                }), ldr = mkNode ("span").applyStyle ({
                    position: "absolute", top: "4px", left: "4px", bottom: "4px", right: "4px", zIndex: 2, background: "#fff no-repeat center center url('" + sapi ("URL_IMG") + "loading.gif')", cursor: "pointer"
                }).$ ({"title": "Натисніть, щоб скасувати завантаження", onclick: function () {
                    cf ();
                    type (th1s.onAbort) === "function" && th1s.onAbort (--busy);
                }});
            
            this.abort = function () {
                cf ();
                type (th1s.onAbort) === "function" && th1s.onAbort (--busy);
            }

            if (this.__texture__) this.__texture__.parentNode.insertBefore (form, this.__texture__);
            else this.parentNode.insertBefore (form, this);
            form.$ (["appendChild", this, ldr]);
            document.body.appendChild (frm);

            frm.on1oad = function () {
                var r = frm.contentWindow.upload;
                if (r.status) type (th1s.onUploaded) === "function" && th1s.onUploaded (--busy, r.file);
                else type (th1s.onFail) === "function" && th1s.onFail (--busy, r.error);
                cf ();
            };

            type (this.onUpload) === "function" && this.onUpload (busy);
            form.submit ();
        },
        busy = 0;

    document.DOMChange.add (function (e) {
        var el = e.target;
        if (el.nodeType !== 1 || !/^input$/i.test (el.nodeName) || !/^file$/i.test (el.type)) return;

        el.haveEventHandler (f, "change") || el.addEventHandler (f, "change");
    }, "add");

    return true;
}) ());