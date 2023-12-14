import Constants from "./Constants"

export default class GridIterator {

    private _x: number
    private _y: number
    private _visitedCounted: number

    constructor() {
        this._x = 0
        this._y = 0
        this._visitedCounted = 0
    }

    get hasCovered():boolean {
        return this._visitedCounted == Constants.GRID_WIDTH * Constants.GRID_HEIGHT
    }

    next() {
        this._x ++
        if (this._x == Constants.GRID_WIDTH) {
            this._x = 0
            this._y++
            if (this._y == Constants.GRID_HEIGHT)
                this._y = 0
        }

        this._visitedCounted ++

        return [this._x, this._y]
    }

    resetStartPoint() {
        this._visitedCounted = 0
    }

}