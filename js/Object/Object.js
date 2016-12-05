/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: ObjectSpec
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */
var corejs = corejs || {};
(function (corejs) {

    corejs.extend = function () {
        var self = arguments[0];
        for (var i = 0, j = arguments.length; i < j; i++) {
            var obj = arguments[i];
            Object.keys(obj).forEach(function (key) {
                self[key] = obj[key];
            });
        }
        return self;
    };

    corejs.clone = function (obj) {
        return corejs.extend({}, obj);
    };

    corejs.removeAllChild = function (element) {
        var fc = element.firstChild;

        while ( fc ) {
            element.removeChild( fc );
            fc = element.firstChild;
        }
        return this;
    };


    corejs.toXML = function (o) {

        function createNode(name, value) {
            var child = document.createElement(name);
            child.innerText = value;
            return child;
        }

        function scanArray(array, nodeName, node) {
            for (var prop = 0; prop < array.length; prop++) {
                if (typeof array[prop] !== 'object') {
                    node.appendChild(createNode(nodeName, array[prop]));
                } else {
                    node.appendChild(scanNodes(array[prop], nodeName));
                }
            }
        }

        function scanNodes(object, nodeName) {
            var node = document.createElement(nodeName);
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    if (object[prop] instanceof Array) {
                        scanArray(object[prop], prop, node);
                    } else {
                        if (typeof object[prop] !== 'object') {
                            node.appendChild(createNode(prop, object[prop]));
                        } else {
                            node.appendChild(scanNodes(object[prop], prop));
                        }
                    }
                }
            }
            return node;
        }

        return scanNodes(o, 'Model');
    };

})(corejs);
