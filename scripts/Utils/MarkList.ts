import Coordinate from './Coordinate';

export default class MarkList {
	private markedArray: Coordinate[];
	private xSize: number;
	private ySize: number;

	public constructor(xSize: number, ySize: number) {
		this.markedArray = [];
		this.xSize = xSize;
		this.ySize = ySize;
	}

	public getMarkedList(): Coordinate[] {
		return this.markedArray;
	}

	public isMarked(position: Coordinate): boolean {
		for (const inv of this.markedArray) {
			if (position.equal(inv)) {
				return true;
			}
		}

		return false;
	}

	public mark(position: Coordinate, numSpread: number): void {
		this.internalMark(position.x, position.y, numSpread);
	}

	private internalMark(x: number, y: number, numSpread: number): void {
		if (numSpread < 0) return;

		// check if the current tile is invalid to avoid adding duplicates
		const marked = this.isMarked(new Coordinate(x, y));
		if (!marked) {
			this.markedArray.push(new Coordinate(x, y));
		}

		// recursively call out in cardinal directions
		this.internalMark((x + 1) % this.xSize, y, numSpread - 1);
		this.internalMark((x - 1 + this.xSize) % this.xSize, y, numSpread - 1);
		this.internalMark(x, (y + 1) % this.ySize, numSpread - 1);
		this.internalMark(x, (y - 1 + this.ySize) % this.ySize, numSpread - 1);
	}
}
