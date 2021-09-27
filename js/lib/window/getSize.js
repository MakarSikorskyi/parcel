window.getSize || (window.getSize = function () {
    var s = {width: 0, height: 0}
    if (!this.innerWidth && !this.innerHeight) {
        if (!(document.documentElement.clientWidth == 0)) s = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
        else s = {width: document.body.clientWidth, height: document.body.clientHeight};
    } else s = {width: this.innerWidth, height: this.innerHeight};

    return s;
});