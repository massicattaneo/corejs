/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: storage
 Created Date: 13 September 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

cjs.storage = function () {

    function createCookieStorage() {
        var obj = {};

        obj.setItem = function (name, value, exdays, path) {
            var exDate = new Date();
            exDate.setDate(exDate.getDate() + exdays);
            value = encodeURI(value) + ((exdays === null) ? "" : "; expires=" + exDate.toUTCString()) + "; path=" + path;
            document.cookie = name + "=" + value;
        };

        obj.getItem = function (name) {
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + name + "=");

            if (c_start === -1)
                c_start = c_value.indexOf(name + "=");

            if (c_start === -1) {
                c_value = null;
            }
            else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end === -1)
                    c_end = c_value.length;
                c_value = decodeURI(c_value.substring(c_start, c_end));
            }

            return c_value;
        };

        obj.removeItem = function (name, path) {
            obj.set(name, "", -1, path);
        };

        return obj;
    }

    return createCookieStorage();

}();
