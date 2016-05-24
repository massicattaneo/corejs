/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Array
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Array.prototype.fillWithIndexes = function(lastIndex, firstIndex) {
    firstIndex = firstIndex || 0;
    for (var i = 0; i <= lastIndex - firstIndex; i++) {
        this[i] = i + firstIndex;
    }
    return this;
};

Array.prototype.clone = function() {
    return this.slice(0);
};