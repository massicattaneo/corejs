(function(factory) {
    if (typeof define === 'function' && define.amd) {

        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {

    (function($) {
        $.attrFn = $.attrFn || {};

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


        // Add Event shortcuts:
        $.each(['tapstart', 'tapend', 'tapmove', 'tap', 'taphold', 'swipe', 'swipeup', 'swiperight', 'swipedown', 'swipeleft', 'swipeend'], function(i, name) {
            $.fn[name] = function(fn) {
                return fn ? this.on(name, fn) : this.trigger(name);
            };

            $.attrFn[name] = true;
        });

        // tapstart Event:
        $.event.special.tapstart = {
            setup: function() {

                var thisObject = this,
                    $this = $(thisObject);

                $this.on(settings.startevent, function tapStartFunc(e) {

                    $this.data('callee', tapStartFunc);
                    if (e.which && e.which !== 1) {
                        return false;
                    }

                    var origEvent = e.originalEvent,
                        touchData = {
                            'position': {
                                'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                                'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                            },
                            'offset': {
                                'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            },
                            'time': Date.now(),
                            'target': e.target
                        };

                    triggerCustomEvent(thisObject, 'tapstart', e, touchData);
                    return true;
                });
            },

            remove: function() {
                $(this).off(settings.startevent, $(this).data.callee);
            }
        };

        // tapmove Event:
        $.event.special.tapmove = {
            setup: function() {
                var thisObject = this,
                    $this = $(thisObject);

                $this.on(settings.moveevent, function tapMoveFunc(e) {
                    $this.data('callee', tapMoveFunc);

                    var origEvent = e.originalEvent,
                        touchData = {
                            'position': {
                                'x': ((settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX),
                                'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                            },
                            'offset': {
                                'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            },
                            'time': Date.now(),
                            'target': e.target
                        };

                    triggerCustomEvent(thisObject, 'tapmove', e, touchData);
                    return true;
                });
            },
            remove: function() {
                $(this).off(settings.moveevent, $(this).data.callee);
            }
        };

        // tapend Event:
        $.event.special.tapend = {
            setup: function() {
                var thisObject = this,
                    $this = $(thisObject);

                $this.on(settings.endevent, function tapEndFunc(e) {
                    // Touch event data:
                    $this.data('callee', tapEndFunc);

                    var origEvent = e.originalEvent;
                    var touchData = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
                    triggerCustomEvent(thisObject, 'tapend', e, touchData);
                    return true;
                });
            },
            remove: function() {
                $(this).off(settings.endevent, $(this).data.callee);
            }
        };

        // taphold Event:
        $.event.special.taphold = {
            setup: function() {
                var thisObject = this,
                    $this = $(thisObject),
                    origTarget,
                    start_pos = {
                        x: 0,
                        y: 0
                    },
                    end_x = 0,
                    end_y = 0;

                $this.on(settings.startevent, function tapHoldFunc1(e) {
                        if (e.which && e.which !== 1) {
                            return false;
                        } else {
                            $this.data('tapheld', false);
                            origTarget = e.target;

                            var origEvent = e.originalEvent;
                            var start_time = Date.now(),
                                startPosition = {
                                    'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                                },
                                startOffset = {
                                    'x': (settings.touch_capable) ? origEvent.touches[0].pageX - origEvent.touches[0].target.offsetLeft : e.offsetX,
                                    'y': (settings.touch_capable) ? origEvent.touches[0].pageY - origEvent.touches[0].target.offsetTop : e.offsetY
                                };

                            start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                            start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                            end_x = start_pos.x;
                            end_y = start_pos.y;

                            settings.hold_timer = window.setTimeout(function() {

                                var diff_x = (start_pos.x - end_x),
                                    diff_y = (start_pos.y - end_y);

                                if (e.target == origTarget && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                                    $this.data('tapheld', true);

                                    var end_time = Date.now(),
                                        endPosition = {
                                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                                        },
                                        endOffset = {
                                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                                        };
                                    var duration = end_time - start_time;

                                    // Build the touch data:
                                    var touchData = {
                                        'startTime': start_time,
                                        'endTime': end_time,
                                        'startPosition': startPosition,
                                        'startOffset': startOffset,
                                        'endPosition': endPosition,
                                        'endOffset': endOffset,
                                        'duration': duration,
                                        'target': e.target
                                    };
                                    $this.data('callee1', tapHoldFunc1);
                                    triggerCustomEvent(thisObject, 'taphold', e, touchData);
                                }
                            }, settings.taphold_threshold);

                            return true;
                        }
                    }).on(settings.endevent, function tapHoldFunc2() {
                        $this.data('callee2', tapHoldFunc2);
                        $this.data('tapheld', false);
                        window.clearTimeout(settings.hold_timer);
                    })
                    .on(settings.moveevent, function tapHoldFunc3(e) {
                        $this.data('callee3', tapHoldFunc3);

                        end_x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                        end_y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    });
            },

            remove: function() {
                $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2).off(settings.moveevent, $(this).data.callee3);
            }
        };

        // tap Event:
        $.event.special.tap = {
            setup: function() {
                var thisObject = this,
                    $this = $(thisObject),
                    started = false,
                    origTarget = null,
                    start_time,
                    start_pos = {
                        x: 0,
                        y: 0
                    },
                    touches;

                $this.on(settings.startevent, function tapFunc1(e) {
                    $this.data('callee1', tapFunc1);

                    if (e.which && e.which !== 1) {
                        return false;
                    } else {
                        started = true;
                        start_pos.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                        start_pos.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                        start_time = Date.now();
                        origTarget = e.target;

                        touches = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches : [e];
                        return true;
                    }
                }).on(settings.endevent, function tapFunc2(e) {
                    $this.data('callee2', tapFunc2);

                    // Only trigger if they've started, and the target matches:
                    var end_x = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageX : e.pageX,
                        end_y = (e.originalEvent.targetTouches) ? e.originalEvent.changedTouches[0].pageY : e.pageY,
                        diff_x = (start_pos.x - end_x),
                        diff_y = (start_pos.y - end_y),
                        eventName;

                    if (origTarget == e.target && started && ((Date.now() - start_time) < settings.taphold_threshold) && ((start_pos.x == end_x && start_pos.y == end_y) || (diff_x >= -(settings.tap_pixel_range) && diff_x <= settings.tap_pixel_range && diff_y >= -(settings.tap_pixel_range) && diff_y <= settings.tap_pixel_range))) {
                        var origEvent = e.originalEvent;
                        var touchData = [];

                        for (var i = 0; i < touches.length; i++) {
                            var touch = {
                                'position': {
                                    'x': (settings.touch_capable) ? origEvent.changedTouches[i].screenX : e.screenX,
                                    'y': (settings.touch_capable) ? origEvent.changedTouches[i].screenY : e.screenY
                                },
                                'offset': {
                                    'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                    'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[i].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                                },
                                'time': Date.now(),
                                'target': e.target
                            };

                            touchData.push(touch);
                        }

                        triggerCustomEvent(thisObject, 'tap', e, touchData);
                    }
                });
            },

            remove: function() {
                $(this).off(settings.startevent, $(this).data.callee1).off(settings.endevent, $(this).data.callee2);
            }
        };



        // swipe Event (also handles swipeup, swiperight, swipedown and swipeleft):
        $.event.special.swipe = {
            setup: function () {
                var thisObject = this,
                    $this = $(thisObject),
                    started = false,
                    hasSwiped = false,
                    originalCoord = {
                        x: 0,
                        y: 0
                    },
                    finalCoord = {
                        x: 0,
                        y: 0
                    },
                    startEvnt;

                // Screen touched, store the original coordinate

                function touchStart(e) {
                    $this = $(e.currentTarget);
                    $this.data('callee1', touchStart);
                    originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
                    finalCoord.x = originalCoord.x;
                    finalCoord.y = originalCoord.y;
                    started = true;
                    var origEvent = e.originalEvent;
                    // Read event data into our startEvt:
                    startEvnt = {
                        'position': {
                            'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                            'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                        },
                        'offset': {
                            'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                            'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                        },
                        'time': Date.now(),
                        'target': e.target
                    };
                }

                // Store coordinates as finger is swiping

                function touchMove(e) {
                    $this = $(e.currentTarget);
                    $this.data('callee2', touchMove);
                    finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
                    finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;

                    var swipedir;

                    // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                    var ele_x_threshold = ($this.parent().data('xthreshold')) ? $this.parent().data('xthreshold') : $this.data('xthreshold'),
                        ele_y_threshold = ($this.parent().data('ythreshold')) ? $this.parent().data('ythreshold') : $this.data('ythreshold'),
                        h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
                        v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;

                    if (originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > v_threshold)) {
                        swipedir = 'swipeup';
                    }
                    if (originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > h_threshold)) {
                        swipedir = 'swiperight';
                    }
                    if (originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > v_threshold)) {
                        swipedir = 'swipedown';
                    }
                    if (originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > h_threshold)) {
                        swipedir = 'swipeleft';
                    }
                    if (swipedir != undefined && started) {
                        originalCoord.x = 0;
                        originalCoord.y = 0;
                        finalCoord.x = 0;
                        finalCoord.y = 0;
                        started = false;

                        // Read event data into our endEvnt:
                        var origEvent = e.originalEvent;
                        var endEvnt = {
                            'position': {
                                'x': (settings.touch_capable) ? origEvent.touches[0].screenX : e.screenX,
                                'y': (settings.touch_capable) ? origEvent.touches[0].screenY : e.screenY
                            },
                            'offset': {
                                'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            },
                            'time': Date.now(),
                            'target': e.target
                        };

                        // Calculate the swipe amount (normalized):
                        var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                            yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                        var touchData = {
                            'startEvnt': startEvnt,
                            'endEvnt': endEvnt,
                            'direction': swipedir.replace('swipe', ''),
                            'xAmount': xAmount,
                            'yAmount': yAmount,
                            'duration': endEvnt.time - startEvnt.time
                        };
                        hasSwiped = true;
                        $this.trigger('swipe', touchData).trigger(swipedir, touchData);
                    }
                }

                function touchEnd(e) {
                    $this = $(e.currentTarget);
                    var swipedir = "";
                    $this.data('callee3', touchEnd);
                    if (hasSwiped) {
                        // We need to check if the element to which the event was bound contains a data-xthreshold | data-vthreshold:
                        var ele_x_threshold = $this.data('xthreshold'),
                            ele_y_threshold = $this.data('ythreshold'),
                            h_threshold = (typeof ele_x_threshold !== 'undefined' && ele_x_threshold !== false && parseInt(ele_x_threshold)) ? parseInt(ele_x_threshold) : settings.swipe_h_threshold,
                            v_threshold = (typeof ele_y_threshold !== 'undefined' && ele_y_threshold !== false && parseInt(ele_y_threshold)) ? parseInt(ele_y_threshold) : settings.swipe_v_threshold;

                        var origEvent = e.originalEvent;
                        var endEvnt = {
                            'position': {
                                'x': (settings.touch_capable) ? origEvent.changedTouches[0].screenX : e.screenX,
                                'y': (settings.touch_capable) ? origEvent.changedTouches[0].screenY : e.screenY
                            },
                            'offset': {
                                'x': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageX - $this.offset().left) : Math.round(e.pageX - $this.offset().left),
                                'y': (settings.touch_capable) ? Math.round(origEvent.changedTouches[0].pageY - $this.offset().top) : Math.round(e.pageY - $this.offset().top)
                            },
                            'time': Date.now(),
                            'target': e.target
                        };

                        // Read event data into our endEvnt:
                        if (startEvnt.position.y > endEvnt.position.y && (startEvnt.position.y - endEvnt.position.y > v_threshold)) {
                            swipedir = 'swipeup';
                        }
                        if (startEvnt.position.x < endEvnt.position.x && (endEvnt.position.x - startEvnt.position.x > h_threshold)) {
                            swipedir = 'swiperight';
                        }
                        if (startEvnt.position.y < endEvnt.position.y && (endEvnt.position.y - startEvnt.position.y > v_threshold)) {
                            swipedir = 'swipedown';
                        }
                        if (startEvnt.position.x > endEvnt.position.x && (startEvnt.position.x - endEvnt.position.x > h_threshold)) {
                            swipedir = 'swipeleft';
                        }

                        // Calculate the swipe amount (normalized):
                        var xAmount = Math.abs(startEvnt.position.x - endEvnt.position.x),
                            yAmount = Math.abs(startEvnt.position.y - endEvnt.position.y);

                        var touchData = {
                            'startEvnt': startEvnt,
                            'endEvnt': endEvnt,
                            'direction': swipedir.replace('swipe', ''),
                            'xAmount': xAmount,
                            'yAmount': yAmount,
                            'duration': endEvnt.time - startEvnt.time
                        };
                        $this.trigger('swipeend', touchData);
                    }

                    started = false;
                    hasSwiped = false;
                }

                $this.on(settings.startevent, touchStart);
                $this.on(settings.moveevent, touchMove);
                $this.on(settings.endevent, touchEnd);
            },

            remove: function () {
                $(this).off(settings.startevent, $(this).data.callee1).off(settings.moveevent, $(this).data.callee2).off(settings.endevent, $(this).data.callee3);
            }
        };
        // Trigger a custom event:

        function triggerCustomEvent(obj, eventType, event, touchData) {
            var originalType = event.type;
            event.type = eventType;

            $.event.dispatch.call(obj, event, touchData);
            event.type = originalType;
        }

        // Correctly on anything we've overloaded:
        $.each({
            swipeup: 'swipe',
            swiperight: 'swipe',
            swipedown: 'swipe',
            swipeleft: 'swipe',
            swipeend: 'swipe'
        }, function (e, srcE) {
            $.event.special[e] = {
                setup: function () {
                    $(this).on(srcE, $.noop);
                }
            };
        });

    }(jQuery));
}));
