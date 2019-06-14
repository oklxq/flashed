export default class List<T> {
    public get length(): number {
        return this._list.length;
    }

    private readonly _list: T[];

    constructor() {
        this._list = [];
    }

    add(child: T) {
        this._list.push(child);
    }

    addAt(child: T, index: number) {
        this._list.splice(index, 0, child);
    }

    remove(child: T) {
        const find = this._list.findIndex(o => o === child);
        this._list.splice(find, 1);
    }

    removeAt(index: number) {
        this._list.splice(index, 1);
    }

    at(index) {
        return this._list[index];
    }

    each(cb: (c: T) => void) {
        for (let child of this._list) {
            cb(child);
        }
    }

}