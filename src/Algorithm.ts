import Grid from "./Grid";

export default abstract class Algorithm {

    private readonly _grid: Grid

    get grid(): Grid {
        return this._grid
    }

    constructor(grid: Grid) {
        this._grid = grid
    }

}