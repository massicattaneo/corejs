/**
 * corejs - Javascript Framework
 * @version v1.0.0
 * @link https://github.com/massicattaneo/corejs#readme
 * @license ISC
 * @author Massimiliano Cattaneo
 */

Array.prototype.fillWithIndexes = function(lastIndex, firstIndex) {
    firstIndex = firstIndex || 0;
    for (var i = 0; i <= lastIndex - firstIndex; i++) {
        this[i] = i + firstIndex;
    }
    return this;
};

Array.prototype.clone = function() {
    return this.slice(0);
};

String.prototype.replaceAt = function (start, length, string) {
    return this.substr(0, start) + string + this.substr(start + length);
};

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
};

String.prototype.removeAt = function (index, length) {
    length = (typeof length === "undefined") ? 1 : length;
    return this.substr(0, index) + this.substr(index + length);
};

String.prototype.padLeft = function (size, char) {
    if (size === 0) {
        return '';
    }
    return (Array(size + 1).join(char) + this).slice(-size);
};

String.prototype.padRight = function (size, char) {
    if (size === 0) {
        return '';
    }
    return (this + Array(size + 1).join(char)).slice(0, size);
};

String.prototype.removeHTMLTags = function () {
    return this.replace(/<\/?[^>]+(>|$)/g, '');
};

String.prototype.startsWith = function (start) {
    return this.substr(0, start.length) === start;
};

String.prototype.highlightWord = function (wordToHighlight, tagName, cssClass) {
    tagName = tagName || 'strong';
    var regex = new RegExp('(' + wordToHighlight + ')', 'gi');
    strClass = (cssClass) ? ' class="' + cssClass + '"' : '';
    return this.replace(regex, '<' + tagName + strClass + '>$1</' + tagName + '>');
};

String.prototype.isTime = function () {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this);
};

String.prototype.isDate = function () {
    var separator = this.indexOf('-') !== -1 ? '-' : '/';
    var d = this.split(separator);
    if (d.join("-").length < 10) return false;

    var date = new Date(d.join("-"));
    if (/Invalid|NaN/.test(date.toString())) return false;
    else if (date.getDate() !== parseInt(d[2], 10)) return false;
    else if (date.getFullYear() !== parseInt(d[0], 10)) return false;

    return true;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toString().toLowerCase();
};

String.prototype.toDate = function () {
    if (!isNaN(this)) {
        return new Date(parseInt(this));
    }
    var array = this.split(this.match(/\D/));
    return new Date(parseInt(array[0], 10), parseInt(array[1], 10) - 1, parseInt(array[2], 10));
};

(function (proto) {

    proto.toCamelCase = function () {
        var self = this;
        if (self.match(/\s|-|_/)) {
            self = self.toLowerCase();
            var a = self.match(/([^\s|_|-]*)/g);
            return a.reduce(function (p, c) {
                return p + c.capitalize();
            });
        } else if (!self.match(/[a-z]/)) {
            return self.toLowerCase();
        } else {
            return self;
        }
    };

    var convert = function (self, char) {
        if (self.match(/\s/)) {
            var a = self.match(/([^\s]*)/g);
            return a.reduce(function (p, c) {
                return p.toLowerCase() + (c ? char + c.toLowerCase() : '');
            });
        } else if (self.match(new RegExp(char))) {
            return self.toLowerCase();
        } else if (self.match(/_/)) {
            return self.toLowerCase().replace(/_/g, '-');
        } else if (self.match(/-/)) {
            return self.toLowerCase().replace(/-/g, '_');
        } else {
            return convert(self
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function(str){ return str.toUpperCase(); }), char);
        }
    };

    proto.toKebabCase = function () {
        return convert(this, '-');
    };

    proto.toSnakeCase = function () {
        return convert(this, '_');
    };

})(String.prototype);




Object.prototype.extend = function () {
    var self = this;
    for (var i = 0, j = arguments.length; i < j; i++) {
        var obj = arguments[i];
        Object.keys(obj).forEach(function (key) {
            self[key] = obj[key];
        });
    }
    return this;
};

Object.prototype.clone = function () {
    return {}.extend(this);
};

Object.prototype.toXML = function () {

    function createNode(name, value) {
        var child = document.createElement(name);
        child.innerText = value;
        return child;
    }

    function scanArray(array, nodeName, node) {
        for (var prop = 0; prop < array.length; prop++) {
            if (typeof array[prop] !== 'object') {
                node.appendChild(createNode(nodeName, array[prop]));
            } else {
                node.appendChild(scanNodes(array[prop], nodeName));
            }
        }
    }

    function scanNodes(object, nodeName) {
        var node = document.createElement(nodeName);
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (object[prop] instanceof Array) {
                    scanArray(object[prop], prop, node);
                } else {
                    if (typeof object[prop] !== 'object') {
                        node.appendChild(createNode(prop, object[prop]));
                    } else {
                        node.appendChild(scanNodes(object[prop], prop));
                    }
                }
            }
        }
        return node;
    }

    return scanNodes(this, 'Model');
};


Element.prototype.addClass = function () {
    for (var a = 0; a < arguments.length; a++) {
        var className = arguments[a].trim();
        if (this.className) {
            if (!this.className.match(className)) {
                this.className += ' ' + className;
            }
        } else {
            this.className = className;
        }
    }
    return this;
};

Element.prototype.clearClass = function () {
    this.className = "";
    return this;
};

Element.prototype.removeClass = function () {
    for (var a = 0; a < arguments.length; a++) {
        var className = arguments[a].trim();
        if (this.className.match(className)) {
            this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
        }
    }
    return this;
};

Element.prototype.hasClass = function (className) {
    return this.className.match(className);
};

Element.prototype.toggleClass = function (className) {
    if (this.hasClass(className)) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
    return this;
};

Element.prototype.addListener = function (action, callback) {
    this._listeners = this._listeners || [];
    this._listeners.push({
        action: action,
        callback: callback
    });
    if (this.addEventListener) {
        this.addEventListener(action, callback);
    } else {
        this.attachEvent('on' + action, callback);
    }
};

Element.prototype.removeListener = function (action, callback) {
    if (this.removeEventListener) {
        this.removeEventListener(action, callback);
    } else {
        this.detachEvent('on' + action, callback);
    }
};

Element.prototype.resetListeners = function () {
    if (this._listeners) {
        this._listeners.forEach(function (listener) {
            this.removeListener(listener.action, listener.callback)
        }, this);
    }
};

Event.prototype.getTarget = function () {
    var event = this || window.event;
    return event.target || event.srcElement;
};

Element.prototype.setInnerText = function (text) {
    this.textContent = text;
    this.innerText = text;
    return this;
};

Element.prototype.fire = function (action, params) {
    if (document.action) {
        var evt = document.createEventObject();
        evt.data = params;
        return this.fireEvent('on' + action, evt)
    }
    else {
        var e = document.createEvent("HTMLEvents");
        e.initEvent(action, true, true);
        e.data = params;
        return !this.dispatchEvent(e);
    }
};

Element.create = function (markup) {
    var doc = document.implementation.createHTMLDocument("");
    doc.body.innerHTML = markup;
    return doc.body.childNodes[0];
};

(function () {

    function getNodeValue(node) {
        var text = node.textContent || node.innerText;
        var value = isNaN(text) ? text : parseFloat(text);
        return value;
    }

    var isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };

    function parseNode(children) {
        var json = {};
        for (var n = 0; n < children.length; n++) {
            var node = children[n];
            var tagName = node.tagName.toCamelCase();

            if (json[tagName] && !(json[tagName] instanceof Array)) {
                json[tagName] = [json[tagName]];
            }

            var value = parseNode(node.children) || getNodeValue(node);

            if (json[tagName] instanceof Array) {
                json[tagName].push(value);
            } else {
                json[tagName] = value;
            }
        }
        return (isEmpty(json)) ? null : json;
    }

    Element.prototype.toJSON = function () {
        return parseNode(this.children);
    };

})();



var Collection = function () {

    var sortTogether = function(array1, array2, versus) {
        var merged = [];
        array1.forEach(function (item, index) {
            merged.push({a1: array1[index], a2: array2[index]});
        });
        merged.sort(function (o1, o2) {
            if (!versus) {
                return ((o1.a1 < o2.a1) ? -1 : ((o1.a1 === o2.a1) ? 0 : 1));
            } else {
                return ((o1.a1 > o2.a1) ? -1 : ((o1.a1 === o2.a1) ? 0 : 1));
            }
        });
        merged.forEach(function (item, index) {
            array1[index] = item.a1;
            array2[index] = item.a2;
        });
    };

    var swapArray = function(array, from, to){
        var removed = array.splice(to, 1, array[from]);
        array[from] = removed[0];
    };

    var proto = {
        VERSUS: {
            ascending: 0,
            descending: 1
        },
        initValues: function () {
            this.items = [];
            this.keys = [];
            this.__counterId = 0;
        },
        size: function () {
            return this.items.length;
        },
        isEmpty: function () {
            return this.size() === 0;
        },
        add: function (item, key) {
            var keyHere = (typeof key === 'undefined') ? this.__counterId++ : key;
            this.keys.push(keyHere);
            this.items.push(item);
            return keyHere;
        },
        sortByItem: function (versus) {
            sortTogether(this.items, this.keys, versus);
        },
        sortByKey: function (versus) {
            sortTogether(this.keys, this.items, versus);
        },
        sortBy: function (itemName, versus) {
            var items1 = [], items2 = [];
            this.forEach(function (o) {
                items1.push(o[itemName]);
                items2.push(o[itemName]);
            });
            sortTogether(items1, this.keys, versus);
            sortTogether(items2, this.items, versus);
        },
        newItem: function (key) {
            var newItem = new this.ClassType();
            this.add(newItem, key);
            return newItem;
        },
        get: function (key) {
            return this.items[this.keys.indexOf(key)];
        },
        getAt: function (index) {
            return this.items[index];
        },
        getKeyAt: function (index) {
            return this.keys[index];
        },
        set: function (key, newValue) {
            var index = this.keys.indexOf(key);
            this.items[index] = newValue;
            return index;
        },
        setAt: function (index, newValue) {
            this.items[index] = newValue;
            return this.keys[index];
        },
        setKey: function (oldKey, newKey) {
            var index = this.keys.indexOf(oldKey);
            this.keys[index] = newKey;
            return index;
        },
        getLast: function (key) {
            return this.items[this.keys.lastIndexOf(key)];
        },
        swap: function (index1, index2) {
            swapArray(this.items, index1, index2);
            swapArray(this.keys, index1, index2);
        },
        getCollection: function (attribute, value) {
            var coll = Collection();
            this.forEach(function (object, key) {
                if (object[attribute] === value) {
                    coll.add(object, key);
                }
            });
            return coll;
        },
        indexOf: function (item) {
            return this.items.indexOf(item);
        },
        addCollection: function (collection) {
            collection.forEach(function (object, key) {
                this.add(object, key);
            }, this);
        },
        remove: function (key) {
            var removed;
            var index = 0;
            do {
                index = this.keys.indexOf(key);
                if (index !== -1) {
                    this.keys.splice(index, 1);
                    removed = this.items.splice(index, 1);
                }
            } while (index !== -1);
            return removed[0] || null;
        },
        removeAt: function (index) {
            this.keys.splice(index, 1);
            return this.items.splice(index, 1)[0];
        },
        removeItem: function (item) {
            var index = this.indexOf(item);
            var key = this.keys[index];
            return this.remove(key);
        },
        filter: function (key) {
            var coll = Collection();
            this.forEach(function (object, k) {
                if (typeof key === 'undefined' || k === key) {
                    coll.add(object, k);
                }
            });
            return coll;
        },
        clone: function () {
            return this.filter();
        },
        forEach: function (callback, thisArg) {
            for (var index = 0; index < this.items.length; index++) {
                callback.call(thisArg || this, this.items[index], this.keys[index], parseInt(index, 10));
            }
        },
        clear: function () {
            this.items = [];
            this.keys = [];
        },
        toArray: function () {
            var array = [];
            this.forEach(function (value) {
                array.push(value);
            });
            return array;
        },
        toJSON: function () {
            var toJSON = {};
            this.forEach(function (value, key) {
                toJSON[key] = value;
            });
            return toJSON;
        }
    };

    return function (ClassType) {
        var obj = {};
        obj.extend(proto);
        obj.initValues();
        if (Array.isArray(ClassType)) {
            ClassType.forEach(function (item) {
                obj.add(item);
            });
        } else {
            obj.ClassType = ClassType;
        }

        return obj;
    }

}();




var Need = function () {
    var c = {
        WAIT: 0, DONE: 1, FAIL: 2
    };

    var finalize = function (props, status, data) {
        props.returnData[status] = data;
        props.status = status;
        props.collection.filter(status).forEach(function (action) {
            action(data, props.id);
        });
    };
    var attach = function (props, status, action) {
        if (props.status === status) {
            action(props.returnData[status], props.id);
        } else {
            props.collection.add(action, status);
        }
    };
    var createSingleNeed = function () {
        var m = {};
        var p = {
            returnData: [],
            status: c.WAIT,
            id: -1,
            collection: Collection()
        };

        m.resolve = function (data) {
            if (p.status === c.WAIT) {
                finalize(p, c.DONE, data);
            }
        };

        m.fail = function (error) {
            finalize(p, c.FAIL, error);
            return m;
        };

        m.then = function (action) {
            attach(p, c.DONE, action);
            return m;
        };

        m.onFail = function (action) {
            attach(p, c.FAIL, action);
        };

        m.status = function () {
            return p.status;
        };
        m.setId = function (id) {
            p.id = id;
        };
        return m;
    };

    var getData = function (p) {
        var args = p.errors;
        if (p.status === c.DONE) {
            args = p.args.slice(0);
        }
        return args;
    };
    var callAction = function (status, callback, p) {
        if (p.status === status) {
            callback.apply(null, getData(p));
        } else {
            if (status === c.DONE) {
                p.done.push(callback);
            } else {
                p.fail = callback;
            }
        }
    };
    var createMultiNeed = function (array) {
        var m = {};
        var p = {
            done: [],
            fail: function () {
            },
            args: [],
            errors: [],
            count: 0,
            counter: 0,
            status: c.WAIT,
            collection: Collection()
        };

        m.add = function (promise) {
            promise.setId(p.counter++);
            p.collection.add(promise);
            promise.then(function (data, id) {
                m.itemOnDone(data, id);
            });
            promise.onFail(function (error) {
                m.itemOnFail(error);
            });
            return this;
        };
        m.itemOnDone = function (data, id) {
            p.count += 1;
            p.args[id] = data;
            if (p.count === p.collection.size()) {
                p.status = c.DONE;
                p.done.forEach(function (func) {
                    func.apply(this, getData(p));
                });
            }
        };
        m.itemOnFail = function (error) {
            p.errors.push(error);
            p.status = c.FAIL;
            p.fail.apply(this, getData(p));
        };
        m.then = function (action) {
            callAction(c.DONE, action, p);
        };
        m.onFail = function (action) {
            callAction(c.FAIL, action, p);
        };
        m.get = function (index) {
            return p.collection.get(index);
        };
        m.status = function () {
            return p.status;
        };

        array.forEach(function (promise) {
            m.add(promise);
        });

        return m;
    };

    var createQueue = function (array) {
        var queue = {};
        var index = -1;

        var clearQueue = function () {
            array.length = 0;
            index = -1;
        };

        var runQueue = function (result) {
            index += 1;
            if (array.length > index) {
                array[index](queue, result).then(runQueue).onFail(clearQueue);
            } else {
                clearQueue();
            }
        };

        queue.start = function (param) {
            runQueue(param);
        };

        queue.push = function (o) {
            array.push(o);
        };

        queue.isRunning = function () {
            return index !== -1;
        };

        return queue;
    };

    return function Need(param) {
        if (param === undefined) {
            return createSingleNeed();
        } else if (Array.isArray(param)) {
            if (typeof param[0] === 'object' || param[0] === undefined) {
                return createMultiNeed(param);
            } else if (typeof param[0] === 'function') {
                return createQueue(param);
            }
        }
    };

}();



var Bus = function () {

    var events = [];
    var obj = {};

    obj.on = function (eventName, callback, priority) {
        events.push({
            eventName: eventName,
            callback: callback,
            priority: priority || 1000
        })
    };

    obj.off = function (eventName, callback) {
        var filter = events.filter(function (e) {
            return e.eventName === eventName && e.callback === callback;
        })[0];
        events.splice(events.indexOf(filter), 1);
    };

    obj.once = function (eventName, callback, priority) {
        events.push({
            eventName: eventName,
            callback: function () {
                callback();
                obj.off(eventName, callback);
            },
            priority: priority || 1000
        })
    };

    obj.fire = function (eventName, param) {
        events.filter(function (e) {
            return e.eventName === eventName;
        }).sort(function (a, b) {
            return a.priority - b.priority;
        }).forEach(function (e) {
            e.callback(param);
        });
    };

    obj.clear = function () {
        events.length = 0;
    };

    return obj;

}();



(function (obj) {

    var packages = Collection();
    var imports = function (url) {
        return packages.get(url) || createPackage(url)
    };
    var getPackage = function (url) {
        return packages.get(url).pack;
    };

    var importer = {
        js: function (o, imported, pack) {
            eval('imported = ' + o.response.response);
            var needs = Need([]), total = 0;
            var importer = function (url) {
                total++;
                needs.add(imports(url));
            };
            imported(importer);
            if (total === 0) {
                pack.pack = imported();
                pack.resolve(pack.pack);
            } else {
                needs.then(function () {
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
        var pack = Need(), imported;
        packages.add(pack, url);
        obj.get(url).then(function (o) {
            var ext = url.substr(url.lastIndexOf('.') +1);
            ext = (ext === 'js' || ext === 'json') ? ext : 'text';
            importer[ext](o, imported, pack);
        });
        return pack;
    };

    obj.send = function (method, url, options) {
        options = options || {};
        var promise = Need();
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
                promise.fail(request);
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
            return {response: response}.extend(abstract);
        }
    }();
    var getHttpObject = function () {
        if (window.ActiveXObject) {
            return new ActiveXObject('MSXML2.XMLHTTP.3.0');
        } else {
            return new XMLHttpRequest();
        }
    };


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
    }

})(navigator);


var Component = function () {

    var stylesFunctions = {};

    var styles = [];

    var injectModel = function (toJSON, node, value) {
        var v = toJSON;
        value.split('/').forEach(function (item) {
            v = v[item];
        });
        node.setInnerText(v);
    };

    var components = [],
        cssStyleIndex = 0,
        dataProxy = (function () {
            var obj = {};
            var collection = [];

            obj.add = function (item, attribute) {
                collection.push({item: item, attribute: attribute});
            };

            obj.collect = function () {
                collection.forEach(function (o) {
                    navigator.send('GET', '/data/' + o.attribute).then(function (data) {
                        injectModel(data.toJSON(), o.item, o.attribute);
                    });
                });
            };

            obj.save = function (item) {
                var elem = this.get(item);
                return navigator.send('POST', '/data/' + elem.attribute);
            };

            obj.get = function (item) {
                var elem = collection.filter(function (o) {
                    return o.item === item;
                });
                return elem ? elem[0] : null;
            };

            return obj;
        }());

    var createListeners = function (attribute, node, obj) {
        var split = attribute.trim().split(':');
        var actions = split[0].split(',');
        var listener = split[1];
        actions.forEach(function (action) {
            node.addListener(action, function (event) {
                obj[listener].call(obj, event);
            });
        })
    };

    var createItems = function (attribute, node, obj) {
        obj.items.add(node, attribute);
    };

    var createBindings = function (attribute, node, obj) {
        dataProxy.add(node, attribute);
    };

    var attach = function (node, obj, attrName) {
        if (node.getAttribute) {
            var attribute = node.getAttribute(attrName);
            if (attribute) {
                attrName === 'data-on' && createListeners(attribute, node, obj);
                attrName === 'data-item' && createItems(attribute, node, obj);
                attrName === 'data-bind' && createBindings(attribute, node, obj);
            }
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.tagName) {
            var match = node.tagName.match(/COREJS:(.*)/);
            if (match) {
                var c = Component.get(match[1].toCamelCase());
                var comp = Component({
                    template: (node.innerHTML) ? parseTemplate(c.template, node.toJSON()) : c.template,
                    style: (node.innerHTML) ? parseStyle(c.style, node.toJSON()) : c.style,
                    config: c.config
                }).extend(c.controller);
                comp.createIn(node, 'before');
                for (var i = 0; i < node.attributes.length; i++) {
                    var a = node.attributes[i];
                    if (a.name !== 'class') {
                        comp.node.setAttribute(a.name, a.value);
                    }
                }
                comp.node.addClass(node.className);
                obj.items.add(comp, node.getAttribute('data-id'));
                node.parentNode.removeChild(node);
                return comp.node;
            }
        }
        return null;
    };

    var parseNode = function (node, obj) {
        var nodes = Array.prototype.slice.call(node.childNodes);
        nodes.forEach(function (n) {
            parseNode(n, obj);
        });
        node = parseNodeComponent(node, obj) || node;
        attach(node, obj, 'data-on');
        attach(node, obj, 'data-item');
        attach(node, obj, 'data-bind');
    };

    var appendStyle = function (style) {
        style = style.replace(/\n/g, '');
        var existingStyle = styles.filter(function (s) {
            return s.style === style;
        });

        if (existingStyle.length > 0) {
            var className = existingStyle[0].className;
        } else {
            var className = 'CJS' + (cssStyleIndex++);
            var cssSelector = '.' + className;
            var sheet = function () {
                var style = document.createElement("style");
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
                return style.sheet;
            }();

            style.split('}').forEach(function (rule) {
                var m1 = rule.concat("}").match(/.*\{.*\}/);
                m1 && m1.forEach(function (r) {
                    var m = r.trim().match(/(.*)\{(.*)\}/);
                    var selector;
                    if (m[1].match('.&')) {
                        selector = m[1].replace(/\.&/g, cssSelector)
                    } else {
                        selector = (cssSelector + ' ') + m[1];
                    }
                    m && sheet.addRule(selector, m[2]);
                });

            });

            styles.push({className: className, style: style});
        }

        return className;

    };

    var parseStyle = function (style, config) {
        var match = style.match(/\$\w*/g);
        if (match) {
            match.forEach(function (string) {
                string = string.replace('$', '');
                style = style.replace(new RegExp('\\$' + string, 'g'), config[string] || '');
            })
        }
        Object.keys(stylesFunctions).forEach(function (fname) {
            match = style.match(new RegExp(fname + '\\((.*)\\)')) || [];
            if (match[1]) {
                style = style.replace(match[0], stylesFunctions[fname](match[1]));
            }
        });

        return style;
    };

    var parseTemplate = function (template, config) {
        var match = template.match(/\{\{\w*\}\}/g);
        while (match) {
            match.forEach(function (string) {
                string = string.replace('{{', '').replace('}}', '');
                template = template.replace(new RegExp('\\{\\{' + string + '\\}\\}', 'g'), config[string] || '');
            });
            match = template.match(/\{\{\w*\}\}/g);
        }
        return template;
    };

    var Component = function (p) {

        var config = p.config || {};
        var style = parseStyle(p.style || '', config);
        var template = parseTemplate(p.template || '', config);

        var node = Element.create(template);

        var obj = {
            items: Collection(),
            template: template,
            style: style,
            config: config,
            node: node
        };

        obj.createIn = function (parent, position) {
            if (!position) {
                parent.appendChild(node);
            } else {
                position === 'before' && parent.parentNode.insertBefore(node, parent);
                position === 'after' && parent.parentNode.insertBefore(node, parent.nextSibling);
            }
            if (style) {
                node.addClass(appendStyle(style));
            }
            node && parseNode(node, obj);
            obj.init && obj.init();
            dataProxy.collect();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName);
        };

        obj.save = function () {
            var needs = [];
            (function saveNode(n) {
                if (dataProxy.get(n)) {
                    needs.push(dataProxy.save(n))
                }
                Array.prototype.slice.call(n.childNodes).forEach(saveNode);
            })(obj.node);

            return Need(needs);
        };

        return obj;
    };

    Component.register = function (p) {
        p.controller = p.controller || {};
        components.push(p);
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name === componentName;
        })[0];
    };

    Component.registerStyleFunction = function (name, func) {
        stylesFunctions[name] = func;
    };

    return Component;

}();
