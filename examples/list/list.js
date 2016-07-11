function item() {

    var replaceValue = function (value) {
        return 'Item value: {{value}}'.replace('{{value}}', value)
    };

    return function () {

            var obj = {};
            var coll = Collection();

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

};
