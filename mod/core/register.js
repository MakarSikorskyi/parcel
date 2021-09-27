require.once("lib/event/applyEvent.js", "lib/ui/castType.js", "lib/ui/calendar.js", "sys/goTo.js", "ui/UI.MainMenu.js", "ui/UI.WorkSpace.js", "ui/UI.WSTabs.js", "lib/string/toDate.js");

window.UI.WorkSpace.active("register");
window.UI.WorkSpace.legend("Реєстрація в системі SalesBase");


window.UI.WorkSpace.legend("Registration", true);

window.UI.WorkSpace.current().empty().$(["appendChild",
    mkNode("form").$(["appendChild", mkNode("table").applyStyle({width: "800px"}).$(["appendChild", mkNode("tbody").$(["appendChild",
        mkNode("tr").$(["appendChild",
            mkNode("th").addText("User info").$({"colSpan": 3}).classname("+decorate", "+ta-center")
        ]),
        mkNode("tr").$(["appendChild",
            mkNode("td").$(["appendChild", 
                mkNode("label").$({"for": "core_register_username"}).addText("Username:")
            ]).classname("+ta-right"),
            mkNode("td").$(["appendChild", 
                mkNode("text").$({"name": "username", "id": "core_register_username"})
            ])
        ]),
        mkNode("tr").$(["appendChild",
            mkNode("td").$(["appendChild", 
                mkNode("label").$({"for": "core_register_pass"}).addText("Password:")
            ]).classname("+ta-right"),
            mkNode("td").$(["appendChild", 
                mkNode("password").$({"name": "password", "id": "core_register_pass"})
            ]),
            mkNode("td").addText("Пароль для авторизації в системі. Він повинен складатися не менш ніж з 8 символів і має включати в себе хоча б одну латинську літеру, одну цифру, та один спеціальний сивол.").classname("+c-darkgray")
        ]),
        mkNode("tr").$(["appendChild",
            mkNode("td").$(["appendChild", 
                mkNode("label").$({"for": "core_register_ph"}).addText("Phone:")
            ]).classname("+ta-right"),
            mkNode("td").$(["appendChild", 
                mkNode("input").$({"name": "phone_1", "id": "core_register_ph"})
            ])
        ]),
        mkNode("tr").$(["appendChild",
            mkNode("td").$(["appendChild", 
                mkNode("label").$({"for": "core_register_em"}).addText("Email:")
            ]).classname("+ta-right"),
            mkNode("td").$(["appendChild", 
                mkNode("input").$({"name": "email", "id": "core_register_em"})
            ])
        ]),
        mkNode ("tr").$ (["appendChild",
            mkNode ("td").$ (["appendChild", mkNode ("label").addText ("Прізвище:").$ ({"for": "core_register_lastname"})]).classname ("+ta-right"),
            mkNode ("td").$ (["appendChild",
                fel = mkNode ("text").$ ({"name": "lastname", "id": "core_register_lastname", "value": sapi ("data", "data", "lastname")}).castType (new RegExp (sapi ("regexp", "letter"), "i"))
            ]).applyStyle ({width: "180px"}),
            mkNode ("td").addText ("Вкажіть Ваше прізвище УКРАЇНСЬКОЮ мовою.").classname ("+c-darkgray")
        ]),
        mkNode ("tr").$ (["appendChild",
            mkNode ("td").$ (["appendChild", mkNode ("label").addText ("Ім'я:").$ ({"for": "core_register_firstname"})]).classname ("+ta-right"),
            mkNode ("td").$ (["appendChild", mkNode ("text").$ ({"name": "firstname", "id": "core_register_firstname", "value": sapi ("data", "data", "firstname")})
                .castType (new RegExp (sapi ("regexp", "letter"), "i"))]),
            mkNode ("td").addText ("Вкажіть Ваше ім'я УКРАЇНСЬКОЮ мовою.").classname ("+c-darkgray")
        ]),
        mkNode ("tr").$ (["appendChild",
            mkNode ("td").$ (["appendChild", mkNode ("label").addText ("По-батькові:").$ ({"for": "core_register_middlename"})]).classname ("+ta-right"),
            mkNode ("td").$ (["appendChild", mkNode ("text").$ ({"name": "middlename", "id": "core_register_middlename", "value": sapi ("data", "data", "middlename")})
                .castType (new RegExp (sapi ("regexp", "letter"), "i"))]),
            mkNode ("td").addText ("Вкажіть Ваше ім'я по-батькові УКРАЇНСЬКОЮ мовою.").classname ("+c-darkgray")
        ]),
        mkNode("tr").$(["appendChild",
            mkNode("th").$({"colSpan": 3}, ["appendChild",
                mkNode("submit").Value("Реєстрація")
            ]).classname("+ta-center", "+decorate")
        ])
    ])]).classname("+margin-auto", "+padding")], {
        "action": sapi("URL_MOD") + "core/register.php?step=reg", "onsubmit": function () {
            getEvent(true).preventDefault();
            try {
                for (var i = 0, el, re; i < this.elements.length; i++) {
                    el = this.elements[i];

                    switch (el.name) {
                        case "lastname":
                            re = new RegExp (sapi ("regexp", "realname"), "i");
                            if (!re.test (el.value)) {
                                throw new Error ("Невірно вказано прізвище!");
                            }
                        break;

                        case "firstname":
                            re = new RegExp (sapi ("regexp", "realname"), "i");
                            if (!re.test (el.value)) {
                                throw new Error ("Невірно вказано ім'я!");
                            }
                        break;

                        case "middlename":
                            re = new RegExp (sapi ("regexp", "realname"), "i");
                            if (!re.test (el.value)) {
                                throw new Error ("Невірно вказано ім'я по-батькові!");
                            }
                        break;

                        case "username":
                            re = new RegExp(sapi("regexp", "username"), "i");
                            if (!re.test(el.value)) {
                                throw new Error("Невірно вказано ім'я користувача (логін)!");
                            }
                            break;

                        case "password":
                            re = new RegExp(sapi("regexp", "password"), "i");
                            if (!re.test(el.value)) {
                                throw new Error("Пароль не відповідає необхідним вимогам!");
                            }
                            break;
                    }
                }
            } catch (e) {
                el.focus ();
                window.UI.report (0, e.message);
                return;
            }
            var rq = new AJAX;
            rq.method = "POST";
            rq.url = this.action;
            rq.data = this.getFormData().join("&");
            rq.send();
        }
    })
]);

window.UI.MainMenu.active("register");
window.UI.WorkSpace.show(true);