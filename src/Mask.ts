import Constants from "./Constants";
import Coord from "./Coord";
import Grid from "./Grid";
import StringBuilder from "./StringBuilder";

type SMask = boolean[][];

export default class Mask {

    private readonly _mask: SMask

    private constructor(mask: SMask) {
        this._mask = mask
    }

    static cloneData(mask: boolean[][] | boolean[]): SMask {
        return mask.map((e: any) => Array.isArray(e) ? this.cloneData(e) : e)
    }

    hideCell(c: number, r: number) {
        this._mask[r][c] = false
    }

    hideRow(r: number) {
        for (let c = 0; c < Constants.GRID_WIDTH; c++) {
            this.hideCell(c, r)
        }
    }

    hideRowExcept(r: number, coords: Coord[]) {
        const backup = coords.map(({ c, r }) => { return { c: c, r: r, v: this._mask[r][c] } })

        this.hideRow(r)

        backup.forEach(({ c, r, v }) => this._mask[r][c] = v)
    }

    hideCol(c: number) {
        for (let r = 0; r < Constants.GRID_WIDTH; r++) {
            this.hideCell(c, r)
        }
    }

    hideColExcept(c: number, coords: Coord[]) {
        const backup = coords.map(({ c, r }) => { return { c: c, r: r, v: this._mask[r][c] } })

        this.hideCol(c)

        backup.forEach(({ c, r, v }) => this._mask[r][c] = v)
    }

    hideBlock(c: number, r: number) {
        const cellR = Math.floor(r / Constants.BLOCK_HEIGHT) * Constants.BLOCK_HEIGHT
        const cellC = Math.floor(c / Constants.BLOCK_WIDTH) * Constants.BLOCK_WIDTH

        for (let cr = cellR; cr < cellR + Constants.BLOCK_HEIGHT; cr++) {
            for (let cc = cellC; cc < cellC + Constants.BLOCK_WIDTH; cc++) {
                this.hideCell(cc, cr)
            }
        }
    }

    analyseBlock(bc: number, br: number): Coord[] {
        const cellR = br * Constants.BLOCK_HEIGHT
        const cellC = bc * Constants.BLOCK_WIDTH

        const freeCells = []

        for (let cr = cellR; cr < cellR + Constants.BLOCK_HEIGHT; cr++) {
            for (let cc = cellC; cc < cellC + Constants.BLOCK_WIDTH; cc++) {
                if (this._mask[cr][cc]) {
                    freeCells.push({ r: cr, c: cc })
                }
            }
        }

        return freeCells
    }

    remainsOnRow(r: number): Coord[] {
        const remains = new Array<Coord>()

        for (let c = 0; c < Constants.GRID_WIDTH; c++) {
            if (!this._mask[r][c]) remains.push({ c: c, r: r })
        }
        return remains
    }

    remainsOnCol(c: number): Coord[] {
        const remains = new Array<Coord>()

        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            if (this._mask[r][c]) remains.push({ c: c, r: r })
        }
        return remains
    }

    clone(): Mask {
        return new Mask(Mask.cloneData(this._mask))
    }

    toString(): string {
        const sb = new StringBuilder()

        sb.append('\n')
        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            if (r > 0 && r % Constants.BLOCK_HEIGHT === 0)
                sb.append('-----------+-----------+-----------\n')
            for (let c = 0; c < Constants.GRID_WIDTH; c++) {
                if (c > 0)
                    sb.append(c % Constants.BLOCK_WIDTH === 0 ? '|' : ' ')
                sb.append(' ', this._mask[r][c] === true ? ' ' : '#', ' ')
            }
            sb.append('\n')
        }

        return sb.toString()
    }

    static fromGrid(grid: Grid): Mask {
        const mask = grid.grid
            .map(r => r
                .map(e => e === 0))

        return new Mask(mask)
    }
}