import Random from './Random';

export default class Coordinate {
	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public equal(other: Coordinate): boolean {
		return this.x === other.x && this.y === other.y;
	}

	public copy(): Coordinate {
		return Coordinate.copy(this);
	}

	public vec3(): TSM.vec3 {
		return new TSM.vec3([this.x, this.y, 0]);
	}

	public static random(randomizer: Random, xMax: number, yMax: number): Coordinate {
		const x = randomizer.nextRangeInt(0, xMax);
		const y = randomizer.nextRangeInt(0, yMax);
		return new Coordinate(x, y);
	}

	public static copy(original: Coordinate): Coordinate {
		return new Coordinate(original.x, original.y);
	}
}
