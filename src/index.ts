import Grid from "./Grid"
import { easyGrids } from "./grids"

const grid = Grid.fromString(easyGrids[0])
console.log(grid.toString());

Grid.solve(grid)
console.log(grid.toString());
