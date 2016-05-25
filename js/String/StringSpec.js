describe("PROTOTYPE - STRING", function () {

    it('padLeft', function() {
        var str = '';
        expect(str.padLeft(0, "0")).toBe('');
        expect(str.padLeft(1, "0")).toBe('0');
        expect(str.padLeft(2, "0")).toBe('00');
        expect(str.padLeft(6, "0")).toBe('000000');

        var str = '1';
        expect(str.padLeft(0, "0")).toBe('');
        expect(str.padLeft(1, "0")).toBe('1');
        expect(str.padLeft(2, "0")).toBe('01');

        var str = '123';
        expect(str.padLeft(0, "0")).toBe('');
        expect(str.padLeft(1, "0")).toBe('3');
        expect(str.padLeft(2, "0")).toBe('23');
        expect(str.padLeft(3, "0")).toBe('123');
    });

    it('padRight', function() {
        var str = '';
        expect(str.padRight(0, "0")).toBe('');
        expect(str.padRight(1, "0")).toBe('0');
        expect(str.padRight(2, "0")).toBe('00');
        expect(str.padRight(6, "0")).toBe('000000');

        str = '1';
        expect(str.padRight(0, "0")).toBe('');
        expect(str.padRight(1, "0")).toBe('1');
        expect(str.padRight(2, "0")).toBe('10');
        expect(str.padRight(4, "0")).toBe('1000');
        expect(str.padRight(6, "0")).toBe('100000');

        var str = '123';
        expect(str.padRight(0, "0")).toBe('');
        expect(str.padRight(1, "0")).toBe('1');
        expect(str.padRight(2, "0")).toBe('12');
        expect(str.padRight(3, "0")).toBe('123');
        expect(str.padRight(5, "0")).toBe('12300');
    });

});