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
            server.respondWith('POST','/url',
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
            server.respondWith('GET','/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('POST: should resolve the promise', function () {
            var http = navigator.post('/url');
            server.respondWith('POST','/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('PUT: should resolve the promise', function () {
            var http = navigator.put('/url');
            server.respondWith('PUT','/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

        it('DELETE: should resolve the promise', function () {
            var http = navigator.delete('/url');
            server.respondWith('DELETE','/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            server.respond();
            expect(http.status()).toEqual(1);
        });

    });

    describe('On receiving a wrong response from server', function () {
        var http;
        beforeEach(function () {
            http = navigator.send('POST', '/url');
            server.respondWith('POST','/url',
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
            server.respondWith('POST','/url',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(json)]);
            server.respond();
            expect(response.toJSON()).toEqual(json);
        });

        it('should have getResponseText method', function () {
            var text = 'a response';
            server.respondWith('POST','/url',
                [200, {'Content-Type': 'application/json'}, text]);
            server.respond();
            expect(response.getResponseText()).toEqual(text);
        });



    });


});
