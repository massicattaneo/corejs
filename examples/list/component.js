/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('example-list', function () {

    return function () {

        var listController = function () {
            var obj = {};
            var coll = Collection();

            var replaceValue = function (value) {
                return 'Item value: {{value}}'.replace('{{value}}', value)
            };
            obj.addItem = function (array) {
                array.forEach(function (i) {
                    var c = Component.get('listItem');
                    var item = Component(c.template, c.style).extend(c.controller);
                    item.createIn(this.get('list'));
                    item.setText(replaceValue(i));
                    coll.add(item)
                }, this);
            };

            obj.modifyItem = function (index, value) {
                coll.getAt(index).setText(replaceValue(value))
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

        c.addItem = function (value) {
            c.get('list').addItem([value]);
        };

        c.createIn(document.body);

        return c;
    }

});