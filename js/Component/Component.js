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
    var parsingFunctions = {};
    var styles = [];

    var dataBase = cjs.Db();

    cjs.bus.addBus('bindings');

    function dataParser(data, node) {
        var attribute = node.getAttribute('data-parser');
        if (attribute && parsingFunctions[attribute]) {
            parsingFunctions[attribute](data, node)
        } else if (!attribute && parsingFunctions[attribute]) {
            console.error('missing parsing function')
        }
    }

    var components = [],
        cssStyleIndex = 0,
        dataProxy = (function () {
            var obj = {};
            var collection = [];

            obj.add = function (item, attribute) {
                collection.push({item: item, attribute: attribute});
            };

            obj.collect = function () {
                var need = cjs.Need([]);
                collection.forEach(function (o) {
                    if (!o.item.__isCollect) {
                        o.item.__isCollect = true;
                        var n = cjs.Need();
                        need.add(n);
                        dataBase.onChange(o.attribute, function (data) {
                            o.item.setValue(data);
                            dataParser(data, o.item);
                            n.resolve();
                        });
                    }
                });
                if (need.size() === 0) {
                    need.add(cjs.Need().resolve())
                }
                return need;
            };

            obj.forEach = function (callback) {
                collection.forEach(callback);
            };

            obj.off = function (path) {
                dataBase.off(path);
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
        attribute.trim().split('||').forEach(function (attribute) {
            var split = attribute.trim().split(':');
            var actions = split[0].split(',');
            var listener = split[1];
            actions.forEach(function (action) {
                node.addListener(action, function (event) {
                    obj[listener].call(obj, event);
                });
            })
        });
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

    var reservedAttributes = ['data-on', 'data-item', 'data-bind', 'data-server'];

    var attach = function (node, obj, attrName) {
        var attribute = node.getAttribute(attrName);
        if (attribute && reservedAttributes.indexOf(attrName) !== -1) {
            attrName === 'data-on' && createListeners(attribute, node, obj);
            attrName === 'data-item' && createItems(attribute, node, obj);
            attrName === 'data-bind' && createBindings(attribute, node, obj);
            attrName === 'data-server' && createServerBindings(attribute, node, obj);
            node.setAttribute(attrName);
        }
    };

    var parseNodeComponent = function (node, obj) {
        if (node.getTagName()) {
            var match = node.getTagName().match(/CJS:(.*)/);
            if (match) {
                var c = Component.get(match[1].toCamelCase());
                var config = node.toJSON();
                var configExt = cjs.Object.extend({}, config, c.config);
                var comp = Component({
                    template: (node.get().innerHTML) ? parseTemplate(c.template, cjs.Object.extend({}, config, c.config)) : c.template,
                    style: (node.get().innerHTML) ? parseStyle(c.style, configExt) : c.style,
                    config: c.config
                }, c.controller(configExt));
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
        reservedAttributes.forEach(function (attrName) {
            attach(node, obj, attrName);
        });
    };

    var appendStyle = function (style) {
        var ruleIndex = 0;
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
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
                return style.sheet;
            }();

            var split = style.split('}');
            split.splice(split.length-1, 1);
            split=split.map(function(a) {
                return a+'}';
            });
            var i = 0;
            while (i!==split.length) {
                if (split[i].indexOf('@keyframes') !== -1) {
                    split[i] += split.splice(i+1,1)[0];
                    if (split[i+1] === '}') {
                        split[i] += split.splice(i+1,1)[0];
                        i++;
                    }
                } else {
                    i++
                }
            }
            split.forEach(function (rule) {
                var m1 = rule.match(/.*\{.*\}/);
                m1 && m1.forEach(function (r) {
                    var m = r.trim().match(/(.*)\{(.*)\}/);
                    var selector;
                    if (m[1].match(/\.&/)) {
                        selector = m[1].replace(/\.&/g, cssSelector)
                    } else if (m[1].match('@keyframes')){
                        selector = m[1].replace(/-&/g, cssSelector.replace('.', '-'))
                    }
                    m && addCSSRule(sheet, selector, m[2], ruleIndex++);
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
                while (match[1]) {
                    style = style.replace(match[0], stylesFunctions[fname](match[1]));
                    match = style.match(new RegExp(fname + '\\((.*)\\)')) || [];
                }
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

    var extensions = {};
    var Component = function (p, obj) {

        var config = p.config || {};
        var style = parseStyle(p.style || '', config);
        var template = parseTemplate(p.template || '', config);
        var className = '';
        var node = cjs.Node(template);

        obj = obj || {};
        obj.items = cjs.Collection();
        obj.template = template;
        obj.style = style;
        obj.config = config;
        obj.node = node;

        function getParent(parent) {
            if (parent instanceof HTMLElement) return parent;
            if (typeof parent === 'string') return cjs.Node(parent).get();
            return parent.get();
        }

        obj.createIn = function (parent, position) {
            parent = getParent(parent);
            if (!position) {
                parent.appendChild(node.get(0));
            } else {
                position === 'before' && parent.parentNode.insertBefore(node.get(), parent);
                position === 'after' && parent.parentNode.insertBefore(node.get(), parent.nextSibling);
            }
            if (style) {
                className = appendStyle(style);
                node.addStyle(className);
            }
            node && parseNode(node, obj);
            obj.init && obj.init();
        };

        obj.get = function (itemName) {
            return obj.items.get(itemName) || obj.node;
        };

        obj.getClassName = function () {
            return className;
        };

        obj.runAnimation = function (name, params) {
            return obj.get(params.item).runAnimation(name + '-' + className, params);
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

        obj.toJSON = function () {
            var a = {};
            obj.items.each(function (index, key, node) {
                a[key] = node.getValue();
            });
            return a;
        };

        obj.remove = function () {
            obj.node.clearListeners();
            obj.items.each(function (index, key, item) {
                var i = item.get() instanceof HTMLElement ? item : item.get();
                i.clearListeners();
            });
            dataProxy.forEach(function (o, index) {
                if (obj.get() === o.item) {
                    dataProxy.off(o.attribute);
                }
                if (obj.items.indexOf(o.item)) {
                    dataProxy.off(o.attribute);
                }
            });

            var parent = obj.node.get().parentNode;
            parent.removeChild(obj.node.get());
        };

        cjs.Object.extend(obj, extensions);

        return obj;
    };

    Component.extend = function (o) {
        cjs.Object.extend(extensions, o);
    };

    Component.register = function (p) {
        p.controller = p.controller || function () {return {}};
        components.push(p);
    };

    Component.injectDatabaseProxy = function (db) {
        dataBase = db;
    };

    Component.collectData = function () {
        return dataProxy.collect();
    };

    Component.get = function (componentName) {
        return components.filter(function (c) {
            return c.name === componentName;
        })[0];
    };

    Component.create = function (componentName, proto) {
        var rc = cjs.Component.get(componentName);
        var config = cjs.Object.extend(proto.config || {}, rc.config);
        var o = (proto.controller) ? proto.controller(config) : rc.controller(config);
        return cjs.Component({
            config: config,
            template: rc.template,
            style: rc.style
        }, o);
    };

    Component.registerStyleFunction = function (name, func) {
        stylesFunctions[name] = func;
    };

    Component.registerParserFunction = function (name, func) {
        parsingFunctions[name] = func;
    };

    Component.parse = function (name, data, item) {
        return parsingFunctions[name](data, item);
    };

    return Component;

}();
