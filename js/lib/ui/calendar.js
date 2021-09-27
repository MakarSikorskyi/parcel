require.once (
    "lib/date/dowOffset.js", "lib/date/format.js", "lib/date/getWeek.js", "lib/dom/_batch.js", "lib/dom/_extend.js", "lib/dom/classname.js", "lib/dom/getPosition.js", "lib/dom/getScrollPos.js", "lib/dom/mkNode.js",
    "lib/event/applyEvent.js", "lib/style/applyStyle.js", "lib/ui/castType.js", "lib/window/getSize.js"
) && window.$.addExtension ("*", {calendar: (function () {
    var self = {
            box: document.body.appendChild (mkNode ("table").$ ({id: "ui-box-calendar"})).classname ("+collapse").addEventHandler (function () {
                getEvent (true);
            }, "click", "mousedown", "mouseup", "selectstart"),
            owner: null, date: null, val: null, state: false,
            eh: {
                d: function () {
                    var e = getEvent ();
                    if (!self.owner || e.target !== document && self.owner === e.target) return;

                    self.show (false);
                    self.apply ();
                },
                w: function () {
                    self.owner && self.show (false);
                }
            },
            apply: function (force) {
                if (force) {
                    self.val = self.owner.Value ();
                    self.owner.applyEvent ("change");
                    return;
                }

                if (self.val === self.owner.Value ()) return;

                var data = self.owner.Value ().split (/[^0-9_]/);
                /_/.test (data[1]) || self.date.setDate (1);
                /_/.test (data[2]) || self.date.setFullYear (data[2]);
                /_/.test (data[1]) || self.date.setMonth (data[1] - 1);
                /_/.test (data[0]) || self.date.setDate (data[0]);

                if (self.owner.__time__) {
                    /_/.test (data[3]) || self.date.setHours (data[3]);
                    /_/.test (data[4]) || self.date.setMinutes (data[4]);
                    /_/.test (data[5]) || self.date.setSeconds (data[5]);
                    self.time.applyStyle ({display: "inline-block"});
                } else self.time.applyStyle ({display: "none"});

                if (!/_/.test (self.owner.Value ())) self.owner.Value (self.date.format (((self.owner.__dots__)? "d.m.Y" : "d/m/Y") + (self.owner.__time__ ? " H:i:s" : "")));

                if (self.val === self.owner.Value ()) return;

                self.val = self.owner.Value ();
                self.owner.applyEvent ("change");
            }, build: function () {
                self.year.Value (self.date.getFullYear ());
                self.month.Value (self.date.getMonth ());
                self.time.Value (self.date.format ("H:i:s"));

                var cDate = new Date (self.date.getFullYear (), self.date.getMonth (), 1), i, j, tr, today = new Date ();

                while (cDate.getDay () != Date.dowOffset ()) cDate.setDate (cDate.getDate () - 1);

                self.days.empty ();
                for (i = 0; i < 6; i++) {
                    tr = self.days.appendChild (mkNode ("tr"));
                    for (j = 0; j < 8; j++) {
                        if (j === 0) tr.appendChild (mkNode ("th").addText (cDate.getWeek ()));
                        else {
                            tr.appendChild (mkNode ("td").addText (cDate.getDate ())).classname (
                                (cDate.format ("m") !== self.date.format ("m") ? "+" : "-") + "other",
                                (cDate.format ("Y-m-d") === today.format ("Y-m-d") ? "+" : "-") + "today",
                                (cDate.format ("Y-m-d") === self.date.format ("Y-m-d") ? "+" : "-") + "active"
                            ).addEventHandler (func (function (d) {
                                self.owner.Value (d + (self.owner.__time__ ? " " + self.time.Value () : "")).focus ();
                                self.show (false);
                            }, cDate.format (((self.owner.__dots__)? "d.m.Y" : "d/m/Y"))), "click");
                            cDate.setDate (cDate.getDate () + 1);
                        }
                    }
                }
            }, event: function () {
                if (this.Disabled () || this.ReadOnly ()) return;

                var e = getEvent (false);

                switch (e.type) {
                    case "focus":
                        self.focus (this);
                        this.__focus__ = true;
                        /_/.test (this.value) && self.show (true);
                    break;

                    case "click":
                        if (!this.__focus__) return;
                        self.show (true);
                    break;

                    case "keydown": if (/^(9|27)$/.test (e.keyCode)) self.show (false); break;

                    case "keyup": self.show (this.__castType__[1] === this.Value ()); break;

                    case "blur":
                        delete this.__focus__;
                        self.apply ();
                    break;
                }
            }, focus: function (o) {
                if (self.owner !== null) {
                    self.apply ();
                    self.show (false);
                }

                self.owner = o;
                self.val = o.Value ();

                var data = self.val.split (/[^0-9_]+/);

                self.date = new Date ();
                /_/.test (data[1]) || self.date.setDate (1);
                /_/.test (data[2]) || self.date.setFullYear (data[2]);
                /_/.test (data[1]) || self.date.setMonth (data[1] - 1);
                /_/.test (data[0]) || self.date.setDate (data[0]);

                if (o.__time__) {
                    /_/.test (data[3]) || self.date.setHours (data[3]);
                    /_/.test (data[4]) || self.date.setMinutes (data[4]);
                    /_/.test (data[5]) || self.date.setSeconds (data[5]);
                    self.time.applyStyle ({display: "inline-block"});
                } else self.time.applyStyle ({display: "none"});
            }, show: function (show) {
                if (show && !self.state) {
                    self.build ();

                    var o = self.owner, pos = o.getPosition (), ds = document.getScrollPos (), ws = window.getSize (), box = self.box.applyStyle ({display: "block"});

                    pos.y += o.offsetHeight;
                    if ((ws.height + ds.y) < (box.offsetHeight + pos.y + 75) && (ds.y + ws.height - 75 - pos.y) < (pos.y - o.offsetHeight - ds.y - 30)) pos.y -= o.offsetHeight + box.offsetHeight + 2;
                    if (ws.width < box.offsetWidth + pos.x + 10) pos.x -= box.offsetWidth - o.offsetWidth;
                    pos.x--;

                    box.applyStyle ({top: pos.y + "px", left: pos.x + "px", visibility: "visible"});
                    self.state = true;

                    window.addEventHandler (self.eh.w, "resize");
                    document.addEventHandler (self.eh.d, "click", "mousedown", "mouseup");
                } else if (!show && self.state) {
                    self.box.applyStyle ({top: 0, left: 0, display: "none", visibility: "hidden"});
                    self.state = false;

                    window.removeEventHandler (self.eh.w, "resize");
                    document.removeEventHandler (self.eh.d, "click", "mousedown", "mouseup");
                }
            }
        }, months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"], days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], years, i, j;

    self.box.$ (["appendChild",
        mkNode ("thead").$ (["appendChild",
            mkNode ("tr").$ (["appendChild",
                mkNode ("th").$ ({colSpan: 8}).$ (["appendChild",
                    mkNode ("button").Value ("<").$ ({onclick: function () {
                        self.date.setMonth (self.month.Value () - 1);
                        self.build ();
                    }}),
                    self.month = mkNode ("select").$ ({onchange: function () {
                        self.date.setMonth (this.value);
                        self.build ();
                    }}),
                    mkNode ("button").Value (">").$ ({onclick: function () {
                        self.date.setDate (1);
                        self.date.setMonth (self.month.Value () - -1);
                        self.build ();
                    }}),
                    mkNode ("button").Value ("<").$ ({onclick: function () {
                        self.date.setDate (1);
                        self.date.setFullYear (self.year.Value () -1);
                        self.build ();
                    }}),
                    self.year = mkNode ("select").$ ({onchange: function () {
                        self.date.setFullYear (this.value);
                        self.build ();
                    }}),
                    mkNode ("button").Value (">").$ ({onclick: function () {
                        self.date.setFullYear (self.year.Value () - -1);
                        self.build ();
                    }})
                ])
            ]),
            self.daynames = mkNode ("tr").$ (["appendChild", mkNode ("th")])
        ]),
        self.days = mkNode ("tbody"),
        mkNode ("tfoot").$ (["appendChild",
            mkNode ("tr").$ (["appendChild",
                mkNode ("th").$ ({colSpan: 8}, ["appendChild", self.time = mkNode ("text").castType (/\d/, "__:__:__").$ ({onchange: function () {
                    var v = this.value.split (/:/);
                    /_/.test (v[0]) || self.date.setHours (v[0]);
                    /_/.test (v[1]) || self.date.setMinutes (v[1]);
                    /_/.test (v[2]) || self.date.setSeconds (v[2]);
                }, size: 5}).applyStyle ({textAlign: "center"})])
            ])
        ])
    ]);
    for (i = 0; i < months.length; i++) self.month.appendChild (mkNode ("option").addText (months[i]).Value (i));
    years = new Date ().getFullYear ();
    for (i = years - 92; i < years + 25; i++) self.year.appendChild (mkNode ("option").addText (i).Value (i));
    for (i = 0; i < days.length; i++) {
        j = Date.dowOffset () + i;
        j > 6 && (j -= 7);
        self.daynames.appendChild (mkNode ("th").addText (days[j]));
    }

    return function (time, dots) {
        if (this.haveEventHandler (self.event)) return this;
        this.__time__ = !!time;
        this.__dots__ = !!dots;
        return this.castType (/\d/, (!!dots ? '__.__.____' : '__/__/____') + (!!time ? ' __:__:__' : '')).$ ({size: !!time ? 17 : 8}).addEventHandler (self.event, "click", "focus", "blur", "keyup", "keydown").applyStyle ({textAlign: "center"});
    };
}) ()});