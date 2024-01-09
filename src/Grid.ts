import Constants from "./Constants";
import StringBuilder from "./StringBuilder";

type SGrid = number[][];

export default class Grid {

    private readonly _grid: SGrid

    private constructor(grid: SGrid) {
        this._grid = grid
    }

    get grid():SGrid {
        return this._grid
    }

    getCell(c: number, r: number): number {
        return this._grid[r][c]
    }

    setCell(c: number, r: number, v: number): void {
        this._grid[r][c] = v
    }

    isCellEmpty(c: number, r: number) {
        return this._grid[r][c] === 0
    }

    colFixedCandidates(c: number): Set<number> {
        const set = new Set<number>()

        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    rowFixedCandidates(r: number): Set<number> {
        const set = new Set<number>()

        for (let c = 0; c < Constants.GRID_WIDTH; c++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    blockFixedCandidates(c: number, r: number): Set<number> {
        const set = new Set<number>()

        const cellR = Math.floor(r / Constants.BLOCK_HEIGHT) * Constants.BLOCK_HEIGHT
        const cellC = Math.floor(c / Constants.BLOCK_WIDTH) * Constants.BLOCK_WIDTH

        for (let cr = cellR; cr < cellR + Constants.BLOCK_HEIGHT; cr++) {
            for (let cc = cellC; cc < cellC + Constants.BLOCK_WIDTH; cc++) {
                const v = this.getCell(cc, cr)
                if (v !== 0)
                    set.add(v)
            }
        }

        return set
    }

    cellFixedCandidates(c: number, r: number): Set<number> {
        return new Set<number>([
            ...this.colFixedCandidates(c),
            ...this.rowFixedCandidates(r),
            ...this.blockFixedCandidates(c, r)
        ])
    }

    candidates(c: number, r: number): Set<number> {
        if (!this.isCellEmpty(c, r))
            return new Set<number>()

        const filled = this.cellFixedCandidates(c, r)
        return new Set<number>(Constants.ALPHABET.filter(e => !filled.has(e)))
    }

    isSolved(): boolean {
        for (let r = 0; r < Constants.BLOCK_HEIGHT; r++) {
            for (let c = 0; c < Constants.BLOCK_WIDTH; c++) {
                if (!this.isCellEmpty(c, r))
                    return false
            }
        }

        return true
    }

    clone() {
        return new Grid([...this._grid])
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
                st.append(' ', this._grid[r][c] === 0 ? '.' : this._grid[r][c].toString(), ' ')
            }
            st.append('\n')
        }

        return st.toString()
    }

    static fromString(str: string): Grid {
        const arr = str
            .split('')
            .map(s => s === '.' ? 0 : parseInt(s))

        const grid =
            Array.from(
                { length: Constants.GRID_WIDTH },
                (_, i) => arr.slice(i * Constants.GRID_WIDTH, i * Constants.GRID_HEIGHT + Constants.GRID_WIDTH))

        return new Grid(grid)
    }


}