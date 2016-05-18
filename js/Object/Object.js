
/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: ObjectSpec
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

// Object.extend = function () {
//     var ret = {};
//     for (var i = 0, j = arguments.length; i < j; i++){
//         var obj = arguments[i];
//         Object.keys(obj).forEach(function (key) {
//             ret[key] = obj[key];
//         });
//     }
//     return ret;
// };

Object.prototype.extend = function () {
    var self = this;
    for (var i = 0, j = arguments.length; i < j; i++){
        var obj = arguments[i];
        Object.keys(obj).forEach(function (key) {
            self[key] = obj[key];
        });
    }
    return this;
};

Object.prototype.clone = function () {
    return Object.extend(this);
};