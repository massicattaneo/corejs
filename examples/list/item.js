Need('controller-item', function () {
    
    return function () {
        var obj = {};
        obj.setText = function (text) {
            this.get('value').setInnerText(text);
        };
        return obj;
    };

});