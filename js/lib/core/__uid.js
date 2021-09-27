window.__uid || (window.__uid = function () {
    var d = new Date ();
    return ((d - - (d.getMilliseconds () / 1000)) * 1000).toString (16);
});