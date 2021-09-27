require.once ("lib/dom/_extend.js") &&  window.$.addExtension ("*", {getRefParent: function (nodeName) {
    var par = this;

    do par = par.parentNode;
    while (par && par.nodeName.toLowerCase () !== nodeName.toLowerCase ());

    return par;
}});