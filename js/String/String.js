
 /*/
///////////////////////////////////////////////////////////////////////////
 Module: String
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

 String.prototype.padLeft = function (size, char) {
     if (size === 0) {
         return '';
     }
     return (Array(size + 1).join(char) + this).slice(-size);
 };

 String.prototype.padRight = function (size, char) {
     if (size === 0) {
         return '';
     }
     return (this + Array(size + 1).join(char)).slice(0, size);
 };