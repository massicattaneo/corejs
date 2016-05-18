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

    var components = Collection();

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
                obj[listener].call(obj, event);
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

    var parseNodeComponent = function (node, obj) {
        if (node.tagName) {
            var match = node.tagName.match(/COREJS:(.*)/);
            if (match) {
                var c = components.get(match[1]);
                var comp = Component(c.template).extend(c);
                comp.createIn(node.parentNode);
                obj.items.add(comp, node.getAttribute('data-id'))
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
        parseNodeComponent(node, obj);
    };

    var Component = function (template) {
        var node = createNode(template);

        var obj = {
            items: Collection(),
            template: template
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

    Component.register = function (name, template, obj) {
        obj.template = template;
        components.add(obj, name.toUpperCase());
    };

    return Component;

}();