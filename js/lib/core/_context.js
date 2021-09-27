window.ConMenu || require.once ('lib/dom/empty.js', 'lib/dom/classname.js', "lib/core/type.js") && (window.ConMenu = (function () {
    _CSS.add ("#wfm-contentbox").applyStyle({fontFamily: '"Comic Sans MS", cursive'});
    _CSS.add ("#wfm-contentbox > ul > li").applyStyle({padding: '5px', minHeight: '18px', height:'auto', cursor:'pointer'});
    _CSS.add ("#wfm-contentbox > ul > li:hover").applyStyle({borderBottom: '1px dotted BurlyWood', minHeight: '17px', height:'auto', backgroundColor:'AntiqueWhite'});
    
    var ul;
    var f = function (string) {
            if (!string) string = '';
            if (type (string) !== "string") throw new Error ("ContextMenu(): Invalid title for contextmenu box");
            if (string) {
                string = string.split ("||");
                var name = string[0],
                subname = string[1];                
            }
            var e = getEvent (true).event;
            if (e.type !== 'contextmenu') throw new Error ("ContextMenu(): Invalid event");
            var box = document.body.appendChild ( mkNode ("div").$ ({id: "wfm-contentbox"}) );
            box.classname ("+ta-center").applyStyle({
                padding:'5px',
                width: '182px',
                height:'auto',
                border:'1px solid #888',
                MozBorderRadius:'8px',
                borderRadius:'8px',
                backgroundColor:'#fff',
                position:'absolute',
                zIndex:'9'
            });
            var pos = {
                x: e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.pageY - 30 || e.clientY + document.body.scrollTop + document.documentElement.scrollTop - 30
            };
            box.$ (['appendChild',                        
                (name) ? mkNode ('span').addText(name).applyStyle({fontSize:'1'}) : false,
                (name) ? mkNode ('br') : false,
                (subname) ? mkNode ('small').addText(subname) : false,
                (subname) ? mkNode ('br') : false
            ]);
            var ds = document.getScrollPos (), ws = window.getSize ();
            if ((ws.height + ds.y) < (box.offsetHeight + pos.y + 75) && (ds.y + ws.height - 75 - pos.y) < (pos.y  - ds.y - 30)) pos.y -= box.offsetHeight + 2;
            if (ws.width < box.offsetWidth + pos.x + 10) pos.x -= box.offsetWidth;
            pos.x--;

            box.applyStyle({
                left: pos.x + 'px',
                top: pos.y + 'px'
            });

            box.$ (['appendChild',
                ul = mkNode ('ul').applyStyle({listStyle:'none',fontWeight:'bold'}).classname ("+ta-left")
            ]);
    }
    f.boxHide = function () {
        var elem = $ ("#wfm-contentbox");
        if (elem && elem.parentNode !== null) {
            document.body.removeChild (elem);
        }
        return false;
    }
    f.li = function (ico_x,ico_y,caption,fu) {
        if (type (ico_x) !== "number") throw new Error ("ContextMenu.li(): Invalid ico_x");
        if (type (ico_y) !== "number") throw new Error ("ContextMenu.li(): Invalid ico_y");
        if (type (caption) !== "string") throw new Error ("ContextMenu.li(): Invalid caption");
        if (type (fu) !== "function") throw new Error ("ContextMenu.li(): Invalid function");
        ul.$ (['appendChild',                
            mkNode ('li').$ (['appendChild',
                mkIco(ico_x,ico_y).applyStyle({margin:'0px 5px -3px'}),
            ]).addText (caption).$({onclick:fu})
        ]);
        return false;
    }
    window.document.addEventHandler(function(){
        f.boxHide();
    },'click');
    return f;
}) ());