describe('GLOBAL - COMPONENT', function () {
    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
    });

    afterEach(function () {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        server.restore();
    });

    it('should exist a function Component', function () {
        expect(Component('')).toBeDefined();
    });

    describe('On passing a HTML template', function () {

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

    describe('On passing a style', function () {

        it('should add it to the document', function () {
            var test = Component('<div><span>CIAO</span></div>', 'span {color: red}');
            test.createIn(document.body);
            expect(document.styleSheets[0].rules[0].cssText).toEqual(".ID00000000 span { color: red; }");
        });

    });

    describe('On reusing components', function () {
        var c;

        beforeEach(function () {
            Component.register('input',
                {},
                '<div><input data-item="input" type="text"><div data-item="error"></div></div>',
                'div {color: red}');
            c = Component('<div><corejs:input data-id="c1"/></div>');
            c.createIn(document.body);
        });

        it('should replace the html', function () {
            expect(c.get('c1')).toBeDefined();
            expect(c.get('c1').get('input')).toBeDefined();
        });

        it('should apply the style only to the scope', function () {
            expect(window.getComputedStyle(document.body.childNodes[0], null).color).toEqual('rgb(0, 0, 0)');
            expect(window.getComputedStyle(document.body.childNodes[0].childNodes[0].childNodes[1], null).color).not.toEqual('rgb(0, 0, 0)');
        });

    });

    describe('On having a data-bind attribute', function () {
        var c;

        beforeEach(function () {
            Component.register('bind',{},'<div data-bind="app/name"></div>');
            c = Component('<div id="bind"><corejs:bind data-id="c1"/></div>');
            c.createIn(document.body);
        });

        it('should inject the app name when the server respond', function () {
            var response = {app: {name: 'appName'}};
            server.respondWith('POST','/data/app/name',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]);
            server.respond();
            expect(document.getElementById('bind').innerText.trim()).toEqual('appName');
        });

        it('should save the value to the server', function () {
            c.get('c1').node.setInnerText('change');
            // c.get('c1').save();
        })

    })


});
