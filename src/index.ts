import Grid from "./Grid"
import { easyGrids } from "./grids"

const grid = Grid.fromString(easyGrids[0])
//console.log(grid.toString());

console.log('grid candidates', grid.candidates(4, 4));

//console.log(grid.toString());
