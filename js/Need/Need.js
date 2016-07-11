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

    /** QUEUE **/
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
