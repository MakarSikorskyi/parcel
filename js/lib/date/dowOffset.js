Date.dowOffset || (Date.dowOffset = (function () {
    var dow = 0;

    return function () {
        if (type (arguments[0]) === "number") {
            arguments[0] > 6 && (arguments[0] %= 7);
            dow = arguments[0];
            return true;
        } else if (/^null|undefined$/.test (type (arguments[0]))) return dow;
        else throw new Error ('Date.dowOffset(): Invalid offset specified: "' + arguments[0] + '"');
    };
}) ());