/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Element
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

Element.prototype.addClass = function () {
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
    return this;
};

Element.prototype.clearClass = function () {
    this.className = "";
    return this;
};

Element.prototype.removeClass = function () {
    for (var a = 0; a < arguments.length; a++) {
        var className = arguments[a].trim();
        if (this.className.match(className)) {
            this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
        }
    }
    return this;
};

Element.prototype.hasClass = function (className) {
    return this.className.match(className);
};

Element.prototype.toggleClass = function (className) {
    if (this.hasClass(className)) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
    return this;
};

Element.prototype.addListener = function (action, callback) {
    this._listeners = this._listeners || [];
    this._listeners.push({
        action: action,
        callback: callback
    });
    if (this.addEventListener) {
        this.addEventListener(action, callback);
    } else {
        this.attachEvent('on' + action, callback);//cover:false
    }
};

/*TO FIX  */
Element.prototype.removeListener = function (action, callback) {
    if (this.removeEventListener) {
        this.removeEventListener(action, callback);
    } else {
        this.detachEvent('on' + action, callback);
    }
};

Element.prototype.resetListeners = function () {
    if (this._listeners) {
        this._listeners.forEach(function (listener) {
            this.removeListener(listener.action, listener.callback)
        }, this);
    }
};

Event.prototype.getTarget = function () {
    var event = this || window.event;
    return event.target || event.srcElement;
};

Element.prototype.setInnerText = function (text) {
    this.textContent = text;
    this.innerText = text;
    return this;
};

Element.prototype.fire = function (action, params) {
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
