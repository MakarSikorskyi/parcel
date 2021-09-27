require.once ("lib/dom/_extend.js", "lib/array/indexOf.js") && window.$.addExtension (["input", "textarea"], {getSelection: function () {
    var r = {};
    if (!/(password|textarea|text)/.test (this.type)) throw new Error ('HTMLInputElement.setSelection(): Invalid element type, should be one of "password", "text", "textarea", but "' + this.type + '" given!');
    if (document.selection) {
        var bm = document.selection.createRange ().getBookmark (), sel = this.createTextRange (), sleft;
        sel.moveToBookmark (bm);

        sleft = this.createTextRange();
        sleft.collapse (true);
        sleft.setEndPoint ("EndToStart", sel);

        r = {
            start: sleft.text.length,
            end: sleft.text.length + sel.text.length,
            text: sel.text
        };
    } else if ("selectionStart" in this) r = {
        start: this.selectionStart,
        end: this.selectionEnd,
        text: this.value.substring (this.selectionStart, this.selectionEnd)
    };

    return r;
}, setSelection: function (start, end) {
    if (type (start) !== "number") throw new Error ('HTMLInputElement.setSelection(): Invalid start position: "' + start + '"!');
    if (type (end) !== "number") end = start;

    start < 0 && (start = 0);
    start > this.value.length && (start = this.value.length);
    end < 0 && (end = 0);
    end > this.value.length && (end = this.value.length);
    if (end < start) {
        var tmp = end;
        end = start;
        start = tmp;
    }
    // IE
    if (this.createTextRange) {
        var range = this.createTextRange ();
        range.moveStart ('character', start);
        range.moveEnd ('character', end);
        range.collapse ();
        range.select ();
    // W3C dom
    } else if ("setSelectionRange" in this) {
        this.focus ();
        this.setSelectionRange (start, end);
    }

    return this;
}});