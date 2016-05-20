/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Http
 Created Date: 18 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

(function (obj) {

    obj.send = function (method, url, options) {
        options = options || {};
        var promise = Need();
        var request = getHttpObject();
        request.open(method, url, 1);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        options.overrideMimeType && request.overrideMimeType(options.overrideMimeType);
        request.onreadystatechange = function () {
            if (request.status === 200 && request.readyState === 4) {
                promise.resolve(Response(request));
            }
            else if (request.status !== 200 && request.readyState === 4) {
                promise.fail(request);
            }
        };
        request.send();
        return promise;
    };

    obj.get = function(url, options) {
        return obj.send('GET', url, options || {});
    };
    obj.post = function(url, options) {
        return obj.send('POST', url, options || {});
    };
    obj.put = function(url, options) {
        return obj.send('PUT', url, options || {});
    };
    obj.delete = function(url, options) {
        return obj.send('DELETE', url, options || {});
    };

    var Response = function () {
        var abstract = {
            toJSON: function () {
                return JSON.parse(this.response.responseText);
            },
            getResponseText: function () {
                return this.response.responseText;
            }
        };

        return function (response) {
            return {response: response}.extend(abstract);
        }
    }();

    var getHttpObject = function () {
        if (window.ActiveXObject) {
            return new ActiveXObject('MSXML2.XMLHTTP.3.0'); //coverage:exclude
        } else {
            return new XMLHttpRequest();
        }
    };
    
})(navigator);
