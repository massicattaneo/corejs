
describe('Navigator', function () {

    describe('Requesting files with XMLhttpRequest', function () {

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

    var checkDevice = function (dm, c) {
        expect(dm.deviceType).toEqual(c.deviceType);
        expect(dm.os).toEqual(c.os);
        expect(dm.osVersion).toEqual(c.osVersion);
        expect(dm.browserName).toEqual(c.browserName);
        expect(dm.browserVersion).toEqual(c.browserVersion);
        expect(dm.getScreenOrientation()).toEqual(c.screenOrientation);
    };

    describe('Device Manager', function () {

        var originalScreenSize = {width: window.innerWidth, height: window.innerHeight};

        describe('On having a Window7 machine', function () {

            it('should get the information of chrome browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.Chrome
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'chrome',
                    browserVersion: '49.0',
                    screenOrientation: 'landscape'
                });
                window.innerWidth = 400;
                window.innerHeight = 800;
                expect(dm.getScreenOrientation()).toEqual('portrait');
                window.innerWidth = originalScreenSize.width;
                window.innerHeight = originalScreenSize.height;
            });

            it('should get the information of firefox browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.Firefox
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'firefox',
                    browserVersion: '45.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of safari browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.Safari
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'safari',
                    browserVersion: '5.1',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of ie11 browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.IE11
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '11',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of ie10 browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.IE10
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '10',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of ie9 browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.IE9
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '9',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of ie8 browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.windows7.IE8
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'windows',
                    osVersion: '7',
                    browserName: 'ie',
                    browserVersion: '8',
                    screenOrientation: 'landscape'
                });
            });

        });

        describe('On having a Mac OSX 10 machine', function () {

            it('should get the information of chrome browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.MacOSx10.Chrome
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Macintosh',
                    osVersion: '10.11',
                    browserName: 'chrome',
                    browserVersion: '49.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of firefox browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.MacOSx10.Firefox
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Macintosh',
                    osVersion: '10.11',
                    browserName: 'firefox',
                    browserVersion: '44.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of safari browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.MacOSx10.Safari
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Macintosh',
                    osVersion: '10.11',
                    browserName: 'safari',
                    browserVersion: '9.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of opera browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.MacOSx10.Opera
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Macintosh',
                    osVersion: '10.11',
                    browserName: 'opera',
                    browserVersion: '26.0',
                    screenOrientation: 'landscape'
                });
            });

        });

        describe('On having a Ubuntu Linux machine', function () {

            it('should get the information of chrome browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.Ubuntu15.Chrome
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Linux',
                    osVersion: 'UNKNOWN',
                    browserName: 'chrome',
                    browserVersion: '49.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of firefox browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.Ubuntu15.Firefox
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Linux',
                    osVersion: 'UNKNOWN',
                    browserName: 'firefox',
                    browserVersion: '45.0',
                    screenOrientation: 'landscape'
                });
            });

            it('should get the information of opera browser', function () {
                var dm = navigator.deviceManager({
                    userAgent: mocks.userAgentsStrings.Ubuntu15.Opera
                });
                checkDevice(dm, {
                    deviceType: 'desktop',
                    os: 'Linux',
                    osVersion: 'UNKNOWN',
                    browserName: 'opera',
                    browserVersion: '36.0',
                    screenOrientation: 'landscape'
                });
            });

        });

    });

});
