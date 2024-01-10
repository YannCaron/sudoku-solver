import Grid from "./Grid";
import MaskingAlgorithm from "./MaskingAlgorithm";
import { easyGrids, hardGrids, normalGrids } from "./grids";

const grid = Grid.fromString(normalGrids[1])
const algo = new MaskingAlgorithm(grid)

algo.debugGrid();

algo.analyze();

//algo.debugMasks();
algo.debugCandidates();
algo.debugGrid();
algo.debugProcess();
