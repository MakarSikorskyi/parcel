window.urlTrack || require.once ("lib/core/AJAX.js", "lib/core/Timer.js", "sys/AJAX.events.js", "ui/UI.lock.js") && (window.urlTrack = (function () {
    var current = "", track;
    (track = function () {
        if (UI.lock ()) {
            Timer.timeout (track, 15);
            return;
        }
        if (!/^#?$/.test (window.location.hash) && current !== window.location.hash) {
            current = window.location.hash;

            var rq = new AJAX ();
            rq.url = window.location.hash.replace (/^#/, "");
            rq.onComplete = function (o) {
                UI.lock (false);
                Timer.timeout (track, 30);
                AJAX.onComplete && AJAX.onComplete (o);
            }
            rq.send ();
            UI.lock (true);
        } else Timer.timeout (track, 15);
    }) ();

    return function (url) {
        current = url;
        return true;
    };
}) ());