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
        return m;
    };

    /** MULTI NEED **/
    var getData = function (p) {
        var args = p.errors;
        if (p.status === c.DONE) {
            args = p.args.slice(-p.importsCounter);
            args = args.concat(p.args.slice(0, p.importsCounter+1));
        }
        return args;
    };

    var callAction = function(status, callback, p) {
        if (p.status === status) {
            callback.apply(null, getData(p));
        } else {
            if (status === c.DONE) {
                p.done = callback;
            } else {
                p.fail = callback;
            }
        }
    };

    var  multiNeed = function (array) {
        var m = {};
        var p = {
            done : function () {},
            fail : function() {},
            args : [],
            errors : [],
            count : 0,
            counter : 0,
            status : c.WAIT,
            collection: Collection(),
            importsCounter: 0
        };

        m.add = function (promise) {
            promise.id = p.counter++;
            promise.then(function(data, id) {
                m.itemOnDone(data,id);
            });
            promise.onFail(function(error) {
                m.itemOnFail(error);
            });
            return this;
        };
        m.itemOnDone = function (data, id) {
            p.count+=1;
            p.args[id] = data;
            if (p.count === p.collection.size()) {
                p.status = c.DONE;
                p.done.apply(this, getData(p));
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
        m.onFail = function(action) {
            callAction(c.FAIL, action, p);
        };

        array.forEach(function (promise) {
            m.add(promise)
        });

        return m;
    };

    /** PACKAGE NEED **/
    var packageNeed = function (callback) {
        var m = {};
        var p = {

        };
        var needCollector = function () {};

        callback.call(this, needCollector);

        m.status = function () {
            return c.WAIT;
        };

        return m;
    };



    return function (param) {
        if (param === undefined) {
             return singleNeed();
        } else if (Array.isArray(param)) {
            return multiNeed(param);
        } else {
            return packageNeed(param);
        }
    };

}();
