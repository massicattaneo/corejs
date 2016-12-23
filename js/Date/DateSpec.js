/**
 * Created by max on 23/12/16.
 */

describe('DATE', function () {

    it('should have the method getMonthName', function () {
        var date = new cjs.Date('2019-09-11');
        expect(date.getMonthName()).toEqual('settembre');
    });

    it('should have the method getShortMonthName', function () {
        var date = new cjs.Date('2019-09-11');
        expect(date.getShortMonthName()).toEqual('set');
    });

    it('should have the method getDayName', function () {
        var date = new cjs.Date('2019-09-11');
        expect(date.getDayName()).toEqual('mercoledì');
    });

    it('should have the method getShortDayName', function () {
        var date = new cjs.Date('2019-09-11');
        expect(date.getShortDayName()).toEqual('mer');
    });

    it('should have the method format', function () {
        /*
         * dd -> 2 number day
         * ddd -> 3 char day name
         * dddd -> complete day name
         * mm -> 2 number month
         * mmm -> 3 char month name
         * mmmm -> complete month name
         * yy -> 2 digit year
         * yyyy - > 4 digit year
         * TT - > 2 digits Hours
         * tt - > 2 digits Minutes
         */

        var date2 = new cjs.Date('2016-01-16');
        expect(date2.format('dddd, dd mmmm yyyy')).toEqual('sabato, 16 gennaio 2016');
        expect(date2.format('Dddd, dd mmmm yyyy')).toEqual('Sabato, 16 gennaio 2016');
        expect(date2.format('ddd, dd mmmm yyyy')).toEqual('sab, 16 gennaio 2016');
        expect(date2.format('Ddd, dd mmmm yyyy')).toEqual('Sab, 16 gennaio 2016');
        expect(date2.format('dddd, dd Mmmm yyyy')).toEqual('sabato, 16 Gennaio 2016');
        expect(date2.format('dddd, dd mmm yyyy')).toEqual('sabato, 16 gen 2016');
        expect(date2.format('dddd, dd Mmm yyyy - h: TT:tt')).toEqual('sabato, 16 Gen 2016 - h: 01:00');
        expect(date2.format('dddd, dd mm yyyy')).toEqual('sabato, 16 01 2016');

    });

});
