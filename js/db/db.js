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
            //db.ref(path).remove();
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
            const ret = {
                orderByChild: function () {return ret;},
                startAt: function () {return ret;},
                endAt: function () {return ret;},
                equalTo: function () {return ret;},
                on: function (action, callback) {
                    if (action === 'child_added') {
                        Object.keys(privateData[ref]).forEach(function (key) {
                            callback({ key: key, val: function() { return privateData[ref][key] }
                            })
                        });
                    }
                }
            };
            return ret;
        };

        obj.init = function () {
        };

        return obj
    }

})();
