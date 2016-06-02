/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('example-standard', function (need) {

    var inputController = need('controller-input');
    var checkController = need('controller-check');
    
    return function () {

        Component.register('input', inputController(), '<div><input data-item="input" type="text" data-on="keyup:check" /><span data-item="error"></span></div>', 'span.invalid {color: red;} span{color:green;}');
        Component.register('check', checkController(), '<div><input type="checkbox" data-on="change:change" data-item="checkbox" /></div>');
        var c = Component('<div><corejs:check data-id="c1" data-on="custom:toggleCheckbox"></corejs:check><corejs:input class="input" id="comp1" data-id="c2" ></corejs:input><input type="submit" data-on="click:submit" /></div>',
            'div {display:inline-block} input[type=submit] {color: white; inline-block: block; margin-top: 10px}');

        c.toggleCheckbox = function (e) {
            (e.data.value) ? c.get('c2').enable() : c.get('c2').disable();
        };

        c.isValid = function () {
            return c.get('c2').check();
        };
        c.getValue = function () {
            return c.get('c2').get('input').value;
        };

        return c;

    }

});