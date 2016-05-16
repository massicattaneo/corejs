


Object.prototype.extend = function () {
    var ret = {};
    for (var i = 0, j = arguments.length; i < j; i++){
        var obj = arguments[i];
        Object.keys(obj).forEach(function (key) {
            ret[key] = obj[key];
        });
    }
    return ret;
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
                    coll.add(object, key);
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
        var obj = Object.extend(proto);
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

    var packageNeed = function (namespace, callback) {
        var m = {};
        var p = {
            needs: Need([])
        };

        var needCollector = function (namespace) {
            if (packages.get(namespace)) {
                p.needs.add(packages.get(namespace));
            } else {
                var need = Need();
                p.needs.add(need);
                packages.add(need, namespace);
            }
        };

        var func = callback(needCollector);

        if (packages.get(namespace)) {
            func.__namespace = namespace;
            packages.get(namespace).resolve(func);
        } else {
            packages.add(Need(), namespace)
        }

        p.needs.then(function () {
            var packs = {};
            for (var i = 0; i < arguments.length; i++) {
                packs[arguments[i].__namespace] = arguments[i]
            }
            callback(function (namespace) {
                return packs[namespace]();
            })();
        });

        m.status = function () {
            return p.needs.status();
        };

        return m;
    };

    return function Need(param, callback) {
        if (param === undefined) {
            return singleNeed();
        } else if (Array.isArray(param)) {
            return multiNeed(param);
        } else {
            return packageNeed(param, callback);
        }
    };

}();
