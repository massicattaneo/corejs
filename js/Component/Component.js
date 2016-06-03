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

    var injectModel = function (toJSON, node, value) {
        var v = toJSON;
        value.split('/').forEach(function (item) {v = v[item];});
        node.setInnerText(v);
    };

    var components = [],
        cssStyleIndex = 0,
        dataProxy = Collection().extend(function () {
            var obj = {};

            obj.collect = function () {
                var coll = this.clone();
                this.clear();
                coll.forEach(function (node, value) {
                    navigator.send('POST', '/data/' + value).then(function (data) {
                       injectModel(data.toJSON(), node, value);
                    });
                });
            };
            return obj;
        }());

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

    var createBindings = function (attribute, node, obj) {
        //attribute: app/name
        dataProxy.add(node, attribute);
    };

    var attach = function (node, obj, attrName) {
        if (node.getAttribute) {
            var attribute = node.getAttribute(attrName);
            if (attribute) {
                attrName === 'data-on' && createListeners(attribute, node, obj);
                attrName === 'data-item' && createItems(attribute, node, obj);
                attrName === 'data-bind' && createBindings(attribute, node, obj);
            }
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.tagName) {
            var match = node.tagName.match(/COREJS:(.*)/);
            if (match) {
                var c = Component.get(match[1]);
                var comp = Component(c.template, c.style).extend(c.controller);
                comp.createIn(node, 'before');
                for (var i = 0; i < node.attributes.length; i++) {
                    var a = node.attributes[i];
                    if (a.name !== 'class') {
                        comp.node.setAttribute(a.name, a.value);
                    }
                }
                comp.node.addClass(node.className);
                obj.items.add(comp, node.getAttribute('data-id'));
                node.parentNode.removeChild(node);
                return comp.node;
            }
        }
        return null;
    };

    var parseNode = function (node, obj) {
        var nodes = Array.prototype.slice.call(node.childNodes);
        nodes.forEach(function (n) {
            parseNode(n, obj);
        });
        node = parseNodeComponent(node, obj) || node;
        attach(node, obj, 'data-on');
        attach(node, obj, 'data-item');
        attach(node, obj, 'data-bind');
    };

    var appendStyle = function (style, cssSelector) {
        var sheet = function () {
            var style = document.createElement("style");
            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style.sheet;
        }();

        style.split('}').forEach(function (rule) {
            var m1 = rule.concat("}").match(/.*\{.*\}/);
            m1 && m1.forEach(function (r) {
                var m = r.trim().match(/(.*)\{(.*)\}/);
                m && sheet.addRule((cssSelector + ' ') + m[1], m[2]);
            });

        })

    };

    var Component = function (template, style) {
        var node = createNode(template);

        var obj = {
            items: Collection(),
            template: template,
            style: style,
            node: node
        };

        obj.createIn = function (parent, position) {
            if (!position) {
                parent.appendChild(node);
            } else {
                position === 'before' && parent.parentNode.insertBefore(node, parent);
                position === 'after' && parent.parentNode.insertBefore(node, parent.nextSibling);
            }
            node && parseNode(node, obj);
            if (style) {
                var cssSelector = 'ID' + (cssStyleIndex++).toString().padLeft(8, '0');
                node.addClass(cssSelector);
                style && appendStyle(style, '.' + cssSelector);
            }
            obj.init && obj.init();
            dataProxy.collect();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName);
        };

        return obj;
    };

    Component.register = function (name, controller, template, style) {
        controller.template = template;
        controller.style = style;
        components.push({
            name: name,
            controller: controller,
            template: template,
            style: style
        });
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name.toUpperCase() === componentName.toUpperCase();
        })[0];
    };

    return Component;

}();
