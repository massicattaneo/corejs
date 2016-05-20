define(function() {
    (function() {
        var coordinateSystemForElementFromPoint;

        var _has3DTransform = (function() {
            if (!window.getComputedStyle) {
                return false;
            }
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }());

        var privateApi = {
            mobile: {
                events: {
                    eventstart: 'touchstart',
                    eventmove: 'touchmove',
                    eventend: 'touchend'
                },
                getMovementsFromEvent: function(event) {
                    var pageXs = [];
                    var pageYs = [];
                    [].forEach.call(event.changedTouches, function(touch) {
                        pageXs.push(touch.pageX);
                        pageYs.push(touch.pageY);
                    });
                    return {
                        pageXs: pageXs,
                        pageYs: pageYs
                    };

                },
                getMovementFromEvent: function(event) {
                    return event.changedTouches[0];
                }
            },
            desktop: {
                events: {
                    eventstart: 'mousedown',
                    eventmove: 'mousemove',
                    eventend: 'mouseup'
                },
                getMovementsFromEvent: function(event) {
                    var pageXs = [];
                    var pageYs = [];

                    pageXs.push(event.pageX);
                    pageYs.push(event.pageY);

                    return {
                        pageXs: pageXs,
                        pageYs: pageYs
                    };

                },
                getMovementFromEvent: function(event) {
                    return event;
                }
            }

        }[document.body.classList.contains('touch') ? 'mobile' : 'desktop'];

        var _movementStart = function(evt) {

            var el = evt.target;
            do {
                if (el.draggable === true) {
                    // If draggable isn't explicitly set for anchors, then simulate a click event.
                    // Otherwise plain old vanilla links will stop working.
                    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events#Handling_clicks
                    if (!el.hasAttribute('draggable') && el.tagName.toLowerCase() === 'a') {
                        var clickEvt = document.createEvent('MouseEvents');
                        clickEvt.initMouseEvent('click', true, true, el.ownerDocument.defaultView, 1,
                            evt.screenX, evt.screenY, evt.clientX, evt.clientY,
                            evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
                        el.dispatchEvent(clickEvt);
                    }
                    evt.preventDefault();
                    new DragDrop(evt, el);
                    break;
                }
            } while ((el = el.parentNode) && el !== document.body);
        };


        //PRIVATE FUNCTIONS
        var _init = function() {
            coordinateSystemForElementFromPoint = navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/) ? 'page' : 'client';
            document.addEventListener(privateApi.events.eventstart, _movementStart);
        };




        // DOM helpers
        var _elementFromEvent = function(el, event) {
            var movement = privateApi.getMovementFromEvent(event);
            var target = document.elementFromPoint(
                movement[coordinateSystemForElementFromPoint + 'X'],
                movement[coordinateSystemForElementFromPoint + 'Y']
            );
            return target;
        };

        //calculate the offset position of an element (relative to the window, not the document)
        var _getOffset = function(el) {
            var rect = el.getBoundingClientRect();
            return {
                'x': rect.left,
                'y': rect.top
            };
        };

        var _onEvt = function(el, event, handler, context) {
            if (context) {
                handler = handler.bind(context);
            }
            el.addEventListener(event, handler);
            return {
                off: function() {
                    return el.removeEventListener(event, handler);
                }
            };
        };

        var _once = function(el, event, handler, context) {
            if (context) {
                handler = handler.bind(context);
            }

            function listener(evt) {
                handler(evt);
                return el.removeEventListener(event, listener);
            }
            return el.addEventListener(event, listener);
        };

        // _duplicateStyle expects dstNode to be a clone of srcNode
        var _duplicateStyle = function(srcNode, dstNode) {
            // Is this node an element?
            if (srcNode.nodeType == 1) {
                // Remove any potential conflict attributes
                dstNode.removeAttribute('id');
                dstNode.removeAttribute('class');
                dstNode.removeAttribute('style');
                dstNode.removeAttribute('draggable');

                // Clone the style
                var cs = window.getComputedStyle(srcNode);
                var csLength = cs.length;
                for (var i = 0; i < csLength; i++) {
                    var csName = cs[i];
                    dstNode.style.setProperty(csName, cs.getPropertyValue(csName), cs.getPropertyPriority(csName));
                }

                // Pointer events as none makes the drag image transparent to document.elementFromPoint()
                dstNode.style.pointerEvents = 'none';
            }

            // Do the same for the children
            if (srcNode.hasChildNodes()) {
                var childNodesLength = srcNode.childNodes.length;
                for (var j = 0; j < childNodesLength; j++) {
                    _duplicateStyle(srcNode.childNodes[j], dstNode.childNodes[j]);
                }
            }
        };

        var _average = function(arr) {
            if (arr.length === 0) {
                return 0;
            }
            return arr.reduce((function(s, v) {
                return v + s;
            }), 0) / arr.length;
        };



        var DragDrop = function (event, el) {

            var threeSholdX = 0;
            var threeSholdY = 0;
            var startDragging = false;
            this.dragData = {};
            this.dragDataTypes = [];
            this.dragImage = null;
            this.dragImageTransform = null;
            this.dragImageWebKitTransform = null;
            this.customDragImage = null;
            this.customDragImageX = null;
            this.customDragImageY = null;
            this.el = el || event.target;


            var _detectTreeshold = function(event) {
                var movements = privateApi.getMovementsFromEvent(event);
                var x = _average(movements.pageXs);
                var y = _average(movements.pageYs);
                return {
                    x: x,
                    y: y
                };

            };

            var dragStartingPoints = _detectTreeshold(event);
            var self = this;
            var _detectStartMove = _onEvt(el, privateApi.events.eventmove, function(event) {

                var dragMovingPoints = _detectTreeshold(event);
                threeSholdX = Math.abs(dragMovingPoints.x - dragStartingPoints.x);
                threeSholdY = Math.abs(dragMovingPoints.y - dragStartingPoints.y);
                if ((threeSholdX >= 2 || threeSholdY >= 2) && startDragging === false) {
                    startDragging = true;
                    if (self.dispatchDragStart()) {
                        self.createDragImage();
                        self.listen();
                        _detectStartMove.off();
                    }
                }
            }, this);

            var _detectEndMove = _onEvt(el, privateApi.events.eventend, function() {
                var abortEvt = document.createEvent('Event');
                abortEvt.initEvent('dragcancel', true, true);
                el.dispatchEvent(abortEvt);
                _detectStartMove.off();
                _detectEndMove.off();
            }, this);




        };

        DragDrop.prototype = {
            listen: function() {
                var move = _onEvt(document, privateApi.events.eventmove, this.move, this);
                var end = _onEvt(document, privateApi.events.eventend, onMovementEnd, this);

                var cancel = _onEvt(document, 'touchcancel', function() {
                    cleanup();
                }, this);


                var mouseout = _onEvt(document, 'mouseout', function(e) {
                       e = e ? e : window.event;
                       var from = e.relatedTarget || e.toElement;
                       if (!from || from.nodeName == 'HTML') {
                           var abortEvt = document.createEvent('Event');
                           abortEvt.initEvent('dragcancel', true, true);
                           window.dispatchEvent(abortEvt);
                           return;
                       }
                }, this);

                function onMovementEnd(event) {
                    this.dragend(event, event.target);
                    cleanup.call(this);
                }

                function cleanup() {
                    this.dragDataTypes = [];
                    if (this.dragImage !== null) {
                        this.dragImage.parentNode.removeChild(this.dragImage);
                        this.dragImage = null;
                        this.dragImageTransform = null;
                        this.dragImageWebKitTransform = null;
                    }
                    this.customDragImage = null;
                    this.customDragImageX = null;
                    this.customDragImageY = null;
                    this.el = this.dragData = null;
                    return [move, end, cancel, mouseout].forEach(function(handler) {
                        return handler.off();
                    });
                }
            },
            move: function(event) {

                var movements = privateApi.getMovementsFromEvent(event);

                var x = _average(movements.pageXs) - (this.customDragImageX || parseInt(this.dragImage.offsetWidth, 10) / 2);
                var y = _average(movements.pageYs) - (this.customDragImageY || parseInt(this.dragImage.offsetHeight, 10) / 2);
                this.translateDragImage(x, y);

                this.synthesizeEnterLeave(event);
            },
            // We use translate instead of top/left because of sub-pixel rendering and for the hope of better performance
            // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
            translateDragImage: function(x, y) {
                var translate = _has3DTransform ? 'translate3d(' + x + 'px,' + y + 'px, 0) ' : 'translate(' + x + 'px,' + y + 'px) ';
                if (this.dragImageWebKitTransform !== null) {
                    this.dragImage.style['-webkit-transform'] = translate + this.dragImageWebKitTransform;
                }
                if (this.dragImageTransform !== null) {
                    this.dragImage.style.transform = translate + this.dragImageTransform;
                }
            },
            synthesizeEnterLeave: function(event) {
                var target = _elementFromEvent(this.el, event);
                if (target != this.lastEnter) {
                    if (this.lastEnter) {
                        this.dispatchLeave(event);
                    }
                    this.lastEnter = target;
                    if (this.lastEnter) {
                        this.dispatchEnter(event);
                    }
                }
                if (this.lastEnter) {
                    this.dispatchOver(event);
                }
            },
            dragend: function(event) {

                // we'll dispatch drop if there's a target, then dragEnd.
                // drop comes first http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#drag-and-drop-processing-model


                if (this.lastEnter) {
                    this.dispatchLeave(event);
                }

                var target = _elementFromEvent(this.el, event);
                if (target) {
                    this.dispatchDrop(target, event);
                }

                var dragendEvt = document.createEvent('Event');
                dragendEvt.initEvent('dragend', true, true);
                this.el.dispatchEvent(dragendEvt);
            },
            dispatchDrop: function(target, event) {

                var dropEvt = document.createEvent('Event');
                dropEvt.initEvent('drop', true, true);

                var movement = privateApi.getMovementFromEvent(event);
                var x = movement[coordinateSystemForElementFromPoint + 'X'];
                var y = movement[coordinateSystemForElementFromPoint + 'Y'];

                var targetOffset = _getOffset(target);

                dropEvt.offsetX = x - targetOffset.x;
                dropEvt.offsetY = y - targetOffset.y;

                dropEvt.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(type) {
                        return this.dragData[type];
                    }.bind(this),
                    dropEffect: 'move'
                };
                dropEvt.preventDefault = function() {
                    // https://www.w3.org/Bugs/Public/show_bug.cgi?id=14638 - if we don't cancel it, we'll snap back
                }.bind(this);

                _once(document, 'drop', function() {}, this);

                target.dispatchEvent(dropEvt);
            },
            dispatchEnter: function(event) {

                var enterEvt = document.createEvent('Event');
                enterEvt.initEvent('dragenter', true, true);
                enterEvt.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(type) {
                        return this.dragData[type];
                    }.bind(this)
                };

                var movement = privateApi.getMovementFromEvent(event);
                enterEvt.pageX = movement.pageX;
                enterEvt.pageY = movement.pageY;

                this.lastEnter.dispatchEvent(enterEvt);
            },
            dispatchOver: function(event) {

                var overEvt = document.createEvent('Event');
                overEvt.initEvent('dragover', true, true);
                overEvt.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(type) {
                        return this.dragData[type];
                    }.bind(this)
                };

                var movement = privateApi.getMovementFromEvent(event);
                overEvt.pageX = movement.pageX;
                overEvt.pageY = movement.pageY;

                this.lastEnter.dispatchEvent(overEvt);
            },
            dispatchLeave: function(event) {

                var leaveEvt = document.createEvent('Event');
                leaveEvt.initEvent('dragleave', true, true);
                leaveEvt.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(type) {
                        return this.dragData[type];
                    }.bind(this)
                };

                var movement = privateApi.getMovementFromEvent(event);
                leaveEvt.pageX = movement.pageX;
                leaveEvt.pageY = movement.pageY;

                this.lastEnter.dispatchEvent(leaveEvt);
                this.lastEnter = null;
            },
            dispatchDragStart: function() {
                var evt = document.createEvent('Event');
                evt.initEvent('dragstart', true, true);
                evt.dataTransfer = {
                    setData: function(type, val) {
                        this.dragData[type] = val;
                        if (this.dragDataTypes.indexOf(type) == -1) {
                            this.dragDataTypes[this.dragDataTypes.length] = type;
                        }
                        return val;
                    }.bind(this),
                    setDragImage: function(el, x, y) {
                        this.customDragImage = el;
                        this.customDragImageX = x;
                        this.customDragImageY = y;
                    }.bind(this),
                    dropEffect: 'move'
                };
                return this.el.dispatchEvent(evt);
            },
            createDragImage: function() {
                if (this.customDragImage) {
                    this.dragImage = this.customDragImage.cloneNode(true);
                    _duplicateStyle(this.customDragImage, this.dragImage);
                } else {
                    this.dragImage = this.el.cloneNode(true);
                    _duplicateStyle(this.el, this.dragImage);
                }
                this.dragImage.style.opacity = '0.5';
                this.dragImage.style.position = 'absolute';
                this.dragImage.style.top = '0px';

                this.dragImage.style.zIndex = '999999';

                var transform = this.dragImage.style.transform;
                if (typeof transform !== 'undefined') {
                    this.dragImageTransform = '';
                    if (transform != 'none') {
                        this.dragImageTransform = transform.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, '');
                    }
                }

                var webkitTransform = this.dragImage.style['-webkit-transform'];
                if (typeof webkitTransform !== 'undefined') {
                    this.dragImageWebKitTransform = '';
                    if (webkitTransform != 'none') {
                        this.dragImageWebKitTransform = webkitTransform.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, '');
                    }
                }

                this.translateDragImage(-9999, -9999);

                document.body.appendChild(this.dragImage);
            }
        };


        _init();


    })();
});
