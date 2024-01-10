import Algorithm from "./Algorithm";
import Candidates from "./Candidates";
import Constants from "./Constants";
import Coord from "./Coord";
import Grid from "./Grid";
import Mask from "./Mask";

export default class MaskingAlgorithm extends Algorithm {

    private readonly _masks: Map<number, Mask>
    private readonly _candidates: Candidates

    private _iteration: number = 0
    private _timeSpent: number = 0

    constructor(grid: Grid) {
        super(grid)

        const identityMask = Mask.fromGrid(grid)
        this._candidates = Candidates.fromGrid(grid)

        this._masks = Constants.ALPHABET
            .map(a => ({ a: a, m: identityMask.clone() }))
            .reduce((acc, e) => acc.set(e.a, e.m), new Map<number, Mask>())

    }

    getMaskOf(s: number): Mask {
        const mask = this._masks.get(s)
        if (!mask) throw new Error(`Mask for number ${s} does not exists!`)
        return mask
    }

    analyze() {
        const time = new Date()
        this._iteration = 0

        this.initializeMasks()

        while (this.analyzeAlphabet()) {
            this._iteration++

            console.log('iteration', this._iteration);
        }

        this._timeSpent = ((new Date()).getMilliseconds() - time.getMilliseconds())

    }

    private initializeMasks() {
        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            for (let c = 0; c < Constants.GRID_WIDTH; c++) {
                if (!this.grid.isCellEmpty(c, r)) {
                    const v = this.grid.getCell(c, r)

                    this._candidates.clearCell(c, r)

                    const mask = this.getMaskOf(v)
                    mask.hideRow(r)
                    this._candidates.hideRow(v, r)
                    mask.hideCol(c)
                    this._candidates.hideCol(v, c)
                    mask.hideBlock(c, r)
                    this._candidates.hideBlock(v, c, r)
                }
            }
        }
    }

    private analyzeAlphabet(): boolean {
        let result = false

        Constants.ALPHABET.forEach(s => {
            const mask = this.getMaskOf(s)
            if (this.analyzeBlocks(s, mask))
                result = true
        })

        this.analyseRemaining()

        return result
    }

    private analyzeBlocks(symbol: number, mask: Mask): boolean {
        let result = false

        for (let br = 0; br < Constants.GRID_WIDTH / Constants.BLOCK_HEIGHT; br++) {
            for (let bc = 0; bc < Constants.BLOCK_WIDTH; bc++) {
                const coords = mask.analyseBlock(bc, br)

                if (coords.length === 1) {
                    const { c, r } = coords[0]
                    this.applyFound(symbol, mask, c, r)
                    result = true
                } else if (coords.length <= 3) {
                    const { lr, lc } = this.analyzeOnLine(coords)
                    if (lr !== -1) {
                        mask.hideRowExcept(lr, coords)
                        //this._candidates.hideRowExcept(symbol, lr, coords)
                    }
                    if (lc !== -1) {
                        mask.hideColExcept(lc, coords)
                        //this._candidates.hideColExcept(symbol, lc, coords)
                    }
                }
            }
        }

        return result
    }

    private analyseRemaining() {
        let result = false

        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            for (let c = 0; c < Constants.GRID_WIDTH; c++) {
                const remaining = this._candidates.getCell(c, r)
                if (remaining.size === 1) {
                    const v = remaining.values().next().value
                    const mask = this.getMaskOf(v)
                    this.applyFound(v, mask, c, r)
                    console.log('one remaining candidate', v, c, r);
                    result = true
                }
            }
        }

        return result
    }

    private analyzeOnLine(coords: Coord[]): { lr: number, lc: number } {
        let lr = -1
        let lc = -1
        for (let i = 0; i < coords.length; i++) {
            const coord = coords[i]

            if (i === 0) {
                lr = coord.r
                lc = coord.c
            } else {
                if (coord.r !== lr) lr = -1
                if (coord.c !== lc) lc = -1
            }
        }

        return { lr: lr, lc: lc }
    }

    private applyFound(symbol: number, mask: Mask, c: number, r: number) {
        mask.hideRow(r)
        this._candidates.hideRow(symbol, r)
        mask.hideCol(c)
        this._candidates.hideCol(symbol, c)
        this._candidates.hideBlock(symbol, c, r)

        for (const otherMask of this._masks.values()) {
            otherMask.hideCell(c, r)
        }
        this._candidates.clearCell(c, r)
        this.grid.setCell(c, r, symbol)
    }

    debugGrid() {
        console.log('grid', this.grid.toString());
    }

    debugMasks() {
        this._masks.forEach((v, k) => console.log("mask of", k, v.toString()))
    }

    debugCandidates() {
        console.log('candidates', this._candidates.toString());
    }

    debugProcess() {
        console.log("time spent", this._timeSpent, "ms", "iterations", this._iteration);
    }

}