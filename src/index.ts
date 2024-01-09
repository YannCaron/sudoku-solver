import Grid from "./Grid";
import MaskingAlgorithm from "./MaskingAlgorithm";
import { easyGrids } from "./grids";

const grid = Grid.fromString(easyGrids[0])
const algo = new MaskingAlgorithm(grid)

algo.analyze();

algo.debugMasks();
algo.debugGrid();
algo.debugProcess();
