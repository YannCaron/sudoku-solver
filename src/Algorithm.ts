import Constants from "./Constants";
import Grid from "./Grid";
import Mask from "./Mask";

export default abstract class Algorithm {

    private readonly _grid: Grid

    get grid(): Grid {
        return this._grid
    }

    constructor(grid: Grid) {
        this._grid = grid
    }

}