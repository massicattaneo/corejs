/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Promise
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

cjs.Need = function () {
    /** CONSTANTS **/
    var c = {
        WAIT: 0, DONE: 1, FAIL: 2
    };

    /** SINGLE NEED **/
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

    /** QUEUE **/
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
