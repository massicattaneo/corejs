/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Bus
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */


(function () {

    function createBus() {
        var events = [];
        var obj = {};

        obj.on = function (eventName, callback, priority) {
            events.push({
                eventName: eventName,
                callback: callback,
                priority: priority || 1000
            })
        };

        obj.off = function (eventName, callback) {
            var filter = events.filter(function (e) {
                return e.eventName === eventName && e.callback === callback;
            })[0];
            events.splice(events.indexOf(filter), 1);
        };

        obj.once = function (eventName, callback, priority) {
            events.push({
                eventName: eventName,
                callback: function () {
                    callback.apply(null, arguments);
                    obj.off(eventName, callback);
                },
                priority: priority || 1000
            })
        };

        obj.need = function (eventName) {
            var p = cjs.Need();
            obj.once(eventName, function (o) {
                p.resolve(o)
            });
            return p;
        };

        obj.fire = function (eventName, param) {
            events.filter(function (e) {
                return e.eventName === eventName;
            }).sort(function (a, b) {
                return a.priority - b.priority;
            }).forEach(function (e) {
                e.callback(param);
            });
        };

        obj.clear = function () {
            events.length = 0;
        };

        return obj;
    }

    cjs.bus = {};

    cjs.bus.addBus = function (name) {
        cjs.bus[name] = createBus();
    };
    cjs.bus.removeBus = function (name) {
        cjs.bus[name].clear();
        delete cjs.bus[name];
    };

})();

