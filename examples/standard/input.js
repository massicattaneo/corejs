/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: input
 Created Date: 02 June 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

Need('controller-input', function () {

    var validate = function (string, enabled) {
        if (!enabled) {
            return {isValid: true, message: "", class: "valid"}
        } else if (string === "") {
            return {isValid: false, message: ":fieldEmpty", class: "invalid"}
        } else {
            return {isValid: true, message: ":fieldValid", class: "valid"}
        }
    };

    var replaceLocalization = function (message) {
        var messages = {
            ":fieldEmpty": "The field is Empty",
            ":fieldValid": "You can add it to the List!",
            "": ""
        };
        return messages[message];
    };

    return function () {
        var obj = {};
        var enabled = true;

        obj.check = function () {
            var check = validate(this.get('input').value, enabled);
            this.get('error')
                .clearClass()
                .addClass(check.class)
                .setInnerText(replaceLocalization(check.message));
            return check.isValid && enabled;
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

});