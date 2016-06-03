/**
 * corejs - Javascript Framework
 * @version v1.0.0.beta
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
    var separator = this.indexOf('-') !== -1 ?'-' : '/';
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




Object.prototype.extend = function () {
    var self = this;
    for (var i = 0, j = arguments.length; i < j; i++){
        var obj = arguments[i];
        Object.keys(obj).forEach(function (key) {
            self[key] = obj[key];
        });
    }
    return this;
};

Object.prototype.clone = function () {
    return Object.extend(this);
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

    var packages = Collection();

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
    var singleNeed = function () {
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
        };

        m.then = function (action) {
            attach(p, c.DONE, action);
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
    var multiNeed = function (array) {
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

    var createPackage = function (namespace, callback) {
        var m = {};
        var theseNeeds = Need([]);

        if (!packages.get(namespace)) {
            packages.add(Need(), namespace)
        }

        var total = 0;
        var needCollector = function (ns) {
            total++;
            if (packages.get(ns)) {
                theseNeeds.add(packages.get(ns));
            } else {
                var need = Need();
                theseNeeds.add(need);
                packages.add(need, ns);
            }
        };

        var needReplacer = function (ns) {
            return retrievePackage(ns);
        };

        callback(needCollector);

        var pack = packages.get(namespace);

        if (total === 0) {
            pack.__callback = function() {return callback()};
            pack.__namespace = namespace;
            pack.resolve(pack.__callback);
        } else {
            theseNeeds.then(function () {
                var packs = {};
                for (var i = 0; i < arguments.length; i++) {
                    packs[arguments[i].__namespace] = arguments[i]();
                }
                pack.__callback = function() {return callback(needReplacer)};
                pack.__namespace = namespace;
                pack.resolve(pack.__callback);
            });
        }


        m.status = function () {
            return theseNeeds.status();
        };

        return m;
    };

    var retrievePackage = function (namespace) {
        return packages.get(namespace).__callback();
    };

    return function Need(param, callback) {
        if (param === undefined) {
            return singleNeed();
        } else if (Array.isArray(param)) {
            return multiNeed(param);
        } else if (arguments.length === 1) {
            return retrievePackage(param);
        } else {
            return createPackage(param, callback);
        }
    };

}();


(function (obj) {

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

    obj.get = function(url, options) {
        return obj.send('GET', url, options || {});
    };
    obj.post = function(url, options) {
        return obj.send('POST', url, options || {});
    };
    obj.put = function(url, options) {
        return obj.send('PUT', url, options || {});
    };
    obj.delete = function(url, options) {
        return obj.send('DELETE', url, options || {});
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

    })(navigator);


var Component = function () {

    var injectModel = function (toJSON, node, value) {
        var v = toJSON;
        value.split('/').forEach(function (item) {v = v[item];});
        node.setInnerText(v);
    };

    var components = [],
        cssStyleIndex = 0,
        dataProxy = Collection().extend(function () {
            var obj = {};

            obj.collect = function () {
                var coll = this.clone();
                this.clear();
                coll.forEach(function (node, value) {
                    navigator.send('POST', '/data/' + value).then(function (data) {
                       injectModel(data.toJSON(), node, value);
                    });
                });
            };
            return obj;
        }());

    var createNode = function (markup) {
        var doc = document.implementation.createHTMLDocument("");
        doc.body.innerHTML = markup;
        return doc.body.childNodes[0];
    };

    function createListeners(attribute, node, obj) {
        var split = attribute.trim().split(':');
        var actions = split[0].split(',');
        var listener = split[1];
        actions.forEach(function (action) {
            node.addListener(action, function (event) {
                obj[listener].call(obj, event);
            });
        })
    }

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
                var c = Component.get(match[1]);
                var comp = Component(c.template, c.style).extend(c.controller);
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

    var appendStyle = function (style, cssSelector) {
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
                m && sheet.addRule((cssSelector + ' ') + m[1], m[2]);
            });

        })

    };

    var Component = function (template, style) {
        var node = createNode(template);

        var obj = {
            items: Collection(),
            template: template,
            style: style,
            node: node
        };

        obj.createIn = function (parent, position) {
            if (!position) {
                parent.appendChild(node);
            } else {
                position === 'before' && parent.parentNode.insertBefore(node, parent);
                position === 'after' && parent.parentNode.insertBefore(node, parent.nextSibling);
            }
            node && parseNode(node, obj);
            if (style) {
                var cssSelector = 'ID' + (cssStyleIndex++).toString().padLeft(8, '0');
                node.addClass(cssSelector);
                style && appendStyle(style, '.' + cssSelector);
            }
            obj.init && obj.init();
            dataProxy.collect();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName);
        };

        return obj;
    };

    Component.register = function (name, controller, template, style) {
        controller.template = template;
        controller.style = style;
        components.push({
            name: name,
            controller: controller,
            template: template,
            style: style
        });
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name.toUpperCase() === componentName.toUpperCase();
        })[0];
    };

    return Component;

}();
