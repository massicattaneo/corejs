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

};

var Promise, Promises;

(function () {
    var WAIT = 0, DONE = 1, FAIL = 2;

    var PromiseAbstract = function () {

        // var obj = {};
        // var id = -1;
        // var status = WAIT;
        // var returnData = [];
        // var actions = [];
        //
        // obj.setStatus = function (status) {
        //     status = status;
        // };
        // obj.isStatus = function (status) {
        //     return status === status;
        // };
        // obj.setAction = function (status, action) {
        //     this.add(action, status);
        // };
        // obj.getActions = function (status) {
        //     return this.filter(status);
        // };
            // eachAction: function (status, callback) {
            //     this.getActions(status).each(function(index, key, action) {
            //         callback.call(this, index, key, action);
            //     });
            // },
        //     hasActions: function (status) {
        //         return !this.filter(status).isEmpty();
        //     },
        //     setData: function(status, action) {
        //         this.returnData[status] = action;
        //     },
        //     getData: function(status) {
        //         return this.returnData[status];
        //     },
        //     finalize: function(status, data) {
        //         var self = this;
        //         this.setData(status, data);
        //         this.setStatus(status);
        //         this.eachAction(status, function(i,k,action) {
        //             action.call(self, data, self.id);
        //         });
        //     },
        //     callAction: function(status, action) {
        //         var self = this;
        //         if (this.isStatus(status)) {
        //             action.call(self, self.getData(status), self.id);
        //         } else {
        //             this.setAction(status, action);
        //         }
        //     }
        //
    };

    //
    // Promise = Object.extend(PromiseAbstract).create({
    //     constructor: function() {
    //         this.parent();
    //     },
    //     resolve: function(data) {
    //         this.finalize(DONE, data);
    //     },
    //     unresolvable: function(error) {
    //         this.finalize(FAIL, error);
    //     },
    //     onDone: function (action) {
    //         this.callAction(DONE, action);
    //         return this;
    //     },
    //     onFail: function(action) {
    //         this.callAction(FAIL, action);
    //         return this;
    //     }
    // });

    // var PromisesAbstract = Class.CollectionOf(Promise).create({
    //     constructor: function(object) {
    //         this.parent(object);
    //         this.done = null;
    //         this.fail = function() {};
    //         this.args = [];
    //         this.errors = [];
    //         this.count = 0;
    //         this.counter = 0;
    //         this.importsCounter = 0;
    //         this.status = WAIT;
    //     },
    //     setStatus: function (status) {
    //         this.status = status;
    //     },
    //     isStatus: function (status) {
    //         return this.status === status;
    //     },
    //     setData: function(status, data, id) {
    //         if (status === DONE) {
    //             this.args[id] = data;
    //         } else {
    //             this.errors.push(data);
    //         }
    //     },
    //     getData: function (status) {
    //         var args = this.errors;
    //         if (status === DONE) {
    //             args = this.args.slice(-this.importsCounter);
    //             args = args.concat(this.args.slice(0, this.importsCounter+1));
    //         }
    //         return args;
    //     },
    //     finalize: function (status, callback) {
    //         if (callback) {
    //             callback.apply(this, this.getData(status));
    //         }
    //     },
    //     setAction: function (status, action) {
    //         if (status === DONE) {
    //             this.done = action;
    //         } else {
    //             this.fail = action;
    //         }
    //     },
    //     callAction: function(status, callback) {
    //         if (this.status === status) {
    //             this.finalize(status, callback);
    //         } else {
    //             this.setAction(status, callback);
    //         }
    //     }
    //
    // });
    //
    // Promises = Object.extend(PromisesAbstract).create({
    //     constructor: function(minimum, object) {
    //         this.parent(object);
    //         this.minimum = minimum || 0;
    //     },
    //     add: function (promise, key) {
    //         this.parent(promise, key);
    //         var self = this;
    //         promise.id = this.counter++;
    //         promise.onDone(function(data, id) {
    //             self.itemOnDone(data,id);
    //         });
    //         promise.onFail(function(error) {
    //             self.itemOnFail(error);
    //         });
    //         return this;
    //     },
    //     itemOnDone: function (data, id) {
    //         this.count+=1;
    //         this.setData(DONE, data, id);
    //         if (this.count === Math.max(this.minimum, this.size())) {
    //             this.setStatus(DONE);
    //             this.finalize(DONE, this.done);
    //         }
    //     },
    //     itemOnFail: function (error) {
    //         this.setData(FAIL, error);
    //         this.setStatus(FAIL);
    //         this.finalize(FAIL, this.fail);
    //     },
    //     onDone: function (action) {
    //         this.callAction(DONE, action);
    //         return this;
    //     },
    //     onFail: function(action) {
    //         this.callAction(FAIL, action);
    //         return this;
    //     },
    //     imports: function(namespace, pack) {
    //         this.importsCounter++;
    //         this.add(pack.retrievePackage(pack.getFullName(namespace)));
    //         return this;
    //     }
    // });

})();
