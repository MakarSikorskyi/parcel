window._Request || require.once ("lib/core/AJAX.js", "lib/core/Timer.js", "sys/AJAX.events.js", "ui/UI.lock.js") && (window._Request = (function () {
    var send, data = {timer: undefined, running: false, reqData: undefined, lock: undefined};
    
    send = function () {
        data.lock = UI.lock (); UI.lock (false);
        !data.timer && (data.timer = Timer.interval (send, 1800));
        !data.running && (data.running = true);
        if (!data.lock && !sapi ("user", "auth")) return;
        var rq = new AJAX ();
        rq.method = "POST";
        rq.url = sapi ("URL_MOD") + "core/request.php";
        rq.silent = true;
        rq.onBeforeSend = function () {
            data.reqData = {data: sapi ("data"), req: sapi ("req"), LOG_CLIENT: sapi ("LOG_CLIENT")};
            return AJAX.onBeforeSend && AJAX.onBeforeSend (this);
        };
        rq.onSuccess = function () {
            AJAX.onSuccess && AJAX.onSuccess (this);
            if (!sapi ("user", "auth")) return;
            var srv = sapi ();
            for (var i in data.reqData.data) srv.data[i] = data.reqData.data[i];
            srv.req.url = data.reqData.req.url;
            srv.req._GET = data.reqData.req._GET;
            srv.LOG_CLIENT = data.reqData.LOG_CLIENT;
            sapi (srv);
            UI.lock (data.lock);
        };
        rq.send ();
    };
    
    return {
        data: function () {return data;},
        running: function () {return data.running;},
        refresh: send,
        kill: function () {if (data.timer && Timer.kill (data.timer)) {data.running = false; data.timer = undefined}}
    };
}) ());