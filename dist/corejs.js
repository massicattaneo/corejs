/**
 * corejs - Javascript Framework
 * @version v1.1.0
 * @link https://github.com/massicattaneo/corejs#readme
 * @license ISC
 * @author Massimiliano Cattaneo
 */
function cjs() {}

(function(_c) {

    _c.create = function(object) {
        return extendClass(new cjs(), object || {});
    };

    _c.extend = function(ParentClass) {
        return {
            create: function(object) {
                return extendClass(new ParentClass(), object || {});
            },
            CollectionOf: function(cjs) {
                return {
                    create: function(object) {
                        var Func = extendClass(new ParentClass(), createCollectionProto(cjs));
                        return extendClass(new Func(), object || {});
                    }
                };
            }
        };
    };

    var extendClass = function (parentProto, childProto) {
        var _class = ExtendedClass(childProto.constructor, parentProto.constructor);
        _class.prototype = parentProto;
        for (var prop in childProto) {
            _class.prototype[prop] = ExtendedClass(childProto[prop], parentProto[prop]);
        }
        return _class;
    };

    _c.CollectionOf = function (cjs) {
        return {
            create: function(object) {
                return extendClass(createCollectionProto(cjs), object || {});
            }
        };
    };

    var sortTogether = function(array1, array2, versus) {
        var merged = [];
        array1.each(function (index) {
            merged.push({a1: array1[index], a2: array2[index]});
        });
        merged.sort(function (o1, o2) {
            if (!versus) {
                return ((o1.a1 < o2.a1) ? -1 : ((o1.a1 === o2.a1) ? 0 : 1));
            } else {
                return ((o1.a1 > o2.a1) ? -1 : ((o1.a1 === o2.a1) ? 0 : 1));
            }
        });
        merged.each(function (index, item) {
            array1[index] = item.a1;
            array2[index] = item.a2;
        });
    };

    var swapArray = function(array, from, to){
        var removed = array.splice(to, 1, array[from]);
        array[from] = removed[0];
    };

    var createCollectionProto = function (ClassType) {
        var proto = {
            VERSUS: {
                ascending: 0,
                descending: 1
            },
            constructor: function(array) {
                this.initValues();
                typeof array === 'array' && array.each(function (index, item) {
                    item && this.add(item);
                }, this);
            },
            initValues: function () {
                this.items = [];
                this.keys = [];
                this.__counterId = 0;
            },
            size: function() {
                return this.items.length;
            },
            isEmpty: function() {
                return this.size() === 0;
            },
            add: function (item, key) {
                var keyHere = (typeof key === 'undefined') ? this.__counterId++ : key;
                this.keys.push(keyHere);
                this.items.push(item);
                return keyHere;
            },
            sortByItem: function(versus) {
                sortTogether(this.items, this.keys, versus);
            },
            sortByKey: function(versus) {
                sortTogether(this.keys, this.items, versus);
            },
            sortBy: function(itemName, versus) {
                var items1 = [], items2 = [];
                this.each(function (i, k, o) {
                    items1.push(o[itemName]);
                    items2.push(o[itemName]);
                });
                sortTogether(items1, this.keys, versus);
                sortTogether(items2, this.items, versus);
            },
            newItem: function (key) {
                var newItem = new ClassType();
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
                var coll = new (cjs.CollectionOf(ClassType).create())();
                this.each(function(index, key, object) {
                    if (object[attribute] === value) {
                        coll.add(object, key);
                    }
                });
                return coll;
            },
            indexOf: function (item) {
                return this.items.indexOf(item);
            },
            addCollection: function(collection) {
                var self=this;
                collection.each(function(index,key,object) {
                    self.add(object,key);
                });
            },
            remove: function (key) {
                var removed;
                var index = 0;
                do {
                    index = this.keys.indexOf(key);
                    if (index !== -1) {
                        this.keys.splice(index,1);
                        removed = this.items.splice(index,1);
                    }
                } while (index !== -1);
                return removed[0] || null;
            },
            removeAt: function (index) {
                this.keys.splice(index,1);
                return this.items.splice(index,1)[0];
            },
            removeItem: function (item) {
                var index = this.indexOf(item);
                var key = this.keys[index];
                return this.remove(key);
            },
            filter: function(key) {
                var coll = new (cjs.CollectionOf(ClassType).create())();
                this.each(function(i, k, object) {
                    if (typeof key === 'undefined' || k === key) {
                        coll.add(object, key);
                    }
                });
                return coll;
            },
            clone: function () {
                return this.filter();
            },
            each: function(callback, thisArg) {
                for (var index = 0; index < this.items.length; index++) {
                    callback.call(thisArg || this, parseInt(index, 10), this.keys[index], this.items[index]);
                }
            },
            clear: function() {
                this.items = [];
                this.keys = [];
            },
            toArray: function() {
                var array = [];
                this.each(function(index,key,value) {
                    array.push(value);
                });
                return array;
            },
            toJSON: function() {
                var toJSON = {};
                this.each(function(index, key, value) {
                    toJSON[key] = value;
                });
                return toJSON;
            }
        };
        return proto;
    };

    function isNotNative(constructor) {
        return constructor && constructor.toString().indexOf('native code') === -1;
    }

    var ExtendedClass = function (childConstructor, parentConstructor) {
        if (typeof childConstructor === 'function') {
            return function () {
                this.parent = parentConstructor;
                return (isNotNative(childConstructor)) ? childConstructor.apply(this, arguments) : parentConstructor.apply(this, arguments);
            };
        } else {
            return childConstructor;
        }
    };

    _c.Collection = function (a) {
        return new (cjs.CollectionOf(Object).create())(a)
    }

})(cjs);


(function () {
    cjs.Array = {};
    cjs.Array.clone = function (array) {
        return array.slice(0);
    };
    cjs.Array.createWithIndexes = function(lastIndex, firstIndex) {
        var array = [];
        firstIndex = firstIndex || 0;
        for (var i = 0; i <= lastIndex - firstIndex; i++) {
            array[i] = i + firstIndex;
        }
        return array;
    };
})();


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



(function () {

    cjs.Object = {};

    cjs.Object.extend = function () {
        var self = arguments[0];
        for (var i = 0, j = arguments.length; i < j; i++) {
            var obj = arguments[i];
            Object.keys(obj).forEach(function (key) {
                self[key] = obj[key];
            });
        }
        return self;
    };

    cjs.Object.clone = function (obj) {
        return cjs.Object.extend({}, obj);
    };

    cjs.Object.toXML = function (o) {

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

        return scanNodes(o, 'Model');
    };

})(cjs);


(function () {
    function addStyle() {
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
    }

    function clearStyles() {
        this.className = "";
    }

    function removeStyle() {
        for (var a = 0; a < arguments.length; a++) {
            var className = arguments[a].trim();
            if (this.className.match(className)) {
                this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
            }
        }
    }

    function hasStyle(className) {
        return this.className.match(className) !== null;
    }

    function toggleStyle(className) {
        if (hasStyle.call(this, className)) {
            removeStyle.call(this, className);
        } else {
            addStyle.call(this, className);
        }
    }

    function addListener(action, callback) {
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
    }

    function removeListener(action, callback) {
        if (this.removeEventListener) {
            this.removeEventListener(action, callback);
        } else {
            this.detachEvent('on' + action, callback);
        }
    }

    function clearListeners() {
        if (this._listeners) {
            this._listeners.forEach(function (listener) {
                removeListener.call(this, listener.action, listener.callback)
            }, this);
        }
    }

    function removeAllChildren() {
        var fc = this.firstChild;
        while (fc) {
            this.removeChild( fc );
            fc = this.firstChild;
        }
        return this;
    }

    function getTarget(selector) {
        var event = selector || window.event;
        return event.target || event.srcElement;
    }

    function setText(text) {
        this.textContent = text;
        this.innerText = text;
        return this;
    }

    function fire(action, params) {
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
    }

    function getValue() {
        if (this.getAttribute('type') === 'checkbox') {
            return this.checked;
        }
        return this.innerText
    }

    function create(markup) {
        var div = document.createElement('div');
        div.innerHTML = markup;
        return div.children[0];
    }

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

    function toJSON() {
        return parseNode(this.children);
    }

    function Node(element) {
        var obj = {};

        [addStyle, clearStyles, removeStyle, hasStyle, toggleStyle,
            addListener, removeListener, clearListeners,
            setText, getValue,
            fire,
            toJSON,
            removeAllChildren]
            .forEach(function (func) {
                obj[func.name] = function () {
                    var apply = func.apply(element, arguments);
                    return apply === undefined ? obj : apply;
                }
            });

        obj.get = function () {
            return element;
        };

        obj.getAttribute = function(attrName) {
            if (!(element && element.getAttribute)) return null;
            return element.getAttribute(attrName)
        };

        obj.getTagName = function() {
            return element.tagName
        };

        obj.attributes = function () {
            return element.attributes;
        };

        obj.setAttribute = function (name, value) {
            return element.setAttribute(name, value);
        };

        obj.children = function() {
            if (!(element && element.childNodes)) return [];
            var nodes = Array.prototype.slice.call(element.childNodes);
            return nodes.map(function(e) {
                return Node(e)
            })
        };

        return obj;
    }

    cjs.Node = function (node) {
        if (typeof node === 'object') {
            return Node(getTarget(node));
        }
        if (node.indexOf('#') === -1) {
            return Node(create(node));
        }
        var e = document.getElementById(node.replace('#', ''));
        return Node(e);
    };



})();


(function () {

    var dayNames = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
    var monthNames = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

    cjs.Date = cjs.create({
        constructor: function (a) {
            this._date = a ? new Date(a) : new Date();
        },
        getMonthName: function () {
            return cjs.Date.getMothName(this._date.getMonth());
        },
        getShortMonthName: function () {
            return monthNames[this._date.getMonth()].substr(0,3);
        },
        getDayName: function () {
            return cjs.Date.getDayName(this._date.getDay());
        },
        getShortDayName: function () {
            return dayNames[this._date.getDay()].substr(0,3)
        },
        format: function (pattern) {
            pattern = pattern.replace(/dddd/g, this.getDayName());
            pattern = pattern.replace(/Dddd/g, this.getDayName().capitalize());
            pattern = pattern.replace(/ddd/g, this.getShortDayName());
            pattern = pattern.replace(/Ddd/g, this.getShortDayName().capitalize());
            pattern = pattern.replace(/dd/g, this._date.getDate().toString().padLeft(2, 0));
            pattern = pattern.replace(/mmmm/g, this.getMonthName());
            pattern = pattern.replace(/Mmmm/g, this.getMonthName().capitalize());
            pattern = pattern.replace(/mmm/g, this.getShortMonthName());
            pattern = pattern.replace(/Mmm/g, this.getShortMonthName().capitalize());
            pattern = pattern.replace(/mm/g, (this._date.getMonth() + 1).toString().padLeft(2, 0));
            pattern = pattern.replace(/yyyy/g, this._date.getFullYear().toString());
            pattern = pattern.replace(/yy/g, this._date.getFullYear().toString().substr(2, 2));
            pattern = pattern.replace(/TT/g, this._date.getHours().toString().padLeft(2,0));
            pattern = pattern.replace(/tt/g, this._date.getMinutes().toString().padLeft(2, 0));
            return pattern;
        }
    });

    cjs.Date.getDayName = function (day) {
        return dayNames[day]
    };
    cjs.Date.getMothName = function (day) {
        return monthNames[day]
    };

})();


cjs.Need = function () {
    var c = {
        WAIT: 0, DONE: 1, FAIL: 2
    };

    var finalize = function (props, status, data) {
        props.returnData[status] = data;
        props.status = status;
        props.collection.filter(function (o) {
            return o.status === status;
        }).forEach(function (o) {
            o.action(data, props.id);
        });
    };
    var attach = function (props, status, action) {
        if (props.status === status) {
            action(props.returnData[status], props.id);
        } else {
            props.collection.push({action: action, status: status});
        }
    };
    var createSingleNeed = function () {
        var m = {};
        var p = {
            returnData: [],
            status: c.WAIT,
            id: -1,
            collection: []
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
            collection: []
        };

        m.add = function (promise) {
            promise.setId(p.counter++);
            p.collection.push(promise);
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
            if (p.count === p.collection.length) {
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
            return p.collection[index];
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



cjs.bus = function () {

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



cjs.navigator = {};

(function (obj) {

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
        var pack = cjs.Need(), imported;
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
            return cjs.Object.extend({response: response}, abstract);
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

})(cjs.navigator);


cjs.Component = function () {

    var stylesFunctions = {};

    var styles = [];

    var injectModel = function (toJSON, node, value) {
        var v = toJSON;
        value.split('/').forEach(function (item) {
            v = v[item];
        });
        node.setText(v);
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
                    cjs.navigator.send('GET', '/data/' + o.attribute).then(function (data) {
                        injectModel(data.toJSON(), o.item, o.attribute);
                    });
                });
            };

            obj.save = function (item) {
                var elem = obj.get(item);
                return cjs.navigator.send('POST', '/data/' + elem.attribute);
            };

            obj.get = function (item) {
                var elem = collection.filter(function (o) {
                    return o.item.get() === item.get();
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
        var attribute = node.getAttribute(attrName);
        if (attribute) {
            attrName === 'data-on' && createListeners(attribute, node, obj);
            attrName === 'data-item' && createItems(attribute, node, obj);
            attrName === 'data-bind' && createBindings(attribute, node, obj);
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.getTagName()) {
            var match = node.getTagName().match(/COREJS:(.*)/);
            if (match) {
                var c = Component.get(match[1].toCamelCase());
                var comp = cjs.Object.extend(Component({
                    template: (node.get().innerHTML) ? parseTemplate(c.template, node.toJSON()) : c.template,
                    style: (node.get().innerHTML) ? parseStyle(c.style, node.toJSON()) : c.style,
                    config: c.config
                }), c.controller);
                comp.createIn(node.get(), 'before');
                for (var i = 0; i < node.attributes().length; i++) {
                    var a = node.attributes()[i];
                    if (a.name !== 'class') {
                        comp.node.setAttribute(a.name, a.value);
                    }
                }
                comp.node.addStyle(node.get().className);
                obj.items.add(comp, node.getAttribute('data-id'));
                node.get().parentNode.removeChild(node.get());
                return comp.node;
            }
        }
        return null;
    };

    var parseNode = function (node, obj) {
        node.children().forEach(function (n) {
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
                    m && addCSSRule(sheet, selector, m[2], 0);
                });

            });

            styles.push({className: className, style: style});
        }

        function addCSSRule(sheet, selector, rules, index) {
            if("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else if("addRule" in sheet) {
                sheet.addRule(selector, rules, index);
            }
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

        var node = cjs.Node(template);

        var obj = {
            items: cjs.Collection(),
            template: template,
            style: style,
            config: config,
            node: node
        };

        obj.createIn = function (parent, position) {
            if (!position) {
                parent.appendChild(node.get(0));
            } else {
                position === 'before' && parent.parentNode.insertBefore(node.get(), parent);
                position === 'after' && parent.parentNode.insertBefore(node.get(), parent.nextSibling);
            }
            if (style) {
                node.addStyle(appendStyle(style));
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
                n.children().forEach(saveNode);
            })(node);

            return cjs.Need(needs);
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
