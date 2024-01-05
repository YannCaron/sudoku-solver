import { finished } from "stream";
import Grid from "./Grid"
import GridIterator from "./GridIterator";
import { easyGrids, normalGrids } from "./grids"

const grid = Grid.fromString(easyGrids[17])
console.log(grid.toString());


function resolve(grid: Grid, c: number = 0, r: number = 0): Grid | undefined {
    let finished = true
    let hasResolved = false
    let count = 0
    let next

    const it = new GridIterator()
    while (!it.hasCovered) {
        const coord = it.next()
        const candidates = grid.candidates(...coord)

        if (candidates.size == 2 && next === undefined) {
            next = { coord: coord, candidates: candidates }
        }

        if (candidates.size == 1) {
            grid.setCell(...coord, candidates.values().next().value)
            hasResolved = true
            count++
        } else if (candidates.size > 1) {
            finished = false
        }
    }

    if (finished) return grid

    console.log(grid.toString());
    console.log('resolved', count);
    if (hasResolved) resolve(grid)
    else if (next) {
        const vit = next.candidates.values()

        const grid1 = grid.clone()
        grid1.setCell(...next.coord, vit.next().value)
        const resGrid1 = resolve(grid1, ...next.coord)
        if (resGrid1) return resGrid1

        const grid2 = grid.clone()
        grid1.setCell(...next.coord, vit.next().value)
        const resGrid2 = resolve(grid2, ...next.coord)
        if (resGrid2) return resGrid2
    }
}

resolve(grid)


