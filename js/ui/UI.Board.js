(window.UI || (window.UI = {})) && window.UI.Board || require.once (
    "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/getPosition.js", "lib/dom/getScrollPos.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/window/getSize.js", "ui/UI.WorkSpace.js", "lib/ui/hex2rgba.js"
) && (window.UI.Board = (function () {
    
    var o = { index: 1, element: {} }, brd = {}, e;
    
    if (!_CSS ('.m-board')) {
        _CSS.add ('.m-board').applyStyle ({
            background: '#fff', borderRadius: '6px', verticalAlign: 'top', position: 'relative',
            textAlign: 'center', margin: '7px', padding: '6px 8px 6px 8px', overflow: 'auto',
            boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)' 
        });
    }

    var f = function ( w, h ) {
        
        if (/null|undefined/.test (typeof (w))) w = false;
        if (/null|undefined/.test (typeof (h))) h = false;
        
        e = o.index, o.index++, brd[e] = {}, brd[e].index = e;

        brd[e].body = mkNode ('div').classname ('+m-board');
        
        w && brd[e].body.applyStyle ( {width: w + 'px'} ), 
        h && brd[e].body.applyStyle ( {height: h + 'px'} );
        
        brd[e].body.$ ({w: w, h: h, index: e});
        for (var i in f) if (f.hasOwnProperty (i)) brd[e].body[i] = f[i];
        return brd[e].body;
   
    };
/*@SWEEP ДОБАВЛЯЕМ БЛОКИ С СВОРАЧИВАНИЕМ*/
    f.addSweep = function () {

        var arg = {};
        for (var i = 0, swp; i < arguments.length; i++) {
            swp = arguments[i];
            if (!/object/.test (typeof swp)) throw new Error ("UI.Board.addS2weep: Invalid swp object: " + swp);
            if (swp.box) {
                if ( !/object/.test (typeof swp.box)) throw new Error ("UI.Board.addS2weep: is not object box: " + i);
                arg.box = swp.box;
            }
            if (swp.title) {
                arg.title = swp.title;
            } 
            if (swp.disabled) {
                arg.disabled = swp.disabled;
            } 
            if (swp.caption) {
                if ( !/object/.test (typeof swp.caption)) throw new Error ("UI.Board.addS2weep: is not object caption: " + i);
                arg.caption = swp.caption;
            }
            if (/boolean/.test (typeof swp.show)) {
                arg.show = swp.show;
            } else throw new Error ("UI.Board.addS2weep: show should be boolean");
        }

        var sweep = mkNode ('span').$ ({
            index: 1, caption: null, disabled: (arg.disabled ? arg.disabled : false), title: (arg.title ? arg.title : ""), show: arg.show, box: (arg.box ? arg.box : null) 
        }).classname ('+m-dialogs-slide').applyStyle ({position: 'relative', display: 'inline-block', margin: '2px'});
        this.rely = mkNode ('div').$ (['appendChild', sweep ]);

        if (arg.caption) {
            sweep.caption = arg.caption;
            this.rely.$ ( ['appendChild', arg.caption.applyStyle ({ display: 'block', margin: '2px' }) ]);
        }

        if ( this.sweeps == undefined ) { 
            this.sweeps = mkNode ('div').classname ('+m-board-sweep').$ ({ index: 1 }), this.sweeps.collection = []; 
            if ( this.sweeps.firstChild != null ) { 
                this.$ ( ['insertBefore', this.sweeps.firstChild, this.sweeps]); 
            } else { 
                this.$ ( ['appendChild', this.sweeps]); 
            }
        }
        
        var event = function () {
            if (this.disabled) return false;
            if (typeof (this.onAct) === "function") this.onAct();
            switch (this.show) {
                case true:
                    this.show = false;
                    this.classname ('+arrow_up', '-arrow_down', '+active'); 
                    this.box && this.parentNode.$ ( ['appendChild', this.box ]);
                    break;
                case false:
                    this.show = true;
                    this.classname ('-arrow_up', '+arrow_down', '-active'); 
                    this.box && this.box.childOf(this.parentNode) && this.parentNode.removeChild ( this.box );
                    break;
            }
            return true;
        };

        sweep.index = this.sweeps.index++;
        this.sweeps.collection.push (this.rely), 
        this.sweeps.appendChild (this.rely), this.appendChild (this.sweeps);
        sweep.addEventHandler (func (event), 'click');
        /*ВОЗМОЖНОСТЬ НАБРОСИТЬ КАСТОМНУЮ ФУНКЦИЮ, КОТОРАЯ ВЫПОЛНЯЕТСЯ НА КЛИКЕ*/
        sweep.onAct = null,
        sweep.Show = function (flag) {
            this.show = flag;
            return this;
        },
        /*ДЕКТИВИРУЕМ ВКЛАДКУ*/
        sweep.Disabled = function (flag) {
            if (!/bool/.test ( typeof flag ))  throw new Error ("UI.Board.addS2weep.disabled: is not bool type: " + flag);
            this.disabled = flag;
            return this;
        };
        sweep.applyEvent ('click');

        return sweep;
    },
    f.getSweep = function (index) {
        if (this.sweeps == undefined || this.sweeps.collection[index] == undefined) { 
            return false;
        }
        return this.sweeps.collection[index];
    },
    f.removeSweep = function (index) {
        if (this.sweeps == undefined || this.sweeps.collection[index] == undefined) { 
            return;
        }
        this.sweeps.collection[index].parentNode != null && this.sweeps.collection[index].parentNode.removeChild (this.sweeps.collection[index]);
        delete this.sweeps.collection[index];
        return this;
    },
/*@TAB ДОБАВЛЯЕМ ВКЛАДКУ*/
    f.addTab = function () {
        if ( this.tabs == undefined ) { 
            if (!_CSS ('.m-board-tabs')) {
                _CSS.add ('.m-board-tabs-collection').applyStyle ({display: 'block', boxShadow: '0px -20px 0px 20px #a7c1d3', background: '#a7c1d3'});
                _CSS.add ('.m-board-tab-box').applyStyle ({display: 'block', paddingTop: '2px', margin: 'auto'});
                _CSS.add ('TABLE.m-board-tabs').applyStyle ({width: '100%', borderCollapse: 'collapse', background: '#a7c1d3', color: '#528ab3', borderBottom: '4px solid rgba(255,255,255,0)'});
                _CSS.add ('TABLE.m-board-tabs>TBODY>TR>TD').applyStyle ({fontSize: '1.09em', padding: '4px'});
            }
            !_CSS ('.mtabhover-' + this.index + ':hover') && _CSS.add ('.mtabhover-' + this.index + ':hover').applyStyle ({cursor: 'pointer', color: '#607B8B'});
            !_CSS ('.mtabactive-' + this.index) && _CSS.add ('.mtabactive-' + this.index).applyStyle ({borderBottom: '4px solid #528ab3', color: '#000',  animation: 'ripple .4s linear'});
            
            this.tabBox = mkNode ('div');
            this.__tabBox__ = mkNode ('div');
            this.tabs = mkNode ('table').classname ('+m-board-tabs').$ ({ index: 1 }), this.tabs.collection = [], this.tabs.selected = false; 
            this.tabs.$(['appendChild', mkNode ('tbody').$ (['appendChild', mkNode ('tr') ]) ]);
            
            this.__tabBox__.$ (['appendChild',
                mkNode('div').$ (['appendChild', this.tabs ]).classname ('+m-board-tabs-collection'),
                this.tabBox.classname ('+m-board-tab-box')
            ]);
            
            this.appendChild (this.__tabBox__);
        }
        for (var i = 0, tb; i < arguments.length; i++) {
            tb = arguments[i];
            if (!/object/.test ( typeof tb )) throw new Error ("UI.Board.addTab: Invalid tab object: " + tb);
            
            if (!tb.id) throw new Error ("UI.Board.addTab: Tab object without ID, on step " + i);
            if (!/object/.test ( typeof tb.caption ))  throw new Error ("UI.Board.addTab: is not object caption: " + i);
        }
        /*ПОИСК ВКЛАДКИ НА СУЩЕСТВОВАНИЕ, ЕСЛИ ТАКОЙ УЖЕ СУЩЕСТВУЕТ, НИЧЕГО НЕ ДЕЛАЕМ ВОЗВРАЩАЕМ ОБЬЕКТ ВКЛАДКИ*/
        if (this.tabs.collection[tb.id]) return this.tabs.collection[tb.id];
        var tab = mkNode ('td'), th1s = this;
        this.tabs.index++;
        this.tabs.collection[tb.id] = tab.$ ({
            disabled: (tb.disabled ? tb.disabled : false), tid: tb.id, title: (tb.title ? tb.title : ""), box: (tb.box ? tb.box : null)
        }).classname('+mtabhover-' + this.index),
        this.tabs.firstChild.firstChild.appendChild (tab), tab.appendChild (tb.caption),
        /*ВОЗМОЖНОСТЬ НАБРОСИТЬ КАСТОМНУЮ ФУНКЦИЮ, КОТОРАЯ ВЫПОЛНЯЕТСЯ НА КЛИКЕ*/
        tab.onAct = null;
        /*АКТИВИРУЕМ ВКЛАКУ*/
        tab.Active = function () {
            var selected = th1s.getTab (th1s.tabs.selected);
            selected && selected.classname ('-mtabactive-' +th1s.index);
            th1s.tabs.selected = this.tid, this.classname ('+mtabactive-' +th1s.index);
            (this.box != undefined || this.box) && th1s.tabBox.appendChild (this.box);
            return this;
        },
        /*ДЕКТИВИРУЕМ ВКЛАДКУ*/
        tab.Disabled = function (flag) {
            if (!/bool/.test ( typeof flag ))  throw new Error ("UI.Board.addTab.disabled: is not bool type: " + flag);
            this.disabled = flag;
            return this;
        },
        /*УДАЛЯЕМ ВКЛАДКУ*/
        tab.Remove = function () {
            var ref = this.getRefParent ('table');
            if (ref == undefined || ref.collection[this.tid] == undefined) { 
                throw new Error ("UI.Board.addTab.remove: not find tab " + this.tid);
            }
            this.parentNode != null && this.parentNode.removeChild (this);
            delete ref.collection[this.tid];

            return this;
        }
        /*ДЕФОЛНОЕ ОПРЕДЕЛЕНИЯ ПРИ КЛИКЕ НА ВКЛАДКУ - ДОБАВЛЯЕМ КОНТЕНТ ДЛЯ КОНТЕЙНЕРА, АКТИВИРУЕМ ВКЛАДКУ*/
        tab.addEventHandler (func (function () {
            if (this.disabled) return false;
            if (th1s.tabBox != null) th1s.tabBox.empty ();
            if (typeof (this.onAct) === "function") this.onAct();
            this.Active ();
            return true;
        }), 'click');
        return tab;
    },
    f.reverseTab = function () {
        if (this.tabs == undefined) { 
            return false;
        }
        this.__tabBox__.$(['appendChild', this.tabs.parentNode ]).applyStyle ({
            position: 'absolute', bottom: 0, width: '100%', left: 0
        });
        
    },
    /*ПОЛУЧИТЬ СЕЛЕКТНУТУЮ ВКЛАДКУ*/
    f.getActiveTab = function () {
        if (this.tabs == undefined) { 
            return false;
        }
        return this.getTab (this.tabs.selected);
    },
    /*СЕЛЕКТИМ ВКЛАДКУ*/
    f.activeTab = function (id) {
        var tab = this.getTab(id).applyEvent ('click');
        return tab;
    },
    /*УДАЛЯЕМ ВКЛАДКУ ПО ID*/
    f.removeTab = function (id) {
        if (this.tabs == undefined || this.tabs.collection[id] == undefined) { 
            throw new Error ("UI.Board.removeTab: not find tab " + id);
        }
        this.tabs.collection[id].parentNode != null && this.tabs.collection[id].parentNode.removeChild (this.tabs.collection[id]);
        delete this.tabs.collection[id];
        return this;
    },
    /*ПОИСК ВКЛАДКИ ПО ID*/
    f.getTab = function (id) {
        if (this.tabs == undefined || this.tabs.collection[id] == undefined) { 
            return false;
        }
        return this.tabs.collection[id];
    },
    /*ПОЛУЧАЕМ ОБЬЕКТ ДЛЯ КОНТЕНТ ВКЛАДКИ*/
    f.getTabBox = function () {
        if (this.tabBox == undefined) return false;
        return this.tabBox;
    },
    /*НАСТРАИВАЕМ КАСТОМНУЮ ЗАЛИВКУ И ЦВЕТ ТЕКСТА ВКЛАДКИ*/
    f.setTabsBackground = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsBackground: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        this.tabs.applyStyle ({background: color});
        this.__tabBox__.firstChild.applyStyle ({boxShadow: '0px -20px 0px 20px ' + color, background: color});
        return this;
    },
    f.setTabsColor = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsColor: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        for (var i in this.tabs.collection) {
            this.tabs.collection[i].applyStyle ({color: color});
        }
        return this;
    },
    /*НАСТРАИВАЕМ КАСТОМНУЮ ЗАЛИВКУ И ЦВЕТ ТЕКСТА ВКЛАДКИ*/
    f.setTabsBackgroundColorHover = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsColorHover: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        if (_CSS ('.mtabhover-'+this.index)) { 
            _CSS.add ('.mtabhover-'+this.index + ':hover').style.setProperty ('background', color, 'important'); 
        }
        return this;
    },
    /*НАСТРАИВАЕМ СТИЛЬ БОРДЕРА И ЦВЕТА ТЕКСТА ПРИ СЕЛЕКТЕ ВКЛАДКИ*/
    f.setTabsBorderColorActive = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsBorderColorActive: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        if (_CSS ('.mtabactive-'+this.index)) {
            _CSS.add ('.mtabactive-'+this.index).style.setProperty ('border-bottom', '4px solid ' + color, 'important'); 
        }
        return this;
    },
    f.setTabsColorActive = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsColorActive: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        if (_CSS ('.mtabactive-'+this.index)) { 
            _CSS.add ('.mtabactive-'+this.index).style.setProperty ('color', color, 'important'); 
        }
        return this;
    },
    /*НАСТРАИВАЕМ СТИЛЬ БОРДЕРА И ЦВЕТА ТЕКСТА ПРИ НАВИДЕНИИ НА ВКЛАДКУ*/
    f.setTabsBorderColorHover = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsBorderColorHover: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        if (_CSS ('.mtabhover-'+this.index)) { 
            _CSS.add ('.mtabhover-'+this.index + ':hover').style.setProperty ('border-bottom', '4px solid ' + color, 'important'); 
        }
        return this;
    },
    f.setTabsColorHover = function (color) {
        if (!/^#{0,1}([0-9a-f]{3}|[0-9a-f]{6})$/i.test (color)) throw new Error ("UI.Board.setTabsColorHover: provided HEX is not valid CSS color value");
        if (this.tabs == undefined) return this;
        if (_CSS ('.mtabhover-'+this.index)) { 
            _CSS.add ('.mtabhover-'+this.index + ':hover').style.setProperty ('color', color, 'important'); 
        }
        return this;
    },
    /*НАСТРАИВАЕМ ТЕМУ ДЛЯ ВКЛАДКОК*/
    f.setTabTheme = function (theme) {
        if (this.tabs == undefined) return this;
        switch (theme) {
            default: 
                throw new Error ("UI.Board.setTabTheme: not found - " + theme);
                return;
                break;
            case 'violet':
                this.setTabsBackground ('#371777').setTabsColor ('#8968CD')
                    .setTabsBorderColorActive ('#AB82FF')
                    .setTabsColorActive ('#fff')
                    .setTabsColorHover ('#FFBBFF');
                break;
            case 'white-violet':
                this.setTabsBackground ('#fff').setTabsColor ('#777')
                    .setTabsBorderColorActive ('#5f00ee')
                    .setTabsColorActive ('#8e43e7').setTabsBackgroundColorHover ('#eee');
                break;
            case 'blue':
                this.setTabsBackground ('#1874CD').setTabsColor ('#ADD8E6')
                    .setTabsBorderColorActive ('#87CEFF')
                    .setTabsColorActive ('#fff')
                    .setTabsColorHover ('#87CEFF');
                break;    
            case 'white-blue':
                this.setTabsBackground ('#fff').setTabsColor ('#777')
                    .setTabsBorderColorActive ('#1a73e8')
                    .setTabsColorActive ('#4285f4').setTabsBackgroundColorHover ('#eee');
                break;
             case 'gray':
                this.setTabsBackground ('#eee').setTabsColor ('#9C9C9C')
                    .setTabsBorderColorActive ('#CFCFCF')
                    .setTabsColorActive ('#333')
                    .setTabsColorHover ('#CFCFCF');
                break;
            case 'white-gray':
                this.setTabsBackground ('#fff').setTabsColor ('#777')
                    .setTabsBorderColorActive ('#CFCFCF')
                    .setTabsColorActive ('#333').setTabsBackgroundColorHover ('#F7F7F7');
                break;
            case 'navi':
                this.setTabsBackground ('#3f51b5').setTabsColor ('#e6e9ff')
                    .setTabsBorderColorActive ('#e6e9ff')
                    .setTabsColorActive ('#fcfcfc')
                    .setTabsColorHover ('#fcfcfc');
                break;
            case 'white-navi':
                this.setTabsBackground ('#fff').setTabsColor ('#777')
                    .setTabsBorderColorActive ('#3f51b5')
                    .setTabsColorActive ('#6575d6').setTabsBackgroundColorHover ('#eee');
                break;
        }
        return this;
    },
    /*УДАЛЯЕМ ВСЕ ВКЛАДКИ*/
    f.destroyTabs = function () {
        if (this.tabs == undefined) {
            throw new Error ("UI.Board.destroyTabs: not find tabs");
        }
        this.__tabBox__.parentNode != null && this.__tabBox__.parentNode.removeChild (this.__tabBox__);
        delete this.__tabBox__, delete this.tabBox, delete this.tabs;
        return this;
    },
/*@POINT*/
    f.addPoint = function () {
        if (this.points == undefined ) { 
            if (!_CSS ('.m-board-point')) {
                _CSS.add ('.m-board-point').applyStyle ({width: '12px', height: '12px', margin: 'auto', background: '#a7c1d3', borderRadius: '3em'});
                _CSS.add ('.m-board-point:hover').applyStyle ({cursor: 'pointer', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)'});
                _CSS.add ('.m-board-point-box').applyStyle ({padding: '5px', minHeight: '18px', position: 'relative', bottom: 0, left: 0, right: 0});
                _CSS.add ('TABLE.m-board-points').applyStyle ({margin: 'auto'});
                _CSS.add ('TABLE.m-board-points>TBODY>TR>TD').applyStyle ({padding: '2px'});
            }
            !_CSS ('.mpointactive-' + this.index) && _CSS.add ('.mpointactive-' + this.index).applyStyle ({background: '#528ab3'});
            
            this.pointBox = mkNode ('div');
            this.__pointBox__ = mkNode ('div').classname ('+m-board-point-box');
            this.points = mkNode ('table').$ ({ index: 1 }).classname('+m-board-points'), this.points.collection = [], this.points.selected = false; 
            this.points.$(['appendChild', mkNode ('tbody').$ (['appendChild', mkNode ('tr') ]) ]);
            
            this.__pointBox__.$ (['appendChild',
                this.pointBox,
                mkNode('div').$ (['appendChild', this.points ])
            ]);
            
            this.appendChild ( this.__pointBox__ );
        }
        for (var i = 0, pnt; i < arguments.length; i++) {
            pnt = arguments[i];
            if (!/object/.test ( typeof pnt )) throw new Error ("UI.Board.addPoint: Invalid ponit object: " + pnt);
            if (!pnt.id) throw new Error ("UI.Board.addPoint: Point object without ID, on step " + i);
        }
        /*ПОИСК ПОИНТА НА СУЩЕСТВОВАНИЕ, ЕСЛИ ТАКОЙ УЖЕ СУЩЕСТВУЕТ, НИЧЕГО НЕ ДЕЛАЕМ ВОЗВРАЩАЕМ ОБЬЕКТ ПОИНТА*/
        if (this.points.collection[pnt.id]) return this.points.collection[pnt.id];
        this.points.index++;
        var td = mkNode ('td'), point = mkNode('div').$ ({title: (pnt.title ? pnt.title : "")}).classname('+m-board-point');
        this.points.firstChild.firstChild.appendChild (td), td.appendChild (point); 
        this.points.collection[pnt.id] = point.$ ({
            disabled: (pnt.disabled ? pnt.disabled : false), tid: pnt.id, box: (pnt.box ? pnt.box : null) 
        }), 
        /*ДЕФОЛНОЕ ОПРЕДЕЛЕНИЯ ПРИ КЛИКЕ НА ПОИНТ - ДОБАВЛЯЕМ КОНТЕНТ ДЛЯ КОНТЕЙНЕРА, АКТИВИРУЕМ ПОИНТ*/
        point.addEventHandler (func (function (index) {
            th1s = brd[index].body;
            if (this.disabled) return false;
            if (th1s.points.selected && th1s.points.selected == this.tid) return false;
            if (typeof (this.onAct) === "function") this.onAct();
            var selected = th1s.getPoint (th1s.points.selected);
            if (selected) {
                if (selected.box != undefined && selected.box && selected.box.parentNode != null) selected.box.parentNode.removeChild (selected.box);
                selected.classname ('-mpointactive-' +th1s.index);
            }
            th1s.points.selected = this.tid, this.classname ('+mpointactive-' +th1s.index);
            (this.box != undefined || this.box) && th1s.pointBox.appendChild (this.box);
            return true;
        }, this.index), 'click'),
        /*ВОЗМОЖНОСТЬ НАБРОСИТЬ КАСТОМНУЮ ФУНКЦИЮ, КОТОРАЯ ВЫПОЛНЯЕТСЯ НА КЛИКЕ*/
        point.onAct = null;
        /*АКТИВИРУЕМ ПОИНТ*/
        point.Active = function () {
            this.applyEvent ('click');
            return this;
        },
        /*ДЕКТИВИРУЕМ ПОИНТ*/
        point.Disabled = function (flag) {
            if (!/bool/.test ( typeof flag ))  throw new Error ("UI.Board.addPoint.disabled: is not bool type: " + flag);
            this.disabled = flag;
            return this;
        },
        /*УДАЛЯЕМ ПОИНТ*/
        point.Remove = function () {
            var ref = this.getRefParent ('table');
            if (ref == undefined || ref.collection[this.tid] == undefined) { 
                throw new Error ("UI.Board.addPoint.remove: not find point " + this.tid);
            }
            this.parentNode != null && this.parentNode.removeChild (this);
            delete ref.collection[this.tid];

            return this;
        };
        return point;
    },
    /*ПОИСК ПОИНТА ПО ID*/
    f.getPoint = function (id) {
        if (this.points == undefined || this.points.collection[id] == undefined) { 
            return false;
        }
        return this.points.collection[id];
    },
    /*ПОЛУЧИТЬ СЕЛЕКТНУТЫЙ ПОИНТ*/
    f.getActivePoint = function () {
        if (this.points == undefined) { 
            return false;
        }
        return this.getPoint (this.points.selected);
    },
    /*ПОЛУЧАЕМ ОБЬЕКТ ДЛЯ КОНТЕНТ ПОИНТА*/
    f.getPointBox = function () {
        if (this.pointBox == undefined) return false;
        return this.pointBox;
    },
    /*УДАЛЯЕМ ВСЕ ПОИНТИ*/
    f.destroyPoints = function () {
      if (this.points != undefined) {
        this.__pointBox__.parentNode != null && this.__pointBox__.parentNode.removeChild (this.__pointBox__);
        delete this.__pointBox__, delete this.pointBox, delete this.points;   
      }
      return this;
    },
    /*ФУНК. ДЛЯ БОРДА*/
    f.removeBoard = function () {
        th1s = brd[this.index].body;
        th1s.parentNode != null && th1s.parentNode.removeChild (th1s);
        delete brd[this.index];
        return true;
    };
    return f;
}) ());
