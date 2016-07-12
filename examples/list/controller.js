/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function main(need) {
    var template = need('examples/list/template.html');

    var list = need('examples/list/list/controller.js');
    var listStyle = need('examples/list/list/style.scss');
    var listTemplate = need('examples/list/list/template.html');
    // var listConfig = need('examples/list/list/config.json');

    var listItemTemplate = need('examples/list/item/template.html');
    var item = need('examples/list/item/controller.js');

    return function () {
        
        Component.register('list', list(), listTemplate, listStyle);
        Component.register('listItem', item(), listItemTemplate);

        var c = Component(template);

        c.addItem = function (value) {
            c.get('list').addItem([value]);
        };

        return c;
    }

};
