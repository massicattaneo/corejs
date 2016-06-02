/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Promise
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

var Need = function () {
    /** CONSTANTS **/
    var c = {
        WAIT: 0, DONE: 1, FAIL: 2
    };

    var packages = Collection();

    /** SINGLE NEED **/
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

    /** MULTI NEED **/
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

    /** PACKAGE NEED **/
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
