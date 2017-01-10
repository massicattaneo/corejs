/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: input
 Created Date: 02 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function controllerCheck() {

    return function () {
        var obj = {};
        obj.init = function () {
            obj.get('checkbox').checked = true;
        };
        obj.change = function (e) {
            var node = cjs.Node(e);
            node.fire('custom', {value: node.getValue()});
        };
        return obj;
    }

};
