window.AJAX || require.once ("lib/core/Timer.js", "lib/core/type.js") && (window.AJAX = (function () {
    var queue = [], busy = false,
        process = function () {
            if (busy || queue.length === 0) return;
            var th1s = queue.shift (), i;

            if (type (th1s.timeout) !== "number") throw new Error ("AJAX.process(): Invalid value for timeout!");

            if (!/^function|null$/.test (type (th1s.onBeforeSend))) throw new Error ("AJAX.process(): Invalid onBeforeSend() callback for AJAX request");
            if (th1s.onBeforeSend && !th1s.onBeforeSend (th1s)) {
                process ();
                return;
            }
            busy = true;

            th1s.xhr.open (th1s.method, th1s.url, true);
            if (/^(post|put)$/i.test (th1s.method)) {
                th1s.xhr.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded");
//                    XMLHttpRequest isn't allowed to set these headers, they are being set automatically by the browser.
//                    th1s.xhr.setRequestHeader ("Content-Length", th1s.data ? th1s.data.length : 0);
//                    th1s.xhr.setRequestHeader ("Connection", "close");
                }
            th1s.xhr.setRequestHeader ("X-Requested-With", "XMLHttpRequest");
            for (i in th1s.headers) if (th1s.headers.hasOwnProperty (i)) th1s.xhr.setRequestHeader (i, th1s.headers[i]);
            
            function msieversion () {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf ("MSIE ");
                return (msie > 0) ?  parseInt (ua.substring (msie + 5, ua.indexOf (".", msie))) : 0;
            }

            //if (!th1s.xhr.onload) th1s.xhr.onload = th1s.xhr.onreadystatechange;
            var reslt = func (function (o) {
                switch (o.xhr.readyState) {
                    case 1:
                        if (!/^function|null$/.test (type (o.onLoading))) throw new Error ("AJAX.readystatechange(1): Invalid onLoading() callback for AJAX request");
                        o.onLoading && o.onLoading (o);
                    break;

                    case 2:
                        if (!/^function|null$/.test (type (o.onLoaded))) throw new Error ("AJAX.readystatechange(2): Invalid onLoaded() callback for AJAX request");
                        o.onLoaded && o.onLoaded (o);
                        type (o.timer) === "number" && Timer.kill (o.timer);
                    break;

                    case 3:
                        if (!/^function|null$/.test (type (o.onInteractive))) throw new Error ("AJAX.readystatechange(3): Invalid onInteractive() callback for AJAX request");
                        o.onInteractive && o.onInteractive (o);
                    break;

                    case 4:
                        if (!/^function|null$/.test (type (o.onComplete))) throw new Error ("AJAX.readystatechange(4): Invalid onComplete() callback for AJAX request");
                        o.onComplete && o.onComplete (o);

                        if (o.xhr.status === 200) {
                            if (!/^function|null$/.test (type (o.onSuccess))) throw new Error ("AJAX.readystatechange(4): Invalid onSuccess() callback for AJAX request");
                            o.onSuccess && o.onSuccess (o);
                        } else {
                            if (!/^function|null$/.test (type (o.onError))) throw new Error ("AJAX.readystatechange(4): Invalid onError() callback for AJAX request");
                            o.onError && o.onError (o);
                        }
                        if (!/^function|null$/.test (type (o.onDone))) throw new Error ("AJAX.readystatechange(4): Invalid onDone() callback for AJAX request");
                        o.onDone && o.onDone (o);

                        busy = false;
                        process ();
                    break;
                }
            }, th1s);
            var msie = msieversion ();
            if (msie > 0 && msie < 10) {
                th1s.xhr.onreadystatechange = reslt;
                th1s.xhr.send (th1s.data);
            } else {
                th1s.xhr.send (th1s.data);
                th1s.xhr.onload = reslt;
            }
            if (th1s.timeout) {
                th1s.timer = Timer.timeout (func (function (th1s) {
                    th1s.xhr.abort ();
                    if (!/^function|null$/.test (type (th1s.onTimeout))) throw new Error ("AJAX.process(): Invalid onTimeout() callback for AJAX request");
                    th1s.onTimeout && th1s.onTimeout ();
                    busy = false;
                    process ();
                }, th1s), parseInt (th1s.timeout * 100 / 30));
            }
        },
        f = function () {
            var self = window.AJAX;
            /* Handlers */
            this.onAbort = self.onAbort;
            this.onBeforeSend = self.onBeforeSend;
            this.onComplete = self.onComplete;
            this.onError = self.onError;
            this.onInteractive = self.onInteractive;
            this.onLoaded = self.onLoaded;
            this.onLoading = self.onLoading;
            this.onSuccess = self.onSuccess;
            this.onDone = self.onDone;
            this.onTimeout = self.onTimeout;
            
            this.headers = {};
            this.url = arguments[0] || null;
            this.data = arguments[1] || null;
            this.method = arguments[2] || "GET";
            this.silent = arguments[3] || false;
            this.timeout = arguments[4] || 0;
            this.timer = null;
            this.xhr = new XMLHttpRequest ();

            return this;
        };
    f.prototype.headers = {};
    f.prototype.addHeaders = function () {
        for (var i = 0, j; i < arguments.length; i++) {
            if (type (arguments[i]) !== "object") throw new Error ("AJAX.addHeaders(): Invalid argument (non-object) on step " + i + ": " + arguments[i]);
            for (j in arguments[i]) {
                if (j == "__test__") continue;
                /^undefined|null$/.test (type (arguments[i][j])) && (arguments[i][j] = "");
                if (type (arguments[i][j]) !== "string") throw new Error ("AJAX.addHeaders(): Invalid header on step " + i + ": " + arguments[i][j]);
                this.headers[j] = arguments[i][j];
            }
        }

        return true;
    };
    f.prototype.send = function () {
        if (!/^get|post|put$/i.test (this.method)) throw new Error ("AJAX.send(): Invalid request method: " + this.method);
        if (this.url === null || /^\s*$/.test (this.url)) throw new Error ("AJAX.send(): Invalid (empty) URL");
        if (/^get$/i.test (this.method) && this.data) {
            this.url = (function (url, query) {
                if (/^[^?]+$/.test (url)) return url + "?" + query;
                else if (/(&|\?)$/.test (url)) return url + query;
                else return url + "&" + query;
            }) (this.url, this.data);
            this.data = null;
        }
        queue.push (this);
        process ();
    };
    f.prototype.abort = function () {
        this.xhr.abort ();

        if (!/^function|null$/.test (type (this.onAbort))) throw new Error ("AJAX.abort(): Invalid onAbort() callback for AJAX request");
        if (this.onAbort && !this.onAbort ()) return false;
        if (type (this.timer) === "number") Timer.kill (this.timer);
        busy = false;
        process ();
    };
    f.onAbort = null;
    f.onBeforeSend = null;
    f.onComplete = null;
    f.onError = null;
    f.onInteractive = null;
    f.onLoaded = null;
    f.onLoading = null;
    f.onSuccess = null;
    f.onTimeout = null;
    f.onDone = null;
    return f;
}) ());