require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {innerEHTML: function (code) {
    $ (this).innerHTML = code;
    return this;
}});