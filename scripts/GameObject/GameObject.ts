import { Animation, AnimationType, MoveAnimation } from '../Animations';
import { Controller } from '../Bots/PremadeBots';
import { Coordinate, Enums } from '../Utils';
import { Model } from '../Model';
import Map from '../Map';
import Renderer from '../Renderer';

abstract class GameObject {
	public readonly ID: string;
	public readonly type: Enums.ObjectType;
	public readonly model: Model;
	public readonly controller?: Controller;
	public position: Coordinate;
	private animation?: Animation;

	public constructor(ID: string, type: Enums.ObjectType, model: Model, controller?: Controller, position?: Coordinate) {
		this.ID = ID;
		this.type = type;
		this.position = position;
		this.model = model;

		if (controller) {
			this.controller = controller;
			this.controller.setActions(['MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight']);
		}
	}

	public canRender(): boolean {
		return !!this.model;
	}

	public render(renderer: Renderer): void {
		if (!this.model) return;
		if (this.animation) this.model.renderAnimation(renderer, this.animation);
		else this.model.render(renderer, this.position);
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
		const xMax = map.xSize - 1;
		const yMax = map.ySize - 1;

		if (this.position.x > xMax) {
			this.position.x = 0;
		}
		if (this.position.x < 0) {
			this.position.x = xMax;
		}
		if (this.position.y > yMax) {
			this.position.y = 0;
		}
		if (this.position.y < 0) {
			this.position.y = yMax;
		}
	}

	protected findCollided(tests: GameObject[]): GameObject[] {
		const result = [];
		if (!tests) return result;

		for (const test of tests) {
			if (this.ID !== test.ID && this.position.x === test.position.x && this.position.y === test.position.y) {
				result.push(test);
			}
		}

		return result;
	}

	private internalMove(deltaX: number, deltaY: number, map: Map, animationType: AnimationType,
		possibleAffected?: GameObject[]): GameObject[] {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.position.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.position.x);
		}

		const startPos = this.position.copy();
		this.position.x += deltaX;
		this.position.y += deltaY;
		const endPos = this.position.copy();
		this.wrapCoordinates(map);

		this.animation = new MoveAnimation(startPos, endPos, animationType);
		const result: GameObject[] = [this];

		if (this.type !== Enums.ObjectType.Drone) {
			const collisions = this.findCollided(possibleAffected);
			for (const go of collisions) {
				// TODO: This needs to be smarter. Perhaps query that object the response of being bumped into.
				if (go.type === Enums.ObjectType.Drone) continue;
				result.push.apply(result, go.internalMove(deltaX, deltaY, map, AnimationType.Bump, possibleAffected));
			}
		}

		return result;
	}
}

export default GameObject;
