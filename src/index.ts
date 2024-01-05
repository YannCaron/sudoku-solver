import { finished } from "stream";
import Grid from "./Grid"
import GridIterator from "./GridIterator";
import { easyGrids, normalGrids } from "./grids"
import Mask from "./Mask";
import Constants from "./Constants";

const grid = Grid.fromString(easyGrids[17])
console.log(grid.toString());

const unitMask = Mask.fromGrid(grid)
console.log(unitMask.clone().toString());

const numberMasks = new Map<number, Mask>()
Constants.UNITY.forEach(e => numberMasks.set(e, unitMask.clone()))

for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
    for (let c = 0; c < Constants.GRID_WIDTH; c++) {
        if (!grid.isCellEmpty(c, r)) {
            const value = grid.getCell(c, r)
            const mask = numberMasks.get(value)
            mask?.hideRow(r)
            mask?.hideCol(c)
            mask?.hideBlock(c, r)
        }
    }
}

numberMasks.forEach((v, k) => console.log("mask", k, v.toString()))
//console.log(numberMasks.get(1)?.toString());
