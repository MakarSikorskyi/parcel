window.type || (window.type = function (o) {
    if (typeof (o) === "undefined") return "undefined";

    if (o === null) return "null";

    if (o instanceof Array || typeof (o) === "object" && typeof (o.length) === "number" && typeof (o.splice) === "function" && !(o).propertyIsEnumerable ("length")) return "array";

    if (typeof o === "function" || o instanceof Function) return "function";

    if (typeof o === "number" || o instanceof Number) {
        if (isNaN (o)) return "NaN";
        else return "number";
    }

    if (o instanceof RegExp) return "regexp";
    
    if (o instanceof Date) return "date";

    if (typeof o === "string" || o instanceof String) return "string";

    if (typeof o === "object") return "object";

    if (o === true || o === false) return "boolean";

    throw new Error ("type(): Object with unknown type given. You should check and analyse this problem. Such situation should never happen.");
});