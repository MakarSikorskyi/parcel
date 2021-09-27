require.once ( "lib/dom/_batch.js",
               "lib/dom/addText.js",
               "lib/dom/classname.js",
               "lib/dom/empty.js",
               "lib/dom/mkNode.js",
               "lib/style/applyStyle.js",
               "ui/mkIco.js" );
               
var pagesArray = [];
var td = mkNode("td").applyStyle({ padding:"7px 30px", width:"150px", verticalAlign:"top" });
var tdiv;

window.UI.SideMenu = function() {
    td.empty();
    sideMenu = mkNode("table").applyStyle({ width:"100%", borderCollapse:"collapse" }).$([ "appendChild",
    mkNode("tr").applyStyle({ backgroundColor:"#fff" }).$([ "appendChild",
        mkNode("td").applyStyle({ padding:"10px 30px", borderTop:"1px solid #E5E5E5", borderBottom:"1px solid #E5E5E5" }).$([ "appendChild",
            tdiv = mkNode("div").applyStyle({ fontSize:"1.5em", color:"#DD4B39" })
        ]),
        mkNode("td").applyStyle({ padding:"10px 30px", borderTop:"1px solid #E5E5E5", borderBottom:"1px solid #E5E5E5" }).$([ "appendChild",
            mkNode("div").applyStyle({ width:"100%" }).$([ "appendChild", window.UI.SideMenu.bar = mkNode("div").applyStyle({ "float":"left" }), window.UI.SideMenu.subTitle = mkNode("div").applyStyle({ "float": "right"}) ])
        ])
    ]),
    mkNode("tr").$([ "appendChild",
        td,
        mkNode("td").applyStyle({ backgroundColor:"#fff", verticalAlign:"top" }).$([ "appendChild",
            window.UI.SideMenu.body = mkNode("div").applyStyle({ width:"100%", margin:"20px 0" })
        ])
    ])
]);
    return sideMenu;
}

window.UI.SideMenu.addPage = function(name, url, isActive) {
    pagesArray.push({ name:name,url:url });
    if( isActive ) {
        td.$([ "appendChild", mkNode("div").applyStyle({ paddingTop:"15px" }).$([ "appendChild", mkNode("span").applyStyle({color:"#DD4B39"}).addText(name) ]) ]);
    } else {
        td.$([ "appendChild", mkNode("div").applyStyle({ paddingTop:"15px" }).$([ "appendChild", mkNode("a").classname( "+smhover" ).applyStyle({color:"#444"}).addText(name).$({ href:  sapi ("URL_MOD") +  url }) ]) ]);
    }
}

window.UI.SideMenu.setTitle = function( text ) {
    tdiv.addText( text );
}

