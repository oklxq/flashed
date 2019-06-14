export default class Renderer {
    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this._canvas.width = this._width;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this._canvas.height = this._height;
    }

    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;

    public mouseEvent: any;


    constructor(width: number = 550, height: number = 400) {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this._context.save();
    }

    public clear() {
        this._context.clearRect(0, 0, this.width, this.height);
    }

    public draw(image: CanvasImageSource) {
        this._context.drawImage(image, 0, 0, this._width, this._height);
    }
}