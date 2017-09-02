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

	public perform(action: string, map: Map): IMoveInfo[] {
		switch (action) {
			case "MoveUp":
				return this.move(0, -1, map);
			case "MoveDown":
				return this.move(0, 1, map);
			case "MoveLeft":
				return this.move(-1, 0, map);
			case "MoveRight":
				return this.move(1, 0, map);
		}

		return null;
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	public move(deltaX: number, deltaY: number, map: Map): IMoveInfo[] {
		return this.internalMove(deltaX, deltaY, map);
	}

	private internalMove(deltaX: number, deltaY: number, map: Map, possibleAffected?: GameObject[], animation?: Animation): IMoveInfo[] {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.x);
		}

		const startPos = { x: this.x, y: this.y };
		this.x += deltaX;
		this.y += deltaY;
		const endPos = { x: this.x, y: this.y }
		this.wrapCoordinates(map);

		let result: IMoveInfo[] = [
			{ ID: this.ID, startPos: startPos, endPos: endPos, curPos: startPos, animation: animation || Animation.Move }
		];

		let collisions = this.findCollided(possibleAffected);
		for(let i = 0; i < collisions.length; i++) {
			const go = collisions[i];
			result.push.apply(result, go.internalMove(deltaX, deltaY, map, possibleAffected, Animation.Bump));
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
		const result = [];
		if (!tests) return result;

		for (let i = 0; i < tests.length; i++) {
			const t = tests[i];
			if (this.ID !== t.ID && this.x === t.x && this.y === t.y) {
				result.push(t);
			}
		}

		return result;
	}
}
