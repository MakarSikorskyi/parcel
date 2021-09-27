String.prototype.toDate || require.once ("lib/core/type.js") && (String.prototype.toDate = function (format) {
    if (type (format) !== "string") throw new Error ('String.toDate(): Invalid format given "' + format + '"');

    var th1s = this, i, date = {d: null, m: null, y: null, h: null, i: null, s: null, u: null}, tmp = new Date (), re = null;

    try {
        rotate: for (i = 0, format = format.split (""); i < format.length; i++, re = null) {
            switch (format[i]) {
                case "d":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.d = re[1];
                break;

                case "j":
                    re = /^([1-9][0-9])(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.d = re[1];
                break;

                case "D":
                    re = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "l":
                    re = /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "S":
                    re = /^(st|nd|rd|th)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "z":
                    re = /^([1-9][0-9])(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);

                    date.m = 0;
                    date.d = 1;
                break;

                case "F":
                    re = /^(January|February|March|April|May|June|July|August|September|October|November|December)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.m = ({"January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11})[re[1] - 1];
                break;

                case "M":
                    re = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.m = ({"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11})[re[1] - 1];
                break;

                case "m":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.m = re[1] - 1;
                break;

                case "n":
                    re = /^([1-9][0-9]?)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.m = re[1] - 1;
                break;

                case "Y":
                    re = /^([0-9]{4})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.y = re[1];
                break;

                case "y":
                    re = /^([0-9]{2,})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.y = re[1];
                break;

                case "a":
                    re = /^(am)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.h = date.h || tmp.getHours ();
                    if (date.h > 12) date.h += 12;
                break;

                case "A":
                    re = /^(pm)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.h = date.h || tmp.getHours ();
                    if (date.h < 12) date.h += 12;
                break;

                case "g": case "h":
                    re = /^([1-9][0-9]?)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.h = re[1];
                break;

                case "G": case "H":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.h = re[1];
                break;

                case "i":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.i = re[1];
                break;

                case "s":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.s = re[1];
                break;

                case "u":
                    re = /^([0-9]{1,6})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.u = re[1];
                break;

                case "U":
                    re = /^([0-9]{2})(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                    date.h = 0;
                    date.i = 0;
                    date.s = 0;
                    date.u = 0;
                    date.d = 1;
                    date.m = 0;
                    date.y = 1970;
                break;

                case " ":
                    re = /^(\s+)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "#":
                    re = /^([;:\/.,)(-])(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "*":
                    re = /^([^;:\/.,)(0-9-]+)(.*)$/.exec (th1s);
                    if (!re) throw new Error (format[i]);
                break;

                case "!":
                    date.h = 0;
                    date.i = 0;
                    date.s = 0;
                    date.u = 0;
                    date.d = 1;
                    date.m = 0;
                    date.y = 1970;
                    continue rotate;
                break;

                case "|":
                    date.h = date.h || 0;
                    date.i = date.i || 0;
                    date.s = date.s || 0;
                    date.u = date.u || 0;
                    date.d = date.d || 1;
                    date.m = date.m || 0;
                    date.y = date.y || 1970;
                    continue rotate;
                break;

                default:
                    th1s = th1s.replace (format[i], "");
                    continue rotate;
                break;
            }
            th1s = re[2];
        }
    } catch (e) {
        return null;
    }

    return new Date (
        date.y === null ? tmp.getFullYear () : date.y,
        date.m === null ? tmp.getMonth () : date.m,
        date.d === null ? tmp.getDate () : date.d,
        date.h === null ? tmp.getHours () : date.h,
        date.i === null ? tmp.getMinutes () : date.i,
        date.s === null ? tmp.getSeconds () : date.s,
        date.u === null ? tmp.getMilliseconds () : date.u
    );
});