import { vec3 } from 'Engine/Math';

export default class MarkList {
	private markedArray: vec3[];
	public readonly xSize: number;
	public readonly ySize: number;

	public constructor(xSize: number, ySize: number) {
		this.markedArray = [];
		this.xSize = xSize;
		this.ySize = ySize;
	}

	public getMarkedList(): vec3[] {
		return this.markedArray;
	}

	public isMarked(position: vec3): boolean {
		for (const inv of this.markedArray) {
			if (position.exactEquals(inv)) {
				return true;
			}
		}

		return false;
	}

	public mark(position: vec3, numSpread: number): void {
		this.internalMark(position.x, position.y, numSpread);
	}

	private internalMark(x: number, y: number, numSpread: number): void {
		if (numSpread < 0) return;

		// check if the current tile is invalid to avoid adding duplicates
		const marked = this.isMarked(new vec3(x, y));
		if (!marked) {
			this.markedArray.push(new vec3(x, y));
		}

		// recursively call out in cardinal directions
		this.internalMark((x + 1) % this.xSize, y, numSpread - 1);
		this.internalMark((x - 1 + this.xSize) % this.xSize, y, numSpread - 1);
		this.internalMark(x, (y + 1) % this.ySize, numSpread - 1);
		this.internalMark(x, (y - 1 + this.ySize) % this.ySize, numSpread - 1);
	}
}
