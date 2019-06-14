import Renderer from './Renderer';
import {DisplayObjectContainer} from "../display/DisplayObjectContainer";
import {ENTER_FRAME} from "../events/Event";

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
        const handleMouse = evt => {
            this._backRenderer.mouseEvent = evt;
        };
        this.display.addEventListener('click', handleMouse);
        this.display.addEventListener('mousemove', handleMouse);
        this.display.addEventListener('mouseup', handleMouse);
        this.display.addEventListener('mousedown', handleMouse);

    }
}