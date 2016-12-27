/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Http
 Created Date: 18 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

cjs.navigator = {};

(function (obj) {

    /** PACKAGES AND IMPORT FILES **/
    var packages = cjs.Collection();

    var imports = function (url) {
        return packages.get(url) || createPackage(url)
    };
    var getPackage = function (url) {
        return packages.get(url).pack;
    };

    var importer = {
        js: function (o, imported, pack) {
            eval('imported = ' + o.response.response);
            var needs = cjs.Need([]), total = 0;
            var importer = function (url) {
                total++;
                needs.add(imports(url));
            };
            imported(importer);
            if (total === 0) {
                pack.pack = imported();
                pack.resolve(pack.pack);
            } else {
                needs.done(function () {
                    pack.pack = imported(getPackage);
                    pack.resolve(pack.pack);
                });
            }
        },
        json: function (o, imported, pack) {
            pack.pack = o.toJSON();
            pack.resolve(o.toJSON());
        },
        text: function (o, imported, pack) {
            pack.pack = o.getResponseText();
            pack.resolve(o.getResponseText());
        }
    };

    var createPackage = function (url) {
        var pack = cjs.Need(), imported;
        packages.add(pack, url);
        obj.get(url).done(function (o) {
            var ext = url.substr(url.lastIndexOf('.') +1);
            ext = (ext === 'js' || ext === 'json') ? ext : 'text';
            importer[ext](o, imported, pack);
        });
        return pack;
    };

    obj.send = function (method, url, options) {
        options = options || {};
        var promise = cjs.Need();
        var request = getHttpObject();
        request.open(method, url, 1);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        options.overrideMimeType && request.overrideMimeType(options.overrideMimeType);
        request.onreadystatechange = function () {
            if (request.status === 200 && request.readyState === 4) {
                promise.resolve(Response(request));
            }
            else if (request.status !== 200 && request.readyState === 4) {
                promise.reject(request);
            }
        };
        request.send();
        return promise;
    };
    obj.get = function (url, options) {
        return obj.send('GET', url, options || {});
    };
    obj.post = function (url, options) {
        return obj.send('POST', url, options || {});
    };
    obj.put = function (url, options) {
        return obj.send('PUT', url, options || {});
    };
    obj.delete = function (url, options) {
        return obj.send('DELETE', url, options || {});
    };

    obj.import = function (url) {
        return imports(url);
    };

    var Response = function () {
        var abstract = {
            toJSON: function () {
                return JSON.parse(this.response.responseText);
            },
            getResponseText: function () {
                return this.response.responseText;
            }
        };

        return function (response) {
            return cjs.Object.extend({response: response}, abstract);
        }
    }();
    var getHttpObject = function () {
        if (window.ActiveXObject) {
            /* istanbul ignore next */
            return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } else {
            return new XMLHttpRequest();
        }
    };

    /** deviceManager **/
    var getScreenOrientation = function () {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
    var getBrowserInfo = function (ua) {
        if (ua.match(/(OPR)[^\d]\d*.\d*/)) {
            return ['', 'opera', ua.match(/OPR[^\d](\d*.\d*)/)[1]]
        }else if (ua.match(/(Chrome)\/(\d*\.\d*)/)) {
            return (ua.match(/(Chrome)\/(\d*\.\d*)/));
        } else if (ua.match(/(Firefox)\/(\d*\.\d*)/)) {
            return (ua.match(/(Firefox)\/(\d*\.\d*)/));
        } else if (ua.match(/(Safari)\/(\d*\.\d*)/)) {
            var newVar = (ua.match(/(Version)\/(\d*\.\d*)/));
            newVar[1] = 'Safari';
            return newVar;
        } else if (ua.match(/Trident\/(\d)/)) {
            var match = Number(ua.match(/Trident\/(\d)/)[1]) + 4;
            return ['', 'IE', match.toString()];
        }
        return ['','',''];
    };
    var getOsInfo = function (ua) {
        var ret = ['',''];
        if (ua.match(/WOW64/)) {
            ret[0] = 'windows';
            if (ua.match(/Windows NT 6/)) {
                ret[1] = '7';
            }
        } else if (ua.match(/Macintosh/)) {
            ret[0] = 'Macintosh';
            ret[1] = ua.match(/Mac OS X (\d*[^\d]\d*)/)[1].replace('_', '.');
        } else if (ua.match(/Linux/)) {
            ret = ['Linux', 'UNKNOWN']
        }
        return ret;
    };
    obj.deviceManager = function (params) {
        var ua = params.userAgent;
        var ret = {};
        ret.deviceType = 'desktop';
        var osInfo = getOsInfo(ua);
        ret.os = osInfo[0];
        ret.osVersion = osInfo[1];
        var browserInfo = getBrowserInfo(ua);
        ret.browserName = browserInfo[1].toLowerCase();
        ret.browserVersion = browserInfo[2];
        ret.getScreenOrientation = getScreenOrientation;
        return ret;
    };
    obj.screenManager = function () {
        var obj = {};

        /** TODO be refactored and tested - coming from BJ ...  */
        function resize(p) {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var transform = '';
            var scale;
            var isRotated = false;
            var canvas = p.canvas;
            var canvasContainer = p.canvasContainer;
            var htmlContainer = p.htmlContainer;
            var body = cjs.Node(document.body);
            var gameRatio = p.width / p.height;
            var windowRatio = windowWidth / windowHeight;

            var widthRatio = windowWidth / p.width;
            var heightRatio = windowWidth / p.height;

            if (windowWidth > windowHeight) {
                scale = (windowRatio > gameRatio) ? windowHeight / p.height : widthRatio;
                transform = 'scale3d(' + scale + ',' + scale + ',1)';
                body.removeStyle('portrait');
            } else {
                scale = (windowHeight / p.width < heightRatio) ? windowHeight / p.width : heightRatio;
                transform = 'scale3d(' + scale + ',' + scale + ',1) rotate3d(0,0,1,90deg)';
                body.addStyle('portrait');
                isRotated = true;
            }

            html.addStyle({
                'transform': transform,
                'transform-origin': '50% 50% 0',
                left: -((p.width - windowWidth) / 2) + 'px',
                top: -((p.height - windowHeight) / 2) + 'px'
            });
            canvas.addStyle({
                width: '100%',
                height: '100%',
                top: 0
            });

            if (windowRatio > gameRatio) {
                //height should be respected
                canvas.width = windowWidth / (windowHeight / p.height);
                canvas.height = p.height;

            } else {
                //width should be respected
                canvas.width = p.width;
                canvas.height = windowHeight / (widthRatio);
            }

            if (windowWidth > windowHeight) {
                if (windowRatio > gameRatio) {
                    canvasContainer.setTransform((windowWidth * (p.height / windowHeight) - p.width) / 2, 0);
                } else {
                    canvasContainer.setTransform(0, (windowHeight * (p.width / windowWidth) - p.height) / 2);
                }
            } else {
                if (gameRatio < 1 / windowRatio) {
                    canvasContainer.setTransform(p.width, (canvas.height - p.width * gameRatio) / 2, gameRatio, gameRatio, 90, 0, 0, 0, 0);
                } else {
                    canvasContainer.setTransform(p.width - ((canvas.width / (canvas.height / p.width) - p.height) / 2), 0, canvas.height / p.width, canvas.height / p.width, 90, 0, 0, 0, 0);
                }
            }
        }

        obj.resize = resize;

        return obj;

    };

})(cjs.navigator);
