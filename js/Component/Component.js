/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Component
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

cjs.Component = function () {

    var stylesFunctions = {};

    var styles = [];

    var injectModel = function (toJSON, node, value) {
        var v = toJSON;
        value.split('/').forEach(function (item) {
            v = v[item];
        });
        node.setValue(v);
    };

    cjs.bus.addBus('bindings');

    var components = [],
        cssStyleIndex = 0,
        dataProxy = (function () {
            var obj = {};
            var collection = [];

            obj.add = function (item, attribute) {
                collection.push({item: item, attribute: attribute});
            };

            obj.collect = function () {
                collection.forEach(function (o) {
                    cjs.navigator.send('GET', '/data/' + o.attribute).then(function (data) {
                        injectModel(data.toJSON(), o.item, o.attribute);
                    });
                });
            };

            obj.save = function (item) {
                var elem = obj.get(item);
                return cjs.navigator.send('POST', '/data/' + elem.attribute);
            };

            obj.get = function (item) {
                var elem = collection.filter(function (o) {
                    return o.item.get() === item.get();
                });
                return elem ? elem[0] : null;
            };

            return obj;
        }());

    var createListeners = function (attribute, node, obj) {
        var split = attribute.trim().split(':');
        var actions = split[0].split(',');
        var listener = split[1];
        actions.forEach(function (action) {
            node.addListener(action, function (event) {
                obj[listener].call(obj, event);
            });
        })
    };

    var createItems = function (attribute, node, obj) {
        obj.items.add(node, attribute);
    };

    var createServerBindings = function (attribute, node) {
        //attribute: app/name
        dataProxy.add(node, attribute);
    };

    var createBindings = function (attribute, node) {
        cjs.bus.bindings.on(attribute, function (value) {
            node.setValue(value)
        })
    };

    var attach = function (node, obj, attrName) {
        var attribute = node.getAttribute(attrName);
        if (attribute) {
            attrName === 'data-on' && createListeners(attribute, node, obj);
            attrName === 'data-item' && createItems(attribute, node, obj);
            attrName === 'data-bind' && createBindings(attribute, node, obj);
            attrName === 'data-server' && createServerBindings(attribute, node, obj);
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.getTagName()) {
            var match = node.getTagName().match(/CJS:(.*)/);
            if (match) {
                var c = Component.get(match[1].toCamelCase());
                var comp = cjs.Object.extend(Component({
                    template: (node.get().innerHTML) ? parseTemplate(c.template, node.toJSON()) : c.template,
                    style: (node.get().innerHTML) ? parseStyle(c.style, node.toJSON()) : c.style,
                    config: c.config
                }), c.controller);
                comp.createIn(node.get(), 'before');
                for (var i = 0; i < node.attributes().length; i++) {
                    var a = node.attributes()[i];
                    if (a.name !== 'class') {
                        comp.node.setAttribute(a.name, a.value);
                    }
                }
                comp.node.addStyle(node.get().className);
                obj.items.add(comp, node.getAttribute('data-id'));
                node.get().parentNode.removeChild(node.get());
                return comp.node;
            }
        }
        return null;
    };

    var parseNode = function (node, obj) {
        node.children().forEach(function (n) {
            parseNode(n, obj);
        });
        node = parseNodeComponent(node, obj) || node;
        attach(node, obj, 'data-on');
        attach(node, obj, 'data-item');
        attach(node, obj, 'data-bind');
        attach(node, obj, 'data-server');
    };

    var appendStyle = function (style) {
        style = style.replace(/\n/g, '');
        var existingStyle = styles.filter(function (s) {
            return s.style === style;
        });

        if (existingStyle.length > 0) {
            var className = existingStyle[0].className;
        } else {
            var className = 'CJS' + (cssStyleIndex++);
            var cssSelector = '.' + className;
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
                    var selector;
                    if (m[1].match('.&')) {
                        selector = m[1].replace(/\.&/g, cssSelector)
                    } else {
                        selector = (cssSelector + ' ') + m[1];
                    }
                    m && addCSSRule(sheet, selector, m[2], 0);
                });

            });

            styles.push({className: className, style: style});
        }

        function addCSSRule(sheet, selector, rules, index) {
            if("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else if("addRule" in sheet) {
                sheet.addRule(selector, rules, index);
            }
        }

        return className;

    };

    var parseStyle = function (style, config) {
        var match = style.match(/\$\w*/g);
        if (match) {
            match.forEach(function (string) {
                string = string.replace('$', '');
                style = style.replace(new RegExp('\\$' + string, 'g'), config[string] || '');
            })
        }
        Object.keys(stylesFunctions).forEach(function (fname) {
            match = style.match(new RegExp(fname + '\\((.*)\\)')) || [];
            if (match[1]) {
                style = style.replace(match[0], stylesFunctions[fname](match[1]));
            }
        });

        return style;
    };

    var parseTemplate = function (template, config) {
        var match = template.match(/\{\{\w*\}\}/g);
        while (match) {
            match.forEach(function (string) {
                string = string.replace('{{', '').replace('}}', '');
                template = template.replace(new RegExp('\\{\\{' + string + '\\}\\}', 'g'), config[string] || '');
            });
            match = template.match(/\{\{\w*\}\}/g);
        }
        return template;
    };

    var Component = function (p) {

        var config = p.config || {};
        var style = parseStyle(p.style || '', config);
        var template = parseTemplate(p.template || '', config);

        var node = cjs.Node(template);

        var obj = {
            items: cjs.Collection(),
            template: template,
            style: style,
            config: config,
            node: node
        };

        obj.createIn = function (parent, position) {
            if (!position) {
                parent.appendChild(node.get(0));
            } else {
                position === 'before' && parent.parentNode.insertBefore(node.get(), parent);
                position === 'after' && parent.parentNode.insertBefore(node.get(), parent.nextSibling);
            }
            if (style) {
                node.addStyle(appendStyle(style));
            }
            node && parseNode(node, obj);
            obj.init && obj.init();
            dataProxy.collect();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName);
        };

        obj.save = function () {
            var needs = [];

            (function saveNode(n) {
                if (dataProxy.get(n)) {
                    needs.push(dataProxy.save(n))
                }
                n.children().forEach(saveNode);
            })(node);

            return cjs.Need(needs);
        };

        return obj;
    };

    Component.register = function (p) {
        p.controller = p.controller || {};
        components.push(p);
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name === componentName;
        })[0];
    };

    Component.registerStyleFunction = function (name, func) {
        stylesFunctions[name] = func;
    };

    return Component;

}();
