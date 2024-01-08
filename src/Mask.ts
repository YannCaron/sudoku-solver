import Constants from "./Constants";
import Grid from "./Grid";
import StringBuilder from "./StringBuilder";

type Coord = { r: number, c: number }
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
        const backup = coords.map(({r, c}) => { return {r: r, c: c, v: this._mask[r][c]} })

        this.hideRow(r)

        backup.forEach(({r, c, v}) => this._mask[r][c] = v)
    }

    hideCol(c: number) {
        for (let r = 0; r < Constants.GRID_WIDTH; r++) {
            this.hideCell(c, r)
        }
    }

    hideColExcept(c: number, coords: Coord[]) {
        const backup = coords.map(({r, c}) => { return {r: r, c: c, v: this._mask[r][c]} })

        this.hideCol(c)

        backup.forEach(({r, c, v}) => this._mask[r][c] = v)
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

    clone(): Mask {
        return new Mask(Mask.cloneData(this._mask))
    }

    toString(): string {
        const st = new StringBuilder()

        st.append('\n')
        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            if (r > 0 && r % Constants.BLOCK_HEIGHT === 0)
                st.append('-----------+-----------+-----------\n')
            for (let c = 0; c < Constants.GRID_WIDTH; c++) {
                if (c > 0)
                    st.append(c % Constants.BLOCK_WIDTH === 0 ? '|' : ' ')
                st.append(' ', this._mask[r][c] === true ? ' ' : '#', ' ')
            }
            st.append('\n')
        }

        return st.toString()
    }

    static fromGrid(grid: Grid): Mask {
        const mask = grid.grid
            .map(r => r
                .map(e => e === 0))

        return new Mask(mask)
    }
}