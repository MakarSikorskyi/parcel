require.once (
    "lib/core/AJAX.js", "lib/dom/_batch.js", "lib/dom/addText.js", "lib/dom/empty.js", "lib/ui/calendar.js", "lib/dom/getFormData.js", "lib/dom/mkNode.js", "lib/event/getEvent.js",
    "lib/style/applyStyle.js", "sys/AJAX.events.js", "sys/GV.js", "ui/UI.report.js", "ui/UI.WorkSpace.js", "ui/UI.MainMenu.js", "sys/_Request.js"
);

var hash = window.GV.get ("hash") || "", req;

if (window.onLoginPage) window.onLoginPage ();
if (window.wfmOnLoginPage) window.wfmOnLoginPage ();

if (hash.replace (/\?.*$/, "") === window.location.hash.replace (/\?.*$/, "")) {
    window.GV.unset ("hash");
    hash = "";
}

notEnded = true;

!_Request.running () && _Request.refresh ();

if (!window.GV.get ("tryHash") && !/^#?$/.test (hash)) {
    window.GV.set ({tryHash: true});

    var ax = new AJAX;
    ax.url = hash.replace (/^#/, "");
    ax.onAct = function () {
        window.GV.unset ("hash");
        window.GV.unset ("tryHash");
    };
    ax.send ();

    notEnded = false;
}

if (notEnded) {
    if (sapi ("user", "auth")) {
        switch (sapi ("req", "_GET", "do")) {
            case "login":
                if (!/^#?$/.test (hash)) {
                    var ax = new AJAX;
                    ax.url = hash.replace (/^#/, "");
                    ax.onAct = function () {
                        window.GV.unset ("hash");
                        window.GV.unset ("tryHash");
                    };
                    ax.send ();
                }
            break;
            
            case "learning":
                var fel, el = {}, reload = function () {
                    switch (this.name) {
                        case "s_list":
                            if (this.value === "") {
                                el.struct.value = "3";
                                lear.style.display = "none";
                                pos.style.display = "";
                                date_j.style.display = "";
                                busy.style.display = "";
                                mod.style.display = "";
                                en.style.display = "";
                                inn.style.display = "";
                                email.style.display = "";
                                phone.style.display = "";
                                phone_l.style.display = "";
                                el.position.Disabled (true).empty ().appendChild (mkNode ("option").addText ("Спочатку оберіть підрозділ").Value (""));
                                el.module.Disabled (true).empty ().appendChild (mkNode ("option").addText ("Спочатку оберіть посаду").Value (""));
                                return;
                            } else if (this.value === "-1") {
                                struct.value = el.struct.value;
                                if (el.struct.value == "2") {
                                    lear.style.display = "";
                                    pos.style.display = "none";
                                    date_j.style.display = "none";
                                    busy.style.display = "none";
                                    mod.style.display = "none";
                                    en.style.display = "none";
                                    inn.style.display = "none";
                                    email.style.display = "none";
                                    phone.style.display = "none";
                                    phone_l.style.display = "none";
                                } else {
                                    lear.style.display = "none";
                                    pos.style.display = "";
                                    date_j.style.display = "";
                                    busy.style.display = "";
                                    mod.style.display = "";
                                    en.style.display = "";
                                    inn.style.display = "";
                                    email.style.display = "";
                                    phone.style.display = "";
                                    phone_l.style.display = "";
                                    var rq = new AJAX;
                                    rq.method = "POST";
                                    rq.url = sapi ("URL_MOD") + "core/login.php";
                                    rq.data = "step=position&struct=" + encodeURIComponent (el.struct.value);
                                    rq.onAct = function () {
                                        var position = sapi ("data", "position"), i;
                                        el.position.empty ().appendChild (mkNode ("option").addText ("Оберіть").Value (""));
                                        for (i in position) {
                                            el.position.appendChild (mkNode ("option").addText (position[i].name).Value (position[i].id));
                                        }
                                        el.position.Disabled (false).Value ("").applyEvent ("change");
//                                }
                                    };
                                    rq.send ();
                                }
                            } else {
                                var rq = new AJAX;
                                rq.method = "POST";
                                rq.url = sapi ("URL_MOD") + "core/login.php";
                                rq.data = "step=struct&struct=" + encodeURIComponent (this.value);
                                rq.onAct = function () {
                                    var struct = sapi ("data", "struct"), i, child = sapi ("data", "child");
                                    el.parent.empty ();
                                    for (i in struct) {
                                        el.parent.$ (["appendChild", mkNode ("a").addText (struct[i].name).$ ({href: "javascript:;", onclick: func (function (id) {
                                                    el.struct.value = id;
                                                    reload ();
                                                }, struct[i].id)}), " ► "]);
                                    }
                                    el.struct.value = struct[i].id;
                                    el.parent.removeChild (el.parent.lastChild);
                                    el.sList.empty ().$ (["appendChild", mkNode ("option").addText ("Оберіть").Value (""), mkNode ("option").addText ("Вибір завершено").Value ("-1")]);
                                    for (i in child) {
                                        el.sList.appendChild (mkNode ("option").addText (child[i].name).Value (child[i].id));
                                    }
                                };
                                rq.send ();
                                el.position.Disabled (true).empty ().appendChild (mkNode ("option").addText ("Спочатку оберіть підрозділ").Value (""));
                            }
                        break;

                        case "busyness":
                            if (this.value === "" || this.value === "2") {
                                el.een.Value ("").Disabled (true);
                            } else {
                                el.een.Value ("").Disabled (false);
                            }
                            busyness = this.value;
                        break;

                        case "position":
                            if (this.value === "") {
                                el.module.Disabled (true).empty ().appendChild (mkNode ("option").addText ("Спочатку оберіть посаду").Value (""));
                            } else {
                                var rq = new AJAX;
                                rq.method = "POST";
                                rq.url = sapi ("URL_MOD") + "core/login.php";
                                rq.data = "step=module&struct=" + encodeURIComponent (el.struct.value) + "&position=" + encodeURIComponent (this.value);
                                rq.onAct = function () {
                                    var module = sapi ("data", "module"), i;
                                    el.module.empty ().Disabled (false).appendChild (mkNode ("option").addText ("Оберіть").Value (""));
                                    for (i in module) {
                                        el.module.appendChild (mkNode ("option").addText (i + "-" + module[i].name).Value (module[i].id));
                                    }
                                    if (!i) {
                                        el.module.empty ().appendChild (mkNode ("option").addText ("0-не передбачено").Value ("0"));
                                    }
                                };
                                rq.send ();
                            }
                        break;

                        default:
                            var rq = new AJAX;
                            rq.method = "POST";
                            rq.url = sapi ("URL_MOD") + "core/login.php";
                            rq.data = "step=struct&struct=" + encodeURIComponent (el.struct.value);
                            rq.onAct = function () {
                                var struct = sapi ("data", "struct"), i, child = sapi ("data", "child");
                                el.parent.empty ();
                                for (i in struct) {
                                    el.parent.$ (["appendChild", mkNode ("a").addText (struct[i].name).$ ({href: "javascript:;", onclick: func (function (id) {
                                                el.struct.value = id;
                                                reload ();
                                            }, struct[i].id)}), " ► "]);
                                }
                                el.struct.value = struct[i].id;
                                el.parent.removeChild (el.parent.lastChild);
                                el.sList.empty ().$ (["appendChild", mkNode ("option").addText ("Оберіть").Value (""), mkNode ("option").addText ("Вибір завершено").Value ("-1")
                                ]);
                                for (i in child) {
                                    el.sList.appendChild (mkNode ("option").addText (child[i].name).Value (child[i].id));
                                }
                                el.sList.Disabled (false).Value ("").applyEvent ("change");
                                el.busyness.Value ("").applyEvent ("change");
                                el.position.Disabled (true).empty ().appendChild (mkNode ("option").addText ("Спочатку оберіть підрозділ").Value (""));
                            };
                            rq.send ();
                        break;
                    }
                };
                window.UI.MainMenu.active ();
                window.UI.WorkSpace.add (sapi ("URL_MOD") + "core/login.php?do=learning", "core", "login");
                window.UI.WorkSpace.active ("core", "login");
                window.UI.WorkSpace.legend ("Система планової зміни підрозділа");
                
                window.UI.WorkSpace.current ().empty ().$ (["appendChild",
                    mkNode ("form").$ (["appendChild", mkNode ("table").applyStyle ({width: "800px"}).$ (["appendChild", mkNode ("tbody").$ (["appendChild",
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("th").addText ("Інформація по співробітнику").$ ({colSpan: 5}).classname ("+decorate", "+ta-center")
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_struct"}).addText ("Підрозділ:")
                                                , mkNode ("span").addText ("*").classname ("+c-darkred")
                                    ]).applyStyle ({width: "120px"}).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild",
                                        el.parent = mkNode ("div").classname ("+ta-center"),
                                        fel = el.sList = mkNode ("select").$ ({id: "core_register_struct", name: "s_list", onchange: reload}).applyStyle ({width: "190px"})
                                    ]).applyStyle ({width: "200px"}),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").addText (
                                            "Оберіть підрозділ в якому ви працюєте. При виборі структури у списку будуть відображені усі дочірні підрозділи. Після вибору підрозділу стануть доступні для вибору інші елементи."
                                            )
                                ]),
                                pos = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_position"}).addText ("Посада:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.position = mkNode ("select").$ ({name: "position", id: "core_register_position", onchange: reload}).applyStyle ({width: "190px"})]),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").$ (["appendChild",
                                        "Оберіть посаду, на якій ви працюєте.", mkNode ("br"), mkNode ("span").addText ("Увага!").classname ("+c-darkred"),
                                        " У списку наведені лише посади, що доступні всередині обраного Вами підрозділу. Якщо ви впевнені, що у списку відсутні посади, що діють у Вашому підрозділі, зверніться до служби технічної підтримки, використовуючи функцію \"Підтримка користувачів\" із головного меню системи."
                                    ])
                                ]),
                                lear = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_learn"}).addText ("Кінцева дата навчання:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.learn = mkNode ("text").$ ({name: "learn", id: "core_register_learn", value: ""}).calendar ()]),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").$ (["appendChild",
                                        "ООберіть кінцеву дату навчання ", mkNode ("br"), mkNode ("span").addText ("Увага!").classname ("+c-darkred")
                                    ])
                                ]).applyStyle ({display: "none"}),
                                mod = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_position"}).addText ("Модуль:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.module = mkNode ("select").$ ({name: "module", id: "core_register_module"}).applyStyle ({width: "190px"})]),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").addText ("Оберіть свій модуль (бізнес-роль). Обов'язково для співробітників відділень. Якщо Ви не співробітник відділення і у Вас немає модуля, оберіть \"0-не передбачено\"")
                                ]),
                                date_j = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_join_date"}).addText ("Дата прийняття на роботу:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.date_job = mkNode ("text").$ ({name: "join_date", id: "core_register_join_date", value: ""}).calendar ()]),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").addText ("Вкажіть дату починаючи з якої ви офіційно працевлаштовані. Для співробітників, що працюють за договором підряду - вкажіть дату заключення першого договору.")
                                ]),
                                busy = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_busyness"}).addText ("Зайнятість:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.busyness = mkNode ("select").$ ({name: "busyness", id: "core_register_busyness", onchange: reload}, ["appendChild",
                                            mkNode ("option").Value ("").addText ("Оберіть"), mkNode ("option").Value ("0").addText ("Повний робочий день"), mkNode ("option").Value ("1").addText ("Неповний робочий день (0.5 ставки)"),
                                            mkNode ("option").Value ("2").addText ("Договір підряду"), mkNode ("option").Value ("3").addText ("Неповний робочий день (0.75 ставки)")
                                        ]).Value (sapi ("data", "data", "busyness"))])
                                ]),
                                en = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_register_een"}).addText ("Табельний номер:")]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", el.een = mkNode ("text").$ ({name: "een", id: "core_register_een", size: 5, disabled: true}).castType (/\d/)]),
                                    mkNode ("td").$ ({colSpan: 2}).classname ("+c-darkgray").addText (
                                            "Табельний номер - унікальний номер співробітника підприємства, під яким він значиться у внутрішніх документах, перш за все в особистій справі, табелі та документах по виплатам заробітної плати.\
                        У випадку не коректно вказаного табельного номеру, можливі проблеми при формуванні звітності по роботі з системою."
                                            )
                                ]),
                                inn = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").addText ("ІПН:").$ ({"for": "core_register_inn"})]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}).$ (["appendChild", mkNode ("text").$ ({name: "inn", id: "core_register_inn", size: 8, value: ""}).castType (/\d/, "__________").classname ("+ta-center")]),
                                    mkNode ("td").$ ({colSpan: 2}).addText ("Вкажіть Ваш індивідуальний податковий номер.").classname ("+c-darkgray")
                                ]),
                                email = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").addText ("E-mail:").$ ({"for": "core_register_email"})]).classname ("+ta-right"),
                                    mkNode ("td").$ ({colSpan: 2}, ["appendChild",
                                        mkNode ("text").$ ({name: "email", id: "core_register_email", value: ""}).Disabled (el.position == 7).castType (/[a-z0-9_.@-]/i)
                                    ]),
                                    mkNode ("td").$ ({colSpan: 2}).addText ("Вкажіть Вашу внутрішню корпоративну електронну поштову скриньку. Вона буде використовуватись для процедури відновлення паролю в разі його втрати, а також для зв'язку зі службою підтримки.").classname ("+c-darkgray")
                                ]),
                                phone = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").addText ("Телефони:").$ ({"for": "core_register_phone"})], {rowSpan: 2}).classname ("+ta-right"),
                                    mkNode ("td").$ (["appendChild",
                                        mkNode ("text").$ ({
                                            id: "core_register_phone", name: "phone_int", value: sapi ("data", "data", "phone_int"), size: 8, title: "Вкажіть внутрішній (IP) телефон за яким з Вами можна буде зв'язатись"
                                        }).Disabled (el.position == 7).castType (/\d/)
                                    ]),
                                    mkNode ("td").$ (["appendChild", mkNode ("text").$ ({name: "phone_1", value: sapi ("data", "data", "phone_1"), size: 11}).castType (/\d/, "(___)___-__-__")]),
                                    mkNode ("td").$ (["appendChild", mkNode ("text").$ ({name: "phone_2", value: sapi ("data", "data", "phone_2"), size: 11}).castType (/\d/, "(___)___-__-__")]).classname ("+ta-center"),
                                    mkNode ("td").$ (["appendChild", mkNode ("text").$ ({name: "phone_3", value: sapi ("data", "data", "phone_3"), size: 11}).castType (/\d/, "(___)___-__-__")]).classname ("+ta-center")
                                ]),
                                phone_l = mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").addText ("(Внутрішній)").classname ("+ta-center"), mkNode ("td").addText ("(Мобільний 1)").classname ("+ta-center"), mkNode ("td").addText ("(Мобільний 2)").classname ("+ta-center"),
                                    mkNode ("td").addText ("(Стаціонарний)").classname ("+ta-center")
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("th").$ ({colSpan: 5}, ["appendChild",
                                        el.struct = mkNode ("hidden").$ ({name: "struct", value: ""}),
                                        struct = mkNode ("hidden").$ ({name: "struct2", value: ""}),
                                        mkNode ("submit").Value ("Зберегти")
                                    ]).classname ("+ta-center", "+decorate")
                                ])
                            ])]).classname ("+margin-auto", "+padding")], {action: sapi ("URL_MOD") + "core/login.php?do=learning", onsubmit: function () {
                            getEvent (true).preventDefault ();
                            try {
                                for (var i = 0, el, re; i < this.elements.length; i++) {
                                    el = this.elements[i];

                                    switch (el.name) {
                                        case "s_list":
                                            if (el.value !== "-1") {
                                                throw new Error ("Необхідно повністю обрати підрозділ!");
                                            }
                                        break;

                                        case "position":
                                            if (struct.value != 2) {
                                                if (el.value === "") {
                                                    throw new Error ("Ви не вказали посаду!");
                                                }
                                            }
                                        break;

                                        case "module":
                                            if (struct.value != 2) {
                                                if (el.value === "") {
                                                    throw new Error ("Ви не вказали Ваш модуль!");
                                                }
                                            }
                                        break;

                                        case "join_date":
                                            if (struct.value != 2) {
                                                re = new RegExp (sapi ("regexp", "date"));
                                                if (!re.test (el.value)) {
                                                    throw new Error ("Невірно вказано дату прийняття на роботу!");
                                                }
                                            }
                                        break;
                                        case "learn":
                                            if (struct.value == 2) {
                                                re = new RegExp (sapi ("regexp", "date"));
                                                if (!re.test (el.value)) {
                                                    throw new Error ("Невірно вказано дату навчання!");
                                                }
                                            }
                                        break;

                                        case "busyness":
                                            if (struct.value != 2) {
                                                if (el.value === "") {
                                                    throw new Error ("Ви не вказали Вашу зайнятість!");
                                                }
                                            }
                                        break;

                                        case "een":
                                            if (struct.value != 2) {
                                                if (!el.Disabled () && el.value === "") {
                                                    throw new Error ("Невірно вказано табельний номер!");
                                                }
                                            }
                                        break;
                                        case "inn":
                                            if (struct.value != 2) {
                                                re = new RegExp (sapi ("regexp", "inn"));
                                                if (!re.test (el.value)) {
                                                    throw new Error ("Невірно вказано ІПН!");
                                                }
                                            }
                                        break;
                                        case "email":
                                            if (struct.value != 2) {
                                                re = new RegExp (sapi ("regexp", "email"), "i");
                                                if (busyness === "2" && !el.value) {
                                                    break;
                                                }
                                                if ( (!el.Disabled ()) && !re.test (el.value)) {
                                                    throw new Error ("Невірно вказано поштову скриньку!");
                                                }
                                            }
                                        break;

                                        case "phone_int":
                                            if (struct.value != 2) {
                                                if (!el.Disabled () && !/^[0-9]{3,}$/.test (el.value)) {
                                                    throw new Error ("Невірно вказано внутрішній номер телефону!");
                                                }
                                            }
                                        break;

                                        case "phone_1": case "phone_2": case "phone_3":
                                            if (struct.value != 2) {
                                                if (el.value !== el.__castType__[1] && /_/.test (el.value)) {
                                                    throw new Error ("Невірно вказано номер телефону!");
                                                }
                                            }
                                        break;
                                    }
                                }
//                               }
                            } catch (e) {
                                el.focus ();
                                window.UI.report (0, e.message);
                                return;
                            }

                            var rq = new AJAX;
                            rq.method = "POST";
                            rq.url = this.action;
                            rq.data = this.getFormData (true).join ("&");
                            rq.silent = true;
                            rq.send ();
                        }})
                ]);
                reload ();

                window.UI.WorkSpace.show (true);
            break;
            
            case "expires":
                window.UI.MainMenu.active ();
                window.UI.WorkSpace.add (sapi ("URL_MOD") + "core/login.php?do=expires", "core", "login");
                window.UI.WorkSpace.active ("core", "login");
                window.UI.WorkSpace.legend ("Система планової зміни паролю");

                var fel, exp = sapi ("user", "expires"), days = ["", "день", "дні", "дні", "дні", "днів", "днів", "днів"];

                window.UI.WorkSpace.current ().empty ().$ (["appendChild", mkNode ("form").$ (["appendChild", mkNode ("table").classname ("+padding").$ (["appendChild", mkNode ("tbody").$ (["appendChild",
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ ({colSpan: 2}).addText (
                                            exp <= 0 ?
                                            "Термін дії Вашого паролю закінчився. Вам необхідно змінити Ваш пароль." :
                                            "Термін дії Вашого паролю закінчується через " + exp + " " + days[exp] + ". Рекомендуємо змінити пароль вже зараз."
                                            ).applyStyle ({color: "red", paddingBottom: "10px"})
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild",
                                        mkNode ("label").$ ({
                                            "for": "core_login_expires_password",
                                            title: "Пароль повинен складатися не менш ніж із 8 символів,||та вміщати хоча б одну маленьку латинську літеру,||велику латинську літеру, цифру та спеціальний символ."
                                        }).addText ("Новий пароль:")
                                    ]).applyStyle ({textAlign: "right"}),
                                    mkNode ("td").$ (["appendChild", fel = mkNode ("password").$ ({core_login_expires_password: "", name: "password"})])
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild",
                                        mkNode ("label").$ ({"for": "core_login_expires_rpassword", title: "Повторіть уведенний вами пароль."}).addText ("Повтор паролю:")
                                    ]).applyStyle ({textAlign: "right"}),
                                    mkNode ("td").$ (["appendChild", mkNode ("password").$ ({core_login_expires_rpassword: "", name: "rpassword"})])
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ ({colSpan: 2}, ["appendChild",
                                        mkNode ("submit").$ ({value: "Зберегти"}),
                                        sapi ("user", "expires") > 0 ? mkNode ("button").$ ({value: "Ні, не зараз", onclick: function () {
                                                window.UI.WorkSpace.show (false);
                                                window.UI.WorkSpace.active ();
                                                window.UI.MainMenu.active ();
                                            }}) : ""
                                    ]).applyStyle ({textAlign: "center"})
                                ])
                            ])]).applyStyle ({
                            margin: "0 auto", fontWeight: "bold"
                        })], {action: sapi ("URL_MOD") + "core/login.php?do=expires", onsubmit: function () {
                            getEvent (true).preventDefault ();

                            for (var i = 0, el, pw, re = new RegExp (sapi ("regexp", "password")); i < this.elements.length; i++) {
                                el = this.elements[i];
                                switch (el.name) {
                                    case "password":
                                        pw = el;
                                        if (!re.test (el.Value ())) {
                                            window.UI.report (0, sapi ("data", "MSG", "expires", "password-invalid"));
                                            return;
                                        }
                                        break;

                                    case "rpassword":
                                        if (el.Value () !== pw.Value ()) {
                                            window.UI.report (0, sapi ("data", "MSG", "expires", "password-different"));
                                            return;
                                        }
                                        break;
                                }
                            }

                            var ax = new AJAX ();
                            ax.method = "POST";
                            ax.url = this.action;
                            ax.data = this.getFormData ().join ("&");
                            ax.onAct = function () {
                                if (sapi ("data", "success")) {
                                    window.UI.WorkSpace.show (false);
                                    window.UI.WorkSpace.active ();
                                    window.UI.MainMenu.active ();
                                }
                            };
                            ax.send ();
                        }})]);

                window.UI.WorkSpace.show (true);
                fel.focus ();
            break;

            case "su":
                window.UI.MainMenu.active ();
                window.UI.WorkSpace.add (sapi ("URL_MOD") + "core/login.php?do=su", "core", "login");
                window.UI.WorkSpace.active ("core", "login");
                window.UI.WorkSpace.legend ("Режим зміни користувача (SU)");

                var fel;

                window.UI.WorkSpace.current ().empty ().$ (["appendChild",
                    mkNode ("form").$ (["appendChild", mkNode ("table").classname ("+padding").$ (["appendChild", mkNode ("tbody").$ (["appendChild",
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_login_su_username"}).addText ("Ім'я користувача (логін):")]).applyStyle ({textAlign: "right"}),
                                    mkNode ("td").$ (["appendChild", fel = mkNode ("text").$ ({name: "username", id: "core_login_su_username"})])
                                ]),
                                mkNode ("tr").$ (["appendChild", mkNode ("td").addText ("АБО").$ ({colSpan: 2})]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_login_su_id"}).addText ("ID користувача (UID):")]).applyStyle ({textAlign: "right"}),
                                    mkNode ("td").$ (["appendChild", mkNode ("text").$ ({name: "id", id: "core_login_su_id"})])
                                ]),
                                mkNode ("tr").$ (["appendChild",
                                    mkNode ("td").$ ({colSpan: 2}, ["appendChild", mkNode ("submit").$ ({value: "Змінити"})])
                                ])
                            ])]).applyStyle ({textAlign: "center", margin: "10px auto", fontWeight: "bold"})], {action: sapi ("URL_MOD") + "core/login.php?do=su", onsubmit: function () {
                            getEvent (true).preventDefault ();

                            elements: for (var i = 0, el, re; i < this.elements.length; i++) {
                                el = this.elements[i];
                                switch (el.name) {
                                    case "username":
                                        if (!el.Value ()) {
                                            continue elements;
                                        }

                                        re = new RegExp (sapi ("regexp", "username"), "i");
                                        if (!re.test (el.Value ())) {
                                            window.UI.report (0, sapi ("data", "MSG", "su", "username-invalid"));
                                            return;
                                        }

                                        break elements;
                                        break;

                                    case "id":
                                        if (el.Value ()) {
                                            if (isNaN (Number (el.Value ()))) {
                                                window.UI.report (0, sapi ("data", "MSG", "su", "id-invalid"));
                                            }
                                            break elements;
                                        }
                                        break;
                                }

                                window.UI.report (0, sapi ("data", "MSG", "su", "fields-empty"));
                                return;
                            }

                            var ax = new AJAX;
                            ax.method = "post";
                            ax.url = this.action;
                            ax.data = this.getFormData ().join ("&");
                            ax.send ();
                        }})
                ]);

                window.UI.WorkSpace.show (true);
                fel.focus ();
            break;

            default:
                hash = window.GV.get ("hash") || "";
                if (!/^#?$/.test (hash)) {
                    var ax = new AJAX;
                    ax.url = hash.replace (/^#/, "");
                    ax.send ();

                    window.GV.unset ("hash");
                    window.GV.unset ("tryHash");
                }

                window.location.hash = "";
            break;
        }
        var wsact = UI.WorkSpace.getActive ();
        if (!wsact[0]) goTo (sapi ("URL_MOD") + "core/main.php") ();
    } else {
        window.UI.MainMenu.active ("login");
        window.UI.WorkSpace.active ("login");

        if (sapi ("req", "_GET", "do") !== "login") {
            var fel;
            window.UI.WorkSpace.current ().empty ().$ (["appendChild",
                mkNode ("form").$ ({action: sapi ("URL_MOD") + "core/login.php?do=login"}, ["appendChild",
//                    mkNode ("table").classname ("+margin-auto", "+bg-red").$ (["appendChild",
//                        mkNode ("tbody").$ (["appendChild",
//                            mkNode ("tr").$ (["appendChild",
//                                mkNode ("td").$ (["appendChild",
//                                    mkNode ("p").applyStyle ({fontSize: "110%", fontWeight: "bold", textIndent: "1.5em"}).addText ("Увага! Для входу до системи необхідно використовувати мережеві ім'я користувача та пароль (як для робочої станції, після завантаження ПК)."),
//                                    mkNode ("br"),
////                                    mkNode ("p").applyStyle ({fontSize: "110%", textIndent: "1.5em"}).addText ("У разі блокування доступу необхідно зареєструвати звернення виключно засобами WEB сторінки Служби підтримки користувачів з проханням розблокувати доступ до робочої станції.")
//                                    mkNode ("p").applyStyle ({fontSize: "110%", textIndent: "1.5em"}).addText ("Пароль в Active Directory (вхід в ПК) розблоковується через 15 хвилин автоматично. У разі входження в ПК з поточним мережевим паролем, необхідно коректно ввести аналогічні логін та пароль в ПЗ Sales Base. Для перевірки необхідно перегрузити ПК і перевірити актуальінсть пароля Novell за посиланням:"),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", textAlign: "center"}).$ (["appendChild",
//                                        mkNode ("a").classname ("+c-darkblue").$ ({rel: "external", href: "https://pass.kv.aval/nps/servlet/portal?render=on"}).addText ("https://pass.kv.aval/nps/servlet/portal?render=on")]).addText ("."),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", textIndent: "1.5em"}).addText ("Якщо Ви увійшли в ПК без проблем і повторно не можете увійти до Sales Base з даними логіном або паролем - Ви не вірно вводите логін або пароль."),
//                                    mkNode ("br"),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", fontWeight: "bold", textIndent: "1.5em"}).$ (["appendChild",
//                                        "Увага! Керування доступом користувачів, за виключенням мобільних банкірів (договір підряду), здійснюється через автоматизовану систему керування доступами ",
////                                        mkNode ("a").$ ({rel: "external", fontWeight: "normal", href: "https://oim.slb.kv.aval/oim/"}).addText ("Oracle Identity Manager (OIM)").classname ("+c-darkblue"),
//                                        mkNode ("a").$ ({rel: "external", fontWeight: "normal", href: "https://oimnew.slb.kv.aval"}).addText ("Oracle Identity Manager (OIM)").classname ("+c-darkblue"),
//                                        "."
//                                    ]),
//                                    mkNode ("br"),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", textIndent: "1.5em"}).addText ("Кожен співробітник РБА може в ОІМі замовити і перевірити свій доступ та особисту інформацію. Співробітники ОД та ЦО можуть замовляти собі доступ в рамках погоджених шаблонів доступу до інформаційних ресурсів Банку. Шаблони доступу викладені за посиланням:"),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", textAlign: "center"}).$ (["appendChild",
//                                        mkNode ("span").classname ("+d-block", "+margin-auto").applyStyle ({width: "75%"}).$ (["appendChild",
//                                            mkNode ("a").$ ({rel: "external", href: "http://www.kv.aval/ua/departments/department_102/section_1107.html?dep_id=102"}).addText ("Головна сторінка (http://www.kv.aval/) -> Безпека та правовий захист -> Департамент інформаційної безпеки -> Керування доступами користувачів до інформаційних ресурсів Банку").classname ("+c-darkblue"),
//                                            " -> Sales Base."
//                                        ])
//                                    ]),
//                                    mkNode ("br"),
//                                    mkNode ("p").applyStyle ({fontSize: "110%", fontWeight: "bold", textIndent: "1.5em"}).addText ("Співробітникам відділень доступ надається автоматично в розрізі функціональних модулів згідно наказів в ПЗ IRBIS HR.")
//                                ]).applyStyle ({padding: "10px"})
//                            ])
//                        ])
//                    ]).applyStyle ({width: "600px", border: "1px solid #e00", color: "#a00", textAlign: "justify"}),
                    mkNode ("table").classname ("+padding", "+margin-auto").$ (["appendChild",
                        mkNode ("tbody").$ (["appendChild",
                            mkNode ("tr").$ (["appendChild",
                                mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_login_username", title: "Логін для входу в систему, співпадає з логіном для входу до робочої станції"})
                                    .addText ("Ім'я користувача:")]).applyStyle ({textAlign: "right"}),
                                mkNode ("td").$ (["appendChild", fel = mkNode ("text").$ ({name: "username", id: "core_login_username"})]).applyStyle ({textAlign: "left"})
                            ]),
                            mkNode ("tr").$ (["appendChild",
                                mkNode ("td").$ (["appendChild", mkNode ("label").$ ({"for": "core_login_password", title: "Введіть пароль, який Ви використовуєте для входу до робочої станції"})
                                    .addText ("Пароль:")]).applyStyle ({textAlign: "right"}),
                                mkNode ("td").$ (["appendChild",
                                    mkNode ("password").$ ({name: "password", id: "core_login_password", onkeydown: function (event) {
                                        var caps = event.getModifierState && event.getModifierState ('CapsLock');
                                        if (caps) {
                                            $ ("#core_caps_lbl").applyStyle ({display: "inline-block"});
                                        } else {
                                            $ ("#core_caps_lbl").applyStyle ({display: "none"});
                                        }
                                    }}),
                                    mkNode ("div").$ ({id: "core_caps_lbl"}).addText ("УВАГА: ввімкнено Caps Lock!").classname ("+c-darkred").applyStyle ({
                                        margin: "left", padding: "6px", margin: "3px", display: "none", position: "absolute", float: "left"
                                    })
                                ]).applyStyle ({textAlign: "left"})
                            ]),
                            mkNode ("tr").$ (["appendChild",
                                mkNode ("td").$ ({colSpan: 2}, ["appendChild",
                                    sapi ("NTLM_AUTH") === true ? mkNode ("button").$ ({value: "Active Directory", title: "Автоматичний вхід по даним з робочої станції", onclick: func (NTLM.auth)}).classname ("+special") : "",
                                    mkNode ("submit").$ ({value: "Увійти"})])
                            ]).applyStyle ({textAlign: "right"})
                        ])
                    ]).applyStyle ({fontWeight: "bold"})], {onsubmit: function () {
                        getEvent (true).preventDefault ();

                        for (var i = 0, el, re; i < this.elements.length; i++) {
                            el = this.elements[i];
                            switch (el.name) {
                                case "username":
                                    if (/^\s*$/.test (el.Value ())) {
                                        window.UI.report (0, sapi ("data", "MSG", "login", "username-empty"));
                                        return false;
                                    }
                                    re = new RegExp (sapi ("regexp", "username"), "i");
                                    if (!re.test (el.Value ())) {
                                        window.UI.report (0, sapi ("data", "MSG", "login", "username-invalid"));
                                        return false;
                                    }
                                break;
                                case "password":
                                    if (el.Value () === "") {
                                        window.UI.report (0, sapi ("data", "MSG", "login", "password-empty"));
                                        return false;
                                    }
                                break;
                            }
                        }

                        var ax = new AJAX ();
                        ax.method = "POST";
                        ax.url = this.action;
                        ax.data = this.getFormData ().join ("&");
                        ax.send ();
                    }})
            ]);

            window.UI.WorkSpace.legend ("Система авторизації");
            window.UI.WorkSpace.show (true);
            fel.focus ();
        }
    }
}
