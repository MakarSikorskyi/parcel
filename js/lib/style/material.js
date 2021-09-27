if ( !document.getElementById ( 'js-material-css' ) ) {

    var link = document.createElement ( 'link' );
    link.id = 'js-material-css', link.rel = 'stylesheet', link.href = 'js/lib/style/material.css?qw' + Math.random() ;
    if (typeof(document.head) !== "undefined") {
        document.head.appendChild(link);
    } else {
        document.getElementsByTagName("head")[0].appendChild(link);
    }
}

require.once ( "lib/dom/DOMChange.js", "lib/dom/mkNode.js", "lib/dom/classname.js", "lib/ui/hex2rgba.js", 'lib/iconfont/init.js' );

document.DOMChange.add ( function (o) {

        var th1s = o.target;
        if (th1s.nodeType !== 1 || !th1s.material || !/^(input|textarea|div|form|select|table)$/i.test (th1s.nodeName) || (typeof(th1s.type) !== "undefined" && !/^(text|textarea|button|submit|checkbox|select-one)$/i.test (th1s.type))) return;
        var __ = 'appendChild';

        switch ( th1s.type ) {
            case 'text': case 'textarea':
                if (th1s.__texture__ === th1s.parentNode) return;
                var e, s, l, c;
                th1s.onUsed = function ( ) {

                    var flag = false;

                    if ( this.value ) {
                        if ( this.__castType__ && this.__castType__[1] != undefined && this.__castType__[1] != this.value  ) flag = 1;
                        else if ( this.__castType__ && ( this.__castType__[0] == undefined || this.__castType__[1] == undefined ) && this.value ) flag = 2;
                        else if ( this.__castType__ == undefined && this.value ) flag = 3;
                    }
                    if (!this.value && this.disabled) flag = 4;

                    this.classname ( ( flag ? '+' : '-') + 'used' );
                    this.classname ( ( !flag ? '+' : '-') + 'no-used' );
                    ( this.disabled || !this.disabled ) && this.classname ( ( this.disabled ? '+' : '-') + 'disabled' );

                    return ( this.value ? true : false );
                };

                th1s.onCounted = function ( ) {
                    this.counted = this.value.length;
                    c.innerHTML = this.counted + (this.maxLength > 0 ? '/' + this.maxLength : '');
                    return this.counted;
                };

                th1s.onValid = function ( focused ) {
                    /*required - 0x01, castType - 0x02, length - 0x04*/
                    var msg = {
                        0x01: 'Обовязкове поле',
                        0x02: 'Невірний формат',
                        0x04: 'Мінімум ' + this.minLength + ' символів'
                    };

                    this.valid = 0;
                    this.required && ( this.valid |= ( !this.value.replace(/\s/g, '') ? 0x01 : 0) );
                    this.__castType__ && ( this.valid |= ( /_/.test (this.value) ? 0x02 : 0) );
                    this.minLength && this.minLength > 1 && ( this.valid |= ( this.value.length < this.minLength ? 0x04 : 0) );

                    var res = $ (".m-notice", e);

                    if( this.valid !== 0 && !this.disabled ) {
                        this.classname('+m-input-valid');
                        if(res[0]) {
                            var m = [];
                            for (var i in msg) if( i & this.valid ) m.push(msg[i]);
                            res[0].innerHTML = m.join(', ');
                        }
                        if(focused) this.focus();
                    } else {
                        if(res[0]) res[0].innerHTML = (!this.classList.contains('m-input-valid') && res[0].innerHTML != '') ? res[0].innerHTML : '';
                        this.classname('-m-input-valid');
                    }

                    return this.valid;
                };

                th1s.onUsed ();

                !th1s.haveEventHandler (th1s.onUsed, "change") && th1s.addEventHandler (th1s.onUsed , "change");
                !th1s.haveEventHandler (th1s.onUsed, "blur") && th1s.addEventHandler (th1s.onUsed , "blur");
                th1s.valid != undefined && ( (!th1s.haveEventHandler (th1s.onValid, "blur") && th1s.addEventHandler (th1s.onValid, "blur") ) );

                e = mkNode ('div').classname ('+m-group'), s = mkNode ('span').classname ('+m-bar'),
                l = mkNode ('label'), c = mkNode ('span').classname ('+m-counted'), notice = mkNode ('span').classname ('+m-notice');

                if(th1s.material === 'inline') e.applyStyle({display:'inline-block', margin: '0 5px'});

                th1s.__texture__ = o.src.insertBefore ( e ), ws = th1s.getStyle ('width');
                e.applyStyle ( {width: parseInt (ws.width) + 10 + 'px'} );
                e.appendChild ( th1s ), e.appendChild ( s ), e.appendChild ( notice );

                th1s.classname ('+m-input-text');
                // th1s.classname('+m-input-valid');
                th1s.color && ( e.applyStyle ( {color: th1s.color } ), s.applyStyle ( {background: th1s.color } ) );
                th1s.placeholder && e.appendChild ( l.addText (th1s.placeholder + (th1s.required ? '*' : '') ) );

                th1s.counted && (th1s.haveEventHandler (th1s.onCounted, "keyup") || th1s.addEventHandler (th1s.onCounted, "keyup"),
                th1s.haveEventHandler (th1s.onCounted, "focus") || th1s.addEventHandler (th1s.onCounted, "focus"),
                th1s.onCounted ( ), e.appendChild ( c ));
                break;
             case 'button': case 'submit':
                th1s.classname ('+m-button');
                break;
            case 'checkbox':

                if ( th1s.__texture__ != o.src ) return;
                th1s.__texture__.classname ('-input-checkbox', '+m-group'), th1s.classname ('+cbx', '+hidden');

                if ( !th1s.id && th1s.name ) th1s.id = th1s.name;
                o.src.insertBefore ( lbl = mkNode ('label').$ ( {'for': th1s.id} ).classname ('+lbl') );

                th1s.onDef = function ( ) {
                    if (!this.checked) {
                        this.value = 'off';
                    } else {
                        this.value = 'on';
                    }

                    return this;
                };

                if (th1s.value === 'on' || th1s.value === 'off') {
                    !th1s.haveEventHandler(th1s.onDef, "change") && th1s.addEventHandler(th1s.onDef, "change");
                    th1s.applyEvent('change');

                }
//                if ( ( th1s.color || th1s.size ) && lbl.htmlFor  ) {
//                    lbl.classname ('+' + lbl.htmlFor);
//
//                    th1s.color && _CSS.add ('INPUT.cbx:checked ~ LABEL.'+ lbl.htmlFor).style.setProperty ('background', hex2rgba (th1s.color, 0.4), 'important');
//                    th1s.color && _CSS.add ('INPUT.cbx:checked ~ LABEL.' + lbl.htmlFor + ':after').style.setProperty ('background', th1s.color, 'important');
//
//                    th1s.size && _CSS.add ('LABEL.'+ lbl.htmlFor + ':after').style.setProperty ('width', Math.round (th1s.size/1.5)  + 'px', 'important');
//                    th1s.size && _CSS.add ('LABEL.'+ lbl.htmlFor + ':after').style.setProperty ('height', Math.round (th1s.size/1.5) + 'px', 'important');
//
//                    th1s.size && _CSS.add ('LABEL.'+ lbl.htmlFor).style.setProperty ('width', th1s.size + 'px', 'important');
//                    th1s.size && _CSS.add ('LABEL.'+ lbl.htmlFor).style.setProperty ('height', Math.round (th1s.size/2.3) + 'px', 'important');
//                }

                break;
            case 'select-one':                
                if ( th1s.__texture__ != o.src ) return;

                if (th1s.defaultOption) def_opt = th1s.firstChild;
                var lbl = mkNode('label').classname('+select-lbl'), lbl_state = false;

                th1s.__texture__.classname('+material-select');
                th1s.classname('+material-select');
                th1s.__texture__.$([__, lbl ]);

                th1s.checkSelected = function () {
                    lbl.empty();
                    if ( th1s.options.selectedIndex !== -1 )
                        var sel_opt = th1s.options[th1s.options.selectedIndex];
                    else
                        var sel_opt = null;

                    if( sel_opt === null || (th1s.defaultOption && def_opt && sel_opt.value === def_opt.value ) ) {
                        if(th1s.placeholder) {
                            lbl.addText(th1s.placeholder).classname('-used');
                            th1s.__texture__.childNodes[0].applyStyle({ opacity:0 });
                            lbl_state = true;
                        }
                    } else {
                        th1s.__texture__.childNodes[0].applyStyle({ opacity:1 });
                        if (lbl_state) lbl_state = false;
                        if (th1s.placeholder) lbl.addText(th1s.placeholder).classname('+used');
                    }
                    return false;
                }

                th1s.__texture__.replaceChild(MaterialIcon('arrow_drop_down').applyStyle({
                    position:'absolute',
                    right:'3px',
                    top:'3px',
                    color: 'rgb(119, 119, 119)'
                }), th1s.__texture__.childNodes[1]);

                th1s.__texture__.$([__,
                    mkNode('span').classname('+m-bar')
                ]);

                !th1s.haveEventHandler(th1s.checkSelected, "change") && th1s.addEventHandler(th1s.checkSelected, "change");
                th1s.checkSelected();

                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                th1s.observer = new MutationObserver(function(mutationsList){
                    th1s.checkSelected();
                });
                th1s.observer.observe(th1s, {
                    attributes: true,
                    attributeOldValue: true,
                    attributeFilter: ['value']
                });

                break;
        }

        switch ( th1s.nodeName ) {
            case 'TABLE':
                switch (th1s.material) {
                    default:

                        th1s.classname ('-decorate', '+material-table');
               
                        if ( typeof th1s.children[0] !== 'undefined' && th1s.children[0].nodeName == 'THEAD' ) th1s.children[0].classname ('-decorate');
                        if ( typeof th1s.children[1] !== 'undefined' && th1s.children[1].nodeName == 'TBODY' ) th1s.children[1].classname ('-decorate');

                        break;
                }
                break;
            case 'FORM': case 'DIV':
                switch (th1s.material) {
                    case 'chips':
                        if(th1s.nodeName == 'DIV') {
                            th1s.classname("+material-panel-chips").$([__,
                                (th1s.icon && typeof th1s.icon === "string") ? MaterialIcon(th1s.icon, 19) : false,
                                mkNode('p').addText(th1s.label || ""),
                                (th1s.clear && typeof th1s.clear === "function") ? cnl = MaterialIcon('cancel', 19).classname("+chips-clear").$({onclick: th1s.clear}).addEventHandler (function() {
                                    if (th1s.parentNode) { th1s.parentNode.removeChild(th1s); }
                                } , "click") : false
                            ])
                        }
                        break;
                    case 'loader':
                        th1s.$([__,
                            mkNode('div').classname("+lds-dual-ring")
                        ]).applyStyle({
                            backgroundColor:'rgb(255, 255, 255, 0.5)',
                            width:'100%',
                            height:'100%',
                            left:'0',
                            top:'0',
                            position:'absolute'
                        });
                        break;
                    default:
                        th1s.classname("+material-panel");
                        break;
                }
                break;
        }
    }, 'add' );