function item() {

    return function () {
        var obj = {};
        obj.setText = function (text) {
            this.get('value').setText(text);
        };
        return obj;
    };

}
