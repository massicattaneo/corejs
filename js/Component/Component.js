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

    var createNode = function (markup) {
        var doc = document.implementation.createHTMLDocument("");
        doc.body.innerHTML = markup;
        return doc.body.childNodes[0];
    };

    function createListeners(attribute, node, obj) {
        var split = attribute.trim().split(':');
        var actions = split[0].split(',');
        var listener = split[1];
        actions.forEach(function (action) {
            node.addListener(action, function (event) {
                obj[listener](event);
            });
        })
    }

    var createItems = function (attribute, node, obj) {
        obj.items.add(node, attribute);
    };

    var attach = function (node, obj, attrName) {
        if (node.getAttribute) {
            var attribute = node.getAttribute(attrName);
            if (attribute) {
                attrName === 'data-on' && createListeners(attribute, node, obj);
                attrName === 'data-item' && createItems(attribute, node, obj);
            }
        }
    };

    var parseNode = function (node, obj) {
        attach(node, obj, 'data-on');
        attach(node, obj, 'data-item');
        var nodes = Array.prototype.slice.call(node.childNodes);
        nodes.forEach(function (n) {
            parseNode(n, obj);
        });
    };

    var Component = function (template) {
        var node = createNode(template);

        var obj = {
            items: Collection()
        };

        obj.createIn = function (parent) {
            parent.appendChild(node);
            node && parseNode(node, obj);
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName);
        };

        return obj;
    };

    return Component;

}();