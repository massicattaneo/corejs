/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('listComponent', function () {

    return function () {

        var listController = function () {
            var obj = {};

            obj.addItem = function (array) {
                array.forEach(function (i) {
                    var c = Component.get('listItem');
                    var item = Component(c.template, c.style).extend(c.controller);
                    item.createIn(this.get('list'));
                    item.setText(i);
                }, this);
            };

            return obj;
        };
        var listItem = function () {
            var obj = {};
            obj.setText = function (text) {
                this.get('value').setInnerText(text);
            };
            return obj;
        };

        Component.register('listItem', listItem(), '<li data-item="value"></li>');
        Component.register('list', listController(), '<ul data-item="list"></ul>', '{color:blue;}');

        var c = Component('<div><corejs:list data-id="list"></corejs:list></div>');

        c.init = function () {
            c.get('list').addItem([0,'prova',2,3])
        };

        c.createIn(document.body);

        return c;
    }

});