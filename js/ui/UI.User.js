window.UI && window.UI.User || require.once ("ui/UI.Skin.js", "lib/effect/titleToolTip.js", "lib/style/CSS.js", sapi ("URL_MOD") + "wfm/contrib/ico.js") && (window.UI.User = {
    panel: function () {
        var user_data = GV.get ("user", "data");
        var oW = window.GV.get ("WFM");
        if (type (oW) == "object" && oW.ico == true) {
            $ ("#ui-box-activemenu").applyStyle ({display: "none", visibility: "hidden"}).removeChild (oW.icoobj);
            if ($ ("#ui-box-activemenu").nextSibling.id) $ ("#ui-box-activemenu").nextSibling.applyStyle (_CSS ("#" + $ ("#ui-box-activemenu").nextSibling.id).getStyle ("marginLeft"));
            else $ ("#ui-box-activemenu").nextSibling.applyStyle (window.GV.get ("WFM", "fcCSS"));
            _CSS (".ui-box-workspace-legend").applyStyle (window.GV.get ("WFM", "legendCSS"));
            if (window.IB && IB.navbar) IB.navbar.applyStyle (window.GV.get ("WFM", "nbCSS"));
            window.GV.unset ("WFM");
        }
        if (sapi ("user", "auth") && user_data) {
            var uprop = $ ("#ui-box-useract").empty ().$ (["appendChild",
//                mkNode ("a").$ ({href: sapi ("URL_MOD") + "core/profile.php"}, ["appendChild", mkIco (3, 0).$ ({title: "Параметри користувача"})]), " ",
                (sapi ("user", "c_id_prov") == true && sapi ("user", "c_id") == null) ? mkNode ("a").$ ({href: sapi ("URL_MOD") + "c_id/c_id.php"}, ["appendChild", mkIco (3, 7).$ ({title: "Cisco ID"})]) : false,
                mkNode ("a").$ ({href: sapi ("URL_MOD") + "core/login.php?do=logout"}, ["appendChild", mkIco (8, 3).$ ({title: "Вийти із системи"})])
            ]), struct = o2a (user_data["struct"]), exp = sapi ("user", "expires"), days = ["", "день", "дні", "дні", "дні", "днів", "днів", "днів"];

            if (sapi ("user", "sumode")) uprop.$ (["insertBefore", uprop.firstChild, mkNode ("a").$ ({href: sapi ("URL_MOD") + "core/login.php?do=su"}, ["appendChild", mkIco (6, 16).$ ({title: "Вийти із режиму SU"})] ), " "]);
            else if (sapi ("user", "access", "admin", "su")) uprop.$ (["insertBefore", uprop.firstChild, mkNode ("a").$ ({href: sapi ("URL_MOD") + "core/login.php?do=su"}, ["appendChild", mkIco (6, 6).$ ({title: "Змінити користувача [SU]"})]), " "]);
            exp <= 7 && uprop.$ (["insertBefore", uprop.firstChild, mkNode ("a").$ ({href: !(sapi ("user", "flag") & 0x02) ? sapi ("URL_MOD") + "core/login.php?do=expires" : "javascript:void(0);"}, ["appendChild",
                mkIco (15, 5).$ ({title: exp > 0 ? "Термін дії Вашого паролю закінчується через " + exp + " " + days[exp] + (!(sapi ("user", "flag") & 0x02) ? ".||Натисніть цю кнопку для зміни паролю." : "") :
                    "Термін дії Вашого паролю закінчився." + (!(sapi ("user", "flag") & 0x02) ? "||Натисніть цю кнопку для зміни паролю." : "")})]
            ), " "]);
            if (UI.User.access ("infobase")) {
                !$ ("#ui-box-usersearch").firstChild && $ ("#ui-box-usersearch").$ (["appendChild",
                    window.UI.IBSearch = mkNode ("form").applyStyle ({display: "inline-block", position: "relative", backgroundColor: "#fff", border: sapi ("SYS_ALTERNATE") ? 0 : "1px solid #528ab3", height: "26px", borderRight: 0, borderLeft: 0}).$ ({onsubmit: function () {
                        getEvent (true).preventDefault ();
                        var q = searchBox.value;
                        searchBox.value = "";
                        sps.applyStyle ({visibility: "visible"});
                        var act = UI.WorkSpace.getActive ();
//                        new AJAX (sapi ("URL_MOD") + "infobase/index.php?q=", "e1=" + act[0] + "&e2=" + act[1] + "&prev_loc=" + window.GV.get("hash"), "POST", true).send ();
                        new AJAX (sapi ("URL_MOD") + "infobase/index.php?q=" + encodeURIComponent (q), "e1=" + act[0] + "&e2=" + act[1] + "&prev_loc=" + window.GV.get("hash"), "POST", false).send ();
                    }}, ["appendChild",
//                        sps = mkNode ("span").addText ("Перехід до бази знань").addEventHandler (function () {searchBox.focus ()}, "click").applyStyle ({position: "absolute", color: "#aaa", fontStyle: "italic", fontWeight: 'normal', fontSize: "12px", fontFamily: "Segoe UI, Arial, sans-serif", margin: "6px 0 0 10px", width: '100%', textAlign: 'left'}),
//                        searchBox = mkNode ("text").applyStyle ({display: "inline-block", width: "198px", margin: 0, fontWeight: "normal", color: "#000", border: 0, lineHeight: "18px", backgroundColor: "transparent"}),
                        sps = mkNode ("span").addText ("Пошук по базі знань").applyStyle ({position: "absolute", color: "#aaa", fontStyle: "italic", fontWeight: 'normal', fontSize: "12px", fontFamily: "Segoe UI, Arial, sans-serif", margin: "6px 0 0 10px", width: '100%', textAlign: 'left'}).$ ({onclick: function () {this.applyStyle ({visibility: "hidden"}); searchBox.focus ();}}),
                        searchBox = mkNode ("text").applyStyle ({display: "inline-block", width: "198px", margin: 0, fontWeight: "normal", color: "#000", border: 0, lineHeight: "18px", backgroundColor: "transparent"}).$ ({
                            onfocus: function () {
                                window.UI.IBSearch.applyStyle ({backgroundColor: "#E0EEEE"});
                                sps.applyStyle ({visibility: "hidden"});
                            },
                            onblur: function () {
                                window.UI.IBSearch.applyStyle ({backgroundColor: "#fff"});
                                if (this.value == "") sps.applyStyle ({visibility: "visible"});
                            },
                            onkeyup: function () {
                                if (this.value != "") sps.applyStyle ({visibility: "hidden"});
                            }
                        }),
                        mkIco (8, 0).applyStyle ({position: "absolute", right: 0, top: 0, margin: "4px 4px 0 0"}).$ ({onclick: function () {window.UI.IBSearch.applyEvent ("submit");}})
                    ])
                ]);
            } else {
                $ ("#ui-box-usersearch").empty ();
            }
            if (UI.User.access ("wfm")) {
                var mnb = 0, pl = 0, ml = 0, fcCSS = $ ($ ("#ui-box-activemenu").nextSibling).getStyle ("marginLeft"), nbCSS = {};
                if (fcCSS.marginLeft) ml = parseInt (fcCSS.marginLeft.replace (/px/, ""));
                else fcCSS.marginLeft = 0;
                var baseCSS = _CSS (".ui-box-workspace-legend").getStyle ("paddingLeft");
                if (baseCSS.paddingLeft) pl = parseInt (baseCSS.paddingLeft.replace (/px/, ""));
                else baseCSS.paddingLeft = 0;
                if (window.IB && IB.navbar) {
                    nbCSS = IB.navbar.getStyle ("marginLeft");
                    if (nbCSS.marginLeft) mnb = parseInt (nbCSS.marginLeft.replace (/px/, ""));
                    else nbCSS.marginLeft = 0;
                }
                window.GV.set ({WFM: {ico: true, icoobj: WFM.ico (40), legendCSS: baseCSS, fcCSS: fcCSS, nbCSS: nbCSS, ml: ml, pl: pl, mnb: mnb}});
                $ ("#ui-box-activemenu").applyStyle ({display: "", visibility: "visible"}).$ (["appendChild", window.GV.get ("WFM", "icoobj")]);
//                $ ("#ui-box-activemenu").nextSibling.applyStyle ({marginLeft: ml + parseInt ($ ("#ui-box-activemenu").offsetWidth - 1) + "px"});
//                _CSS (".ui-box-workspace-legend").applyStyle ({paddingLeft: pl + parseInt ($ ("#ui-box-activemenu").offsetWidth - 1) + "px"});
//                if (window.IB && IB.navbar) IB.navbar.applyStyle ({marginLeft: mnb + parseInt ($ ("#ui-box-activemenu").offsetWidth - 1) + "px"});
                $ ("#ui-box-activemenu").applyStyle ({display: "none", visibility: "hidden"});
            }
            $ ("#ui-box-userinfo").empty ().$ (["appendChild",
                (sapi ("user", "sumode") ? "[SU] " : ""),
                mkNode ("span").classname ("+bold").addText ((sapi ("SERVER") ? sapi ("SERVER") + " " : "") + "[" + (user_data["id"] != 0 ? sapi ("user", "id") + " : " : "") + user_data["username"] + "]").applyStyle ({marginRight: "10px"}),
                (user_data["lastname"] != null ? (user_data["lastname"] + " " + user_data["firstname"].slice (0, 1) + ". " + user_data["middlename"].slice (0, 1)
                    + ". ") : user_data["displayname"] ? user_data["displayname"] + " " : "")
            ]);
//                        .$ ({title: struct.join ("|")});

        } else {
            $ ("#ui-box-useract").empty ().$ (["appendChild",
                mkNode ("a").$ (["appendChild", mkIco (10, 5), " "]).$ ({title: "Реєстрація для співробітників Управління інформаційного обслуговування клієнтів, що проходять навчання!", href: sapi ("URL_MOD") + "core/register.php"}),
                mkNode ("a").$ (["appendChild", mkIco (2, 6)]).$ ({title: "Авторизуватись", href: sapi ("URL_MOD") + "core/login.php"})
            ]);
            $ ("#ui-box-userinfo").empty ().addText ("Будь ласка, авторизуйтесь, або зареєструйтесь");
            $ ("#ui-box-usersearch").empty ();
        }
        UI.Skin.apply ();
        return true;
    },
    access: function (g, i) {
        var access = arguments.length === 2 ? sapi ("user", "access", g, i) : sapi ("user", "access", g);

        if (access === false) return false;
        else if (access) return !!access;
        else if (sapi ("user", "access", "admin", "su")) return true;
        else return false;
    }
});