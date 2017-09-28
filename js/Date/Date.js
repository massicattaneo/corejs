/**
 * Created by max on 05/12/16.
 */

(function () {

    var dayNames = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
    var monthNames = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

    cjs.Date = cjs.create({
        constructor: function (a) {
            this._date = a ? new Date(a) : new Date();
        },
        getMonthName: function () {
            return cjs.Date.getMothName(this._date.getMonth());
        },
        getShortMonthName: function () {
            return monthNames[this._date.getMonth()].substr(0,3);
        },
        getDayName: function () {
            return cjs.Date.getDayName(this._date.getDay());
        },
        getShortDayName: function () {
            return dayNames[this._date.getDay()].substr(0,3)
        },
        format: function (pattern) {
            pattern = pattern.replace(/dddd/g, this.getDayName());
            pattern = pattern.replace(/Dddd/g, this.getDayName().capitalize());
            pattern = pattern.replace(/ddd/g, this.getShortDayName());
            pattern = pattern.replace(/Ddd/g, this.getShortDayName().capitalize());
            pattern = pattern.replace(/dd/g, this._date.getDate().toString().padLeft(2, 0));
            pattern = pattern.replace(/mmmm/g, this.getMonthName());
            pattern = pattern.replace(/Mmmm/g, this.getMonthName().capitalize());
            pattern = pattern.replace(/mmm/g, this.getShortMonthName());
            pattern = pattern.replace(/Mmm/g, this.getShortMonthName().capitalize());
            pattern = pattern.replace(/mm/g, (this._date.getMonth() + 1).toString().padLeft(2, 0));
            pattern = pattern.replace(/yyyy/g, this._date.getFullYear().toString());
            pattern = pattern.replace(/yy/g, this._date.getFullYear().toString().substr(2, 2));
            pattern = pattern.replace(/TT/g, this._date.getHours().toString().padLeft(2,0));
            pattern = pattern.replace(/tt/g, this._date.getMinutes().toString().padLeft(2, 0));
            return pattern;
        }
    });

    cjs.Date.getDayName = function (day) {
        return dayNames[day]
    };
    cjs.Date.getMothName = function (day) {
        return monthNames[day]
    };
    cjs.Date.isToday = function (time) {
        var d = new Date(time);
        var today = new Date();
        if (d.getFullYear() !== today.getFullYear()) return false;
        if (d.getMonth() !== today.getMonth()) return false;
        if (d.getDate() !== today.getDate()) return false;
        return true;
    };
    cjs.Date.setUp = function (_dayNames, _monthNames) {
        dayNames = _dayNames;
        monthNames = _monthNames;
    };

})();
