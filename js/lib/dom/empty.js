require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {empty: function () {
    var tmpDefaultOption = null;
    if(this.type == 'select-one' && this.firstChild && this.defaultOption === true) tmpDefaultOption = this.firstChild; 
    while (this.firstChild) this.removeChild (this.firstChild);
    if(tmpDefaultOption != null) this.$(['appendChild', tmpDefaultOption]);
    return this;
}});