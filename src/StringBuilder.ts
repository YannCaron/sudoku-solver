export default class StringBuilder {

	protected _array: Array<string>

	constructor(array: Array<string> = new Array<string>()) {
		this._array = array
	}

	get isEmpty(): boolean {
		return this.length === 0
	}

	get length(): number {
		return this._array.length
	}

	append(...str: Array<string>): StringBuilder {
		for (const s of str) {
			this._array.push(s)
		}
		return this
	}

	repeat(str:string, count: number = 1): StringBuilder {
		for (let i = 0; i < count; i++) {
			this._array.push(str)
		}
		return this
	}

	splice(i: number):void {
		this._array.splice(i)
	}

	toString(): string {
		return this._array.join("")
	}

}
