/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Component
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

var Component = function () {

    var components = [];

    var createNode = function (template) {
        var n = document.createElement('div');
        n.innerHTML = template;
        return n.firstChild;
    };

    var Component = function (template) {
        var node = createNode(template);
        var nameMatch = template.match(/data-name="(.*)"/);

        var obj = {
            name: nameMatch ? nameMatch[1] : ''
        };

        return obj;
    };

    return Component;

}();