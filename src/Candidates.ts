import Constants from "./Constants";
import Coord from "./Coord";
import Grid from "./Grid"
import StringBuilder from "./StringBuilder";

type SCandidates = Set<number>[][];

export default class Candidates {

    private readonly _candidates: SCandidates;

    private constructor(candidates: SCandidates) {
        this._candidates = candidates
    }

    getCell(c: number, r: number):Set<number> {
        return this._candidates[r][c]
    }

    clearCell(c: number, r: number) {
        this._candidates[r][c].clear()
    }

    hideCell(v: number, c: number, r: number) {
        this._candidates[r][c].delete(v)
    }

    hideRow(v: number, r: number) {
        for (let c = 0; c < Constants.GRID_WIDTH; c++) {
            this.hideCell(v, c, r)
        }
    }

    hideRowExcept(v: number, r: number, coords: Coord[]) {
        const backup = coords.map(({ c, r }) => { return { c: c, r: r, v: new Set<number>([...this._candidates[r][c]]) } })

        this.hideRow(v, r)

        backup.forEach(({ c, r, v }) => this._candidates[r][c] = v)
    }

    hideCol(v: number, c: number) {
        for (let r = 0; r < Constants.GRID_WIDTH; r++) {
            this.hideCell(v, c, r)
        }
    }

    hideColExcept(v: number, c: number, coords: Coord[]) {
        const backup = coords.map(({ c, r }) => { return { c: c, r: r, v: new Set<number>([...this._candidates[r][c]]) } })

        this.hideCol(v, c)

        backup.forEach(({ c, r, v }) => this._candidates[r][c] = v)
    }

    hideBlock(v: number, c: number, r: number) {
        const cellR = Math.floor(r / Constants.BLOCK_HEIGHT) * Constants.BLOCK_HEIGHT
        const cellC = Math.floor(c / Constants.BLOCK_WIDTH) * Constants.BLOCK_WIDTH

        for (let cr = cellR; cr < cellR + Constants.BLOCK_HEIGHT; cr++) {
            for (let cc = cellC; cc < cellC + Constants.BLOCK_WIDTH; cc++) {
                this.hideCell(v, cc, cr)
            }
        }
    }


    toString(): string {
        const sb = new StringBuilder()
        sb.append('\n')

        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            if (r > 0 && r % Constants.BLOCK_HEIGHT === 0)
                sb.append('---------------+---------------+---------------\n')

            for (let br = 0; br < 3; br++) {
                for (let c = 0; c < Constants.GRID_WIDTH; c++) {

                    sb.append(' ')
                    for (let bc = 1; bc <= 3; bc++) {
                        const v = br * 3 + bc
                        sb.append(this._candidates[r][c].has(v) ? `${v}` : '.')
                    }

                    sb.append((c + 1) % 3 === 0 && c < 8 ? ' |' : ' ')
                }
                sb.append('\n')
            }

            // TODO: Is it necessary ?
            if ((r + 1) % 3 !== 0)
                sb.append('               |               |               \n')
        }

        return sb.toString()
    }

    static fromGrid(grid: Grid): Candidates {
        const candidates = grid.grid
            .map(r => r
                .map(c => new Set<number>([...Constants.ALPHABET])))

        return new Candidates(candidates)
    }

}