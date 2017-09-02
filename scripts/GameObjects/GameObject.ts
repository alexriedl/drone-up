import { Controller } from '../Bots/PremadeBots';
import { ICoords, IMoveInfo, Animation } from '../Utils';
import Map from '../Map';

export default class GameObject implements ICoords {
	public readonly ID: string
	public readonly type: string;
	public readonly controller?: Controller;
	public x: number;
	public y: number;

	public constructor(ID: string, type: string, controller?: Controller, x?: number, y?: number) {
		this.ID = ID;
		this.type = type;
		this.x = x || 0;
		this.y = y || 0;

		if (controller) {
			this.controller = controller;
			this.controller.setActions(["MoveUp", "MoveDown", "MoveLeft", "MoveRight"]);
		}
	}

	public moveUp(map: Map): void {
		map.move(this.ID, 1, 0);
	}

	public moveDown(map: Map): void {
		map.move(this.ID, -1, 0);
	}

	public moveLeft(map: Map): void {
		map.move(this.ID, 0, -1);
	}

	public moveRight(map: Map): void {
		map.move(this.ID, 0, 1);
	}

	public perform(action: string, map: Map): void {
		switch (action) {
			case "MoveUp":
				this.moveUp(map);
				break;
			case "MoveDown":
				this.moveDown(map);
				break;
			case "MoveLeft":
				this.moveLeft(map);
				break;
			case "MoveRight":
				this.moveRight(map);
				break;
		}
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	public move(deltaX: number, deltaY: number, map: Map, interalOnly?: GameObject[]): IMoveInfo[] {
		const startPos = { x: this.x, y: this.y };
		this.x += deltaX;
		this.y += deltaY;
		const endPos = { x: this.x, y: this.y }
		this.wrapCoordinates(map);

		let result: IMoveInfo[] = [];

		let possibleAffected = interalOnly;
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.x);

			result = [
				{ startPos: startPos, endPos: endPos, animation: Animation.Move }
			];
		}

		let collisions = this.findCollided(possibleAffected);
		for(let i = 0; i < collisions.length; i++) {
			const go = collisions[i];
			const sp = { x: go.x, y: go.y };
			result.push.apply(result, go.move(deltaX, deltaY, map, possibleAffected));
			const ep = { x: go.x, y: go.y };
			result.push({ startPos: sp, endPos: ep, animation: Animation.Bump });
		}

		return result;
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
		if(!tests || tests.length <= 0) return [];
		return [];
	}
}
