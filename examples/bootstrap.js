/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: bootstrap
 Created Date: 02 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('bootstrap', function (Need) {

    var S = Need('example-standard');
    var L = Need('example-list');

    return function () {
        var standard = S();
        var list = L();

        standard.createIn(document.body);
        list.createIn(document.body);

        standard.submit = function () {
            standard.isValid() && list.addItem(standard.getValue());
        };
        
    };

});