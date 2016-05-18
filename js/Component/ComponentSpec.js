describe('GLOBAL - COMPONENT', function () {

    it('should exist a function Component', function () {
        expect(Component('')).toBeDefined();
    });

    describe('On having a HTML template', function () {

        it('should attach listeners', function () {
            var test = Component('<div><button id="button1" data-on="click:click1"></button><button id="button2" data-on="click:click2"></button></div>');
            test.createIn(document.body);

            test.click1 = function () {};
            test.click2 = function () {};
            spyOn(test, 'click1');
            spyOn(test, 'click2');

            $('#button1').click();
            expect(test.click1).toHaveBeenCalled();
            expect(test.click2).not.toHaveBeenCalled();
            $('#button2').click();
            expect(test.click2).toHaveBeenCalled();
        });

        it('should create items', function () {
            var test = Component('<input type="text" data-item="input" />');
            test.createIn(document.body);
            expect(test.get('input')).toBeDefined();
        })

    });

    describe('On reusing components', function () {
        var c;

        beforeEach(function () {
            Component.register('input', '<input data-item="input" type="text" /><span data-item="error"', {});
            c = Component('<div><corejs:input  data-id="c1"/></div>');
            c.createIn(document.body);
        });

        it('should replace the html', function () {
            expect(c.get('c1')).toBeDefined();
            expect(c.get('c1').get('input')).toBeDefined();
        });

    })


});