(window.UI || (window.UI = {})) && window.UI.Dialogs || require.once (
    "lib/core/type.js", "lib/dom/_batch.js", "lib/dom/getPosition.js", "lib/dom/getScrollPos.js", "lib/event/getEvent.js", "lib/style/applyStyle.js", "lib/window/getSize.js", "ui/UI.WorkSpace.js"
) && (window.UI.Dialogs = (function () {
    
    var o = { index: 1, element: {} }, dlb = {}, e;
    
    if ( !_CSS ('.m-dialogs') ) {

        _CSS.add ('.m-dialogs').applyStyle ( {
            zIndex: 100, position: 'absolute', verticalAlign: 'top',
            textAlign: 'center', margin: '6px', padding: '8px', 
            background: '#fff', borderRadius: '6px', 
            boxShadow: ' 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2)' 
        } );
      
        _CSS.add ('.m-dialogs .box').applyStyle ( {
            position: 'relative', overflow: 'auto', padding: '4px', margin: '4px'
        } );

        _CSS.add ('.m-dialogs .caption').applyStyle ( {
            overflow: 'auto', textAlign: 'center', display: 'block', 
            padding: '0px 4px 4px 4px', margin: '0px 4px 4px 4px', borderBottom: '1px solid #eee'
        } );
                
        _CSS.add ('.m-dialogs .close') .applyStyle ( { 
            cursor: 'pointer', fontSize: '16px', 
            float: 'right', position: 'relative', top: '-2px'
        } );
        
        _CSS.add ('.m-dialogs .close:hover').applyStyle ( { 
            color: '#999' 
        } );
        
        _CSS.add ('.m-dialogs .footer').applyStyle ( {
            overflow: 'auto', display: 'block', position: 'relative', 
            bottom: 0, textAlign: 'center', padding: '0px 4px 4px 4px', 
            margin: '0px 4px 4px 4px', borderTop: '1px solid #eee'
        } );

    }

    if ( !_CSS ('.m-dialogs-wrapper') ) {
        
        _CSS.add ('.m-dialogs-wrapper').applyStyle ( {
            position: 'fixed', top: '26px', right: 0, 
            zIndex: 7, background: 'rgba(0, 0, 0, 0.5)'
        } );
        
    }
    if ( !_CSS ('.m-dialogs-box-select-fixed') ) {    
        _CSS.add('#ui-list-select.m-dialogs-box-select-fixed').applyStyle({position:'fixed'}); 
    }
    
    var f = function ( name, w, h ) {
        
        /*@name : caption filter box*/
        /*@w,h : size of filter box*/
        
        e = o.index, o.index++, dlb[e] = {}, dlb[e].index = e;
        
        if ( dlb[e].position != 'undefined' ) dlb[e].position = 'center';

        dlb[e].caption = mkNode ('div').classname ('+caption'), 
        dlb[e].title = mkNode ('span').addText ( name ).classname ('+ctitle'), 
        dlb[e].close = mkNode ('a').addText ('×').$ ( {title: 'закрити'} ).classname ('+close'), dlb[e].wrapper = mkNode ('div').classname ('+m-dialogs-wrapper'),
        dlb[e].caption = mkNode ('div').classname ('+caption'), 
        dlb[e].footer = mkNode ('div').classname ('+footer'), 
        dlb[e].title = mkNode ('span').addText ( name ),
        dlb[e].wrapper = mkNode ('div').classname ('+m-dialogs-wrapper'),
        dlb[e].body = mkNode ('div').classname ('+m-dialogs'), dlb[e].box = mkNode ('div').classname ('+box'); 

        dlb[e].close.onClose = null, dlb[e].wrapper.onClose = null;
        
        window.UI.WorkSpace.current().$ (['appendChild', dlb[e].body, dlb[e].wrapper ]);
        dlb[e].body.$ (['appendChild', dlb[e].caption.$ (['appendChild', dlb[e].title, dlb[e].close ]), dlb[e].box, dlb[e].footer ]); 
        
        for (var i in f) if (f.hasOwnProperty (i)) dlb[e][i] = f[i];
        
        dlb[e].size (w, h), dlb[e].body.$ ({index: e}), dlb[e].box.$ ({index: e}), dlb[e].footer.$ ({index: e}),
        dlb[e].close.$ ({index: e}).addEventHandler ( func (dlb[e].remove), 'click'),
        dlb[e].wrapper.$ ({index: e}).addEventHandler ( func (dlb[e].remove), 'click');

//        dlb[e].body.addEventHandler (func (dlb[e].focus), 'mouseout');

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        dlb[e].body.observer = new MutationObserver(function(mutationsList){
            if (typeof (dlb[e]) !== 'undefined' && typeof (dlb[e].bodyChange) === 'function') {
                dlb[e].bodyChange(mutationsList);
            }
        });
        dlb[e].body.observer.observe(dlb[e].body, {childList: true, subtree: true});
        
        return dlb[e];
   
    };
    f.size = function (w, h) {
        var sp = document.getScrollPos (),
            top = _CSS (".ui-box-workspace-legend").getStyle ("height"),
//проверить вот этот параметр
            wstb = (($ ('.ui-box-wstabs') && $ ('.ui-box-wstabs')[0]) ? $ ('.ui-box-wstabs')[0].getInnerSize () : null),
            ltdef = (sapi ("SYS_ALTERNATE") ? [0, 50] :
                [($ ("#ui-left-div") && $ ("#ui-left-div").offsetWidth) ? $ ("#ui-left-div").offsetWidth : 0,
                $ ("#ui-panel-top").offsetHeight + parseInt (top["height"].replace ("px", "")) + ((wstb && wstb.height) ? wstb.height : 0)]),
            wsdef = [ ltdef[0] + 28, ltdef[1] + 28 ],
            btmdef = (($ ("#ui-panel-bottom") && $ ("#ui-panel-bottom").offsetHeight) ? $ ("#ui-panel-bottom").offsetHeight : 0),
            ws = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};

        if (/null|undefined/.test (typeof (w))) w = Math.floor ((ws.width - wsdef[0]) / 3);
        if (/null|undefined/.test (typeof (h))) h = Math.floor ((ws.height - wsdef[1]) / 3);
        if (typeof (w) !== "number" || typeof (h) !== "number") throw new Error ("Dialogs: Invalid width/height value given: " + w + "x" + h);

        (ws.height - wsdef[1] - btmdef < h) && (h = ws.height - wsdef[1] - btmdef);
        (ws.width - wsdef[0] < w) && (w = ws.width - wsdef[0]);
        (h < 50) && (h = 50);
        (w < 30) && (w = 30);
        var e = getEvent(true).preventDefault();
        if (/^(mouseover|mouseout|click|dblclick)$/i.test(e.type)) {
            var targetPos = e.target.getPosition();
        }
        offset = {
            lft: ltdef[0], btm: btmdef, wsdef: wsdef, sp: sp,
            x: sp.x + Math.floor(ltdef[0] + (ws.width - wsdef[0] - w) / 2),
            y: sp.y + Math.floor(ltdef[1] + ((h < ws.height - wsdef[1] - btmdef) ? (ws.height - wsdef[1] - btmdef - h) / 2 : 0)),
            pos: typeof (targetPos) != 'undefined' && targetPos != null  ? targetPos : (typeof (this.offset) != 'undefined' && typeof (this.offset.pos) != 'undefined' && this.offset.pos != null ? this.offset.pos : {x: 1, y: 1}),
        },
        
        this.offset = offset, this.w = w, this.h = h;
        typeof (this.position) != 'undefined' && this.applyPos ( this.position );
        
        return this;
    },
    f.bodyChange = function (mutations) {
        if (typeof (this.body.style.position) == "undefined") throw new Error("Dialogs: position can't be empty");
        var appendNode = false;
        for (var i in mutations) {
            if (mutations[i].addedNodes.length > 0) {
                appendNode = true;
                var select = mutations[i].target.getElementsByTagName('select');
                for (var i = 0; i < select.length; i++) {
                    if (select[i].type == 'select-one') {
                        if (dlb[this.index].body.style.position != 'fixed') {
                            select[i].classname('-m-dialogs-box-select-fixed');
                        } else {
                            select[i].classname('+m-dialogs-box-select-fixed');
                        }
                    }
                }
            }
        }
        if (appendNode) {
            typeof (dlb[this.index].position) != 'undefined' && dlb[this.index].applyPos(dlb[this.index].position);
        }
        return this;
    },
    f.remove = function ( ) {
        if (typeof (this.onClose) === "function" && !this.onClose()) return false;
        
        ( dlb[this.index].wrapper && dlb[this.index].wrapper.parentNode != null )&& dlb[this.index].wrapper.parentNode.removeChild ( dlb[this.index].wrapper ),
        ( dlb[this.index].body && typeof(dlb[this.index].body.observer)!='undefined' && dlb[this.index].body.observer != null) && dlb[this.index].body.observer.disconnect(),
        ( dlb[this.index].body && dlb[this.index].body.parentNode != null ) && dlb[this.index].body.parentNode.removeChild ( dlb[this.index].body );

        delete dlb[this.index];

        return true;
    },
    f.focus = function () {
        
        if ( dlb[this.index].body && dlb[this.index].body.parentNode != null ) {
            dlb[this.index].body.parentNode.$ (["removeChild", dlb[this.index].body], ["appendChild", dlb[this.index].body]);
        }
        if ( dlb[this.index].wrapper && dlb[this.index].wrapper.parentNode != null ) {
            dlb[this.index].wrapper.parentNode.$ (["removeChild", dlb[this.index].wrapper], ["appendChild", dlb[this.index].wrapper ]);
        }
        
        return dlb[this.index];
    },
    f.deleteCaption = function () {
        ( this.caption && this.caption.parentNode != null ) && this.caption.parentNode.removeChild ( this.caption );
        this.caption = false;
        return this;
    },
    f.deleteFooter = function () {
        ( this.footer && this.footer.parentNode != null ) && this.footer.parentNode.removeChild ( this.footer );
        this.footer = false;
        return this;
    },
    f.deleteWrapper = function () {
        ( this.wrapper && this.wrapper.parentNode != null ) && this.wrapper.parentNode.removeChild ( this.wrapper );
        this.wrapper = false;
        return this;
    },
    f.applyPos = function ( position ) {
 
        if ( /^(null|undefined)$/i.test (typeof (position)) ) throw new Error ('Dialog applyPos position is null or undefined');
        if ( !/^(left|right|center|float)$/i.test (position) ) throw new Error ('Dialog applyPos should by position float, left, right or center');
        
        this.position = position;
        var wsh = document.documentElement.clientHeight, wsw = document.documentElement.clientWidth, scp = {height: 0}, sft = {height: 0};
        
        if ( this.caption ) { 
            this.caption.applyStyle ( { maxWidth: this.w + 'px'});
            scp = this.caption.getInnerSize (); 
        }
        
        if ( this.footer ) { 
            this.footer.applyStyle ( { maxWidth: this.w + 'px'});
            sft = this.footer.getInnerSize (); 
        }
    
        this.offset.ws = {w: wsw, h: wsh}; 
        
        switch ( position ) {
            case 'center':
                this.body.applyStyle ( { top: this.offset.y + 'px', left: this.offset.x + 'px' } );        
                
                break;
            case 'left':
                this.body.applyStyle ( {overflow: 'auto', width: this.w + 'px', height: this.h + 'px', position: 'fixed', top: this.offset.y + 'px', right: 0
                }, $ ("#ui-left-div") ? {left: this.offset.lft + 'px'} : {left: 0}, $ ("#ui-panel-bottom") ? {bottom: this.offset.btm + 'px'} : {bottom: 0});        
                
                break;
            case 'right': 
                this.body.applyStyle ( {overflow: 'auto', width: this.w + 'px', height: this.h + 'px', position: 'fixed', top: this.offset.y + 'px', left: 'auto', right: 0
                }, $ ("#ui-panel-bottom") ? {bottom: this.offset.btm + 'px'} : {bottom: 0});        
                
                break;
            case 'float': 
                
                if (!this.offset.pos || !this.offset.pos.x || !this.offset.pos.y) throw new Error (' Dialog applyPos float can`t be offset position null ');

                this.body.applyStyle ( {
                    position: 'absolute',
                    top: ((this.offset.pos.y - this.offset.sp.y + (this.h + 32) / 2) > (wsh - this.offset.btm) ?
                            (wsh - this.offset.btm - this.h - 32 + this.offset.sp.y) :
                            ((this.offset.pos.y - this.offset.sp.y - this.h / 2) > this.offset.wsdef[1] ? this.offset.pos.y - this.h / 2 : this.offset.wsdef[1] + this.offset.sp.y)
                            ) + 'px',
                    left: ((this.offset.pos.x + 25 + this.w) > wsw ?
                            (this.offset.pos.x - this.w - 25 < this.offset.wsdef[0] ? this.offset.wsdef[0] + 'px' : this.offset.pos.x - this.w - 25 + 'px') :
                            this.offset.pos.x < this.offset.wsdef[0] ? this.offset.wsdef[0] + 'px' : this.offset.pos.x + 25 + 'px')
                });
                break;
        }

        this.box.applyStyle ( { width: this.w - 20 + 'px', height: this.h - ( scp.height + sft.height + 25 ) + 'px'}),
        this.wrapper && this.wrapper.applyStyle ( $ ("#ui-left-div") ? {left:  this.offset.lft + 'px'} : {left: 0},
            $ ("#ui-panel-bottom") ? {bottom: this.offset.btm + 'px'} : {bottom: 0}
        );
        
//        !this.body.haveEventHandler ( this.bodyChange, 'DOMNodeInserted') && this.body.addEventHandler(func(this.bodyChange, this.index), 'DOMNodeInserted');
  
        return this;
    };

    return f;
}) ());
