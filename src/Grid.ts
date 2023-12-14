import StringBuilder from "./StringBuilder";

type SGrid = number[][];

export default class Grid {

    private static readonly UNITY = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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

        for (let r = 0; r < 9; r++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    public rowFixedCandidates(r: number): Set<number> {
        const set = new Set<number>()

        for (let c = 0; c < 9; c++) {
            const v = this.getCell(c, r)
            if (v !== 0)
                set.add(v)
        }
        return set
    }

    public blockFixedCandidates(c: number, r: number): Set<number> {
        const set = new Set<number>()

        const cellC = Math.ceil(c / 9) * 3
        const cellR = Math.ceil(r / 9) * 3

        for (let cr = cellR; cr < cellR + 3; cr++) {
            for (let cc = cellC; cc < cellC + 3; cc++) {
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
        return new Set<number>(Grid.UNITY.filter(e => !filled.has(e)))
    }

    public cellRemains(): boolean {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!this.isCellEmpty(c, r))
                    return true
            }
        }

        return false
    }

    public getNextLowestCandidateCell(): { c: number, r: number, count: number } {
        let lowestCandidate = { c: 0, r: 0, count: 9 }

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cellCandidates = this.candidates(c, r)
                console.log(cellCandidates, cellCandidates.size);

                if (cellCandidates.size > 0 && cellCandidates.size < lowestCandidate.count) {
                    lowestCandidate = { c: c, r: r, count: cellCandidates.size }
                }
                //if (lowestCandidate.count === 1)
                //    return lowestCandidate
            }
        }

        return lowestCandidate
    }

    //public getNextCellToEvaluate() {}

    public clone() {
        return new Grid([...this._grid])
    }

    public solveGrid(): boolean {
        let found = false

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cellCandidates = this.candidates(c, r)
                if (cellCandidates.size === 1) {
                    found = true
                    const [first] = cellCandidates
                    this.setCell(c, r, first)
                }
            }
        }

        return found
    }

    public static solve(grid: Grid): void {
        //while (grid.solveGrid()) {
        //}

        if (grid.cellRemains()) {
            console.log('CELL REMAINS !!!!');
            console.log(grid.getNextLowestCandidateCell());
        }
    }

    public toString(): string {
        const st = new StringBuilder()

        st.append('\n')
        for (let r = 0; r < 9; r++) {
            if (r > 0 && r % 3 === 0)
                st.append('-----------+-----------+-----------\n')
            for (let c = 0; c < 9; c++) {
                if (c > 0)
                    st.append(c % 3 === 0 ? '|' : ' ')
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
                { length: 9 },
                (_, i) => arr.slice(i * 9, i * 9 + 9))

        return new Grid(grid)
    }


}