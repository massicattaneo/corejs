/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Bus
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */


var Bus = function () {

    var events = [];

    return {
        fire: function (eventName, param) {
            events.filter(function (e) {
                return e.eventName === eventName;
            }).sort(function (a, b) {
                return a.priority - b.priority;
            }).forEach(function (e) {
                e.callback(param);
            });
        },
        listen: function (eventName, callback, priority) {
            events.push({
                eventName: eventName,
                callback: callback,
                priority: priority || 1000
            })
        },
        remove: function (eventName, callback) {
            var filter = events.filter(function (e) {
                return e.eventName === eventName && e.callback === callback;
            })[0];
            events.splice(events.indexOf(filter), 1);
        }
    };

}();

