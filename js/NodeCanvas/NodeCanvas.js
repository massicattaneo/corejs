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

    function parseStyleForCanvas(cssStyle) {
        cssStyle = cssStyle.replace(/\.&/g, '').replace(/;\s*}/g, ';').replace(/{/g, ';');
        var values = cssStyle.match(/(\:[^\:]*;)/g).map(function (o) {
            return o.replace(/\s*;\s*/g, '').replace(/\s*:\s*/g, '')
        });
        var properties = cssStyle.match(/(\;[^\;]*:)/g).map(function (o) {
            return o.replace(/\s*;\s*/g, '').replace(/\s*:\s*/g, '')
        });

        var o = {};
        properties.forEach(function (p, i) {
            o[p] = parseValue(values[i]);
        });
        return o;
    }

    function addClass(className) {
        addCss.call(this, parseStyleForCanvas(cjs.Component.getStyle(className)))
    }

    function parseValue(value) {
        if (value.match(/\d*px/)) {
            return Number(value.replace('px', ''));
        }
        if (value.match(/0/)) {
            return Number(0);
        }
        return value;
    }

    function addCss(o) {
        var ctx = this;
        ctx.beginPath();
        ctx.fillStyle=o['background-color'];
        ctx.fillRect(0,0,o.width,o.height);
        ctx.stroke();
    }

    function addStyle() {
        if (typeof arguments[0] === 'object') {
            addCss.apply(this, arguments);
        } else {
            addClass.apply(this, arguments);
        }
    }

    function clearStyles() {
    }

    function removeStyle() {
    }

    function hasStyle(className) {
    }

    function toggleStyle(className) {
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
                window.clearTimeout(settings.hold_timer);
            });
            addListener.call(this, settings.moveevent, function tapHoldFunc3(e) {
                end_x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
                end_y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
            });
        };

        /** TODO: magage DBLTAP*/

        /** TODO: TO BE REFACTORED - REMOVED JQUERY */
        // evs.swipe = function () {
        //     var self = this,
        //         $this = ret(self),
        //         started = false,
        //         hasSwiped = false,
        //         originalCoord = {
        //             x: 0,
        //             y: 0
        //         },
        //         finalCoord = {
        //             x: 0,
        //             y: 0
        //         },
        //         startEvnt;
        //
        //     // Screen touched, store the original coordinate
        //
        //     function touchStart(e) {
        //         originalCoord.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
        //         originalCoord.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
        //         finalCoord.x = originalCoord.x;
        //         finalCoord.y = originalCoord.y;
        //         started = true;
        //         // Read event data into our startEvt:
        //         startEvnt = {
        //             'position': {
        //                 'x': (settings.touch_capable) ? e.touches[0].screenX : e.screenX,
        //                 'y': (settings.touch_capable) ? e.touches[0].screenY : e.screenY
        //             },
        //             // 'offset': {
        //             //     'x': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
        //             //     'y': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
        //             // },
        //             'time': Date.now(),
        //             'target': e.target
        //         };
        //     }
        //
        //     // Store coordinates as finger is swiping
        //
        //     function touchMove(e) {
        //         finalCoord.x = (e.targetTouches) ? e.targetTouches[0].pageX : e.pageX;
        //         finalCoord.y = (e.targetTouches) ? e.targetTouches[0].pageY : e.pageY;
        //
        //         var swipedir;
        //
        //         // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
        //         var ele_x_threshold = ($this.parent().data('xthreshold')) ? $this.parent().data('xthreshold') : $this.data('xthreshold'),
        //             ele_y_threshold = ($this.parent().data('ythreshold')) ? $this.parent().data('ythreshold') : $this.data('ythreshold'),
        //             h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
        //             v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;
        //
        //         if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
        //             swipedir = 'swipeup';
        //         }
        //         if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
        //             swipedir = 'swiperight';
        //         }
        //         if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
        //             swipedir = 'swipedown';
        //         }
        //         if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
        //             swipedir = 'swipeleft';
        //         }
        //         if (swipedir != undefined && started) {
        //             originalCoord.x = 0;
        //             originalCoord.y = 0;
        //             finalCoord.x = 0;
        //             finalCoord.y = 0;
        //             started = false;
        //
        //             // Read event data into our endEvnt:
        //             var origEvent = e;
        //             var endEvnt = {
        //                 'position': {
        //                     'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
        //                     'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
        //                 },
        //                 // 'offset': {
        //                 //     'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
        //                 //     'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
        //                 // },
        //                 'time': Date.now(),
        //                 'target': e.target
        //             };
        //
        //             // Calculate the swipe amount (normalized):
        //             var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
        //                 yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);
        //
        //             var touchData = {
        //                 'startEvnt': startEvnt,
        //                 'endEvnt': endEvnt,
        //                 'direction': swipedir.replace('swipe', ''),
        //                 'xAmount': xAmount,
        //                 'yAmount': yAmount,
        //                 'duration': endEvnt.time - startEvnt.time
        //             };
        //             hasSwiped = true;
        //             $this.trigger('swipe', touchData).trigger(swipedir, touchData);
        //         }
        //     }
        //
        //     function touchEnd(e) {
        //         var swipedir = "";
        //         if (hasSwiped) {
        //             // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
        //             var ele_x_threshold = $this.data('xthreshold'),
        //                 ele_y_threshold = $this.data('ythreshold'),
        //                 h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
        //                 v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;
        //
        //             var endEvnt = {
        //                 'position': {
        //                     'x': (settings.touch_capable) ? e.changedTouches[0].screenX : e.screenX,
        //                     'y': (settings.touch_capable) ? e.changedTouches[0].screenY : e.screenY
        //                 },
        //                 'offset': {
        //                     'x': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
        //                     'y': (settings.touch_capable) ? Math.round(e.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
        //                 },
        //                 'time': Date.now(),
        //                 'target': e.target
        //             };
        //
        //             // Read event data into our endEvnt:
        //             if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
        //                 swipedir = 'swipeup';
        //             }
        //             if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
        //                 swipedir = 'swiperight';
        //             }
        //             if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
        //                 swipedir = 'swipedown';
        //             }
        //             if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
        //                 swipedir = 'swipeleft';
        //             }
        //
        //             // Calculate the swipe amount (normalized):
        //             var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
        //                 yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);
        //
        //             var touchData = {
        //                 'startEvnt': startEvnt,
        //                 'endEvnt': endEvnt,
        //                 'direction': swipedir.replace('swipe', ''),
        //                 'xAmount': xAmount,
        //                 'yAmount': yAmount,
        //                 'duration': endEvnt.time - startEvnt.time
        //             };
        //             $this.trigger('swipeend', touchData);
        //         }
        //
        //         started = false;
        //         hasSwiped = false;
        //     }
        //
        //     $this.on(settings.startevent, touchStart);
        //     $this.on(settings.moveevent, touchMove);
        //     $this.on(settings.endevent, touchEnd);
        // };
        function triggerCustomEvent(obj, eventType, callback, event, touchData) {
            var originalType = event.type;
            event.type = eventType;
            callback.call(obj, event, touchData);
            event.type = originalType;
        }

    })(specialEvents);

    function addListener(action, callback) {
    }

    function removeListener(action, callback) {
    }

    function addOnceListener(action, callback) {
    }

    function clearListeners() {
    }

    function removeAllChildren() {
    }

    function getTarget(selector) {
    }

    function fire(action, params) {
    }

    function setValue(value) {
    }

    function getValue() {
    }

    function getAttribute(attrName) {
    }

    function setAttribute(name, value) {
    }

    function runAnimation(name, params) {
    }

    function appendChild(node) {
    }


    function create(markup) {
    }

    /** toJSON */
    function getNodeValue(node) {
    }

    var isEmpty = function (obj) {
    };

    function parseNode(children) {
    }

    function toJSON() {
    }

    var extensions = {};

    cjs.NodeCanvas = function NodeCanvas(ctx, template) {
        var json = cjs.Node(template || '<div></div>').toJSON() || {};
        var children = [];
        var self = this;
        [addStyle, clearStyles, removeStyle, hasStyle, toggleStyle,
            addListener, addOnceListener, removeListener, clearListeners,
            setValue, getValue,
            getAttribute, setAttribute,
            runAnimation,
            appendChild,
            fire,
            toJSON,
            removeAllChildren]
            .forEach(function (func) {
                self[func.name] = function () {
                    var apply = func.apply(ctx, arguments);
                    return apply === undefined ? self : apply;
                }
            });

        this.getCtx = function () {
            return ctx;
        };

        this.get = function () {
            // return element;
        };

        this.attributes = function () {
            // return element.attributes;
        };

        this.getTagName = function() {
            // return element.tagName
        };

        this.children = function() {
        //
        };

        cjs.Object.extend(this, extensions);
    };

    cjs.NodeCanvas.extend = function (o) {
        cjs.Object.extend(extensions, o);
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


})();
