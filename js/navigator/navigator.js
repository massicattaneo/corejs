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
    obj.fileLength = function (url) {
        var promise = cjs.Need();
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState === this.DONE) {
                promise.resolve(parseInt(xhr.getResponseHeader("Content-Length")));
            }
        };
        xhr.send();
        return promise;
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
        var dm = {};
        dm.deviceType = 'desktop';
        var osInfo = getOsInfo(ua);
        dm.os = osInfo[0];
        dm.osVersion = osInfo[1];
        var browserInfo = getBrowserInfo(ua);
        dm.browserName = browserInfo[1].toLowerCase();
        dm.browserVersion = browserInfo[2];
        dm.getScreenOrientation = getScreenOrientation;
        return dm;
    };
    obj.screenManager = function (params) {

        var sm = {};
        var fixedSize = [];
        var tops = [];
        var bottoms = [];
        var rights = [];
        var fullScreen = [];

        sm.centered = function (p) {
            fixedSize.push({
                node: cjs.Node(p.selector),
                width: p.width,
                height: p.height
            });
            resize();
        };
        sm.top = function (p) {
            tops.push({
                node: cjs.Node(p.selector)
            });
            resize();
        };
        sm.bottom = function (p) {
            bottoms.push({
                node: cjs.Node(p.selector)
            });
            resize();
        };
        sm.right = function (p) {
            rights.push({
                node: cjs.Node(p.selector)
            });
            resize();
        };
        sm.fullScreen = function (p) {
            fullScreen.push({
                node: cjs.Node(p.selector)
            });
            resize();
        };

        function choseOrientation(landscape, portrait) {
            if (window.innerWidth > window.innerHeight || !params.rotateOnPortrait) {
                return landscape;
            } else {
                return portrait;
            }
        }
        function getTransformation(scale) {
            return choseOrientation(
                'scale3d(' + scale + ',' + scale + ',1)',
                'scale3d(' + scale + ',' + scale + ',1) rotate3d(0,0,1,90deg)'
            )
        }
        function getScale(width, height) {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var gameRatio = width / height;
            var windowRatio = windowWidth / windowHeight;
            var widthRatio = windowWidth / width;
            var heightRatio = windowWidth / height;

            var scaleLandscape = (windowRatio > gameRatio) ? windowHeight / height : widthRatio;
            var scalePortrait = (windowHeight / width < heightRatio) ? windowHeight / width : heightRatio;

            return choseOrientation(scaleLandscape, scalePortrait);
        }
        function resize() {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var scale = getScale(params.width, params.height);

            fixedSize.forEach(function (o) {
                o.node.addStyle({
                    'position': 'absolute',
                    'width': o.width + 'px',
                    'height': o.height + 'px',
                    'transform': getTransformation(getScale(o.width, o.height)),
                    'transform-origin': '50% 50% 0',
                    left: -((o.width - windowWidth) / 2) + 'px',
                    top: -((o.height - windowHeight) / 2) + 'px'
                })
            });

            tops.forEach(function (o) {
                o.node.addStyle({
                    'position': 'absolute',
                    'height': '1px',
                    'width': choseOrientation(windowWidth / scale + 'px', windowHeight / scale + 'px'),
                    'transform': getTransformation(scale),
                    'transform-origin': '0% 0% 0',
                    top: choseOrientation('0px', '0px'),
                    left: choseOrientation('0px', 'auto'),
                    right: choseOrientation('auto', -windowHeight / scale + 'px')
                })
            });

            bottoms.forEach(function (o) {
                o.node.addStyle({
                    'position': 'absolute',
                    'height': '1px',
                    'width': choseOrientation(windowWidth / scale + 'px', windowHeight / scale + 'px'),
                    'transform': getTransformation(scale),
                    'transform-origin': '0% 0% 0',
                    bottom: choseOrientation('0px', windowHeight + 'px'),
                    left: choseOrientation('0px', '0px')
                })
            });

            rights.forEach(function (o) {
                o.node.addStyle({
                    'position': 'absolute',
                    'width': '1px',
                    'height': params.height + 'px',
                    'transform': getTransformation(scale),
                    'transform-origin': '50% 50% 0',
                    // top: choseOrientation('0px', window.innerHeight / 2 + 'px'),
                    // left: choseOrientation(-((params.width - windowWidth) / 2) + 'px', 'auto'),
                    right: choseOrientation('0px',  windowWidth/2 + 'px'),
                    top: choseOrientation((windowHeight-params.height)/2 +'px', windowHeight-(params.height/2)+'px')
                })
            });

            fullScreen.forEach(function (o) {
                o.node.addStyle({
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    top: 0
                });

                if (o.node.get() instanceof HTMLCanvasElement) {
                    var gameRatio = params.width / params.height;
                    var windowRatio = windowWidth / windowHeight;

                    if (windowRatio > gameRatio) {
                        o.node.get().width = windowWidth / (windowHeight / params.height);
                        o.node.get().height = params.height;
                    } else {
                        o.node.get().width = params.width;
                        o.node.get().height = windowHeight / (windowWidth / params.width);
                    }
                }
            });

            // var canvasContainer = p.canvasContainer;
            // if (windowWidth > windowHeight) {
            //     if (windowRatio > gameRatio) {
            //         canvasContainer.setTransform((windowWidth * (p.height / windowHeight) - p.width) / 2, 0);
            //     } else {
            //         canvasContainer.setTransform(0, (windowHeight * (p.width / windowWidth) - p.height) / 2);
            //     }
            // } else {
            //     if (gameRatio < 1 / windowRatio) {
            //         canvasContainer.setTransform(p.width, (canvas.height - p.width * gameRatio) / 2, gameRatio, gameRatio, 90, 0, 0, 0, 0);
            //     } else {
            //         canvasContainer.setTransform(p.width - ((canvas.width / (canvas.height / p.width) - p.height) / 2), 0, canvas.height / p.width, canvas.height / p.width, 90, 0, 0, 0, 0);
            //     }
            // }
        }

        window.onresize = resize;

        resize();

        return sm;

    };

    obj.fileLoader = function () {

        var loadingSpeed;
        var imagesLoaded = [];
        var obj = {};

        function previouslyLoaded(p) {
            return imagesLoaded.filter(function (o) {
                return o.url === p.url;
            })[0];
        }
        function loadImage(url, onProgress, imageSize) {
            var defer = cjs.Need(), image = cjs.Need('<img>');
            var totalRemainingToLoad = imageSize;
            var startTime = new Date().getTime();

            var int = setInterval(function () {
                var sizeLoaded = loadingSpeed * 0.3;
                if (totalRemainingToLoad > sizeLoaded) {
                    totalRemainingToLoad -= sizeLoaded;
                    onProgress(sizeLoaded)
                }
            }, 100);

            image
                .setAttribute('src', url)
                .addOnceEventListener('load', function (data) {
                    clearInterval(int);
                    updateLoadingSpeed(startTime, new Date().getTime(), imageSize);
                    onProgress(totalRemainingToLoad);
                    image = null;
                    defer.resolve(data);
                })
                .addOnceEventListener('error',function (e) {
                    clearInterval(int);
                    defer.resolve({});
                });
            return defer.promise();
        }
        function loadImages(images, onProgress) {
            var defs = [];

            var totalSize = 0, totalLoaded = 0;
            images.forEach(function (image) {
                image.size = isNaN(image.size) ? 0 : image.size;
                totalSize += image.size;
                totalLoaded += image.loaded;
            });

            images.forEach(function (image) {
                defs.push(loadImage(image.url, function (loaded) {
                    image.loaded = loaded;
                    totalLoaded += loaded;
                    onProgress(totalLoaded, totalSize);
                }, image.size))
            });
            return cjs.Need(defs);
        }

        obj.load = function (array, onProgress) {
            var images = [];
            array.forEach(function (o) {
                if (!previouslyLoaded(o)) {
                    images.push(o)
                }
            });
            onProgress = onProgress || function () {};
            onProgress(1, 100);
            return loadImages(images, onProgress);
        };

        obj.calculateSpeed = function (testImageUrl, testImageSize) {
            var d = cjs.Need();
            var startTime = new Date().getTime();
            cjs.Node('<img>')
                .setAttribute('src', testImageUrl)
                .addOnceListener('load', function () {
                    updateLoadingSpeed(startTime, new Date().getTime(), testImageSize);
                    d.resolve();
                });
            return d.promise();
        };

        function updateLoadingSpeed(startTime, endTime, fileSize) {
            loadingSpeed = fileSize/((endTime - startTime)/1000);// bytes/s
        }

        return obj;
    }

})(cjs.navigator);
