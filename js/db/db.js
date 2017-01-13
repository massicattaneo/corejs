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
        var obj = {};
        var proxy;

        obj.on = function (attr, callback) {
            // var commentsRef = proxy.ref(attr);
            // commentsRef.on('child_added', function(data) {
            // });
            //
            // commentsRef.on('child_changed', function(data) {
            // });
            //
            // commentsRef.on('child_removed', function(data) {
            // });
            // return cjs.Need().resolve(commentsRef)
            proxy.ref(attr).on('value', function (data) {
                callback(data.val())
            });
        };

        obj.proxyTo = function (p) {
            proxy = p;
        };


        return obj
    }

})();
