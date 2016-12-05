/**
 * Created by max on 05/12/16.
 */

(function () {
    var dayNames = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

    /* toFormatString:
     * return a String formatted date. Use:
     * dd -> 2 number day
     * ddd -> 3 char day name
     * dddd -> complete day name
     * mm -> 2 number month
     * mmm -> 3 char month name
     * mmmm -> complete month name
     * yy -> 2 digit year
     * yyyy - > 4 digit year
     */
    Date.prototype.toFormatString = function (pattern) {
        pattern = pattern.replace(/dddd/g, this.getDayName());
        pattern = pattern.replace(/ddd/g, this.getShortDayName());
        pattern = pattern.replace(/dd/g, this.getDate().toString().padLeft(2));
        pattern = pattern.replace(/mmmm/g, this.getMonthName());
        pattern = pattern.replace(/mmm/g, this.getShortMonthName());
        pattern = pattern.replace(/mm/g, (this.getMonth() + 1).toString().padLeft(2));
        pattern = pattern.replace(/yyyy/g, this.getFullYear().toString());
        pattern = pattern.replace(/yy/g, this.getFullYear().toString().substr(2, 2));
        return pattern;
    };

    /* getMonthName: return the Month name - uses the core.language names */
    Date.prototype.getMonthName = function () {return monthNames[this.getMonth()];};
    /* getShortMonthName: return the Short Month (3 chars) name - uses the core.language names */
    Date.prototype.getShortMonthName = function () { return monthNames[this.getMonth()].substr(0,3); };
    /* getDayName: return the Day name - uses the core.language names */
    Date.prototype.getDayName = function () { return dayNames[this.getDay()]; };
    /* getShortDayName: return the Short Day (3 chars) name - uses the core.language names */
    Date.prototype.getShortDayName = function () { return dayNames[this.getDay()].substr(0,3); };

})();
