(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.flashed = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    var Renderer = /** @class */ (function () {
        function Renderer(width, height) {
            if (width === void 0) { width = 550; }
            if (height === void 0) { height = 400; }
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
            this.width = width;
            this.height = height;
            this._context.save();
        }
        Object.defineProperty(Renderer.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
                this._canvas.width = this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
                this._canvas.height = this._height;
            },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.clear = function () {
            this._context.clearRect(0, 0, this.width, this.height);
        };
        Renderer.prototype.draw = function (image) {
            this._context.drawImage(image, 0, 0, this._width, this._height);
        };
        return Renderer;
    }());

    var ACTION_RECT = Symbol();
    var ACTION_CIRCLE = Symbol();
    var Graphics = /** @class */ (function () {
        function Graphics() {
            this._actions = [];
        }
        Graphics.prototype.reset = function () {
        };
        Graphics.prototype.lineStyle = function (data) {
            this._lineStyle = data.style;
            this._lineWidth = data.width;
        };
        Graphics.prototype.beginFill = function (fill) {
            this._fillStyle = fill;
        };
        Graphics.prototype.endFill = function () {
        };
        Graphics.prototype.push = function (type, data) {
            this._actions.push(Object.assign({
                fillStyle: this._fillStyle,
                lineWidth: this._lineWidth,
                lineStyle: this._lineStyle,
                type: type,
            }, data));
        };
        Graphics.prototype.drawRect = function (x, y, width, height) {
            this.push(ACTION_RECT, {
                x: x, y: y, width: width, height: height,
            });
        };
        Graphics.prototype.drawCircle = function (x, y, radius) {
            this.push(ACTION_CIRCLE, {
                x: x, y: y, width: radius * 2, height: radius * 2,
            });
        };
        Graphics.prototype.draw = function (renderer, target) {
            var e_1, _a;
            var context = renderer.context, mouseEvent = renderer.mouseEvent;
            context.save();
            if (target) {
                context.translate(target.x, target.y);
                context.rotate(target.rotation);
                context.scale(target.scaleX, target.scaleY);
            }
            var mouse = false;
            try {
                for (var _b = __values(this._actions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var dt = _c.value;
                    context.beginPath();
                    var x = dt.x, y = dt.y, width = dt.width, height = dt.height, type = dt.type, fillStyle = dt.fillStyle, lineWidth = dt.lineWidth, lineStyle = dt.lineStyle;
                    context.fillStyle = fillStyle;
                    context.strokeStyle = lineStyle;
                    context.lineWidth = lineWidth;
                    if (type === ACTION_RECT) {
                        context.rect(x, y, width, height);
                    }
                    if (type === ACTION_CIRCLE) {
                        context.arc(x, y, width / 2, 0, Math.PI * 2);
                    }
                    if (fillStyle) {
                        context.fill();
                    }
                    if (lineWidth) {
                        context.stroke();
                    }
                    context.closePath();
                    if (target && target.mouseEnable && mouseEvent) {
                        var offsetX = mouseEvent.offsetX, offsetY = mouseEvent.offsetY;
                        if (context.isPointInPath(offsetX, offsetY)) {
                            mouse = true;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            mouse && target.dispatch(mouseEvent.type, mouseEvent);
            context.restore();
        };
        return Graphics;
    }());

    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this._events = new Map();
        }
        EventDispatcher.prototype.addEventListener = function (event, fn) {
            if (!this._events.has(event)) {
                this._events.set(event, new Set());
            }
            this._events.get(event).add(fn);
        };
        EventDispatcher.prototype.dispatch = function (event, data) {
            var e_1, _a;
            if (!this._events.has(event)) {
                return;
            }
            var fns = this._events.get(event);
            try {
                for (var _b = __values(fns.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fn = _c.value;
                    fn(data);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        EventDispatcher.prototype.removeEventListener = function (event, fn) {
            if (!this._events.has(event)) {
                return;
            }
            this._events.get(event).delete(fn);
        };
        return EventDispatcher;
    }());

    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this._x = 0;
            _this._y = 0;
            _this._rotation = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._mouseEnable = true;
            _this._graphics = new Graphics();
            return _this;
        }
        Object.defineProperty(DisplayObject.prototype, "mouseEnable", {
            get: function () {
                return this._mouseEnable;
            },
            set: function (value) {
                this._mouseEnable = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (value) {
                this._scaleX = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (value) {
                this._scaleY = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            set: function (value) {
                this._stage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (value) {
                this._parent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "graphics", {
            get: function () {
                return this._graphics;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.draw = function () {
            if (this.parent && this.stage) {
                this._graphics.draw(this.stage.renderer, this);
            }
        };
        return DisplayObject;
    }(EventDispatcher));

    var List = /** @class */ (function () {
        function List() {
            this._list = [];
        }
        Object.defineProperty(List.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        List.prototype.add = function (child) {
            this._list.push(child);
        };
        List.prototype.addAt = function (child, index) {
            this._list.splice(index, 0, child);
        };
        List.prototype.remove = function (child) {
            var find = this._list.findIndex(function (o) { return o === child; });
            this._list.splice(find, 1);
        };
        List.prototype.removeAt = function (index) {
            this._list.splice(index, 1);
        };
        List.prototype.at = function (index) {
            return this._list[index];
        };
        List.prototype.each = function (cb) {
            var e_1, _a;
            try {
                for (var _b = __values(this._list), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    cb(child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return List;
    }());

    var DisplayObjectContainer = /** @class */ (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this) || this;
            _this._children = new List();
            return _this;
        }
        Object.defineProperty(DisplayObjectContainer.prototype, "children", {
            // public set stage(value: Stage) {
            //     this._stage = value;
            //     this._children.each(child => {
            //         child.stage = value;
            //     });
            // }
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObjectContainer.prototype.addChild = function (child) {
            this._children.add(child);
            child.parent = this;
            child.stage = this.stage;
        };
        DisplayObjectContainer.prototype.addChildrenAt = function (child, index) {
            this._children.addAt(child, index);
            child.parent = this;
            child.stage = this.stage;
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            this._children.remove(child);
            child.parent = null;
            child.stage = null;
        };
        DisplayObjectContainer.prototype.removeChildAt = function (index) {
            var child = this._children.at(index);
            if (child) {
                child.parent = null;
                child.stage = null;
                this._children.removeAt(index);
            }
        };
        DisplayObjectContainer.prototype.removeChildByName = function (name) {
        };
        DisplayObjectContainer.prototype.getChildAt = function (index) {
            return this._children.at(index);
        };
        DisplayObjectContainer.prototype.draw = function () {
            _super.prototype.draw.call(this);
            this._children.each(function (child) {
                child.draw();
            });
        };
        return DisplayObjectContainer;
    }(DisplayObject));

    var ENTER_FRAME = Symbol();

    var Event = /*#__PURE__*/Object.freeze({
        ENTER_FRAME: ENTER_FRAME
    });

    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            var _this = _super.call(this) || this;
            _this.stage = _this;
            _this._renderer = new Renderer();
            _this._backRenderer = new Renderer();
            var fn = function () {
                _this._renderer.clear();
                _this._backRenderer.clear();
                _this.dispatch(ENTER_FRAME);
                _this.draw();
                _this._renderer.draw(_this._backRenderer.canvas);
                _this._backRenderer.mouseEvent = null;
                requestAnimationFrame(fn);
            };
            requestAnimationFrame(fn);
            var handleMouse = function (evt) {
                _this._backRenderer.mouseEvent = evt;
            };
            _this.display.addEventListener('click', handleMouse);
            _this.display.addEventListener('mousemove', handleMouse);
            _this.display.addEventListener('mouseup', handleMouse);
            _this.display.addEventListener('mousedown', handleMouse);
            return _this;
        }
        Object.defineProperty(Stage.prototype, "renderer", {
            get: function () {
                return this._backRenderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "display", {
            get: function () {
                return this._renderer.canvas;
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    }(DisplayObjectContainer));

    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            return _super.call(this) || this;
        }
        return Sprite;
    }(DisplayObjectContainer));

    var index = {
        Stage: Stage,
        Sprite: Sprite,
        Event: Event,
    };

    return index;

}));
