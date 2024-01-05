import Constants from "./Constants";
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