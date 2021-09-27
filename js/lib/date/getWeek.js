Date.prototype.getWeek || require.once ("lib/date/dowOffset.js") && (Date.prototype.getWeek = function () {
    // First day of current year
    var ny = new Date (this.getFullYear (), 0, 1),
        // Making offset correction accordingly to day of week offset
        day = ny.getDay () - Date.dowOffset (),
        // Calculating number of days from the beginning of the year
        daynum = Math.floor ((this.getTime () - ny.getTime () - (this.getTimezoneOffset () - ny.getTimezoneOffset ()) * 60000) / 86400000) + 1,
        weeknum;
    // Fixing negative day of week
    day = day >= 0 ? day : day + 7;
    // Calculating week number
    weeknum = Math.floor ((daynum + day - 1) / 7);
    // Making correction for week between years
    day < 4 && weeknum++;
    // Recalculating week, if it is more then 52
    if (weeknum > 52) {
        var nYear = new Date (this.getFullYear () + 1, 0, 1),
            nday = nYear.getDay () - Date.dowOffset ();

        nday = nday >= 0 ? nday : nday + 7;
        weeknum = nday < 4 ? 1 : 53;
    }

    return weeknum;
});