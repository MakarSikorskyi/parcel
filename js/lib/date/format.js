Date.prototype.format || require.once ("lib/core/type.js", "lib/date/getWeek.js") && (Date.prototype.format = function (f) {
    if (type (f) !== "string") throw new Error ('Date.format(): Invalid format given "' + f + '"');

    var th1s = this;

    return f.replace (/\\.|./g, function (i) {
        var dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            mon = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            j;
        if (/^\\/.test (i)) return i.substr (1, 1);
        switch (i) {
            // Day of month incl. leading zero (01, 02, 31)
            case "d": i = th1s.getDate () < 10 ? "0" + th1s.getDate () : th1s.getDate (); break;
            // Day of week (3 letters: Sun, Mon, Tue)
            case "D": i = dow[th1s.getDay ()].substr (0, 3);
            break;
            // Day of month w/o leading zero (1, 5, 31)
            case "j": i = th1s.getDate (); break;
            // Day of week full (Sunday, Monday)
            case "l": i = dow[th1s.getDay ()]; break;
            // ISO number of day in week 1 (Mo) to 7 (Su)
            case "N": i = i.getDay (); i = i === 0 ? 7 : i;
            break;
            // Prefix for "j" - st, nd, rd, th
            case "S":
                i = i.getDay ();
                switch (i) {
                    case 1: i = "st"; break;
                    case 2: i = "nd"; break;
                    case 3: i = "rd"; break;
                    default: i = "th"; break;
                }
            break;
            // Day of week from 0 (Su) to 7 (Sa)
            case "w": i = i.getDay (); break;
            // Day of year (360, 365)
            case "z":
                var onejan = new Date (th1s.getFullYear(), 0, 1);
                i = Math.ceil ((th1s - onejan) / 86400000);
            break;
            // Week number
            case "W": i = th1s.getWeek (); break;
            // Full month name (January, February)
            case "F": i = mon[th1s.getMonth ()]; break;
            // Month number incl. leading zero (01 - 12)
            case "m":
                i = th1s.getMonth () + 1;
                i = i < 10 ? "0" + i : i;
            break;
            // 3 letter month name (Jan, Feb)
            case "M": i = mon[th1s.getMonth ()].substr (0, 3); break;
            // Month number (1 - 12)
            case "n": i = th1s.getMonth () + 1; break;
            // Number of days in month (28 - 31)
            case "t": i = new Date (th1s.getFullYear (), th1s.getMonth () + 1, 0).getDate (); break;
            // Leap year (1 or 0)
            case "L":
                i = th1s.getFullYear ();
                if (!(i % 400) || !(i % 4) && (i % 100)) i = 1;
                else i = 0;
            break;
            // Year based on week number
            case "o":
                i = th1s.getWeek ();
                j = th1s.getDate ();
                if (i >= 52 && j < 23) i = th1s.getFullYear () + 1;
                else if (i < 2 && j > 23) i = th1s.getFullYear () - 1;
            break;
            // Full year (1900, 2012)
            case "Y": i = th1s.getFullYear (); break;
            // Short year (99, 01, 12)
            case "y": i = th1s.getFullYear ().toString ().replace (/^[0-9]+([0-9]{2})$/, "$1"); break;
            // Lowercase "am" and "pm" suffixes
            case "a":
                i = th1s.getHours ();
                i = i < 12 ? "am" : "pm";
            break;
            // Uppercase "AM" and "PM" suffixes
            case "A":
                i = th1s.getHours ();
                i = i < 12 ? "AM" : "PM";
            break;
            // Swatch Internet Time
            case "B":
                j = ((th1s.getUTCHours () + 1) % 24) + th1s.getUTCMinutes () / 60 + th1s.getUTCSeconds () / 3600;
                i = Math.floor (j * 1000 / 24);
            break;
            // 12-hours format w/o leading zero (1 - 12)
            case "g":
                j = th1s.getHours ();
                if (j === 0) i = 12;
                else if (i > 12) i -= 12;
                else i = j;
            break;
            // 24-hours format w/o leading zero (1 - 23)
            case "G": i = th1s.getHours (); break;
            // 12-hours format incl. leading zero (01 - 12)
            case "h":
                j = th1s.getHours ();
                if (j === 0) i = 12;
                else if (i > 12) i -= 12;
                else i = j;
                i = i < 10 ? "0" + i : i;
            break;
            // 24-hours format incl. leading zero (01 - 23)
            case "H":
                i = th1s.getHours ();
                i = i < 10 ? "0" + i : i;
            break;
            // Minutes incl. leading zero (00 - 59)
            case "i":
                i = th1s.getMinutes ();
                i = i < 10 ? "0" + i : i;
            break;
            // Seconds incl. leading zero (00 - 59)
            case "s":
                i = th1s.getSeconds ();
                i = i < 10 ? "0" + i : i;
            break;
            // Milliseconds
            case "u": i = th1s.getMilliseconds (); break;

            default: break;
        }

        return i;
    });
});