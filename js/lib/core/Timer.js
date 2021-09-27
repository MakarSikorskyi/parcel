window.Timer || require.once ("lib/core/type.js"/*@cc_on, "lib/core/timeout.js"@*/) && (window.Timer = (function () {
    // List of actions/timers
    var data = {iterator: 0, processing: 0},
        // Single timer to run actions
        timer = null,
        /**
         * This function running all actions one by one and restarting timer if there are any functions what should be run again.
         */
        run = function () {
            var i;
            data.processing = 0;
            // Running throught all timers
            for (i in data) {
                if (data[i] === data.iterator || !data.hasOwnProperty (i)) continue;
                // If timer remove flag is set, delete it
                if (data[i].rm) {
                    delete data[i];
                    continue;
                }
                // If current timing step, is target step to run ...
                if (++data[i].cStep % data[i].step === 0) {
                    // ... execute timer associated function
                    data[i].func ();
                    // If current timer is "timeout" - remove it
                    if (data[i].once) {
                        data[i].rm = true;
                        continue;
                    }
                }
                data.processing++;
                
                // If current step is target, reset step for current timer
                data[i].cStep >= data[i].step && (data[i].cStep = 1);
            }
            // If there are any timers to run, restart timer ...
            timer = data.processing ? window.setTimeout (arguments.callee, 30) : null;
        };

    return {
        /**
         * This function starting to run interval. Returns timer ID to control timer.
         *
         * @param f - Function to be executed
         * @param t - Execution interval (ms)
         * @return int
         */
        interval: function (f, t) {
            if (type (f) !== "function") throw new Error ("Timer.interval(): Invalid callback function: " + f);
            if (type (t) !== "number") throw new Error ("Timer.interval(): Invalid timer: " + t);
            var id = data.iterator;
            // Insert timer to data storage
            data[id] = {func: f, step: t, once: false, rm: false, cStep: 0};
            data.iterator++;
            // Invoke single timer if not running
            !timer && (timer = window.setTimeout (run, 30));

            return id;
        },
        /**
         * This function starting to run timeout. Returns timer ID to control timer.
         *
         * @param f - Function to be executed
         * @param t - Execution interval (ms)
         * @return int
         */
        timeout: function (f, t) {
            if (type (f) !== "function") throw new Error ("Timer.timeout(): Invalid callback function: " + f);
            if (type (t) !== "number") throw new Error ("Timer.timeout(): Invalid timer: " + t);
            var id = data.iterator;
            // Insert timer to data storage
            data[id] = {func: f, step: t, once: true, rm: false, cStep: 0};
            data.iterator++;
            // Invoke single timer if not running
            !timer && (timer = window.setTimeout (run, 30));

            return id;
        },
        /**
         * Remove timeout/interval by ID. Return success or failure by using true/false.
         *
         * @param id - ID of timer to be stopped
         * @return boolean
         */
        kill: function (id) {
            if (type (id) !== "number") throw new Error ("Timer.kill(): Invalid timer ID: " + id);
            data[id] && (data[id].rm = true);

            return true;
        },
        /**
         * Return list of active timers.
         *
         * @return object
         */
        active: function () {return data;}
    };
}) ());