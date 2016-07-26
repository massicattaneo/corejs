describe('GLOBAL - COMPONENT', function () {
    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
    });

    afterEach(function () {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        Array.prototype.forEach.call(document.querySelectorAll('style,[rel="stylesheet"],[type="text/css"]'), function(element){
            try{
                element.parentNode.removeChild(element)
            }catch(err){}
        });
        server.restore();
    });

    it('should exist a function Component', function () {
        expect(Component('')).toBeDefined();
    });

    describe('On passing a HTML template', function () {

        it('should attach listeners', function () {
            var test = Component({
                template: '<div><button id="button1" data-on="click:click1"></button><button id="button2" data-on="click:click2"></button></div>'
            });
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
            var test = Component({template: '<input type="text" data-item="input" />'});
            test.createIn(document.body);
            expect(test.get('input')).toBeDefined();
        })

    });

    describe('On passing a style', function () {

        it('should add it to the document', function () {
            var test = Component({
                template: '<div><span>CIAO</span></div>',
                style: 'span {color: red}'
            });
            test.createIn(document.body);
            expect(document.styleSheets[0].rules[0].cssText).toEqual(".CJS0 span { color: red; }");
        });

    });

    describe('On passing a configuration', function () {

        it('should parse the style and the template', function () {
            var test = Component({
                template: '<div><span id="text">{{text}}</span></div>',
                style: 'span {color: $color; background-color: $background; width: $width}',
                config: {color: "#000000", background: "#AAAAAA", text: "HELLO!", width: 120}
            });
            test.createIn(document.body);
            expect(document.styleSheets[0].rules[0].cssText).toEqual(".CJS1 span { color: rgb(0, 0, 0); background-color: rgb(170, 170, 170); }");
            expect(document.getElementById('text').innerText).toEqual("HELLO!");
        });

    });

    describe('On reusing components', function () {
        var c;

        beforeEach(function () {
            Component.register({
                name: 'input',
                template: '<div><input data-item="input" type="text"><div data-item="error"></div></div>',
                style: '{color: red}'
            });
            c = Component({template: '<div><corejs:input data-id="c1"></corejs:input><corejs:input data-id="c2"></corejs:input></div>'});
            c.createIn(document.body);
        });

        it('should replace the html', function () {
            expect(c.get('c1')).toBeDefined();
            expect(c.get('c1').get('input')).toBeDefined();
        });

        it('should apply the style only to the scope', function () {
            expect(window.getComputedStyle(document.body.childNodes[0], null).color).toEqual('rgb(0, 0, 0)');
            var childNode = document.body.childNodes[0].childNodes[0];
            // expect(window.getComputedStyle(document.body.childNodes[0].childNodes[0].childNodes[1], null).color).not.toEqual('rgb(0, 0, 0)');
        });

        it('should add a same class only once', function () {
            expect(document.head.children.length).toEqual(3);
        })

    });

    describe('On passing a configuration to the registered component', function () {

        var c;

        beforeEach(function () {
            Component.register({
                name: 'newInput',
                template: '<div><input data-item="input" type="text"><div data-item="error" id="{{id}}"></div></div>',
                style: '{color: $color}'
            });
            c = Component({
                template: '<div><corejs:new-input data-id="c1"><id>{{mainId}}</id><color>{{mainColor}}</color></corejs:new-input>',
                config: {mainColor: 'red', mainId: 'id1'}
            });
            c.createIn(document.body);
        });

        it('should add it to the template', function () {
            expect(c.get('c1').get('error').id).toEqual('id1');
        });

    });

    describe('On having a data-bind attribute', function () {
        var c;

        beforeEach(function () {
            Component.register({
                name: 'bind',
                template: '<div><span data-bind="app/name"></span><span data-bind="app/version"></span></div>'
            });
            c = Component({template: '<div id="bind"><corejs:bind data-id="c1"/></div>'});
            c.createIn(document.body);
        });

        it('should inject the app name when the server respond', function () {
            var response = {app: {name: 'appName'}};
            server.respondWith('GET','/data/app/name',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]);
            server.respond();
            expect(document.getElementById('bind').innerText.trim()).toEqual('appName');
        });

        it('should save the value to the server', function () {
            var a = c.get('c1').save();
            server.respondWith('POST','/data/app/name',
                [200, {'Content-Type': 'application/json'}, ""]);
            server.respondWith('POST','/data/app/version',
                [200, {'Content-Type': 'application/json'}, ""]);
            server.respond();
            expect(a.status()).toEqual(1);
        })

    })

});
