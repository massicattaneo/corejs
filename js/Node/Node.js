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

    function addCss(o) {
        var e = this;
        Object.keys(o).forEach(function (k) {
            e.style[k] = o[k];
        })
    }

    function addStyle() {
        if (typeof arguments[0] === 'object') {
            addCss.apply(this, arguments);
        } else {
            addClass.apply(this, arguments);
        }
    }

    function clearStyles() {
        this.className = "";
    }

    function removeStyle() {
        for (var a = 0; a < arguments.length; a++) {
            var className = arguments[a].trim();
            if (this.className.match(className)) {
                this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
            }
        }
    }

    function hasStyle(className) {
        return this.className.match(className) !== null;
    }

    function toggleStyle(className) {
        if (hasStyle.call(this, className)) {
            removeStyle.call(this, className);
        } else {
            addStyle.call(this, className);
        }
    }

    var specialEvents = {};
    (function (evs) {

        var agent = navigator.userAgent.toLowerCase(),
            isChromeDesktop = (agent.indexOf('chrome') > -1 && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('mobile') < 0 && agent.indexOf('android') < 0),
            settings = {
                tap_pixel_range: 5,
                swipe_h_threshold: 50,
                swipe_v_threshold: 50,
                taphold_threshold: 750,
                touch_capable: ('ontouchstart' in window && !isChromeDesktop),
                tapevent:    ('ontouchstart' in window && !isChromeDesktop) ? 'tap' : 'click',
                startevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchstart' : 'mousedown'),
                endevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchend' : 'mouseup'),
                moveevent: (('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'mousemove'),
                scrollevent: ('ontouchstart' in window && !isChromeDesktop) ? 'touchmove' : 'scroll',
                hold_timer: null
            };

        evs.tapstart = function(callback) {
            var self = this;
            addListener.call(this, settings.startevent, function tapStartFunc(e) {

                if (e.which && e.which !== 1) {
                    return false;
                }

                var origEvent = e.originalEvent,
                    touchData = {
                        'position': {
                            'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        // 'offset': {
                        //     'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                        //     'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        // },
                        'time': Date.now(),
                        'target': e.target
                    };
                triggerCustomEvent(self, 'tapstart', callback, e, touchData);
                return true;
            })
        };

        evs.tap = function (callback) {
            var self = this,
                started = false,
                origTarget = null,
                start_time,
                start_pos = {
                    x: 0,
                    y: 0
                },
                touches;
            addListener.call(this, settings.startevent, function (e) {
                if (e.which && e.which !== 1) {
                    return false;
                }
                started = true;
                start_pos.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                start_pos.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
                start_time = Date.now();
                origTarget = e.target;
                touches = (e.targetTouches) ? e.targetTouches : [e];
                return true;
            });
            addListener.call(this, settings.endevent, function (e) {
                // Only trigger if they've started, and the target matches:
                var end_x = (e.targetTouches) ? e.changedTouches[0].pageX : e.pageX,
                    end_y = (e.targetTouches) ? e.changedTouches[0].pageY : e.pageY,
                    diff_x = (start_pos.x - end_x),
                    diff_y = (start_pos.y - end_y);

                if (origTarget == e.target && started && ((Date.now() - start_time) < settings.taphold_threshold) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                    var touchData = [];

                    for (var i = 0; i < touches.length; i++) {
                        var touch = {
                            'position': {
                                'x': (settings.touch_capable) ? e.changedTouches[i].screenX : e.screenX,
                                'y': (settings.touch_capable) ? e.changedTouches[i].screenY : e.screenY
                            },
                            // 'offset': {
                            //     'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            //     'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            // },
                            'time': Date.now(),
                            'target': e.target
                        };

                        touchData.push(touch);
                    }
                    triggerCustomEvent(self, 'tap', callback, e, touchData);
                }
            });

        };
        evs.tapmove = function (callback) {
            var self = this;
            addListener.call(this, settings.moveevent, function tapMoveFunc(e) {
                var touchData = {
                    'position': {
                        'x': ((settings.touch_capable) ? e.touches[0].screenX : e.screenX),
                        'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                    },
                    // 'offset': {
                    //     'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                    //     'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                    // },
                    'time': Date.now(),
                    'target': e.target
                };

                triggerCustomEvent(self, 'tapmove', callback, e, touchData);
                return true;
            });
        };

        evs.tapend = function (callback) {
            var self = this;
            addListener.call(this, settings.endevent, function (e) {
                var touchData = {
                    'position': {
                        'x': (settings.touch_capable) ? e.changedTouches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? e.changedTouches[0].screenY : e.screenY
                    },
                    // 'offset': {
                    //     'x': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                    //     'y': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                    // },
                    'time': Date.now(),
                    'target': e.target
                };
                triggerCustomEvent(self, 'tapend', callback, e, touchData);
                return true;
            });
        };
        evs.taphold = function (callback) {
            var self = this,
                $this = ret(self),
                origTarget,
                start_pos = {
                    x: 0,
                    y: 0
                },
                end_x = 0,
                end_y = 0;

            addListener.call(this, settings.startevent, function tapHoldFunc1(e) {
                if (e.which && e.which !== 1) {return false;}

                origTarget = e.target;
                var start_time = Date.now(),
                    startPosition = {
                        'x': (settings.touch_capable) ? e.touches[0].screenX : e.screenX,
                        'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                    },
                    startOffset = {
                        'x': (settings.touch_capable) ? e.touches[0].pageX - e.touches[0].target.offsetLeft : e.offsetX,
                        'y': (settings.touch_capable) ? e.touches[0].pageY - e.touches[0].target.offsetTop : e.offsetY
                    };

                start_pos.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                start_pos.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;

                end_x = start_pos.x;
                end_y = start_pos.y;

                settings.hold_timer = window.setTimeout(function() {

                    var diff_x = (start_pos.x - end_x),
                        diff_y = (start_pos.y - end_y);

                    if (e.target == origTarget && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                        var end_time = Date.now(),
                            endPosition = {
                                'x': (settings.touch_capable) ? e.touches[0].screenX : e.screenX,
                                'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
                            };
                        // endOffset = {
                        //     'x': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                        //     'y': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        // };
                        var duration = end_time - start_time;

                        // Build the touch data:
                        var touchData = {
                            'startTime': start_time,
                            'endTime': end_time,
                            'startPosition': startPosition,
                            'startOffset': startOffset,
                            'endPosition': endPosition,
                            // 'endOffset': endOffset,
                            'duration': duration,
                            'target': e.target
                        };
                        triggerCustomEvent(self, 'taphold', callback, e, touchData);
                    }
                }, settings.taphold_threshold);

                return true;
            });
            addListener.call(this, settings.endevent, function tapHoldFunc2() {
                $this.data('callee2', tapHoldFunc2);
                $this.data('tapheld', false);
                window.clearTimeout(settings.hold_timer);
            });
            addListener.call(this, settings.moveevent, function tapHoldFunc3(e) {
                $this.data('callee3', tapHoldFunc3);

                end_x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                end_y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
            });
        };
        function triggerCustomEvent(obj, eventType, callback, event, touchData) {
            var originalType = event.type;
            event.type = eventType;
            callback.call(obj, event, touchData);
            event.type = originalType;
        }

    })(specialEvents);

    function addListener(action, callback) {
        if (['tapstart', 'tap', 'tapmove', 'tapend', 'taphold'].indexOf(action) !== -1) {
            specialEvents[action].call(this, callback);
        } else{
            this._listeners = this._listeners || [];
            this._listeners.push({
                action: action,
                callback: callback
            });
            if (this.addEventListener) {
                this.addEventListener(action, callback);
            } else {
                this.attachEvent('on' + action, callback);
            }
        }
    }

    /* TO FIX */
    function removeListener(action, callback) {
        /** TODO */
        // if (['tapstart'].indexOf(action) !== -1) {
        //     removeListener(settings.startevent, callback);
        // } else if (['tapmove'].indexOf(action) !== -1) {
        //     removeListener(settings.moveevent, callback);
        // } else if (['tapend'].indexOf(action) !== -1) {
        //     removeListener(settings.endevent, callback);
        // } else if (['tap'].indexOf(action) !== -1) {
        //     removeListener(settings.startevent, callback);
        //     removeListener(settings.endevent, callback);
        // } else {
        if (this.removeEventListener) {
            this.removeEventListener(action, callback);
        } else {
            this.detachEvent('on' + action, callback);
        }
        // }
    }

    function addOnceListener(action, callback) {
        var self = this;
        var once = function () {
            callback();
            removeListener.call(self, action, once)
        };
        addListener.call(self, action, once);
    }

    function clearListeners() {
        if (this._listeners) {
            this._listeners.forEach(function (listener) {
                removeListener.call(this, listener.action, listener.callback)
            }, this);
            this._listeners.length = 0;
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

    function setValue(value) {
        if (this.getAttribute('type') === 'checkbox') {
            this.checked = value;
        } else if (['text', 'email', 'tel', ].indexOf(this.getAttribute('type')) !== -1) {
            this.value = value;
        } else {
            this.textContent = value;
            this.innerText = value;
        }
        return this;
    }

    function getValue() {
        if (this.getAttribute('type') === 'checkbox') {
            return this.checked;
        } else if(this.value !== undefined) {
            return this.value;
        }
        return this.innerText
    }

    function getAttribute(attrName) {
        var element = this;
        if (!(element && element.getAttribute)) return null;
        return element.getAttribute(attrName)
    }

    function setAttribute(name, value) {
        var element = this;
        if (value === undefined) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value);
        }
    }

    function runAnimation(name, time) {
        var onEnds = 'animationend animationend webkitAnimationEnd oanimationend MSAnimationEnd'.split(' ');
        var n = cjs.Need();
        var self = this;
        var callback = function () {
            self.style.animation = '';
            n.resolve()
        };
        onEnds.forEach(function (action) {
            addListener.call(this, action, callback)
        });
        n.done(function () {
            onEnds.forEach(function (action) {
                removeListener.call(this, action, callback)
            });
        });
        this.style.animation = name + ' ' + time + 'ms';
        return n;
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

    var extensions = {};
    function Node(element) {
        var obj = {};

        [addStyle, clearStyles, removeStyle, hasStyle, toggleStyle,
            addListener, addOnceListener, removeListener, clearListeners,
            setValue, getValue,
            getAttribute, setAttribute,
            runAnimation,
            fire,
            toJSON,
            removeAllChildren]
            .forEach(function (func) {
                obj[func.name] = function () {
                    var apply = func.apply(element, arguments);
                    return apply === undefined ? obj : apply;
                }
            });

        obj.get = function () {
            return element;
        };

        obj.attributes = function () {
            return element.attributes;
        };

        obj.getTagName = function() {
            return element.tagName
        };

        obj.children = function() {
            if (!(element && element.childNodes)) return [];
            var nodes = Array.prototype.slice.call(element.childNodes);
            return nodes.map(function(e) {
                return Node(e)
            })
        };

        cjs.Object.extend(obj, extensions);

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

    cjs.Node.extend = function (o) {
        cjs.Object.extend(extensions, o);
    }

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


})();
