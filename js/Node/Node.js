/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Element
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

(function () {
    function addClass() {
        for (var a = 0; a < arguments.length; a++) {
            var className = arguments[a].trim();
            if (this.className) {
                if (!this.className.match(className)) {
                    this.className += ' ' + className;
                }
            } else {
                this.className = className;
            }
        }
    }

    function clearClass() {
        this.className = "";
    }

    function removeClass() {
        for (var a = 0; a < arguments.length; a++) {
            var className = arguments[a].trim();
            if (this.className.match(className)) {
                this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
            }
        }
    }

    function hasClass(className) {
        return this.className.match(className) !== null;
    }

    function toggleClass(className) {
        if (hasClass.call(this, className)) {
            removeClass.call(this, className);
        } else {
            addClass.call(this, className);
        }
    }

    function addListener(action, callback) {
        this._listeners = this._listeners || [];
        this._listeners.push({
            action: action,
            callback: callback
        });
        if (this.addEventListener) {
            this.addEventListener(action, callback);
        } else {
            /* istanbul ignore next */
            this.attachEvent('on' + action, callback);
        }
    }

    /*TO FIX  */
    function removeListener(action, callback) {
        if (this.removeEventListener) {
            this.removeEventListener(action, callback);
        } else {
            /* istanbul ignore next */
            this.detachEvent('on' + action, callback);
        }
    }

    function clearListeners() {
        if (this._listeners) {
            this._listeners.forEach(function (listener) {
                removeListener.call(this, listener.action, listener.callback)
            }, this);
        }
    }

    function removeAllChildren() {
        var fc = this.firstChild;
        while (fc) {
            this.removeChild( fc );
            fc = this.firstChild;
        }
        return this;
    }

    function getTarget(selector) {
        var event = selector || window.event;
        return event.target || event.srcElement;
    }

    function setInnerText(text) {
        this.textContent = text;
        this.innerText = text;
        return this;
    }

    function fire(action, params) {
        /* istanbul ignore if */
        if (document.action) {
            var evt = document.createEventObject();
            evt.data = params;
            return this.fireEvent('on' + action, evt)
        }
        else {
            var e = document.createEvent("HTMLEvents");
            e.initEvent(action, true, true);
            e.data = params;
            return !this.dispatchEvent(e);
        }
    }

    function getValue() {
        if (this.getAttribute('type') === 'checkbox') {
            return this.checked;
        }
        return this.innerText
    }

    function create(markup) {
        var div = document.createElement('div');
        div.innerHTML = markup;
        return div.children[0];
        //var doc = document.implementation.createHTMLDocument("");
        //doc.body.innerHTML = markup;
        //return doc.body.childNodes[0];
    }

    /** toJSON */
    function getNodeValue(node) {
        var text = node.textContent || node.innerText;
        var value = isNaN(text) ? text : parseFloat(text);
        return value;
    }

    var isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };

    function parseNode(children) {
        var json = {};
        for (var n = 0; n < children.length; n++) {
            var node = children[n];
            var tagName = node.tagName.toCamelCase();

            if (json[tagName] && !(json[tagName] instanceof Array)) {
                json[tagName] = [json[tagName]];
            }

            var value = parseNode(node.children) || getNodeValue(node);

            if (json[tagName] instanceof Array) {
                json[tagName].push(value);
            } else {
                json[tagName] = value;
            }
        }
        return (isEmpty(json)) ? null : json;
    }

    function toJSON() {
        return parseNode(this.children);
    }

    function Node(element) {
        var obj = {};

        [addClass, clearClass, removeClass, hasClass, toggleClass,
            addListener, removeListener, clearListeners, setInnerText,
            fire, getValue, toJSON, removeAllChildren]
            .forEach(function (func) {
                obj[func.name] = function () {
                    return func.apply(element, arguments) || obj;
                }
            });

        obj.get = function () {
            return element;
        };

        obj.getAttribute = function(attrName) {
            if (!(element && element.getAttribute)) return null;
            return element.getAttribute(attrName)
        };

        obj.getTagName = function() {
            return element.tagName
        };

        obj.attributes = function () {
            return element.attributes;
        };

        obj.setAttribute = function (name, value) {
            return element.setAttribute(name, value);
        };

        obj.children = function() {
            if (!(element && element.childNodes)) return [];
            var nodes = Array.prototype.slice.call(element.childNodes);
            return nodes.map(function(e) {
                return Node(e)
            })
        };

        return obj;
    }

    cjs.Node = function (node) {
        if (typeof node === 'object') {
            return Node(getTarget(node));
        }
        if (node.indexOf('#') === -1) {
            return Node(create(node));
        }
        var e = document.getElementById(node.replace('#', ''));
        return Node(e);
    };

//
// if (!Event.prototype.stopPropagation) {
//     Event.prototype.stopPropagation = function () {
//         this.cancelBubble = true;
//     };
// }
// if (!Event.prototype.preventDefault) {
//     Event.prototype.preventDefault = function () {
//         this.returnValue = false;
//     };
// }
//
// Element.prototype.trigger = function (eventTypeArg) {
//     if ("createEvent" in document) {
//         var evt = document.createEvent("HTMLEvents");
//         evt.initEvent(eventTypeArg, true, true);
//         this.dispatchEvent(evt);
//     }
//     else
//         this.fireEvent("on" + eventTypeArg);
// };


})()
