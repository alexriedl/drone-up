import { Animation, AnimationType, MoveAnimation } from '../Animations';
import { Controller } from '../Bots/PremadeBots';
import { ICoords, ObjectType } from '../Utils';
import { Model } from '../Model';
import Map from '../Map';

export default class GameObject implements ICoords {
	public readonly ID: string;
	public readonly type: ObjectType;
	public readonly model: Model;
	public readonly controller?: Controller;
	public x: number;
	public y: number;
	private animation?: Animation;

	public constructor(ID: string, type: ObjectType, model: Model, controller?: Controller, x?: number, y?: number) {
		this.ID = ID;
		this.type = type;
		this.x = x || 0;
		this.y = y || 0;

		if (controller) {
			this.controller = controller;
			this.controller.setActions(['MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight']);
		}
	}

	public render(): void {
		if(this.animation) this.model.renderAnimation(this.animation);
		else this.model.render();
	}

	public updateAnimation(deltaTime: number): boolean {
		if(!this.animation) return true;

		const finished = this.animation.update(deltaTime);
		if(finished) this.animation = undefined;

		return finished;
	}

	public moveUp(map: Map, animationType?: AnimationType): GameObject[] {
		return this.move(0, -1, map, animationType);
	}

	public moveDown(map: Map, animationType?: AnimationType): GameObject[] {
		return this.move(0, 1, map, animationType);
	}

	public moveLeft(map: Map, animationType?: AnimationType): GameObject[] {
		return this.move(-1, 0, map, animationType);
	}

	public moveRight(map: Map, animationType?: AnimationType): GameObject[] {
		return this.move(1, 0, map, animationType);
	}

	public perform(action: string, map: Map): GameObject[] {
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

		return [];
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	public move(deltaX: number, deltaY: number, map: Map, animationType: AnimationType = AnimationType.Move): GameObject[] {
		return this.internalMove(deltaX, deltaY, map, animationType);
	}

	/**
	 * If delta(x|y) was greater than 1, wrapCoords does not work correctly
	 */
	protected wrapCoordinates(map: Map): void {
		const xMax = map.getXSize() - 1;
		const yMax = map.getYSize() - 1;

		if (this.x > xMax) {
			this.x = 0;
		}
		if (this.x < 0) {
			this.x = xMax;
		}
		if (this.y > yMax) {
			this.y = 0;
		}
		if (this.y < 0) {
			this.y = yMax;
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

	private internalMove(deltaX: number, deltaY: number, map: Map, animationType: AnimationType,
		possibleAffected?: GameObject[]): GameObject[] {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.x);
		}

		const startPos = { x: this.x, y: this.y };
		this.x += deltaX;
		this.y += deltaY;
		const endPos = { x: this.x, y: this.y };
		this.wrapCoordinates(map);

		this.animation = new MoveAnimation(startPos, endPos, animationType);
		const result: GameObject[] = [this];

		if (this.type !== ObjectType.Drone) {
			const collisions = this.findCollided(possibleAffected);
			for (const go of collisions) {
				// TODO: This needs to be smarter. Perhaps query that object the response of being bumped into.
				if (go.type === ObjectType.Drone) continue;
				result.push.apply(result, go.internalMove(deltaX, deltaY, map, AnimationType.Bump, possibleAffected));
			}
		}

		return result;
	}
}
