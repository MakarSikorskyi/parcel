require.once (
    "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/addText.js", "lib/dom/classname.js", "lib/dom/mkNode.js", "lib/effect/titleToolTip.js", "lib/event/eventHandler.js", "lib/event/getEvent.js",
    "lib/style/applyStyle.js", "lib/window/getSize.js", "ui/mkIco.js", "lib/core/Timer.js"
) && $ (document.body).$ (["appendChild",
    /* mkNode("div").$ (["appendChild", mkNode ("img").$ ({src: "pub/img/bug.gif"}).applyStyle ({position:"absolute", zIndex:100})]), <- here is it ;D */
    mkNode ("div").$ ({id: "ui-panel-left"}, ["appendChild",
        mkNode ("div").applyStyle({margin:'10px', width:'auto', height:'5px'}).$ ({id: "ui-box-logo"}, ["appendChild",
            mkNode ("div").addText ("SikorskyiDev").applyStyle ({fontSize: "200%", lineHeight: 0.8, fontStyle: "italic", height: "30px"}).$ (["appendChild",
//                mkNode ("sup").addText ("").applyStyle ({fontSize: "25%"})
            ]).classname('+ta-left').applyStyle ({cursor: "pointer"}).addEventHandler (window.sb_logo_eh = function () {getEvent (true).stopBubble (); goTo (sapi ("URL_MOD") + "core/main.php") ();}, "click"),
//            mkNode ("small").addText ("").applyStyle ({display: "block", position: "relative", fontSize: "100%", color: "#fff", top: "-5px", height: "15px"}),
            mkNode ("div").$ ({id: "ui-box-usersearch"}).applyStyle({display:'none'})
        ]),
        mkNode ("ul").$ ({id: "ui-list-mainmenu"})
    ]).addEventHandler (function () {
        getEvent (false).preventDefault ();
    }, "selectstart", "mousedown"),
    mkNode ("div").$ ({id: "ui-left-div"}),
    mkNode ("div").$ ({id: "ui-panel-top"}).$ (["appendChild",
        mkNode ("div").$ ({id: "ui-box-activemenu"}).applyStyle ({display: "none", visibility: "hidden"}),
        mkNode ("div").$ (["appendChild",
            mkNode ("div").$ ({id: "ui-box-userinfo"}),
            mkNode ("div").$ ({id: "ui-box-useract"})
        ]).applyStyle ({position: "absolute", top: 0, bottom: 0, right: 0})
    ]),
    mkNode ("div").$ ({id: "ui-box-workzone"}),
    mkNode ("div").$ ({id: "ui-panel-bottom"}).$ (["appendChild",
        mkNode ("div").$ ({id: "ui-box-rotator"}),
        mkNode ("div").$ ({id: "ui-box-copyright"}).addText ("© 2011-" + new Date().getFullYear()),
        mkNode ("div").$ ({id: "ui-box-version"}).addText (sapi ("SYS_VERSION"))
    ])
]) && (window.addEventHandler (document.update = (function () {
    var h = window.getSize ().height;
    $ ("#ui-panel-left").applyStyle ({position: $ ("#ui-list-mainmenu").offsetHeight > h - 150 ? "absolute" : "fixed"});

    return arguments.callee;
}) (), "resize")) && Timer.interval (function () {
    if ($ ("#ui-box-rotator").childNodes.length <= 1) return;
    while (!$ ("#ui-box-rotator").firstChild.firstChild) {
        $ ("#ui-box-rotator").appendChild ($ ("#ui-box-rotator").firstChild);
    }
    $ ("#ui-box-rotator").appendChild ($ ("#ui-box-rotator").firstChild);
}, 150);