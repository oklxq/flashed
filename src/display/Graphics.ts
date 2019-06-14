import DisplayObject from "./DisplayObject";
import Renderer from "../core/Renderer";
import * as MouseEvent from '../events/MouseEvent';

const ACTION_RECT = Symbol();
const ACTION_CIRCLE = Symbol();

type DrawStyle = string | CanvasGradient | CanvasPattern;

interface DrawType {
    x: number;
    y: number;
    width: number;
    height: number;
    type: Symbol;
    fillStyle: DrawStyle;
    lineWidth?: number;
    lineStyle?: DrawStyle;
}

export default class Graphics {
    private _fillStyle: DrawStyle;
    private _lineWidth: number;
    private _lineStyle: DrawStyle;
    private readonly _actions: DrawType[];

    constructor() {
        this._actions = [];
    }

    private reset() {

    }

    public lineStyle(data: { style: DrawStyle, width: number }) {
        this._lineStyle = data.style;
        this._lineWidth = data.width;
    }

    public beginFill(fill: DrawStyle) {
        this._fillStyle = fill;
    }

    public endFill() {

    }

    private push(type: Symbol, data: any) {
        this._actions.push(Object.assign({
            fillStyle: this._fillStyle,
            lineWidth: this._lineWidth,
            lineStyle: this._lineStyle,
            type,
        }, data));
    }

    public drawRect(x: number, y: number, width: number, height: number) {
        this.push(ACTION_RECT, {
            x, y, width, height,
        });
    }

    public drawCircle(x: number, y: number, radius: number) {
        this.push(ACTION_CIRCLE, {
            x, y, width: radius * 2, height: radius * 2,
        });
    }

    public draw(renderer: Renderer, target?: DisplayObject) {
        const {context, mouseEvent} = renderer;
        context.save();
        if (target) {
            context.translate(target.x, target.y);
            context.rotate(target.rotation);
            context.scale(target.scaleX, target.scaleY);
        }
        let mouse = false;
        for (let dt of this._actions) {
            context.beginPath();
            const {x, y, width, height, type, fillStyle, lineWidth, lineStyle} = dt;
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
                const {offsetX, offsetY} = mouseEvent;
                if (context.isPointInPath(offsetX, offsetY)) {
                    mouse = true;
                }
            }
        }

        mouse && target.dispatch(mouseEvent.type, mouseEvent);
        context.restore();
    }
}