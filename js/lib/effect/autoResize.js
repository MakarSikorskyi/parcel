require.once ("lib/core/func.js", "lib/core/type.js", "lib/core/Timer.js", "lib/dom/_extend.js", "lib/dom/relations.js", "lib/dom/getInnerSize.js") && window.$.addExtension ("*", {
    autoResize: (function () {
        // Controlling resizing process
        var run = function (o, to, spd) {
                    // Get current size
                var c = o.getInnerSize (),
                    // Check resizing direction (stretching)
                    inc = {x: c.width > to.width ? 1 : c.width < to.width ? -1 : 0, y: c.height > to.height ? 1 : c.height < to.height ? -1 : 0};

                // Recalculate current step sizes
                c = {width: c.width - inc.x * spd.x, height: c.height - inc.y * spd.y};
                // Check if target reached, correct sizes to target values
                if (inc.x === 0 || (inc.x === 1 && c.width < to.width) || (inc.x === -1 && c.width > to.width)) {
                    c.width = to.width;
                }
                if (inc.y === 0 || (inc.y === 1 && c.height < to.height) || (inc.y === -1 && c.height > to.height)) {
                    c.height = to.height;
                }
                // Update sizes
                o.applyStyle ({width: c.width + "px", height: c.height + "px"});
                // Stop resizing if target reached
                if (c.width === to.width && c.height == to.height) {
                    stop (o);
                    return;
                }
            },
            // Stop resizing, and execute "onAutoResize" handler if set
            stop = function (o) {
                kill (o);
                type (o.onAutoResize) === "function" && o.onAutoResize ("autoresize");
            },
            // Forcibly kill current resizing state
            kill = function (o) {
                type (o.autoResizing) === "number" && Timer.kill (o.autoResizing);
                o.autoResizing = null;
            };

        return function (w, h, spd) {
            if (!this.childOf (document.body) && this !== document.body) {
                throw new Error ("HTMLElement.autoResize(): Element is not inserted into document hierarchy!");
            }
            if (type (w) !== "number" && w !== null && w !== "auto") {
                throw new Error ("HTMLElement.autoResize(): Invalid width argument!");
            }
            if (type (h) !== "number" && h !== null && h !== "auto") {
                throw new Error ("HTMLElement.autoResize(): Invalid height argument!");
            }
            if (type (spd) !== "number" || spd < 0 || spd > 100) {
                throw new Error ("HTMLElement.autoResize(): Invalid speed!");
            }
            var c = this.getInnerSize (), s;
            arguments.callee.kill = kill;
            // Stop resizing procedure if any currently running
            kill (this);
            // Auto size calculations
            if (w === "auto" || h === "auto") {
                if (w === "auto") {
                    this.style.width = "auto";
                } else {
                    this.style.width = (w === null ? c.width : w) + "px";
                }
                if (h === "auto") {
                    this.style.height = "auto";
                } else {
                    this.style.height = (h === null ? c.height : h) + "px";
                }

                w = this.getInnerSize ();
                h = w.height;
                w = w.width;

                this.style.width = c.width + "px";
                this.style.height = c.height + "px";
            }
            // Checking target sizes
            w === null && (w = c.width);
            h === null && (h = c.height);
            // Do nothing, if target and source sizes are equal
            if (w === c.width && h === c.height) {
                stop (this);
                return this;
            }
            // Calculate resizing speed
            s = {x: Math.ceil (Math.abs (c.width - w) / 100 * spd), y: Math.ceil (Math.abs (c.height - h) / 100 * spd)};
            // Start resizing timer
            this.autoResizing = Timer.interval (func (run, this, {width: w, height: h}, s), 1);

            return this;
        }
    }) ()
});