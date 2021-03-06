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

    var listItemTemplate = need('examples/list/item/template.html');
    var item = need('examples/list/item/controller.js');

    return function (config) {

        cjs.Component.register({
            name: 'list',
            controller: list,
            template: listTemplate,
            style: listStyle,
            config: config
        });

        cjs.Component.register({
            name: 'listItem',
            controller: item,
            template: listItemTemplate,
            config: config
        });

        var c = cjs.Component({template: template});

        c.addItem = function (value) {
            c.get('list').addItem([value]);
        };

        return c;
    }

};
