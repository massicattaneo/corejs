/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Http
 Created Date: 18 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

(function (namespace) {
    var JSONtoXML = function (json, nodeName) {

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
                if (object[prop] instanceof Array){
                    scanArray(object[prop], prop, node);
                } else {
                    if (typeof object[prop] !== 'object') {
                        node.appendChild(createNode(prop, object[prop]));
                    } else {
                        node.appendChild(scanNodes(object[prop], prop));
                    }
                }

            }
            return node;
        }

        return scanNodes(json, nodeName);
    };

    namespace.toXML = JSONtoXML;

})(JSON);
