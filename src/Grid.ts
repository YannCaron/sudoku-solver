import Constants from "./Constants";
import StringBuilder from "./StringBuilder";

type SGrid = number[][];

export default class Grid {

    private readonly _grid: SGrid

    private constructor(grid: SGrid) {
        this._grid = grid
    }

    public getCell(c: number, r: number): number {
        return this._grid[r][c]
    }

    public setCell(c: number, r: number, v: number): void {
        this._grid[r][c] = v
    }

    public isCellEmpty(c: number, r: number) {
        return this._grid[r][c] === 0
    }

    public colFixedCandidates(c: number): Set<number> {
        const set = new Set<number>()

        for (let r = 0; r < Constants.GRID_HEIGHT; r++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    public rowFixedCandidates(r: number): Set<number> {
        const set = new Set<number>()

        for (let c = 0; c < Constants.GRID_WIDTH; c++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    public blockFixedCandidates(c: number, r: number): Set<number> {
        const set = new Set<number>()

        const cellC = Math.ceil(c / Constants.GRID_WIDTH) * Constants.BLOCK_WIDTH
        const cellR = Math.ceil(r / Constants.GRID_HEIGHT) * Constants.BLOCK_HEIGHT

        for (let cr = cellR; cr < cellR + Constants.BLOCK_HEIGHT; cr++) {
            for (let cc = cellC; cc < cellC + Constants.BLOCK_WIDTH; cc++) {
                const v = this.getCell(cc, cr)
                if (v !== 0)
                    set.add(v)
            }
        }

        return set
    }

    public cellFixedCandidates(c: number, r: number): Set<number> {
        return new Set<number>([
            ...this.colFixedCandidates(c),
            ...this.rowFixedCandidates(r),
            ...this.blockFixedCandidates(c, r)
        ])
    }

    public candidates(c: number, r: number): Set<number> {
        if (!this.isCellEmpty(c, r))
            return new Set<number>()

        const filled = this.cellFixedCandidates(c, r)
        return new Set<number>(Constants.UNITY.filter(e => !filled.has(e)))
    }

    public isSolved(): boolean {
        for (let r = 0; r < Constants.BLOCK_HEIGHT; r++) {
            for (let c = 0; c < Constants.BLOCK_WIDTH; c++) {
                if (!this.isCellEmpty(c, r))
                    return false
            }
        }

        return true
    }

    public clone() {
        return new Grid([...this._grid])
    }

    public toString(): string {
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