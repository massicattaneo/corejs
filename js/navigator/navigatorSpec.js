describe('XMLHttpRequest', function () {
    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
    });

    afterEach(function () {
        server.restore();
    });

    it('Should return a Need', function () {
        expect(navigator.send('POST', '/url').then).toBeDefined();
    });

    describe('On receiving a correct response from server', function () {
        var http;
        beforeEach(function () {
            http = navigator.send('POST', '/url');
            server.respondWith('POST', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
        });

        it('should resolve the promise', function () {
            expect(http.status()).toEqual(0);
            server.respond();
            expect(http.status()).toEqual(1);
        });

    });

    describe('On sending a ...', function () {

        it('GET: should resolve the promise', function () {
            var http = navigator.get('/url');
            server.respondWith('GET', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('POST: should resolve the promise', function () {
            var http = navigator.post('/url');
            server.respondWith('POST', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('PUT: should resolve the promise', function () {
            var http = navigator.put('/url');
            server.respondWith('PUT', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('DELETE: should resolve the promise', function () {
            var http = navigator.delete('/url');
            server.respondWith('DELETE', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

    });

    describe('On receiving a wrong response from server', function () {
        var http;
        beforeEach(function () {
            http = navigator.send('POST', '/url');
            server.respondWith('POST', '/url',
                [404, {'Content-Type': 'application/json'}, JSON.stringify({})]);
        });

        it('should resolve the promise', function () {
            expect(http.status()).toEqual(0);
            server.respond();
            expect(http.status()).toEqual(2);
        })
    });

    describe('On receiving a response from server', function () {
        var response;
        beforeEach(function () {
            navigator.send('POST', '/url').then(function (resp) {
                response = resp
            });
        });

        it('should have toJSON method', function () {
            var json = {name: 'test', value: 1.34};
            server.respondWith('POST', '/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(json)]);
            server.respond();
            expect(response.toJSON()).toEqual(json);
        });

        it('should have getResponseText method', function () {
            var text = 'a response';
            server.respondWith('POST', '/url',
                [200, {'Content-Type': 'application/json'}, text]);
            server.respond();
            expect(response.getResponseText()).toEqual(text);
        });

    });

    describe('On importing a javascript file', function () {

        it('should request and parse the file', function (done) {
            navigator.import('testA.js').then(function (testA) {
                expect(testA).toEqual('a');
                done();
            });
            server.respondWith('GET', 'testA.js', [200, {'Content-Type': 'application/javascript'}, "function () {return 'a';}"]);
            server.respond();
        });

        it('should request and parse the multiple files', function (done) {
            navigator.import('import.js').then(function (o) {
                expect(o()).toEqual('b');
                done();
            });
            server.respondWith('GET', 'import.js',
                [200, {'Content-Type': 'application/javascript'}, "function (imports) {var b  = imports('testB.js'); return function () {return b;}}"]);
            server.respond();
            server.respondWith('GET', 'testB.js',
                [200, {'Content-Type': 'application/javascript'}, "function () {return 'b';}"]);
            server.respond();
        });

    });

    describe('On importing a JSON file', function () {

        it('should request and parse the file', function (done) {
            navigator.import('config.json').then(function (testA) {
                expect(testA).toEqual({a: 1, b:2});
                done();
            });
            server.respondWith('GET', 'config.json', [200, {'Content-Type': 'application/json'}, '{"a": 1, "b":2}']);
            server.respond();
        });

    });

    describe('On importing a PNG/JPG file', function () {

        it('should request and parse the file', function (done) {
            // navigator.import('image.jpg').then(function (testA) {
            //     expect(testA).toEqual({a: 1, b:2});
                done();
            // });
            // server.respondWith('GET', 'image.jpg', [200, {'Content-Type': 'application/json'}, '{"a": 1, "b":2}']);
            // server.respond();
        });

    });

    describe('On importing an HTML/HTML/CSS/SCSS/TEXT file', function () {

        it('should request and parse the file html', function (done) {
            navigator.import('index.html').then(function (testA) {
                expect(testA).toEqual('<div></div>');
                done();
            });
            server.respondWith('GET', 'index.html', [200, {'Content-Type': 'application/json'}, '<div></div>']);
            server.respond();
        });

        it('should request and parse the file htm', function (done) {
            navigator.import('index.htm').then(function (testA) {
                expect(testA).toEqual('<div></div>');
                done();
            });
            server.respondWith('GET', 'index.htm', [200, {'Content-Type': 'application/json'}, '<div></div>']);
            server.respond();
        });

    });

});
