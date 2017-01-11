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

        obj.ref = function (attr) {
            if (proxy) {
                var commentsRef = proxy.ref(attr);
                commentsRef.on('child_added', function(data) {
                    // data.key, data.val()
                });

                commentsRef.on('child_changed', function(data) {
                    // data.key, data.val()
                });

                commentsRef.on('child_removed', function(data) {
                    // data.key, data.val()
                });
            }
            // else {
                // cjs.navigator.send('GET', '/data/' + attr)
            // }
        };

        obj.proxyTo = function (p) {
            proxy = p;
        };


        return obj
    }

});
