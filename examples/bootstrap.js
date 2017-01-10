/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: bootstrap
 Created Date: 02 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function bootstrap(imports) {

    var S = imports('examples/standard/main.js');
    var L = imports('examples/list/controller.js');
    var config = imports('examples/config.json');

    cjs.Component.registerStyleFunction('toPixel', function (value) {
        return value + 'px';
    });

    return function (p) {
        var standard = S(config);
        var list = L(config);

        standard.createIn(p.standard);
        list.createIn(p.list);

        // list.addItem(['Test item']);

        standard.submit = function () {
            if (standard.isValid()) {
                list.addItem(standard.getValue());
                standard.setValue('');
            }
        };

    };

}
