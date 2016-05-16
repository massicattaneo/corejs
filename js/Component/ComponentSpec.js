describe('GLOBAL - COMPONENT', function () {

    it('should exist a function Component', function () {
        expect(Component('')).toBeDefined();
    });

    describe('On having a HTML template', function () {

        it('should get the name to the component', function () {
            var test = Component('<div data-name="test"></div>');
            expect(test.name).toEqual('test');
        });

        it('should attach listeners', function () {
            var test = Component('<div id="a" data-name="test"><button id="button1" data-on="click:click1"></button><button id="button2" data-on="click:click2"></button></div>');
                test.click1 = function () {};
                test.click2 = function () {};
                spyOn(test, 'click1');
                spyOn(test, 'click2');
                $('#button1').click();
                $('#button2').click();
                expect(test.click1).toHaveBeenCalled();
                // expect(test.click2).not.toHaveBeenCalled();
                // spyOn(test, 'click2');
                // expect(test.click2).toHaveBeenCalled();
        });

    })


});