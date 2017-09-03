import { Animation, AnimationType, MoveAnimation } from '../Animations';
import { Controller } from '../Bots/PremadeBots';
import { ICoords, ObjectType } from '../Utils';

import Map from '../Map';

export default class GameObject implements ICoords {
	public readonly ID: string;
	public readonly type: ObjectType;
	public readonly controller?: Controller;
	public x: number;
	public y: number;

	public constructor(ID: string, type: ObjectType, controller?: Controller, x?: number, y?: number) {
		this.ID = ID;
		this.type = type;
		this.x = x || 0;
		this.y = y || 0;

		if (controller) {
			this.controller = controller;
			this.controller.setActions(['MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight']);
		}
	}

	public moveUp(map: Map, animationType?: AnimationType): Animation[] {
		return this.move(0, -1, map, animationType);
	}

	public moveDown(map: Map, animationType?: AnimationType): Animation[] {
		return this.move(0, 1, map, animationType);
	}

	public moveLeft(map: Map, animationType?: AnimationType): Animation[] {
		return this.move(-1, 0, map, animationType);
	}

	public moveRight(map: Map, animationType?: AnimationType): Animation[] {
		return this.move(1, 0, map, animationType);
	}

	public perform(action: string, map: Map): Animation[] {
		switch (action) {
			case 'MoveUp':
				return this.moveUp(map);
			case 'MoveDown':
				return this.moveDown(map);
			case 'MoveLeft':
				return this.moveLeft(map);
			case 'MoveRight':
				return this.moveRight(map);
		}

		return null;
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	public move(deltaX: number, deltaY: number, map: Map, animationType?: AnimationType): Animation[] {
		return this.internalMove(deltaX, deltaY, map, undefined, animationType);
	}

	/**
	 * If delta(x|y) was greater than 1, wrapCoords does not work correctly
	 */
	protected wrapCoordinates(map: Map): void {
		if (this.x >= map.getXSize()) {
			this.x = 0;
		}
		if (this.x < 0) {
			this.x = map.getXSize();
		}
		if (this.y >= map.getYSize()) {
			this.y = 0;
		}
		if (this.y < 0) {
			this.y = map.getYSize();
		}
	}

	protected findCollided(tests: GameObject[]): GameObject[] {
		const result = [];
		if (!tests) return result;

		for (const test of tests) {
			if (this.ID !== test.ID && this.x === test.x && this.y === test.y) {
				result.push(test);
			}
		}

		return result;
	}

	private internalMove(deltaX: number, deltaY: number, map: Map, possibleAffected?: GameObject[],
		animationType?: AnimationType): Animation[] {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.x);
		}

		const startPos = { x: this.x, y: this.y };
		this.x += deltaX;
		this.y += deltaY;
		const endPos = { x: this.x, y: this.y };
		this.wrapCoordinates(map);

		const result: Animation[] = [
			new MoveAnimation(this.ID, this.type, startPos, endPos, animationType),
		];

		if (this.type !== ObjectType.Drone) {
			const collisions = this.findCollided(possibleAffected);
			for (const go of collisions) {
				if (go.type === ObjectType.Drone) continue;
				result.push.apply(result, go.internalMove(deltaX, deltaY, map, possibleAffected, AnimationType.Bump));
			}
		}

		return result;
	}
}
