require.once ("lib/core/func.js", "lib/core/Timer.js", "lib/core/type.js", "lib/dom/_extend.js", "lib/dom/relations.js", "lib/style/opacity.js") && window.$.addExtension ("*", {
    fade: (function () {
        // This function is controlling fading process
        var run = function (o, to, step) {
                    // Get current opacity
                var cop = o.opacity (),
                    // Check if we fade IN or OUT
                    inc = cop > to ? 1 : cop < to ? -1 : 0;
                // Calculate current step opacity
                cop -= inc * step;
                // Check if fading done
                if (inc === 0 || inc === 1 && cop < to || inc === -1 && cop > to) {
                    // Set opacity to target value
                    o.opacity (to);
                    // Stop execution
                    stop (o);
                } else {
                    // Set opacity calculated in current step
                    o.opacity (cop);
                }
            },
            // This function will be executed when fade will be done. Remove fading timer and execute "onFade" event
            stop = function (o) {
                kill (o);
                type (o.onFade) === "function" && o.onFade ("fade");
            },
            // This function forcibly stop fading effect without executing "onFade"
            kill = function (o) {
                type (o.fading) === "number" && Timer.kill (o.fading);
                o.fading = null;
            };

        return function (op, spd) {
            // If fading is already in progress, we need forcibly stop it
            kill (this);
            if (!this.childOf (document.body) && this !== document.body) {
                throw new Error ("HTMLElement.fade(): Element is not inserted into document hierarchy!");
            }
            if (type (op) !== "number" || op < 0 || op > 1) {
                throw new Error ("HTMLElement.fade(): Invalid opacity!");
            }
            if (type (spd) === "number" && (type (spd) < 0 || type (spd) > 100)) {
                throw new Error ("HTMLElement.autoResize(): Invalid speed!");
            }
            var cop, step;
            // This function forcibly stop fading effect without executing "onFade"
            arguments.callee.kill = kill;
            // Checking for proper fading speed
            type (spd) !== "number" && (spd = 10);
            // Trim extra digits after period
            op = op.toFixed (2);
            // Getting current opacity
            cop = this.opacity ();
            // If target and current opacity are same, do nothing, just execute "onFade" if given
            if (cop === op) {
                stop (this);
                return this;
            }
            // Calculate opacity changing speed
            step = Math.abs (cop - op) / 100 * spd;
            step < 0.01 && (step = 0.01);
            step > 1 && (step = 1.00);
            // Start fading interval
            this.fading = Timer.interval (func (run, this, op, step), 1);

            return this;
        }
    }) ()
});