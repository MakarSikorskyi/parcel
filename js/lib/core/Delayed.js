window.Delayed || require.once ("lib/core/Timer.js") && (window.Delayed = (function () {
    var o = function (f, t, cancelBubble) {
        var self = window.Delayed;
        this.onStart = self.onStart;
        this.onComplete = self.onComplete;
        this.timer = null;
        this.f = f;
        this.t = t;
        this.stop = false;
        this.cancelBubble = cancelBubble;
    };
    o.prototype.stop = function () {
        self.stop = true;
    };
    o.prototype.callback = function () {
        this.f ();
        if (!/^function|null$/.test (type (this.onComplete))) throw new Error ("delayed(): Invalid onComplete() callback attached");
        this.onComplete && this.onComplete ();
        delete window.__event;
    };
    o.prototype.launch = function () {
        if (!/^function$/.test (type (this.f))) throw new Error ("delayed.launch(): Invalid callback function: " + this.f);
        if (type (this.t) !== "number") throw new Error ("delayed.launch(): Invalid timer: " + this.t);
        if (this.timer) {
            Timer.kill (this.timer);
            this.timer = null;
            delete window.__event;
        }
        window.__event = window.getEvent (this.cancelBubble);
        if (!/^function|null$/.test (type (this.onStart))) throw new Error ("delayed.launch(): Invalid onStart() callback attached");
        this.onStart && this.onStart ();
        this.stop === false && (this.timer = Timer.timeout (this.callback.bind (this), this.t));
    };
    o.onStart = null;
    o.onComplete = null;
    return o;
}) ());