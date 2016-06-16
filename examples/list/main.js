/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('example-list', function (need) {
    var list = need('controller-list');
    var item = need('controller-item');

    return function () {

        Component.register('listItem', item(), '<li data-item="value"></li>');
        Component.register('list', list(), '<ul data-item="list"></ul>', '{color:blue;}');

        var c = Component('<div><corejs:list data-id="list"></corejs:list><corejs:list data-id="list1"></corejs:list></div>');

        c.addItem = function (value) {
            c.get('list').addItem([value]);
        };

        return c;
    }

});
