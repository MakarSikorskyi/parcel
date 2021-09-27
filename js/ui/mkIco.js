window.mkIco || require.once ("lib/dom/classname.js") && (window.mkIco = (function () {
    var idf = function (state) {
        this._disabled = !!state;
        if (state === true) this.applyStyle ({backgroundPosition: "-" + this.x * this.size + "px -" + (this.y + 10 > 20 ? this.y - 10 : this.y + 10) * this.size + "px"});
        else this.applyStyle ({backgroundPosition: "-" + this.x * this.size + "px -" + this.y * this.size + "px"});
        return this;
    }
    var chg = function (x, y) {
        x = Number (x) || this.x; y = Number (y) || this.y;
        this.applyStyle ({backgroundPosition: "-" + x * this.size + "px -" + y * this.size + "px",});
        return this;
    }
    return function (x, y, size) {
        if (size === undefined) size = 18;
        x = Number (x) || 0; y = Number (y) || 0;
        var bound = size * 20;
        var n = mkNode ("span").$ ({size: size, x: x, y: y}).applyStyle ({
            backgroundRepeat: "no-repeat", backgroundImage: "url(" + sapi ("URL_IMG") + "iconset.png)", backgroundPosition: "-" + x * size + "px -" + y * size + "px",
            backgroundSize: bound + "px " + bound + "px", MozBackgroundSize: bound + "px " + bound + "px", width: size + "px", height: size + "px", lineHeight: size + "px"
        }).classname ("+ui-ico");
        n.disable = idf;
        n.change = chg;
        return n;
    }
}) ());