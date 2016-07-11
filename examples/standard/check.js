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
        return {
            change: function (e) {
                e.getTarget().fire('custom', {value: e.getTarget().checked});
            },
            init: function () {
                this.get('checkbox').checked = true;
            }
        };
    }

};
