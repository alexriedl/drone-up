import { vec2 } from 'Engine/Math';

export enum Direction { RIGHT = 'RIGHT', LEFT = 'LEFT', UP = 'UP', DOWN = 'DOWN' }

export namespace Direction {
	export function getOpposite(d: Direction): Direction {
		switch (d) {
			case Direction.RIGHT: return Direction.LEFT;
			case Direction.LEFT: return Direction.RIGHT;
			case Direction.UP: return Direction.DOWN;
			case Direction.DOWN: return Direction.UP;
		}
	}

	export function isOpposite(d1: Direction, d2: Direction): boolean {
		return Direction.getOpposite(d1) === d2;
	}

	export function getVector(d: Direction): vec2 {
		switch (d) {
			case Direction.RIGHT: return new vec2(+1, +0);
			case Direction.LEFT: return new vec2(-1, +0);
			case Direction.UP: return new vec2(+0, -1);
			case Direction.DOWN: return new vec2(+0, +1);
		}
	}

	export function fromVector(d: vec2): Direction {
		if (d.x > 0) return Direction.RIGHT;
		if (d.x < 0) return Direction.LEFT;
		if (d.y > 0) return Direction.DOWN;
		if (d.y < 0) return Direction.UP;
	}
}

export default Direction;
