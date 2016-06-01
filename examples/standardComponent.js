/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: standardComponent
 Created Date: 01 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('standardComponent', function () {

    return function () {

        var validate = function (string, enabled) {
            if (!enabled) {
                return {isValid: true, message: "", class: "valid"}
            } else if (string === "") {
                return {isValid: false, message: ":fieldEmpty", class: "invalid"}
            } else {
                return {isValid: true, message: ":fieldValid", class: "valid"}
            }
        };

        var inputController = function () {
            var obj = {};
            var enabled = true;

            obj.check = function () {
                var check = validate(this.get('input').value, enabled);
                this.get('error')
                    .clearClass()
                    .addClass(check.class)
                    .setInnerText(check.message);
                return check.isValid;
            };
            obj.disable = function () {
                enabled = false;
                this.get('input').setAttribute('disabled', 'disabled');
                this.check();
            };
            obj.enable = function () {
                enabled = true;
                this.get('input').removeAttribute('disabled');
                this.check();
            };

            return obj;
        };

        Component.register('input', inputController(), '<div><input data-item="input" type="text" data-on="keyup:check" /><span data-item="error"></span></div>', 'span.invalid {color: red;} span{color:green;}');
        Component.register('check', {
            change: function (e) {
                e.getTarget().fire('custom', {value: e.getTarget().checked});
            },
            init: function () {
                this.get('checkbox').checked = true;
            }
        }, '<div><input type="checkbox" data-on="change:change" data-item="checkbox" /></div>');
        var c = Component('<div><corejs:check data-id="c1" data-on="custom:toggleCheckbox"></corejs:check><corejs:input class="input" id="comp1" data-id="c2" ></corejs:input><input type="submit" data-on="click:submit" /></div>',
            'div {display:inline-block} input[type=submit] {color: white; display: block; margin-top: 10px}');

        c.toggleCheckbox = function (e) {
            (e.data.value) ? c.get('c2').enable() : c.get('c2').disable();
        };

        c.init = function () {
//        c.get('c2').check();
        };

        c.createIn(document.body);
        c.submit = function () {
            if (c.get('c2').check()) {
                alert('submit');
            }
        };

    }

});