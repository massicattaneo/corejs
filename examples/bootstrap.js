/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: bootstrap
 Created Date: 02 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

function bootstrap(imports) {

    var S = imports('examples/standard/main');
    var L = imports('examples/list/main');
    var Sv = imports('examples/server/main');

    return function (p) {
        var standard = S();
        var list = L();
        var server = Sv();

        standard.createIn(p.standard);
        list.createIn(p.list);
        server.createIn(p.server);

        list.addItem(['Test item']);

        standard.submit = function () {
            if (standard.isValid()) {
                list.addItem(standard.getValue());
                standard.setValue('');
            }
        };

    };

}
