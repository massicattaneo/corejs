/**
 * corejs - Javascript Framework
 * @version v1.1.0
 * @link https://github.com/massicattaneo/corejs#readme
 * @license ISC
 * @author Max Cattaneo <massi.cattaneo.it@gmail.com>
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
            filter: function(callback, thisArg) {
                var coll = new (cjs.CollectionOf(ClassType).create())();
                this.forEach(function(object, k, i) {
                    if (callback.call(thisArg ||this, object, k, i)) {
                        coll.add(object, k);
                    }
                });
                return coll;
            },
            filterByKey: function(key) {
                var coll = new (cjs.CollectionOf(ClassType).create())();
                this.forEach(function(object, k, i) {
                    if (typeof key === 'undefined' || k === key) {
                        coll.add(object, key);
                    }
                });
                return coll;
            },
            clone: function () {
                return this.filter();
            },
            forEach: function(callback, thisArg) {
                for (var index = 0; index < this.items.length; index++) {
                    callback.call(thisArg || this, this.items[index], this.keys[index], parseInt(index, 10));
                }
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
                this.forEach(function(o) {
                    array.push(o);
                });
                return array;
            },
            keysToArray: function() {
                var array = [];
                this.forEach(function(o, k) {
                    array.push(k);
                });
                return array;
            },
            toJSON: function() {
                var toJSON = {};
                this.forEach(function(value, key) {
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
        for (var i = 1, j = arguments.length; i < j; i++) {
            var obj = arguments[i] || {};
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

    function addClass() {
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

    function addCss(o) {
        var e = this;
        Object.keys(o).forEach(function (k) {
            e.style[k] = o[k];
        })
    }

    function addStyle() {
        if (typeof arguments[0] === 'object') {
            addCss.apply(this, arguments);
        } else {
            addClass.apply(this, arguments);
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

    var specialEvents = {};
    (function (evs) {

        var agent = navigator.userAgent.toLowerCase(),
            isChromeDesktop = (agent.indexOf('chrome') > -1 && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('mobile') < 0 && agent.indexOf('android') < 0),
            settings = {
                tap_pixel_range: 5,
                swipe_h_threshold: 50,
                swipe_v_threshold: 50,
                taphold_threshold: 750,
                touch_capable: ('ontouchstart' in window && !isChromeDesktop),
                tapevent:    ('ontouchstart' in window && !isChromeDesktop) ? 'tap' : 'click',
                startevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchstart' : 'mousedown'),
                endevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchend' : 'mouseup'),
                moveevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'mousemove'),
                scrollevent: ('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'scroll',
                hold_timer: null
            };

        evs.tapstart = function(callback) {
            var self = this;
            addListener.call(this, settings.startevent, function tapStartFunc(e) {

                if (e.which && e.which !== 1) {
                    return false;
                }

                var touchData = {
                        'position': {
                            'x': ((settings.touch_capable) ? e.touches[0].screenX : e.screenX),
                            'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
                triggerCustomEvent(self, 'tapstart', callback, e, touchData);
                return true;
            })
        };
        evs.tap = function (callback) {
            var self = this,
                started = false,
                origTarget = null,
                start_time,
                start_pos = {
                    x: 0,
                    y: 0
                },
                touches;
            addListener.call(this, settings.startevent, function (e) {
                if (e.which && e.which !== 1) {
                    return false;
                }
                started = true;
                start_pos.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                start_pos.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
                start_time = Date.now();
                origTarget = e.target;
                touches = (e.targetTouches) ? e.targetTouches : [e];
                return true;
            });
            addListener.call(this, settings.endevent, function (e) {
                var end_x = (e.targetTouches) ? e.changedTouches[0].pageX : e.pageX,
                    end_y = (e.targetTouches) ? e.changedTouches[0].pageY : e.pageY,
                    diff_x = (start_pos.x - end_x),
                    diff_y = (start_pos.y - end_y);

                if (origTarget == e.target && started && ((Date.now() - start_time) < settings.taphold_threshold) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                    var touchData = [];

                    for (var i = 0; i < touches.length; i++) {
                        var touch = {
                            'position': {
                                'x': (settings.touch_capable) ? e.changedTouches[i].screenX : e.screenX,
                                'y': (settings.touch_capable) ? e.changedTouches[i].screenY : e.screenY
                            },
                            'time': Date.now(),
                            'target': e.target
                        };

                        touchData.push(touch);
                    }
                    triggerCustomEvent(self, 'tap', callback, e, touchData);
                }
            });

        };
        evs.tapmove = function (callback) {
            var self = this;
            addListener.call(this, settings.moveevent, function tapMoveFunc(e) {
                var touchData = {
                    'position': {
                        'x': ((settings.touch_capable) ? e.touches[0].screenX : e.screenX),
                        'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                    },
                    'time': Date.now(),
                    'target': e.target
                };

                triggerCustomEvent(self, 'tapmove', callback, e, touchData);
                return true;
            });
        };
        evs.tapend = function (callback) {
            var self = this;
            addListener.call(this, settings.endevent, function (e) {
                var touchData = {
                    'position': {
                        'x': (settings.touch_capable) ? e.changedTouches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? e.changedTouches[0].screenY : e.screenY
                    },
                    'time': Date.now(),
                    'target': e.target
                };
                triggerCustomEvent(self, 'tapend', callback, e, touchData);
                return true;
            });
        };
        evs.taphold = function (callback) {
            var self = this,
                $this = ret(self),
                origTarget,
                start_pos = {
                    x: 0,
                    y: 0
                },
                end_x = 0,
                end_y = 0;

            addListener.call(this, settings.startevent, function tapHoldFunc1(e) {
                if (e.which && e.which !== 1) {return false;}

                origTarget = e.target;
                var start_time = Date.now(),
                    startPosition = {
                        'x': (settings.touch_capable) ? e.touches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                    },
                    startOffset = {
                        'x': (settings.touch_capable) ? e.touches[0].pageX - e.touches[0].target.offsetLeft : e.offsetX,
                        'y': (settings.touch_capable) ? e.touches[0].pageY - e.touches[0].target.offsetTop : e.offsetY
                    };

                start_pos.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                start_pos.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;

                end_x = start_pos.x;
                end_y = start_pos.y;

                settings.hold_timer = window.setTimeout(function() {

                    var diff_x = (start_pos.x - end_x),
                        diff_y = (start_pos.y - end_y);

                    if (e.target == origTarget && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                        var end_time = Date.now(),
                            endPosition = {
                                'x': (settings.touch_capable) ? e.touches[0].screenX : e.screenX,
                                'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                            };
                        var duration = end_time - start_time;

                        var touchData = {
                            'startTime': start_time,
                            'endTime': end_time,
                            'startPosition': startPosition,
                            'startOffset': startOffset,
                            'endPosition': endPosition,
                            'duration': duration,
                            'target': e.target
                        };
                        triggerCustomEvent(self, 'taphold', callback, e, touchData);
                    }
                }, settings.taphold_threshold);

                return true;
            });
            addListener.call(this, settings.endevent, function tapHoldFunc2() {
                window.clearTimeout(settings.hold_timer);
            });
            addListener.call(this, settings.moveevent, function tapHoldFunc3(e) {
                end_x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                end_y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
            });
        };


        function triggerCustomEvent(obj, eventType, callback, event, touchData) {
            var originalType = event.type;
            event.type = eventType;
            callback.call(obj, event, touchData);
            event.type = originalType;
        }

    })(specialEvents);

    function addListener(action, callback) {
        if (['tapstart', 'tap', 'tapmove', 'tapend', 'taphold'].indexOf(action) !== -1) {
            specialEvents[action].call(this, callback);
        } else{
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
        var self = this;
        return function () {removeListener.call(self,action, callback)}
    }

    function removeListener(action, callback) {
        if (this.removeEventListener) {
            this.removeEventListener(action, callback);
        } else {
            this.detachEvent('on' + action, callback);
        }
    }

    function addOnceListener(action, callback) {
        var self = this;
        var once = function (a) {
            callback(a);
            removeListener.call(self, action, once)
        };
        addListener.call(self, action, once);
    }

    function clearListeners() {
        if (this._listeners) {
            this._listeners.forEach(function (listener) {
                removeListener.call(this, listener.action, listener.callback)
            }, this);
            this._listeners.length = 0;
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

    function setValue(value) {
        if (this.getAttribute('type') === 'checkbox') {
            this.checked = value;
        } else if (['text', 'email', 'tel', ].indexOf(this.getAttribute('type')) !== -1) {
            this.value = value;
        } else {
            this.textContent = value;
            this.innerText = value;
        }
        return this;
    }

    function getValue() {
        if (this.getAttribute('type') === 'checkbox') {
            return this.checked;
        } else if(this.value !== undefined) {
            return this.value;
        }
        return this.innerText
    }

    function getAttribute(attrName) {
        var element = this;
        if (!(element && element.getAttribute)) return null;
        return element.getAttribute(attrName)
    }

    function setAttribute(name, value) {
        var element = this;
        if (value === undefined) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value);
        }
    }

    function runAnimation(name, params) {
        params = params || {time: 500, times: 1}
        var onEnds = 'animationend animationend webkitAnimationEnd oanimationend MSAnimationEnd'.split(' ');
        var n = cjs.Need();
        var self = this;
        var callback = function () {
            self.style.animation = '';
            n.resolve()
        };
        onEnds.forEach(function (action) {
            addListener.call(self, action, callback)
        });
        n.done(function () {
            onEnds.forEach(function (action) {
                removeListener.call(self, action, callback)
            });
        });
        this.style.animation = name + ' ' + params.time + 'ms ' + (params.times || 1) + ' ' + (params.ease || 'linear');
        return n;
    }

    function appendChild(node) {
        return this.appendChild(node.get());
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

    var extensions = {};
    function Node(element) {
        var obj = {};

        [addStyle, clearStyles, removeStyle, hasStyle, toggleStyle,
            addListener, addOnceListener, removeListener, clearListeners,
            setValue, getValue,
            getAttribute, setAttribute,
            runAnimation,
            appendChild,
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

        obj.attributes = function () {
            return element.attributes;
        };

        obj.getTagName = function() {
            return element.tagName
        };

        obj.children = function() {
            if (!(element && element.childNodes)) return [];
            var nodes = Array.prototype.slice.call(element.childNodes);
            return nodes.map(function(e) {
                return Node(e)
            })
        };

        cjs.Object.extend(obj, extensions);

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

    cjs.Node.extend = function (o) {
        cjs.Object.extend(extensions, o);
    }



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
    cjs.Date.isToday = function (time) {
        var d = new Date(time);
        var today = new Date();
        if (d.getFullYear() !== today.getFullYear()) return false;
        if (d.getMonth() !== today.getMonth()) return false;
        if (d.getDate() !== today.getDate()) return false;
        return true;
    };
    cjs.Date.setUp = function (_dayNames, _monthNames) {
        dayNames = _dayNames;
        monthNames = _monthNames;
    };

})();


(function() {

    cjs.Currency = cjs.create({
        constructor: function (a) {
            this._original = a!== undefined ? a : 0;
        },
        format: function (pattern) {
            var integer = parseInt(this._original, 10);
            var float = this._original.toString().split('.')[1] ||[];
            pattern = pattern.replace(/i/g, integer);
            var count = -1;
            pattern = pattern.split('').map(function (char) {
                if (char === 'f') count++;
                return (char === 'f') ? float[count] || 0 : char;
            }).join('');
            pattern = pattern.replace(/s/g, '€');
            return pattern;
        }
    });

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
            return m;
        };

        m.reject = function (error) {
            finalize(p, c.FAIL, error);
            return m;
        };

        m.done = function (action) {
            attach(p, c.DONE, action);
            return m;
        };

        m.fail = function (action) {
            attach(p, c.FAIL, action);
            return m;
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
                p.reject = callback;
            }
        }
    };

    function itemOnDone(p, data, id) {
        p.count += 1;
        p.args[id] = data;
        if (p.count === p.collection.length) {
            p.status = c.DONE;
            p.done.forEach(function (func) {
                func.apply(this, getData(p));
            });
        }
    }

    function itemOnFail(p, error) {
        p.errors.push(error);
        p.status = c.FAIL;
        p.reject.apply(this, getData(p));
    }

    var createMultiNeed = function (array) {
        var m = {};
        var p = {
            done: [],
            reject: function () {},
            args: [],
            errors: [],
            count: 0,
            counter: 0,
            status: c.WAIT,
            collection: [],
            id: -1
        };

        m.add = function (promise) {
            promise.setId(p.counter++);
            p.collection.push(promise);
            promise.done(function (data, id) {
                itemOnDone.call(this,p, data, id);
            });
            promise.fail(function (error) {
                itemOnFail.call(this,p, error);
            });
            return this;
        };
        m.done = function (action) {
            callAction(c.DONE, action, p);
            return m;
        };
        m.fail = function (action) {
            callAction(c.FAIL, action, p);
            return m;
        };
        m.get = function (index) {
            return p.collection[index];
        };
        m.status = function () {
            return p.status;
        };
        m.size = function () {
            return p.collection.length;
        };
        m.setId = function (id) {p.id = id;};

        array.forEach(function (promise) {
            m.add(promise);
        });

        return m;
    };

    var createQueue = function (array) {
        var queue = {};
        var index = -1;
        var always;
        var queuePromise;

        queue.start = function (param) {
            queuePromise = createSingleNeed();
            runQueue(param);
            return queuePromise;
        };
        queue.push = function (o) {
            Array.prototype.push.apply(array, arguments);
            return queue;
        };
        queue.pushAndRun = function () {
            if (!queue.isRunning()) {
                queue.push.apply(queue, arguments);
                queue.start();
            } else {
                queue.push.apply(queue, arguments)
            }
            return queue;
        };
        queue.reject = function () {
            array = [];
            index = -1;
            if (always) {
                always.apply(queue, arguments);
            }
            queuePromise.reject();
            always = undefined;
        };
        queue.length = function () {
            return array.length;
        };
        queue.isRunning = function () {
            return index !== -1;
        };
        queue.concat = function (a) {
            array = array.concat(a);
            return queue;
        };
        queue.always = function (callback) {
            always = callback;
            return queue;
        };
        queue.insert = function (item, offset) {
            array.splice(index+1+(offset ||0), 0, item);
            return queue;
        };

        function clearQueue() {
            array = [];
            index = -1;
            if (always) {
                always.apply(queue, arguments);
            }
            queuePromise.resolve();
            always = undefined;
        }
        function runQueue(result) {
            index += 1;
            if (array.length > index) {
                var n = array[index](queue, result);
                if (n && n.done) {
                    n.done(runQueue).fail(clearQueue);
                } else {
                    clearQueue();
                }
            } else {
                clearQueue();
            }
        }

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



(function () {

    function createBus() {
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
    }

    cjs.bus = {};

    cjs.bus.addBus = function (name) {
        cjs.bus[name] = createBus();
    };
    cjs.bus.removeBus = function (name) {
        cjs.bus[name].clear();
        delete cjs.bus[name];
    };

})();



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
            loadingSpeed = fileSize/((endTime - startTime)/1000);
        }

        return obj;
    }

})(cjs.navigator);

(function () {

    cjs.Db = function () {
        return {
            onChange: function () {}
        }
    };

    cjs.Db.firebaseAdapter = function () {
        var obj = {}, db;

        obj.once = function (path, callback) {
            db.ref(path).once('value').then(callback);
        };

        obj.onChange = function (path, callback) {
            db.ref(path).on('value', function (data) {
                callback(data.val())
            });
        };

        obj.onRemove = function (path, callback) {
            db.ref(path).on('child_removed', callback);
        };

        obj.get = function (path) {
            return db.ref().child(path);
        };

        obj.remove = function (path) {
            db.ref(path).remove();
        };

        obj.ref = function (reference) {
            return db.ref(reference);
        };

        obj.add = function (path, info) {
            var newStoreRef = db.ref(path).push();
            info.created = new Date().getTime();
            newStoreRef.set(info);
            return newStoreRef.key;
        };

        obj.update = function (path, info) {
            var newStoreRef = db.ref(path);
            info.modified = new Date().getTime();
            return newStoreRef.set(info);
        };

        obj.off = function (path) {
            db.ref(path).off();
        };

        obj.login = function (email, password) {
            var n = cjs.Need();
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(n.resolve)
                .catch(n.reject);
            return n;
        };

        obj.init = function (config) {
            firebase.initializeApp(config);
            db = firebase.database();
        };

        return obj;
    };

    cjs.Db.staticJSONAdapter = function (privateData) {
        var obj = {};
        var onChange, onRemove;

        obj.once = function (path, callback) {
            var array = privateData[path.replace('/', '')];
            var json = {};
            array.forEach(function (o, i) {
                json[i] = o;
            });
            callback({
                val: function () {
                    return json;
                },
                exportVal: function () {
                    return json;
                }
            });
        };

        obj.onChange = function (path, callback) {
            onChange = callback;
            var k = path.split('/');
            var f = privateData;
            k.forEach(function (o) {
                f = f[o]
            });
            callback(f);
        };

        obj.onRemove = function (path, callback) {
        };

        obj.get = function (path) {
            return json[path.replace('/', '')];
        };

        obj.remove = function (path) {
        };

        obj.add = function (path, info) {
            var d = json[path.replace('/', '')];
            d.push(info);
            return d.length -1;
        };

        obj.update = function (path, info) {

        };

        obj.off = function (path) {

        };

        obj.login = function () {
            return cjs.Need().resolve();
        };

        obj.ref = function (reference) {
            const ref = reference.replace('/', '');
            return {
                on: function (action, callback) {
                    if (action === 'child_added') {
                        Object.keys(privateData[ref]).forEach(function (key) {
                            callback({ key: key, val: function() { return privateData[ref][key] }
                        })
                        });
                    }
                }
            };
        };

        obj.init = function () {
        };

        return obj
    }

})();

(function () {

    cjs.Calendar = function () {};

    cjs.Calendar.googleCalendar = function () {
        var obj = {};
        var calendars = {};

        function getCalendarList(promise) {
            gapi.client.calendar.calendarList.list().then(function (e) {
                e.result.items.forEach(function (c) {
                    calendars[c.summary] = c;
                });
                promise.resolve();
            });
        }

        obj.init = function (config) {
            var promise = cjs.Need();
            gapi.load('client:auth2', function () {
                gapi.client.init({
                    discoveryDocs: config.DISCOVERY_DOCS,
                    clientId: config.CLIENT_ID,
                    scope: config.SCOPES
                }).then(function () {
                    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        gapi.auth2.getAuthInstance().signIn().then(function (e) {
                            getCalendarList(promise);
                        });
                    } else {
                        getCalendarList(promise);
                    }
                })
            });
            return promise;
        };

        obj.get = function (calendarOwner, datetime) {
            var cal = calendars[calendarOwner];
            var promise = cjs.Need();
            datetime.setHours(0,0,0,0);
            var timeMin = datetime.toISOString();
            datetime.setHours(23,59,59,999);
            var timeMax = datetime.toISOString();
            var params = {
                calendarId: cal.id,
                timeMin: timeMin,
                timeMax: timeMax,
                timeZone: cal.timeZone
            };
            gapi.client.calendar.events.list(params).then(function(d) {
                promise.resolve(d);
            });
            return promise;
        };

        obj.insert = function (calendarOwner, params) {
            var summary = params.summary, start= params.start, end = params.end, description = params.description;
            var promise = cjs.Need();
            var cal = calendars[calendarOwner];
            gapi.client.calendar.events.insert({
                calendarId: cal.id,
                resource: {
                    summary: summary,
                    location: cal.location,
                    start: { "dateTime": start.toISOString(), timeZone: cal.timeZone},
                    end: { "dateTime": end.toISOString(), timeZone: cal.timeZone },
                    description: description
                }
            }).then(function (e) {
                promise.resolve(e.result.id);
            });
            return promise;
        };

        obj.delete = function (calendarOwner, eventId) {
            var cal = calendars[calendarOwner];
            var promise = cjs.Need();
            var params = {
                calendarId: cal.id,
                eventId: eventId,
            };
            gapi.client.calendar.events.delete(params).then(function(err) {
                promise.resolve();
            });
            return promise;
        };

        obj.update = function (calendarOwner, eventId, modify) {
            var cal = calendars[calendarOwner];
            var promise = cjs.Need();
            gapi.client.calendar.events.get({calendarId: cal.id,eventId: eventId,}).then(function (e) {
                var params = {
                    calendarId: cal.id,
                    eventId: eventId,
                    summary: modify.summary || e.result.summary,
                    location: cal.location,
                    start: { "dateTime": modify.start ? modify.start.toISOString() : e.result.start.dateTime, timeZone: cal.timeZone},
                    end: { "dateTime": modify.end ? modify.end.toISOString() : e.result.end.dateTime, timeZone: cal.timeZone },
                    description: modify.description || e.result.description
                };
                gapi.client.calendar.events.update(params).then(function(err) {
                    promise.resolve();
                });
            });
            return promise;
        };

        obj.getCalendars = function (calendarOwner) {
            return calendarOwner ? calendars[calendarOwner] : calendars;
        };

        return obj;
    };

    cjs.Calendar.staticJSONAdapter = function (privateData) {
        var obj = {};

        return obj
    }

})();


cjs.Component = function () {

    var stylesFunctions = {};
    var parsingFunctions = {};
    var styles = [];

    var dataBase = cjs.Db();

    cjs.bus.addBus('bindings');

    function dataParser(data, node) {
        var attribute = node.getAttribute('data-parser');
        if (attribute && parsingFunctions[attribute]) {
            parsingFunctions[attribute](data, node)
        } else if (!attribute && parsingFunctions[attribute]) {
            console.error('missing parsing function')
        }
    }

    var components = [],
        cssStyleIndex = 0,
        dataProxy = (function () {
            var obj = {};
            var collection = [];

            obj.add = function (item, attribute) {
                collection.push({item: item, attribute: attribute});
            };

            obj.collect = function () {
                var need = cjs.Need([]);
                collection.forEach(function (o) {
                    if (!o.item.__isCollect) {
                        o.item.__isCollect = true;
                        var n = cjs.Need();
                        need.add(n);
                        dataBase.onChange(o.attribute, function (data) {
                            o.item.setValue(data);
                            dataParser(data, o.item);
                            n.resolve();
                        });
                    }
                });
                if (need.size() === 0) {
                    need.add(cjs.Need().resolve())
                }
                return need;
            };

            obj.forEach = function (callback) {
                collection.forEach(callback);
            };

            obj.off = function (path) {
                dataBase.off(path);
            };

            obj.save = function (item) {
                var elem = obj.get(item);
                dataBase.update(elem.attribute, elem.item.getValue());
                return cjs.Need().resolve();
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
        attribute.trim().split('||').forEach(function (attribute) {
            var split = attribute.trim().split(':');
            var actions = split[0].split(',');
            var listener = split[1];
            actions.forEach(function (action) {
                node.addListener(action, function (event) {
                    obj[listener].call(obj, event);
                });
            })
        });
    };

    var createItems = function (attribute, node, obj) {
        obj.items.add(node, attribute);
    };

    var createServerBindings = function (attribute, node) {
        dataProxy.add(node, attribute);
    };

    var createBindings = function (attribute, node) {
        cjs.bus.bindings.on(attribute, function (value) {
            node.setValue(value)
        })
    };

    var reservedAttributes = ['data-on', 'data-item', 'data-bind', 'data-server'];

    var attach = function (node, obj, attrName) {
        var attribute = node.getAttribute(attrName);
        if (attribute && reservedAttributes.indexOf(attrName) !== -1) {
            attrName === 'data-on' && createListeners(attribute, node, obj);
            attrName === 'data-item' && createItems(attribute, node, obj);
            attrName === 'data-bind' && createBindings(attribute, node, obj);
            attrName === 'data-server' && createServerBindings(attribute, node, obj);
            node.setAttribute(attrName);
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.getTagName()) {
            var match = node.getTagName().match(/CJS:(.*)/);
            if (match) {
                var c = Component.get(match[1].toCamelCase());
                var config = node.toJSON();
                var configExt = cjs.Object.extend({}, config, c.config);
                var comp = Component({
                    template: (node.get().innerHTML) ? parseTemplate(c.template, cjs.Object.extend({}, config, c.config)) : c.template,
                    style: (node.get().innerHTML) ? parseStyle(c.style, configExt) : c.style,
                    config: c.config
                }, c.controller(configExt));
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
        reservedAttributes.forEach(function (attrName) {
            attach(node, obj, attrName);
        });
    };

    var appendStyle = function (style) {
        var ruleIndex = 0;
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

            var split = style.split('}');
            split.splice(split.length-1, 1);
            split=split.map(function(a) {
                return a+'}';
            });
            var i = 0;
            while (i!==split.length) {
                if (split[i].indexOf('@keyframes') !== -1) {
                    split[i] += split.splice(i+1,1)[0];
                    if (split[i+1] === '}') {
                        split[i] += split.splice(i+1,1)[0];
                        i++;
                    }
                } else {
                    i++
                }
            }
            split.forEach(function (rule) {
                var m1 = rule.match(/.*\{.*\}/);
                m1 && m1.forEach(function (r) {
                    var m = r.trim().match(/(.*)\{(.*)\}/);
                    var selector;
                    if (m[1].match(/\.&/)) {
                        selector = m[1].replace(/\.&/g, cssSelector)
                    } else if (m[1].match('@keyframes')){
                        selector = m[1].replace(/-&/g, cssSelector.replace('.', '-'))
                    }
                    m && addCSSRule(sheet, selector, m[2], ruleIndex++);
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
                while (match[1]) {
                    style = style.replace(match[0], stylesFunctions[fname](match[1]));
                    match = style.match(new RegExp(fname + '\\((.*)\\)')) || [];
                }
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

    var extensions = {};
    var Component = function (p, obj) {

        var config = p.config || {};
        var style = parseStyle(p.style || '', config);
        var template = parseTemplate(p.template || '', config);
        var className = '';
        var node = cjs.Node(template);

        obj = obj || {};
        obj.items = cjs.Collection();
        obj.template = template;
        obj.style = style;
        obj.config = config;
        obj.node = node;

        function getParent(parent) {
            if (parent instanceof HTMLElement) return parent;
            if (typeof parent === 'string') return cjs.Node(parent).get();
            return parent.get();
        }

        obj.createIn = function (parent, position) {
            parent = getParent(parent);
            if (!position) {
                parent.appendChild(node.get(0));
            } else {
                position === 'before' && parent.parentNode.insertBefore(node.get(), parent);
                position === 'after' && parent.parentNode.insertBefore(node.get(), parent.nextSibling);
            }
            if (style) {
                className = appendStyle(style);
                node.addStyle(className);
            }
            node && parseNode(node, obj);
            obj.init && obj.init();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName) || obj.node;
        };

        obj.getClassName = function () {
            return className;
        };

        obj.runAnimation = function (name, params) {
            return obj.get(params.item).runAnimation(name + '-' + className, params);
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

        obj.toJSON = function () {
            var a = {};
            obj.items.each(function (index, key, node) {
                a[key] = node.getValue();
            });
            return a;
        };

        obj.remove = function () {
            obj.node.clearListeners();
            obj.items.each(function (index, key, item) {
                var i = item.get() instanceof HTMLElement ? item : item.get();
                i.clearListeners();
            });
            dataProxy.forEach(function (o, index) {
                if (obj.get() === o.item) {
                    dataProxy.off(o.attribute);
                }
                if (obj.items.indexOf(o.item)) {
                    dataProxy.off(o.attribute);
                }
            });

            var parent = obj.node.get().parentNode;
            parent.removeChild(obj.node.get());
        };

        cjs.Object.extend(obj, extensions);

        return obj;
    };

    Component.extend = function (o) {
        cjs.Object.extend(extensions, o);
    };

    Component.register = function (p) {
        p.controller = p.controller || function () {return {}};
        components.push(p);
    };

    Component.injectDatabaseProxy = function (db) {
        dataBase = db;
    };

    Component.collectData = function () {
        return dataProxy.collect();
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name === componentName;
        })[0];
    };

    Component.create = function (componentName, proto) {
        var rc = cjs.Component.get(componentName);
        var config = cjs.Object.extend(proto.config || {}, rc.config);
        var o = (proto.controller) ? proto.controller(config) : rc.controller(config);
        return cjs.Component({
            config: config,
            template: rc.template,
            style: rc.style
        }, o);
    };

    Component.registerStyleFunction = function (name, func) {
        stylesFunctions[name] = func;
    };

    Component.registerParserFunction = function (name, func) {
        parsingFunctions[name] = func;
    };

    Component.parse = function (name, data, item) {
        return parsingFunctions[name](data, item);
    };

    return Component;

}();


cjs.Audio = function () {
    var obj = {};

    var sounds = {name: {url: ''}};
    var instances = {};
    var isMuted = false;

    obj.init = function (sds) {
        sounds = sds;
        Object.keys(sounds).forEach(function (type) {
            instances[type] = new Audio(sounds[type].url);
        });
    };

    obj.play = function (type) {
        var sound = sounds[type];
        if (sound && !isMuted) {
            instances[type].play();
        }
    };

    obj.stop = function (type) {
        instances[type].pause();
        instances[type].currentTime = 0;
    };

    obj.mute = function () {
        isMuted = true;
    };

    obj.unmute = function () {
        isMuted = false;
    };

    return obj;
};
