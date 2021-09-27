window.require && window.require.list && (window.dbg || require.once ("lib/core/Cookie.js", "lib/date/format.js", "lib/core/__uid.js") && (window.dbg = (function () {
    var __lib = {
            __cache: {},
            __load: function (lib, cache) {
                if (!cache) cache = false; else cache = true;
                if (lib in require.list.done) {
                    if (lib in require.list.cache) require.cache (lib);
                } else {
                    if (cache === true) require.cache (lib);
                    else require.once (lib);
                }
            },
            __unload: function (lib) {
                if (lib in require.list.done) {
                    __lib.__cache[lib] = false;
                    delete require.list.done[lib];
                }
                if (lib in require.list.cache) {
                    __lib.__cache[lib] = true;
                    delete require.list.cache[lib];
                }
            },
            __reload: function (lib) {
                __lib.__unload (lib);
                __lib.__load (lib, __lib.__cache[lib]);
            }
        },

        __usage = {
            /* Click event cookie variable hash prefix */
            __cpfx: sapi ("LOG_CPFX"),
            /* UI.report event cookie variable hash prefix */
            __rpfx: sapi ("LOG_RPFX"),

            __click: (function () {
                var f = function () {
                    if (!sapi ("LOG_CLIENT") || !(sapi ("user", "auth") && parseInt (sapi ("user", "id")) > 0)) return;
                    var e = getEvent (true), estr = [];
                    if (e.type !== "click") return;
                    e.time = (new Date ()).format ("Y-m-d H:i:s.u");
                    for (var i in e) {
                        if (/(event|type|keyCode|charCode|stopBubble|preventDefault|mkey)/.test (i) || typeof e[i] === "undefined" || e[i] === null) continue;
                        if (/(target|source)/.test (i)) {
                            estr.push (i + ":" + e[i].tagName.toString ().toLowerCase ());
                            continue;
                        }
                        if (/(pos)/.test (i)) {
                            estr.push (i + ":" + e.pos.x + "," + e.pos.y);
                            continue;
                        }
                        estr.push (i + ":" + e[i]);
                    }
                    Cookie (__usage.__cpfx + "[" + __uid () + "]", estr.join (";"));
                    f.count++;
                };
                f.count = 0;
                return f;
            }) (),
            __rcount: 0,
            __report: function (type, msg) {
                if (type == 3) type = 1;
                Cookie (__usage.__rpfx + "[" + __usage.__rcount + "i" + __uid () + "]", type + ";" + msg);
                __usage.__rcount++;
            }
        };
    
    document.addEventHandler (__usage.__click, "click");
    return {lib: __lib, usage: __usage};
}) ()));