/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Array
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

(function () {
    cjs.Array = {};
    cjs.Array.clone = function (array) {
        return array.slice(0);
    };
    cjs.Array.createWithIndexes = function(lastIndex, firstIndex) {
        var array = [];
        firstIndex = firstIndex || 0;
        for (var i = 0; i <= lastIndex - firstIndex; i++) {
            array[i] = i + firstIndex;
        }
        return array;
    };
})();
