require.once (
    "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/addText.js", "lib/dom/classname.js", "lib/dom/mkNode.js", "lib/effect/titleToolTip.js", "lib/event/eventHandler.js", "lib/event/getEvent.js",
    "lib/style/applyStyle.js", "lib/window/getSize.js", "ui/mkIco.js", "lib/core/Timer.js"
) && $ (document.body).$ (["appendChild",
    mkNode ("ul").$ ({id: "ui-list-mainmenu-alt"}),
    mkNode ("div").$ (["appendChild", mkNode ("img").$ ({src: "pub/img/bug.gif"}).applyStyle ({position:"absolute", zIndex:100})]),
    mkNode ("div").$ ({id: "ui-panel-left"}, ["appendChild",
        mkNode ("div").$ ({id: "ui-box-logo"}, ["appendChild",
            mkNode ("div").addText ("SalesBase").applyStyle ({padding: "10px 10px 0", fontSize: "270%", lineHeight: 0.8, fontStyle: "italic", height: "30px"}).$ (["appendChild",
                mkNode ("sup").addText ("TM").applyStyle ({fontSize: "25%"})
            ]).applyStyle ({cursor: "pointer"}).addEventHandler (window.sb_logo_eh = function () {getEvent (true).stopBubble (); goTo (sapi ("URL_MOD") + "core/main.php") ();}, "click"),
            mkNode ("small").addText ("The best way for sales").applyStyle ({display: "block", position: "relative", fontSize: "100%", color: "#fff", top: "-5px", height: "15px"})
        ]),
    ]).addEventHandler (function () {
        getEvent (false).preventDefault ();
    }, "selectstart", "mousedown"),
    mkNode ("div").$ ({id: "ui-left-div"}),
    mkNode ("div").$ ({id: "ui-panel-top"}).$ (["appendChild",
        mkNode ("div").$ ({id: "ui-box-activemenu"}).applyStyle ({display: "none", visibility: "hidden"}),
        mkNode ("div").$ ({id: "ui-box-usersearch"}),
        mkNode ("ul").$ ({id: "ui-list-mainmenu"}),
        mkNode ("div").$ (["appendChild",
            mkNode ("div").$ ({id: "ui-box-userinfo"}),
            mkNode ("div").$ ({id: "ui-box-useract"})
        ]).applyStyle ({position: "absolute", top: 0, bottom: 0, right: 0})
    ]),
    mkNode ("div").$ ({id: "ui-box-workzone"})
]) && (window.addEventHandler (document.update = (function () {
    var h = window.getSize ().height;
    $ ("#ui-list-mainmenu-alt").applyStyle ({position: $ ("#ui-list-mainmenu-alt").offsetHeight > h - 25 ? "absolute" : "fixed"});
    return arguments.callee;
}) (), "resize"));