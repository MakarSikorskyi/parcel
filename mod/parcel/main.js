require.once(
    'lib/ui/castType.js', 'lib/dom/empty.js', 'lib/dom/classname.js', 'lib/ui/calendar.js', 'lib/dom/insertAfter.js',
    'lib/core/upload.js', 'lib/core/download.js', 'ui/UI.DialogBox.js', 'lib/ui/pages.js', 'lib/dom/clone.js','ui/UI.WSTabs.js',
    "lib/style/CSS.js", sapi ("URL_MOD") + "wfm/contrib/multiselect.js", sapi ("URL_MOD") + "cc_report/_Chart.js", "lib/ui/hex2rgba.js",
    "lib/style/material.js", 'ui/UI.Dialogs.js', 'lib/string/toDate.js', 'ui/UI.Board.js', 'lib/chartjs/chart.js', sapi ("URL_MOD") + "core/webDialer.js"
);

window.UI.MainMenu.active('parcel');
window.UI.WorkSpace.active('parcel');
window.UI.WorkSpace.legend('Parcel');
window.UI.WorkSpace.current().empty();

var __ = 'appendChild',
    urlMod = sapi("URL_MOD") + "parcel/main.php",
    parcel_list = sapi('data', 'parcel_list'),
    category = sapi('data', 'category'),
    access = {
        admin:  window.UI.User.access ('parcel', 'admin'),
        client:  window.UI.User.access ('parcel', 'client')
    },
    statesC = {
        1: '#bbdefb', 
        2: '#c8e6c9', 
        3: '#ffcdd2'
    },
    main = mkNode('div'),
    chart_board = new UI.Board (false, false);
    
    function addCategory() {
        var dbox = window.UI.Dialogs('Category', 350, 100);
        dbox.box.$([__,
           mkNode('form').$([__,
                mkNode('div').$({material:false}).$([__,
                    mkNode('input').$({
                        material:'inline', 
                        placeholder:'Name', 
                        name:'name'
                    }).applyStyle({width:'170px'})
                ])
            ],{
                onsubmit: function() {
                    var rq = new AJAX ();
                    rq.method = 'POST';
                    rq.url = urlMod;
                    rq.data = 'action=add_category&' + this.getFormData().join('&');
                    rq.onAct = function () {
                        dbox.remove();
                        getCategory();
                    }
                    rq.send();
                    return false;
                }
            }).applyStyle ({width: '100%'})
        ]);
        dbox.wrapper.onClose = function() {
            dbox.remove();
            getCategory();
        };
    }
    
    function getCategory() {
        var rq = new AJAX ();
        rq.method = 'POST';
        rq.url = urlMod;
        rq.silent = false;
        rq.data = 'action=get_category';
        rq.onAct = function () {
            var category = sapi('data', 'category');

            var dbox = window.UI.Dialogs('Category', 350, 450);
            dbox.box.$([__,
               mkNode('table').$({material: true},[__,
                    mkNode('thead').$([__,
                        mkNode('tr').$([__,
                            mkNode('th').addText('ID'),
                            mkNode('th').addText('Name'),
                            mkNode('th').$([__,
                                MaterialIcon('add_circle', 20).$({
                                    onclick: function() {
                                        dbox.remove();
                                        addCategory();
                                    }
                                })
                            ])
                        ])
                    ]),
                    body = mkNode('tbody')
                ]).applyStyle ({width: '100%'})
            ]);

            for (var i in category) {
                body.$([__,
                    mkNode('tr').$([__,
                        mkNode('th').addText(category[i].id),
                        mkNode('th').addText(category[i].name),
                        mkNode('th').$([__,
                                MaterialIcon('close', 20).$({
                                    onclick: func(function(id) {
                                        var rq = new AJAX ();
                                        rq.method = 'POST';
                                        rq.url = urlMod;
                                        rq.data = 'action=delete_category&id=' + id;
                                        rq.onAct = function () {
                                            dbox.remove();
                                            getCategory();
                                        }
                                        rq.send();
                                        return false;
                                    },category[i].id)
                                }).applyStyle({color:'red'})
                            ])
                    ])
                ])
            }
        };
        rq.send ();
        return false;
    }
    
    function parcel(data) {
        var rq = new AJAX ();
        rq.method = 'POST';
        rq.url = urlMod;
        rq.data = 'action=get_list';
        rq.silent = true;
        rq.onAct = function () {
            list = sapi('data', 'list');
            
            var s = [];
            var dbox = window.UI.Dialogs('Parcel', 350, 400);
            dbox.box.$([__,
               form = mkNode('form').$([__,
                    mkNode('div').$({material:false}).$([__,
                        mkNode('select').$({
                            material:'inline', 
                            placeholder:'Recipient', 
                            name:'recipient',
                            searchOption:true,
                            defaultOption: true,
                            required: true
                        }).applyStyle({width:'180px'}),
                        mkNode('select').$({
                            material:'inline', 
                            placeholder:'Category', 
                            name:'category',
                            defaultOption: true,
                            required: true
                        }).applyStyle({width:'180px'}),
                        (access.admin && data) ?  mkNode('select').$({
                            material:'inline', 
                            placeholder:'State', 
                            name:'state',
                            required: true
                        }).applyStyle({width:'180px'}).$([__,
                            mkNode('option').addText('Send').Value(1),
                            mkNode('option').addText('Recive').Value(2),
                            mkNode('option').addText('Canceled').Value(3)
                        ]) : false,
                        mkNode('input').$({
                            material:'inline', 
                            placeholder:'Weight', 
                            name:'weight',
                            required: true
                        }).applyStyle({width:'170px'}).castType(/\d/),
                        mkNode('input').$({
                            material:'inline', 
                            placeholder:'Розміри (ШхВхГ)', 
                            name:'size',
                            required: true
                        }).applyStyle({width:'170px'}).castType(/\d/,'__x__x__'),
                        mkNode('input').$({
                            material:'inline', 
                            placeholder:'Price', 
                            name:'price',
                            required: true
                        }).applyStyle({width:'170px'}).castType(/\d/),
                        mkNode('textarea').$({
                            material:'inline', 
                            placeholder:'Comment', 
                            name:'comment',
                            rows:'5'
                        }).applyStyle({width:'170px'})
                    ]),
                    mkNode('submit').Value('Save').$({material:true})
                ],{
                    onsubmit: function() {
                        if(this.validateForm()) {
                            var rq = new AJAX ();
                            rq.method = 'POST';
                            rq.url = urlMod;
                            rq.data = 'action=add_parcel&' + this.getFormData().join('&');
                            rq.onAct = function () {

                            }
                            rq.send();
                        }
                        return false;
                    }
                }).applyStyle ({width: '100%'})
            ]);
            
            for (i = 0; i < form.elements.length; i++){
                el = form.elements[i];
                if(list[el.name]) {
                    for(var j in list[el.name]) {
                        var item = list[el.name][j];
                        el.$([__,
                            mkNode('option').addText(item.name).Value(item.id)
                        ])
                    }
                }
                if(data && data[el.name]) { el.Value(data[el.name]).applyEvent('change').blur(); }
            }
        }
        rq.send();
    }
    
    main.$([__,
        mkNode('div').$({material:false},[__,
            (access.admin) ? mkNode('button').$({
                material:true,
                onclick: function() {
                    getCategory();
                }
            }).Value('Category').applyStyle({backgroundColor:'#5e35b1'}) : false
        ]).classname('+ta-right').applyStyle({width:'96%', padding:'2px 7px'}),
        mkNode('div').$([__,
            chart_board.applyStyle ({width: '90%'}),
        ]).applyStyle({width:'20%', float: 'left'}).classname('+ta-center'),
        mkNode('div').$({material:true}, [__,
            mkNode('table').$({material: true},[__,
                mkNode('thead').$([__,
                    mkNode('tr').$([__,
                        mkNode('th').addText('ID'),
                        mkNode('th').addText('Category'),
                        mkNode('th').addText('Sender'),
                        mkNode('th').addText('Recipient'),
                        mkNode('th').addText('Price'),
                        mkNode('th').$([__,
                            MaterialIcon('add_circle',20).$({
                                onclick: function() {
                                    parcel();
                                }
                            })
                        ])
                    ])
                ]),
                body = mkNode('tbody')
            ]).applyStyle ({width: '100%'})
        ]).applyStyle ({width:'76%', float: 'left'})
    ]);
    
    for( var i in parcel_list ) {
        p = parcel_list[i];
        console.log(p.recipient, sapi('user', 'id'), p.state);
        body.$([__,
            mkNode('tr').$([__,
                mkNode('td').addText(p.id),
                mkNode('td').addText(category[p.category].name),
                mkNode('td').addText(p.sender_name),
                mkNode('td').addText(p.recipient_name),
                mkNode('td').addText(p.price),
                mkNode('th').$([__,
                    (access.admin || (access.client 
                        && p.recipient == sapi('user', 'id')
                        && p.state == 1)
                    ) ? MaterialIcon('done', 20).$({
                        onclick: func(function(data) {
                            var rq = new AJAX ();
                            rq.method = 'POST';
                            rq.url = urlMod;
                            rq.data = 'action=edit_parcel&state=2&id=' + data.id;
                            rq.send();
                        },p)
                    }).applyStyle({color:'green'}) : false,
                    (access.admin || (access.client 
                        && p.sender == sapi('user', 'id')
                        && p.state == 1)
                    || (
                        access.client 
                        && p.recipient == sapi('user', 'id')
                        && p.state == 1)
                    ) ? MaterialIcon('close', 20).$({
                        onclick: func(function(data) {
                            var rq = new AJAX ();
                            rq.method = 'POST';
                            rq.url = urlMod;
                            rq.data = 'action=edit_parcel&state=3&id=' + data.id;
                            rq.send();
                        },p)
                    }).applyStyle({color:'red'}) : false,
                    (access.admin || ( access.client 
                        && p.sender == sapi('user', 'id')
                        && (p.state == 1 || p.state == 3) )
                    ) ? MaterialIcon('edit', 20).$({
                        onclick: func(function(data) {
                            parcel(data);
                        },p)
                    }) : false,
                    MaterialIcon('print', 20).$({
                        onclick: func(function(data){
                            var rq = new AJAX ();
                            rq.method = 'POST';
                            rq.url = urlMod;
                            rq.data = 'action=print&id=' + data.id;
                            rq.onAct = function() {
                                var print_data = sapi('data', 'print');
                                var dbox = window.UI.Dialogs('Print Data', 350, 500);
                                dbox.box.$([__,
                                    mkNode('div').$({material:true},[__,
                                        mkNode('img').$({
                                            src:'https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=H&chl=12312412',
                                            onclick: function() {
                                                var WinPrint = window.open('','','left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');
                                                WinPrint.document.write('');
                                                WinPrint.document.write(dbox.box.innerHTML);
                                                WinPrint.document.write('');
                                                WinPrint.document.close();
                                                WinPrint.focus();
                                                setTimeout(function () {
                                                    WinPrint.print();
                                                    WinPrint.close();
                                                }, 500);
                                            }
                                        }),
                                        mkNode('table').$({material:true}).$([__,
                                            tbl = mkNode('tbody')
                                        ])
                                    ])
                                ]);
                                
                                tbl.$([__,
                                    mkNode("tr").$([__,
                                        mkNode('td').$({colSpan:'2'}).addText('Recipient')
                                    ])
                                ]);
                                for(var i in print_data.recipient) {
                                    tbl.$([__,
                                        mkNode("tr").$([__,
                                            mkNode('td').addText(i),
                                            mkNode('td').addText(print_data.recipient[i])
                                        ])
                                    ])
                                }
                                delete print_data.recipient;
                                tbl.$([__,
                                    mkNode("tr").$([__,
                                        mkNode('td').$({colSpan:'2'}).addText('Sender')
                                    ])
                                ]);
                                for(var i in print_data.sender) {
                                    tbl.$([__,
                                        mkNode("tr").$([__,
                                            mkNode('td').addText(i),
                                            mkNode('td').addText(print_data.sender[i])
                                        ])
                                    ])
                                }
                                delete print_data.sender;
                                delete print_data.state;
                                tbl.$([__,
                                    mkNode("tr").$([__,
                                        mkNode('td').$({colSpan:'2'}).addText('Info')
                                    ])
                                ]);
                                for(var i in print_data) {
                                    tbl.$([__,
                                        mkNode("tr").$([__,
                                            mkNode('td').addText(i),
                                            mkNode('td').addText(print_data[i])
                                        ])
                                    ])
                                }
                            };
                            rq.send();
                        },p)
                    })
                ])
            ]).applyStyle({backgroundColor:statesC[p.state]})
        ]);
    }
    
    chart_board.addPoint({id: 'dashboard', title:'dashboard'}).onAct = function() {
        var box = mkNode("div");
        this.box = box;
        box.$([__,
            canvas_chart = mkNode('canvas').$({width:'200', height:'150'})
        ]).applyStyle({
            minHeight:'100px',
            minWidth:'100px'
        });

        var rq = new AJAX ();
        rq.method = 'POST';
        rq.url = urlMod;
        rq.silent = true;
        rq.data = 'action=get_chart';
        rq.onAct = function () {
            chart = sapi('data', 'chart');
            var chart_nps = new Chart(canvas_chart, {
                type: 'doughnut',
                data: {
                    labels: ['Send', 'Recive', 'Canceled'],
                    datasets: [{
                        label: "Percent",
                        data: [ chart.send, chart.recive, chart.canceled ],
                        backgroundColor: [ '#03a9f4', '#4caf50', '#e53935' ]
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Dashboard'
                    },
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            display: false
                        }
                    }
                }
            });
        };
        rq.send ();
        return false;
    };
    chart_board.getPoint ('dashboard').Active ();

window.UI.WorkSpace.current().$([__, main]);
window.UI.WorkSpace.show(true);