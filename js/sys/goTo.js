window.goTo || require.once ("lib/core/AJAX.js", "lib/core/type.js", "sys/AJAX.events.js") && (window.goTo = function (url) {
    if (type (url) !== "string") throw new Error ('window.goTo(): Invalid url given: "' + url + '"');
    return function () {
        var rq = new AJAX;
        rq.url = url;
        rq.send ();
    };
})