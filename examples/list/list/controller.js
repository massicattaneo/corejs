function item() {

    var replaceValue = function (value) {
        return 'Item value: {{value}}'.replace('{{value}}', value)
    };

    return function () {

        var obj = {};
        var coll = cjs.Collection();
        var lastInserted;
        function appendToDOM(item, node) {
            if (lastInserted) {
                item.createIn(lastInserted, 'before');
            } else {
                item.createIn(node);
            }
            lastInserted = item.get().get();
        }

        obj.addItem = function (array) {
            array.forEach(function (i) {
                var c = cjs.Component.get('listItem');
                var item = cjs.Object.extend({}, cjs.Component(c), c.controller);
                appendToDOM(item, this.get('list').get())
                item.get().setValue(replaceValue(i));
                coll.add(item)
            }, this);
        };

        obj.modifyItem = function (index, value) {
            coll.getAt(index).setValue(replaceValue(value))
        };

        return obj;

    };

};
