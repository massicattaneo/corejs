/**
 * Created by max on 31/01/17.
 */

(function() {

    cjs.Currency = cjs.create({
        constructor: function (a) {
            this._original = a!== undefined ? a : 0;
        },
        format: function (pattern) {
            var integer = parseInt(this._original, 10);
            var float = this._original.toString().split('.')[1] ||[];
            pattern = pattern.replace(/i/g, integer);
            var count = -1;
            pattern = pattern.split('').map(function (char) {
                if (char === 'f') count++;
                return (char === 'f') ? float[count] || 0 : char;
            }).join('');
            pattern = pattern.replace(/s/g, '€');
            return pattern;
        }
    });

})();
