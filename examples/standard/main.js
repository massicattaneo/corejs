/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function exampleStandard(need) {

    var inputController = need('examples/standard/input.js');
    var checkController = need('examples/standard/check.js');

    return function (config) {

        Component.register({
            name: 'input',
            controller: inputController(),
            template: '<div><input data-item="input" type="text" data-on="keyup:check" /><span data-item="error"></span></div>',
            style: 'input {width: toPixel($inputWidth)} span.invalid {color: $warningColor;} span{color:green;}',
            config: config
        });
        Component.register({
            name: 'check',
            controller: checkController(),
            template: '<div><input type="checkbox" data-on="change:change" data-item="checkbox" /></div>'
        });

        var c = Component({
            template: '<div><corejs:check data-id="c1" data-on="custom:toggleCheckbox"></corejs:check><input type="submit" value="{{submitButtonText}}" data-on="click:submit" /><corejs:input class="input" id="comp1" data-id="c2" ></corejs:input></div>',
            style: 'div {display:inline-block} input[type=submit] {color: gray; inline-block: block; margin-right: 10px}',
            config: config
        });

        c.toggleCheckbox = function (e) {
            (e.data.value) ? c.get('c2').enable() : c.get('c2').disable();
        };

        c.isValid = function () {
            return c.get('c2').check();
        };
        c.getValue = function () {
            return c.get('c2').get('input').value;
        };
        c.setValue = function (value) {
            c.get('c2').get('input').value = value;
        };

        return c;

    }

};
