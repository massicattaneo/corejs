/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: db.js
 Created Date: 11 January 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */
(function () {

    cjs.Db = function () {
        return {
            onChange: function () {}
        }
    };

    cjs.Db.firebaseAdapter = function (db) {
        var obj = {};

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

        obj.off = function (path) {
            db.ref(path).off();
        };

        return obj
    }

})();
