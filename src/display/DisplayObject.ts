import Graphics from "./Graphics";
import Stage from "../core/Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import EventDispatcher from "../events/EventDispatcher";
import * as MouseEvent from "../events/MouseEvent";

export default abstract class DisplayObject extends EventDispatcher {
    get mouseEnable(): Boolean {
        return this._mouseEnable;
    }

    set mouseEnable(value: Boolean) {
        this._mouseEnable = value;
    }

    get scaleX(): number {
        return this._scaleX;
    }

    set scaleX(value: number) {
        this._scaleX = value;
    }

    get scaleY(): number {
        return this._scaleY;
    }

    set scaleY(value: number) {
        this._scaleY = value;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(value: number) {
        this._rotation = value;
    }

    set stage(value: Stage) {
        this._stage = value;
    }

    get parent(): DisplayObjectContainer {
        return this._parent;
    }

    set parent(value: DisplayObjectContainer) {
        this._parent = value;
    }

    get graphics(): Graphics {
        return this._graphics;
    }

    get stage(): Stage {
        return this._stage;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    private _width: number;
    private _height: number;
    private _x: number = 0;
    private _y: number = 0;
    private _rotation: number = 0;
    private _scaleX: number = 1;
    private _scaleY: number = 1;
    private _stage: Stage;
    private _parent: DisplayObjectContainer;
    private _mouseEnable: Boolean = false;
    private readonly _graphics: Graphics;
    public name: string;

    protected constructor() {
        super();
        this._graphics = new Graphics();
    }


    public draw() {
        if (this.parent && this.stage) {
            this._graphics.draw(this.stage.renderer, this);
        }
    }
}