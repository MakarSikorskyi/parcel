require.once ("lib/core/type.js", "lib/dom/_extend.js") && window.$.addExtension ("*", {addEventHandler: window.addEventHandler = document.addEventHandler = function (f) {
    if (type (f) !== "function") throw new Error ("HTMLElement.addEventHandler(): Invalid callback function!");
    if (arguments.length < 2) throw new Error ("HTMLElement.addEventHandler(): Event type not specified!");

    var th1s = this, _f = function () {f.call (th1s)}, i, ev;
    this._eventHandlers || (this._eventHandlers = {});

    for (i = 1; i < arguments.length; i++) {
        ev = arguments[i];
        if (type (ev) !== "string") throw new Error ("HTMLElement.addEventHandler(): Invalid event type: " + ev);

        if (this.haveEventHandler (f, ev)) throw new Error ('HTMLElement.addEventHandler(): Object "' + this + '" already contains this handler on "' + ev + '" event');

        if (typeof (window.attachEvent) != "undefined") {
            try {
                this.attachEvent ("on" + ev, _f);
                this._eventHandlers[ev] || (this._eventHandlers[ev] = []);
                this._eventHandlers[ev].push ({m: _f, o: f});
                continue;
            } catch (e) {}
        }
        try {
            this.addEventListener (ev, _f, false);
            this._eventHandlers[ev] || (this._eventHandlers[ev] = []);
            this._eventHandlers[ev].push ({m: _f, o: f});
            continue;
        } catch (e) {}
        throw new Error ('HTMLElement.addEventHandler(): Can not set handler for "' + this + '" on event "' + ev + '"');
    }

    return this;
}, removeEventHandler: window.removeEventHandler = document.removeEventHandler = function (f) {
    if (type (f) !== "function") throw new Error ("HTMLElement.removeEventHandler(): Invalid callback function!");
    if (arguments.length < 2) throw new Error ("HTMLElement.removeEventHandler(): Event type not specified!");

    if (!("_eventHandlers" in this)) {
        window.UI.report (2, 'HTMLElement.removeEventHandler(0): No handlers set for "' + this + '" on event "' + ev + '"');
        return this;
    }

    var i, j, ev;

    ev: for (i = 1; i < arguments.length; i++) {
        ev = arguments[i];

        if (type (ev) !== "string") throw new Error ("HTMLElement.removeEventHandler(): Invalid event type: " + ev);

        if (!(ev in this._eventHandlers)) {
            window.UI.report (2, 'HTMLElement.removeEventHandler(1): No handlers set for "' + this + '" on event "' + ev + '"');
            continue;
        }

        for (j = 0; j < this._eventHandlers[ev].length; j++) {
            if (this._eventHandlers[ev][j].o === f) {
                if (typeof (window.attachEvent) != "undefined") {
                    try {
                        this.detachEvent ("on" + ev, this._eventHandlers[ev][j].m);
                        this._eventHandlers[ev].splice (j, 1);
                        continue ev;
                    } catch (e) {}
                }
                try {
                    this.removeEventListener (ev, this._eventHandlers[ev][j].m, false);
                    this._eventHandlers[ev].splice (j, 1);
                    continue ev;
                } catch (e) {}
            }
        }
        window.UI.report (2, 'HTMLElement.removeEventHandler(2): No handlers set for "' + this + '" on event "' + ev + '"');
    }

    return this;
}, haveEventHandler: window.haveEventHandler = document.haveEventHandler = function (f, ev) {
    if (!this._eventHandlers) return false;
    if (!(ev in this._eventHandlers)) return false;
    for (var i = 0; i < this._eventHandlers[ev].length; i++) if (this._eventHandlers[ev][i].o === f) return true;
    return false;
}});