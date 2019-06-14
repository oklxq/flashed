import DisplayObject from './DisplayObject';
import List from '../data/List';
import Stage from "../core/Stage";

export class DisplayObjectContainer extends DisplayObject {
    // public set stage(value: Stage) {
    //     this._stage = value;
    //     this._children.each(child => {
    //         child.stage = value;
    //     });
    // }

    get children(): List<DisplayObject> {
        return this._children;
    }

    private readonly _children: List<DisplayObject>;

    constructor() {
        super();
        this._children = new List<DisplayObject>();
    }

    public addChild(child: DisplayObject) {
        this._children.add(child);
        child.parent = this;
        child.stage = this.stage;
    }

    public addChildrenAt(child: DisplayObject, index: number) {
        this._children.addAt(child, index);
        child.parent = this;
        child.stage = this.stage;
    }

    public removeChild(child: DisplayObject) {
        this._children.remove(child);
        child.parent = null;
        child.stage = null;
    }

    public removeChildAt(index: number) {
        const child = this._children.at(index);
        if (child) {
            child.parent = null;
            child.stage = null;
            this._children.removeAt(index);
        }
    }

    public removeChildByName(name: string) {
    }

    public getChildAt(index: number): DisplayObject {
        return this._children.at(index);
    }

    public draw() {
        super.draw();
        this._children.each((child: DisplayObject) => {
            child.draw();
        });
    }

}