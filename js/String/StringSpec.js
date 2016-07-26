describe("PROTOTYPE - STRING", function () {

    it('replaceAt', function() {
        var str = 'String';
        expect(str.replaceAt(0, 1,'s')).toBe('string');
        expect(str.replaceAt(1, 1,'w')).toBe('Swring');
        expect(str.replaceAt(0, 6,'strong')).toBe('strong');
        expect(str.replaceAt(0, 6,'strong')).toBe('strong');
        expect(str.replaceAt(0, 1,'strong')).toBe('strongtring');
    });

    it('insertAt', function() {
        var str = 'String';
        expect(str.insertAt(0,'s')).toBe('sString');
        expect(str.insertAt(1,'s')).toBe('Sstring');
        expect(str.insertAt(3,'rr')).toBe('Strrring');
    });

    it('removeAt', function() {
        var str = 'String';
        expect(str.removeAt(0)).toBe('tring');
        expect(str.removeAt(0,2)).toBe('ring');
        expect(str.removeAt(2)).toBe('Sting');
    });

    it('capitalize', function () {
        expect('string'.capitalize()).toEqual('String');
        expect('123 cuaisd uiuls dklj '.capitalize()).toEqual('123 cuaisd uiuls dklj ');
        expect('sTRING'.capitalize()).toEqual('String');
        expect('s'.capitalize()).toEqual('S');
    });

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

    it('removeHTMLTags', function() {
        var str = '<div></div>';
        expect (str.removeHTMLTags()).toEqual('');

        str = '<div></div>';
        expect (str.removeHTMLTags()).toEqual('');

        str = '<div>text</div>';
        expect (str.removeHTMLTags()).toEqual('text');

        str = '<div><p>text</p></div>';
        expect (str.removeHTMLTags()).toEqual('text');

        str = '<br/><div><p>text</p></div>';
        expect (str.removeHTMLTags()).toEqual('text');
    });

    it('highlightWord', function() {
        var str = 'piano';
        expect(str.highlightWord('pia')).toEqual('<strong>pia</strong>no');

        str = 'piano';
        expect(str.highlightWord('peter', 'span')).toEqual('piano');

        str = 'pi and pi and pu';
        expect(str.highlightWord('pi', 'span')).toEqual('<span>pi</span> and <span>pi</span> and pu');

        str = 'pi';
        expect(str.highlightWord('pi', 'span', 'high'))
            .toEqual('<span class="high">pi</span>');
    });

    it("startsWith", function () {
        var str = 'ancora qui';
        expect(str.startsWith('anc')).toBeTruthy();
        expect(str.startsWith('Anc')).toBeFalsy();
    });

    it('isTime', function() {
        expect('12:00'.isTime()).toBe(true);
        expect('00:00'.isTime()).toBe(true);
        expect('00:59'.isTime()).toBe(true);
        expect('24:00'.isTime()).toBe(false);
        expect('00:60'.isTime()).toBe(false);
        expect('11'.isTime()).toBe(false);
        expect('11:0'.isTime()).toBe(false);
        expect('Time'.isTime()).toBe(false);
    });

    it("toDate", function () {
        var date = '2015-11-15'.toDate();
        expect(date instanceof Date).toBeTruthy();
        expect(date.getFullYear()).toEqual(2015);
        expect(date.getMonth()).toEqual(10);
        expect(date.getDate()).toEqual(15);

        var date = '2015/11/15'.toDate();
        expect(date instanceof Date).toBeTruthy();
        expect(date.getFullYear()).toEqual(2015);
        expect(date.getMonth()).toEqual(10);
        expect(date.getDate()).toEqual(15);

        var date = '1450134000000'.toDate();
        expect(date instanceof Date).toBeTruthy();
        expect(date.getFullYear()).toEqual(2015);
        expect(date.getMonth()).toEqual(11);
        expect(date.getDate()).toEqual(15);
    });

    it('isDate', function () {
        expect('2015-11-15'.isDate()).toEqual(true);
        expect('2015/11/15'.isDate()).toEqual(true);
    });

    /** converting different notations */
    describe('toCamelCase', function () {

        it('from camel case string', function () {
            expect('Tutto sembra DIVISO perfetto'.toCamelCase()).toEqual('tuttoSembraDivisoPerfetto');
        });

        it('from spaced string', function () {
            expect('Tutto sembra DIVISO perfetto'.toCamelCase()).toEqual('tuttoSembraDivisoPerfetto');
        });

        it('from kebab string', function () {
            expect('tutto-sembra------DIVISO-perfetto'.toCamelCase()).toEqual('tuttoSembraDivisoPerfetto');
        });

        it('from snake string', function () {
            expect('tutto_sembra___DIVISO_perfetto'.toCamelCase()).toEqual('tuttoSembraDivisoPerfetto');
        });

    });

    describe('toKebabCase', function () {

        it('from spaced string', function () {
            expect('Tutto sembra DIVISO perfetto'.toKebabCase()).toEqual('tutto-sembra-diviso-perfetto');
        });

        it('from camel case', function () {
            expect('tuttoSembraDivisoPerfetto'.toKebabCase()).toEqual('tutto-sembra-diviso-perfetto');
        });

        it('from kebab string', function () {
            expect('tutto-sembra-DIVISO-perfetto'.toKebabCase()).toEqual('tutto-sembra-diviso-perfetto');
        });

        it('from snake string', function () {
            expect('tutto_sembra_DIVISO_perfetto'.toKebabCase()).toEqual('tutto-sembra-diviso-perfetto');
        });

    });

    describe('toSnakeCase', function () {

        it('from spaced string', function () {
            expect('Tutto sembra DIVISO perfetto'.toSnakeCase()).toEqual('tutto_sembra_diviso_perfetto');
        });

        it('from camel case', function () {
            expect('tuttoSembraDivisoPerfetto'.toSnakeCase()).toEqual('tutto_sembra_diviso_perfetto');
        });

        it('from kebab string', function () {
            expect('tutto-sembra-DIVISO-perfetto'.toSnakeCase()).toEqual('tutto_sembra_diviso_perfetto');
        });

        it('from snake string', function () {
            expect('tutto_sembra_DIVISO_perfetto'.toSnakeCase()).toEqual('tutto_sembra_diviso_perfetto');
        });

    });

});
