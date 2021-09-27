window.UI && window.UI.User || require.once ("lib/core/Timer.js", "lib/dom/getInnerSize.js", "lib/dom/getPosition.js", "lib/style/CSS.js") && (window.UI.Skin = {
    collection: {
        troll_mod: function () {
            $ ("#ui-panel-bottom").$ (["appendChild", troll = mkNode ("div").applyStyle ({position: "fixed", bottom: "-60px", right: 0, width: "192px", height: "56px", background: "url('" + sapi ("URL_IMG") + "face.png') no-repeat"})]);
            var bot = -60;
            function troll_move () {
                bot += 10;
                troll.applyStyle ({bottom: bot + "px"});
                if (bot < 0) pTimer = window.setTimeout (troll_move, 100);
            }
            troll_move ();
        },
        unloader: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "bg.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        blablabla: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "##363636", colorb = "#363636";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "stepashka.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        monako: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "monako1.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        bora_bora: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "bora-bora1.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        shavalda: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "test2.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        unloaderW: function () {
            var color = "#fff", colora = "#cef", colorb = "#8bd";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "bg.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        unloaderW2: function () {
            var color = "#fff", colora = "#ddd0f0", colorb = "#9fb0ed";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "img9.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.55);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        prapor1: function () {
            var color = "#fff", colora = "#ddd0f0", colorb = "#9fb0ed";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "301975823.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.55);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        prapor2: function () {
            var color = "#fff", colora = "#ddd0f0", colorb = "#9fb0ed";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "91541100.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.55);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.55);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        unloaderPyramid: function () {
            var color = "#fff", colora = "#cef", colorb = "#8bd";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "958535484.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        timeM: function () {
            var color = "#fff", colora = "#cef", colorb = "#8bd";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "mw.jpg') repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        yuren2: function () {
            document.body.appendChild (mkNode ("div").$ ({onclick: function () {
            this.parentNode.removeChild (this);
        }}).applyStyle ({
            position: "fixed", zIndex: 9, left: "210px", top: "26px", right: 0, overflowY: "700",
            border: "0 none", padding: "15px 25px 700px 15px", marginBottom: "10px", backgroundColor: "#e9eff4",
            fontSize: "30pt", fontWeight: "bold", fontFamily: "Consolas"
        }).addText ("Не обижайся =)"));
        },
        yuren: function () {
    
            document.body.appendChild (mkNode ("div").$ ({onclick: function () {
            this.parentNode.removeChild (this);
        }}).applyStyle ({
            position: "fixed", zIndex: 9, left: "210px", top: "26px", right: 0, overflowY: "800px",
             border: "0 none", padding: "15px 25px 800px 15px", marginBottom: "10px", backgroundColor: "#DCDCDC",
            fontSize: "70pt", fontWeight: "bold", fontFamily: "Consolas"
        }).addText ("Welcome to hell!"));
    
            var color = "#DCDCDC", colora = "#F0FFFF", colorb = "#8B8989";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#DCDCDC"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color});
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color}).addText('Когда-нибудь ниже будет твой собственный модуль, но это уже совсем другая история...').removeChild($ ("#ui-box-logo").firstChild);
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: "#CDC9C9"});
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-box-version").applyStyle ({backgroundColor: color}).applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-box-useract").applyStyle ({background: "#CDC9C9"});
            _CSS (".ui-box-workspace-legend").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        unloaderA: function () {
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "bg.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
            var c1 = {r: 153, g: 204, b: 221}, c2 = {r: 102, g: 153, b: 187}, _c1, _c2, h = 1, d = 2, i = 0, s = 1;
            Timer.interval (function () {
                if (i >= d) s = 0;
                if (i <= -d) s = 1;
                if (s === 1) i += h;
                else i -= h;
                c1.r += i; c1.g += i; c1.b += i;
                c2.r += i; c2.g += i; c2.b += i;
                _c1 = "#" + (c1.r > 255 ? 255 : c1.r < 0 ? 0 : c1.r).toString (16) + (c1.g > 255 ? 255 : c1.g < 0 ? 0 : c1.g).toString (16) + (c1.b > 255 ? 255 : c1.b < 0 ? 0 : c1.b).toString (16);
                _c2 = "#" + (c2.r > 255 ? 255 : c2.r < 0 ? 0 : c2.r).toString (16) + (c2.g > 255 ? 255 : c2.g < 0 ? 0 : c2.g).toString (16) + (c2.b > 255 ? 255 : c2.b < 0 ? 0 : c2.b).toString (16);
                $ ("#ui-left-div").applyStyle ({backgroundColor: _c1});
                $ ("#ui-panel-top").applyStyle ({backgroundColor: _c1});
                $ ("#ui-panel-bottom").applyStyle ({backgroundColor: _c1});
                $ ("#ui-box-useract").applyStyle ({backgroundColor: _c1});
                _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: _c2});
                _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: _c2});
                _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: _c1});
                _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: _c2});
            }, 5);
        },
        unloaderG: function () {
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "bg.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
            var c1 = {r: 0, g: 0, b: 0}, c2 = {r: 255, g: 255, b: 255}, _c1, _c2, h = 5, d = 0, i = 0, s = 1;
            Timer.interval (function () {
                if (i >= 255) s = 0;
                if (i <= 0) s = 1;
                if (s === 1) i += h;
                else i -= h;
                c1.r += i; c1.g += i; c1.b += i;
                c2.r -= i; c2.g -= i; c2.b -= i;
                _c1 = "#" + (c1.r > 255 ? 255 : c1.r < 0 ? 0 : c1.r).toString (16) + (c1.g > 255 ? 255 : c1.g < 0 ? 0 : c1.g).toString (16) + (c1.b > 255 ? 255 : c1.b < 0 ? 0 : c1.b).toString (16);
                _c2 = "#" + (c2.r > 255 ? 255 : c2.r < 0 ? 0 : c2.r).toString (16) + (c2.g > 255 ? 255 : c2.g < 0 ? 0 : c2.g).toString (16) + (c2.b > 255 ? 255 : c2.b < 0 ? 0 : c2.b).toString (16);
                $ ("#ui-left-div").applyStyle ({backgroundColor: _c1});
                $ ("#ui-panel-top").applyStyle ({backgroundColor: _c1});
                $ ("#ui-panel-bottom").applyStyle ({backgroundColor: _c1});
                $ ("#ui-box-useract").applyStyle ({backgroundColor: _c1});
                _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: _c2});
                _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: _c2});
                _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: _c1});
                _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: _c2});
            }, 10);
        },
        jeans: function () {
            $ ("#ui-left-div").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff'});
            $ ("#ui-list-mainmenu").applyStyle ({fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 'normal', color: '#eee'});
            $ ("#ui-box-logo").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#520', fontSize: '80%', marginTop: '10px'}).$(['appendChild',
                mkNode ('img').$ ({src: sapi ("URL_PUB") + "img/skin_denim/label.png"}).applyStyle ({position: 'absolute', left: '1px', top: '1px', zIndex: '-1', width: '200px', height: '80px', marginTop: '-10px'})
            ]);
            $ ("#ui-panel-top").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff', zIndex: '-2'});
            $ ("#ui-panel-bottom").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff'});
            $ ("#ui-box-copyright").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff'}).empty ();
            $ ("#ui-box-version").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff'}).empty ();
            $ ("#ui-box-useract").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_denim/denim2.jpg')", color: '#fff'});
        },
        vs: function () {
            $ ("#ui-left-div").applyStyle ({ backgroundColor: 'transparent', border: '0'});
            $ ("#ui-list-mainmenu").applyStyle ({fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 'normal', color: '#eee', marginTop: '30px'});
            	
            var tc = $ ("#ui-box-logo").childNodes;
            for(i = 0; i < tc.length-1; i++) {
                tc[i].style.display = 'none';
            }
            $ ("#ui-box-logo").$ (["insertBefore", $ ("#ui-box-logo").firstChild,
                mkNode ('button').applyStyle ({width: '100%', margin: 0}).$ ({
                    onclick: function () {
                        $ ('#ui-list-mainmenu').applyStyle ({display: ($ ('#ui-list-mainmenu').style.display == 'none' ? '' : 'none')});
                        $ ('#ui-box-usersearch').applyStyle ({display: ($ ('#ui-box-usersearch').style.display == 'none' ? '' : 'none')});
                        //$ ('#ui-panel-left').applyStyle ({pointerEvents: ($ ('#ui-panel-left').style.pointerEvents == 'none' ? 'all' : 'none')});
                        
                    },
                    onmouseover: function () {
                        
                    }
                })
            ]);
            _CSS ('#ui-list-mainmenu > li > a').applyStyle ({padding: '2px 10px'});
            $ ('#ui-box-usersearch').applyStyle ({top: '0px'});
            $ ('#ui-list-mainmenu').applyStyle ({margin: '55px 0 0 0'});
            $ ("#ui-panel-top").applyStyle ({borderBottom: '0', color: '#252525', backgroundColor: 'transparent'});
            $ ("#ui-panel-bottom").applyStyle ({display: 'none'});
            $ ('#ui-panel-left').applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_vs/line.png')", MozBoxShadow: '3px 0 3px 0 rgba(0, 0, 0, 0.5)'});
            $ ("#ui-box-workzone").applyStyle ({paddingLeft: '20px'});
            var all = document.styleSheets,
                s = all[all.length - 1],
                l = s.cssRules.length;
            if (s.insertRule) {
                s.insertRule('#ui-panel-left {position: fixed !important}', l);
            } else {
                s.addRule('#ui-panel-left', 'position: fixed !important', -1);
            }            
            $ ("#ui-box-copyright").applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_PUB") + "img/skin_vs/line.png')", color: '#fff'}).empty ();
            $ ("#ui-box-useract").applyStyle ({color: '#fff', backgroundColor: 'transparent'});
            $ ("#ui-box-userinfo").applyStyle ({textAlign: 'right', marginRight: '60px'});
            _CSS (".ui-box-workspace-legend").applyStyle ({top: '0'});
            _CSS (".ui-box-wstabs").applyStyle ({margin: '-46px -20px 0 -21px'});
            _CSS (".ui-box-workspace-content").applyStyle ({paddingBottom: '0'});
            ((typeof console === "undefined" || typeof console.log === "undefined") ? console = {log: alert} : alert = console.log) && Cookie.del (/^ce/);
        },
        aki4_mod: function () {
            ((typeof console === "undefined" || typeof console.log === "undefined") ? console = {log: alert} : alert = console.log) && Cookie.del (/^ce/);
        },
        monako: function () {
//            var color = "#9c9", colora = "#efe", colorb = "#7a7";
            var color = "#9cd", colora = "#dff", colorb = "#69b";
            $ ("#ui-box-loader").applyStyle ({bottom: 0}).opacity (0.925);
            document.body.applyStyle ({background: "#f3ddc3 url('" + sapi ("URL_IMG") + "monako1.jpg') no-repeat fixed"});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-list-mainmenu").applyStyle ({overflow: "hidden"});
            $ ("#ui-box-logo").applyStyle ({background: "none"});
            $ ("#ui-box-copyright").applyStyle ({background: "none"}).empty ();
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color}).opacity (0.65);
            $ ("#ui-panel-bottom").applyStyle ({display: "none", visibility: "hidden"});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-workspace-legend").opacity (0.65);
            _CSS (".ui-box-wstabs").opacity (0.85);
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "none"});
        },
        ny: function () {
            var color = "#ADD8E6";
//            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
//            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
//            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
//            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
//            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
//            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            $ ("#ui-box-logo").firstChild.applyStyle ({paddingLeft: "45px", fontSize: "250%", width: "160px", color: color});
            $ ("#ui-box-logo").firstChild.nextSibling.applyStyle ({paddingLeft: "45px", fontSize: "90%", color: "#fff"});
            $ ("#ui-panel-bottom").$ (["appendChild", mkNode ("div").applyStyle ({position: "fixed", bottom: 0, left: 0, width: "100%", height: "90px", background: "url('" + sapi ("URL_IMG") + "snow.png') repeat"})]);
            $ ("#ui-panel-bottom").$ (["appendChild", mkNode ("div").applyStyle ({position: "fixed", bottom: "-20px", right: "30px", width: "120px", height: "200px", background: "url('" + sapi ("URL_IMG") + "snowman_small.png')"})]);
            $ ("#ui-panel-bottom").$ (["appendChild", mkNode ("img").$ ({src: sapi ("URL_IMG") + "elka26.gif", width: "60"}).applyStyle ({position: "fixed", top: 0, left: "5px", width: "60px", height: "84.5px"})]);
            var elem = mkNode ("canvas");
            if (!!(elem.getContext && elem.getContext ("2d"))) {
                $ ("#ui-box-logo").$ (["appendChild", elem.applyStyle ({position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "hidden"})]);
                context = elem.getContext ("2d");
                elem.height = window.innerHeight;
                elem.width = window.innerWidth;
                snowflake = [];
                for (var i = 0; i <= 100; i++) snowflake[i] = {x: (Math.random () * elem.width), y: -(Math.random () * elem.height), size: (Math.random () * 4), rotate: (Math.random () * 360)};
                function megaSnow () {
                    context.clearRect (0, 0, elem.width, elem.height);
                    for (var i in snowflake) {
                        context.fillStyle = "#fff";
                        context.font = "bold " + 10 * snowflake[i].size + "px Arial";
                        context.fillText ("*", snowflake[i].x, snowflake[i].y);
                        snowflake[i].y++;
                        snowflake[i].rotate++;
                        if (snowflake[i].y > elem.height) {
                            snowflake[i].y = -(Math.random () * 100);
                            snowflake[i].x = (Math.random () * elem.width);
                        }
                    }
                }
                if (window.stmr) Timer.kill (window.stmr);
                window.stmr = Timer.interval (megaSnow, 5);
            }
      
        },
        new_year: function () {
            if (window.snowFall) return;
            window.snowFall = (function () {
                var o = {
                    particle: {count: 0, iter: 0, density: 0},
                    passedaway: {},
                    snowflake: mkNode ("div").applyStyle ({
                        position: "absolute", display: "block", border: "none", padding: 0, margin: 0,
                        zIndex: 10000, fontSize: "45%", color: "#ffffef"
                    }).addText ("❄"),
                    letItSnow: function (density, size, speed, angle, change_direction) {
                        if (!density || density < 1) density = 1;
                        if (!size) size = 1;
                        if (!change_direction) change_direction = false;
                        var s, th1s = this, sfoff, ngl_sin, g = true, snowFallRotator, i, ls;
                        th1s.particle.density = density;
                        th1s.particle.finished = th1s.particle.count;
                        snowFallRotator = function () {
                            s = document.body.getInnerSize ();
                            if (g) {
                                if (th1s.particle.density == density) {
                                    if (!th1s.particle.hasOwnProperty (th1s.particle.iter)) {
                                        th1s.particle[th1s.particle.iter] = $ (th1s.snowflake.cloneNode (true)).$ ({passed: false}).applyStyle ({
                                            fontSize: (Math.random () * (Math.ceil (150 * size) - 35 * size + 1) + 35 * size) + "%", top: "-5px", left: (Math.random () * (s.width - 10)) + "px", pointerEvents: "none"
                                        });
                                        document.body.$ (["appendChild", th1s.particle[th1s.particle.iter]]);
                                        th1s.particle[th1s.particle.iter].$ ({pp: th1s.particle[th1s.particle.iter].getPosition (), ps: th1s.particle[th1s.particle.iter].getInnerSize ()});
                                        th1s.particle.count++;
                                    } else {
                                        ls = (Math.random () * (s.width - 10));
                                        th1s.particle[th1s.particle.iter].$ ({passed: false, ngl: undefined, dx: undefined}).applyStyle ({
                                            top: "-5px", left: ls + "px",
                                            visibility: "visible", display: ""
                                        });
                                        th1s.particle[th1s.particle.iter].pp.y = -5;
                                        th1s.particle[th1s.particle.iter].pp.x = ls;
                                    }
                                    th1s.particle.iter++;
                                    th1s.particle.density = 0;
                                } else th1s.particle.density++;
                            }
                            for (i in th1s.particle) {
                                if (!th1s.particle.hasOwnProperty (i) || /^(count|iter|density|finished)$/.test (i) || th1s.particle[i].passed === true) continue;
                                if (!th1s.particle[i]) continue;
                                if (th1s.particle[i].ngl === undefined) th1s.particle[i].ngl = Math.round (Math.random ()) * - 1;
                                if (change_direction && th1s.particle.iter % (5 * density) === 0) th1s.particle[i].ngl = Math.round (Math.random ()) * - 1;
                                ngl_sin = Math.sin (angle * th1s.particle[i].ngl);
                                if (angle !== 0 && ngl_sin === 0) ngl_sin = 1;
                                if (th1s.particle[i].dx === undefined) th1s.particle[i].dx = Math.random () * 4 + 1;
                                if (th1s.particle[i].pp.y + th1s.particle[i].ps.height > s.height - Math.ceil (10 * size) ||
                                        (th1s.particle[i].pp.x + th1s.particle[i].dx * ngl_sin) >= s.width - th1s.particle[i].ps.width ||
                                        (th1s.particle[i].pp.x + th1s.particle[i].dx * ngl_sin) < 0) {
                                    th1s.particle[i].$ ({passed: true}).applyStyle ({visibility: "hidden", display: "none"});
                                    if (g === true && th1s.particle.iter * density >= 250) g = false;
                                    th1s.particle.finished++;
                                    if (th1s.particle.finished === th1s.particle.iter) {
                                        g = true;
                                        th1s.particle.iter = 0;
                                        th1s.particle.finished = 0;
                                        Timer.kill (window.sfrwt);
                                        window.sfrwt = false;
                                        if (Cookie.get ("snowFallOff")) window.stmr = Timer.timeout (o.sfrWrapper, 120);
                                    }
                                } else {
                                    th1s.particle[i].pp.y += 3;
                                    th1s.particle[i].pp.x += th1s.particle[i].dx * ngl_sin;
                                    th1s.particle[i].applyStyle ({top: th1s.particle[i].pp.y + "px", left: th1s.particle[i].pp.x + "px"});
                                }
                            }
                        };
                        o.sfrWrapper = function () {
                            window.sfrwt = Timer.interval (snowFallRotator, speed);
                        };
                    }
                };
                
                return o;
            } ());
            var color = "#cffaf8", sfo, snowFallOffEvent = function () {
                this.e = getEvent (true);
                switch (this.e.type) {
                    case "click":
                        if (this.tsoff === null) {
                            Cookie ("snowFallOff", 1);
                            this.tsoff = 1;
                            !window.stmr && !window.sfrwt && window.snowFall.sfrWrapper ();
                            this.$ ({title: "Вимкнути сніг"}).applyStyle ({color: "", bottom: "20px", animation: "none"});
                        } else {
                            this.tsoff = null;
                            Cookie.del ("snowFallOff");
                            if (window.stmr) {
                                Timer.kill (window.stmr);
                                window.stmr = false;
                            }
                            this.$ ({title: "Let It Snow"}).applyStyle ({color: color, bottom: "21px", animation: "snowflake-gradient infinite 10s alternate"});
                        }
                    break;
                    default: this.e.preventDefault (); break;
                }
            };
            $ ("#ui-box-logo").firstChild.applyStyle ({paddingLeft: "40px", fontSize: "260%", width: "160px", color: color});
            $ ("#ui-box-logo").firstChild.nextSibling.applyStyle ({paddingLeft: "35px", fontSize: "90%", color: "#fff"});
            $ ("#ui-panel-bottom").$ (["appendChild",
                mkNode ("div").applyStyle ({
                    position: "fixed", bottom: 0, left: 0, width: "100%", height: "60px", background: "url('" + sapi ("URL_IMG") + "snow.png') repeat",
                    backgroundSize: "490px 76px", MozBackgroundSize: "490px 76px"
                }),
                mkNode ("img").$ ({src: sapi ("URL_IMG") + "snowman_small.png"}).applyStyle ({position: "fixed", bottom: "-5px", right: "90px", width: "36px", height: "60px"}),
                sfo = mkNode ("div").addText ("❄").$ ({title: "Вимкнути сніг"}).applyStyle ({
                    position: "fixed", bottom: "20px", left: "218px", fontSize: "275%", cursor: "pointer", zIndex: 0
                }).addEventHandler (snowFallOffEvent, "click", "dblclick", "selectstart", "mousemove", "mousedown")
            ]);
            $ ("#ui-panel-top").$ (["appendChild",
                mkNode ("img").$ ({src: sapi ("URL_IMG") + "elka26.gif"}).applyStyle ({position: "fixed", top: 0, left: "5px", height: "61px", width: "43px"})
            ]);
            window.snowFall.letItSnow (15, 1, 2, -5);
            sfo.tsoff = Cookie.get ("snowFallOff");
            if (sfo.tsoff === null) {
                sfo.$ ({title: "Let It Snow"}).applyStyle ({color: color, bottom: "21px", animation: "snowflake-gradient infinite 10s alternate"});
            } else {
                window.snowFall.sfrWrapper ();
                sfo.$ ({title: "Вимкнути сніг"}).applyStyle ({color: "", bottom: "20px", animation: "none"});
            }
        },
        violet: function () {
            var color = "#ceb7fd";
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
        },
        white: function () {
            var color = "#00BFFF";
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
        },
        
        blue: function () {
            var color = "#4682B4";
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            $ ("#ui-box-version").applyStyle ({backgroundColor: color}).applyStyle ({display: "none", visibility: "hidden"});
        },
        dark_pink: function () {
            var color = "#dbc"; colora = "#cf9fb7";
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            $ ("#ui-box-version").applyStyle ({backgroundColor: color});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "000"});
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: "none"});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
        },
        roma: function () {
            var color = "#3A5FCD"; colora = "#4876FF"; colorb = "#FFFAFA";
            $ ("#ui-box-logo").applyStyle ({backgroundColor: colorb});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: colorb});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: colorb});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
            $ ("#ui-box-version").applyStyle ({backgroundColor: color});
            $ ("#ui-left-div").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td").applyStyle ({backgroundColor: colorb});
            _CSS (".ui-box-wstabs > table td:hover").applyStyle ({backgroundColor: color});
            _CSS (".ui-box-wstabs > table td.active").applyStyle ({background: "none transparent", borderBottom: "000"});
            _CSS ("#ui-list-mainmenu > li > a.active").applyStyle ({backgroundColor: "none"});
            _CSS ("#ui-list-mainmenu > li > ul > li > a.active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:hover").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:hover").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > a:active").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:active").applyStyle ({backgroundColor: colora});
            _CSS ("#ui-list-mainmenu > li > a:focus").applyStyle ({backgroundColor: color});
            _CSS ("#ui-list-mainmenu > li > ul > li > a:focus").applyStyle ({backgroundColor: colora});
        },
        casino_royale: function () {
            var color = "#9c9";
            $ ("#ui-list-mainmenu").applyStyle ({marginTop: "95px"});
            $ ("#ui-box-logo").empty ().$ (["appendChild", mkNode ("img").$ ({src: sapi ("URL_IMG") + "cr_logo.png"}).applyStyle ({marginTop: "5px"})]).applyStyle ({backgroundColor: color});
            $ ("#ui-box-logo").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-left").applyStyle ({backgroundColor: color});
            $ ("#ui-box-copyright").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-top").applyStyle ({backgroundColor: color});
            $ ("#ui-panel-bottom").applyStyle ({backgroundColor: color});
            $ ("#ui-box-useract").applyStyle ({backgroundColor: color});
        },
        welcome: function () {
            require.cache ("ui/welcome.js");
        }
    },
    rules: {
        struct: {
            1: "default", 3: "default", 6: "default", 7: "default", 12: "default", 17: "default", 18: "default", 22: "default", 23: "default", 24: "default",
            839: "default", 995: "default", 8: "default", 9: "default", 10: "default", 11: "default", 13: "default", 14: "default", 16: "default",
            19: "default", 20: "default", 892: "default", 25: "default", 26: "default", 27: "default", 783: "default"
        },
        employee: {
            1: "default", 8404: "violet", 5803: "dark_pink",  8493: "timeM", 6907:"unloader"/*, 17: "unloader"*/, 9166: "unloader",
            10257: "unloader", 8027: "unloader", 325: "default", 3250: "unloaderPyramid", 4027: "unloaderW", //7030: "yuren",
            9: "welcome", 1404: "bora_bora", 95: "default", 3718: "blablabla", 5961: "unloader", 9250: "dark_pink"
        }
    },
    apply: function () {
        var f, d = new Date ();
        if (type (this.collection[this.rules.struct[sapi ("user", "struct")]]) === "function") f = this.collection[this.rules.struct[sapi ("user", "struct")]];
        if (type (this.collection[this.rules.employee[sapi ("user", "id")]]) === "function") f = this.collection[this.rules.employee[sapi ("user", "id")]];
        if ((d.getMonth () >= 11 && d.getDate () >= 12) || (d.getMonth () < 1 && d.getDate () <= 20)) f = this.collection["new_year"];
        f && f.call ();
    }
});
