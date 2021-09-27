require.once (
    "lib/core/func.js", "lib/core/type.js", "lib/core/Timer.js", "lib/dom/_extend.js", "lib/dom/relations.js", "lib/dom/getOuterSize.js", "lib/dom/getPosition.js", "lib/style/getStyle.js"
) && window.$.addExtension ("*", {
    autoMove: (function () {
        // Controlling moving process
        var run = function (o, to, spd) {
                    // Get current size
                var c = o.getPosition (o.offsetParent), i = o.getMargin (), inc;

                c.x -= i.left;
                c.y -= i.top;

                // Check moving direction
                inc = {x: c.x > to.x ? 1 : c.x < to.x ? -1 : 0, y: c.y > to.y ? 1 : c.y < to.y ? -1 : 0}

                // Recalculate current step sizes
                c = {x: c.x - inc.x * spd.x, y: c.y - inc.y * spd.y};
                // Check if target reached, correct sizes to target values
                if (inc.x === 0 || (inc.x === 1 && c.x < to.x) || (inc.x === -1 && c.x > to.x)) {
                    c.x = to.x;
                }
                if (inc.y === 0 || (inc.y === 1 && c.y < to.y) || (inc.y === -1 && c.y > to.y)) {
                    c.y = to.y;
                }
                // Update sizes
                o.applyStyle ({top: c.y + "px", left: c.x + "px"});
                // Stop moving if target reached
                if (c.x === to.x && c.y == to.y) {
                    stop (o);
                    return;
                }
            },
            // Stop moving, and execute "onAutoMove" handler if set
            stop = function (o) {
                kill (o);
                type (o.onAutoMove) === "function" && o.onAutoMove ("automove");
            },
            // Forcibly kill current moving state
            kill = function (o) {
                type (o.autoMoving) === "number" && Timer.kill (o.autoMoving);
                o.autoMoving = null;
            };

        return function (x, y, spd) {
            if (!this.childOf (document.body) && document.body !== this) {
                throw new Error ("HTMLElement.autoMove(): Element is not inserted into document hierarchy!");
            }
            if (type (x) !== "number" && x !== null && x !== "auto") {
                throw new Error ("HTMLElement.autoMove(): Invalid X position!");
            }
            if (type (y) !== "number" && y !== null && y !== "auto") {
                throw new Error ("HTMLElement.autoMove(): Invalid Y position!")
            }
            if (type (spd) !== "number" || spd < 0 || spd > 100) {
                throw new Error ("HTMLElement.autoMove(): Invalid speed!");
            }

            var c = this.getPosition (this.offsetParent), s;
            kill (this);

            s = this.getStyle ("position");
            if (s.position === "static") {
                throw new Error ("HTMLElement.autoMove(): Invalid object position. Should be one of: relative, absolute or fixed!");
            }

            s = this.getMargin ();
            c.x += s.left;
            c.y += s.top;
            if (x === "auto" || y === "auto") {
                if (x === "auto") {
                    this.style.left = "auto";
                } else {
                    this.tyle.left = x === null ? c.x : x;
                }
                if (y === "auto") {
                    this.style.top = "auto";
                } else {
                    this.style.top = y === null ? c.y : y;
                }

                x = this.getPosition (this.offsetParent);
                y = x.y;
                x = x.x;

                this.style.top = c.y + "px";
                this.style.left = c.x + "px";
            }
            x === null && (x = c.x);
            y === null && (y = c.y);

            if (x === c.x && y === c.y) {
                stop (this);
                return this;
            }

            s = {x: Math.ceil (Math.abs (c.x - x) / 100 * spd), y: Math.ceil (Math.abs (c.y - y) / 100 * spd)};
            this.autoMoving = Timer.interval (func (run, this, {x: x, y: y}, s), 1);

            return this;
        };
    }) ()
});