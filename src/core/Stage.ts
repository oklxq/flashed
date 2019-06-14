import Renderer from './Renderer';
import {DisplayObjectContainer} from "../display/DisplayObjectContainer";
import {ENTER_FRAME} from "../events/Event";
import * as MouseEvent from "../events/MouseEvent";

export default class Stage extends DisplayObjectContainer {


    get renderer(): Renderer {
        return this._backRenderer;
    }

    public get display(): HTMLCanvasElement {
        return this._renderer.canvas;
    }

    private readonly _backRenderer: Renderer;
    private readonly _renderer: Renderer;


    constructor() {
        super();
        this.stage = this;
        this._renderer = new Renderer();
        this._backRenderer = new Renderer();

        const fn = () => {
            this._renderer.clear();
            this._backRenderer.clear();
            this.dispatch(ENTER_FRAME);
            this.draw();
            this._renderer.draw(this._backRenderer.canvas);
            this._backRenderer.mouseEvent = null;
            requestAnimationFrame(fn);
        };
        requestAnimationFrame(fn);

        this.display.addEventListener('click', evt => {
            this._backRenderer.mouseEvent = evt;
        });
        this.display.addEventListener('mousemove', evt => {
            this.dispatch(MouseEvent.MOUSE_MOVE, evt);

        });
        this.display.addEventListener('mouseup', evt => {
            this.dispatch(MouseEvent.MOUSE_UP, evt);
        });
        this.display.addEventListener('mousedown', evt => {
            this.dispatch(MouseEvent.MOUSE_DOWN, evt);
        });

    }
}