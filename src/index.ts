import { finished } from "stream";
import Grid from "./Grid"
import GridIterator from "./GridIterator";
import { easyGrids, hardGrids, normalGrids } from "./grids"
import Mask from "./Mask";
import Constants from "./Constants";

const grid = Grid.fromString(easyGrids[0])
console.log("initial grid", grid.toString());

const unitMask = Mask.fromGrid(grid)
console.log("initial mask", unitMask.clone().toString());

const numberMasks = new Map<number, Mask>()
Constants.UNITY.forEach(e => numberMasks.set(e, unitMask.clone()))

const time = new Date()

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

let found = false

do {
    found = false
    Constants.UNITY.forEach(e => {
        const mask = numberMasks.get(e)
        for (let br = 0; br < Constants.BLOCK_HEIGHT; br++) {
            for (let bc = 0; bc < Constants.BLOCK_WIDTH; bc++) {
                const coords = mask?.analyseBlock(bc, br)
                if (coords?.length === 1) {
                    const { r, c } = coords[0]
                    mask?.hideRow(r)
                    mask?.hideCol(c)
                    for (const otherMask of numberMasks.values()) {
                        otherMask.hideCell(c, r)
                    }
                    grid.setCell(c, r, e)
                    found = true
                } else if (coords?.length || 9 <= 3) {
                    let lr = -1
                    let lc = -1
                    for (let i = 0; i < (coords?.length || 0); i++) {
                        if (i === 0) {
                            lr = coords?.at(i)?.r || -1
                            lc = coords?.at(i)?.c || -1
                        } else {
                            if (coords?.at(i)?.r !== lr) lr = -1
                            if (coords?.at(i)?.c !== lc) lc = -1
                        }

                    }
                    if (lr && lr != -1) mask?.hideRowExcept(lr, coords ?? [])
                    if (lc && lc != -1) mask?.hideColExcept(lc, coords ?? [])
                    
                }
            }
        }
    })
} while (found)

const timeSpent = ((new Date()).getMilliseconds() - time.getMilliseconds())

//console.log("mask 1", numberMasks.get(0)?.toString());
console.log("grid", grid.toString());

console.log("time spent", timeSpent, "ms");

// numberMasks.forEach((v, k) => console.log("mask", k, v.toString()))
// console.log(numberMasks.get(1)?.toString());
