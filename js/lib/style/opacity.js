require.once ("lib/dom/_extend.js") && window.$.addExtension ("*", {opacity: function () {
    var op;
    // If opacity given
    if (arguments.length === 1) {
        // Convert to float
        op = parseFloat (arguments[0]);
        // Check if opacity is correct number
        (isNaN (op) || op > 1) && (op = 1.0);
        op < 0 && (op = 0);
        // Only two digits after period are needed
        op = op.toFixed (2);
        // DOM model
        "opacity" in this.style && (this.style.opacity = op);
        // IE
        /*@cc_on
            // Value for IE is in percentages integer, so we need multiply opacity by 100
            this.style.filter = "alpha(opacity=" + parseInt (op * 100) + ")";
            parseInt (op) === 1 && (this.style.filter = "none");
        @*/
        // return object
        return this;
    // If no opacity given
    } else {
        // DOM
        "opacity" in this.style && (op = this.style.opacity);
        // IE
        /*@cc_on
            // IE filter we need to parse to fetch value
            r = this.style.filter.match (/alpha\(opacity=(\d{1,3})\)/i);
            op = (r !== null) ? r[1] / 100 : 1;
        @*/
        // Convert fetched value to float
        op = parseFloat (op);
        isNaN (op) && (op = 1.0);
        // Trim unneeded digits from the end and return opacity
        return op.toFixed (2);
    }
}});