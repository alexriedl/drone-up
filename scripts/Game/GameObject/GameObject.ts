import { MoveAnimation } from '../../Animations';
import { Controller } from '../Bot';
import { Model } from '../../Model';
import { vec2 } from '../../Math';
import BaseObject from './BaseObject';
import Drone from './Drone';
import Map from '../Map';

abstract class GameObject extends BaseObject {
	public readonly controller?: Controller;
	protected canBump: boolean;
	public static PUSH_LIMIT: number = 5;

	public constructor(ID: string, model: Model, controller?: Controller, position?: vec2) {
		super(ID, position, model);
		this.canBump = true;

		if (controller) {
			this.controller = controller;
			this.controller.setActions(['MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight']);
		}
	}

	public perform(action: string, map: Map): BaseObject[] {
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

	public moveUp(map: Map, moveType?: any): BaseObject[] {
		return this.move(0, -1, map, moveType);
	}

	public moveDown(map: Map, moveType?: any): BaseObject[] {
		return this.move(0, 1, map, moveType);
	}

	public moveLeft(map: Map, moveType?: any): BaseObject[] {
		return this.move(-1, 0, map, moveType);
	}

	public moveRight(map: Map, moveType?: any): BaseObject[] {
		return this.move(1, 0, map, moveType);
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	protected move(deltaX: number, deltaY: number, map: Map,
		moveType: any = MoveAnimation.MoveTypeBasic): BaseObject[] {
		if (!GameObject.PUSH_LIMIT) return this.internalMove(deltaX, deltaY, map, moveType);
		else return this.internalMoveLimit(new vec2(deltaX, deltaY), map, GameObject.PUSH_LIMIT, moveType).objects;
	}

	private internalMove(deltaX: number, deltaY: number, map: Map, moveType: any,
		possibleAffected?: GameObject[]): BaseObject[] {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.position.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.position.x);
		}

		const startPos = this.position;
		this.position = this.position.addValues(deltaX, deltaY);
		const endPos = this.position;
		this.position = GameObject.wrapCoordinates(this.position, map);

		this.setAnimation(new MoveAnimation(startPos, endPos, undefined, moveType));
		const result: BaseObject[] = [this];

		if (!(this instanceof Drone)) {
			const collisions = this.findAt(this.position, possibleAffected);
			for (const go of collisions) {
				// TODO: This needs to be smarter. Perhaps query that object the response of being bumped into.
				if (go instanceof Drone) continue;
				result.push.apply(result, go.internalMove(deltaX, deltaY, map, MoveAnimation.MoveTypeBump, possibleAffected));
			}
		}

		return result;
	}

	private internalMoveLimit(delta: vec2, map: Map, movesRemaining: number,
		moveType: any, possibleAffected?: GameObject[]): IMoveResult {
		// TODO: If a drone is at the end of a chain, it will prevent the spikes from moving, and survive
		if (movesRemaining <= 0) return { canMove: false, objects: [] };
		if (!possibleAffected) {
			if (delta.x) possibleAffected = map.getAllObjectsOnSameY(this.position.y);
			if (delta.y) possibleAffected = map.getAllObjectsOnSameX(this.position.x);
		}

		const startPos = this.position;
		let endPos = this.position.add(delta);
		let newPos = GameObject.wrapCoordinates(endPos, map);

		const result = { canMove: true, objects: [] };

		if (this.canBump) {
			const collisions = this.findAt(newPos, possibleAffected);
			for (const go of collisions) {
				const childResult = go.internalMoveLimit(delta, map, movesRemaining - 1,
					MoveAnimation.MoveTypeBump, possibleAffected);
				if (!childResult.canMove) result.canMove = false;
				result.objects = childResult.objects;
			}
		}

		if (!result.canMove) {
			endPos = startPos;
			newPos = startPos;
		}

		this.setAnimation(new MoveAnimation(startPos, endPos, undefined, moveType));
		this.position = newPos;
		result.objects.push(this);

		return result;
	}

	/**
	 * Clips position to map coordinates. Wraps position to oposite side of map if they are off of the board.
	 */
	protected static wrapCoordinates(position: vec2, map: Map): vec2 {
		const xMax = map.xSize - 1;
		const yMax = map.ySize - 1;

		let x = position.x;
		let y = position.y;

		if (x > xMax) x = 0;
		else if (x < 0) x = xMax;

		if (y > yMax) y = 0;
		else if (y < 0) y = yMax;

		return new vec2(x, y);
	}

	private findAt(pos: vec2, tests: GameObject[]): GameObject[] {
		const result = [];
		if (!tests) return result;

		for (const test of tests) {
			if (this.ID !== test.ID && pos.x === test.position.x && pos.y === test.position.y) {
				result.push(test);
			}
		}

		return result;
	}
}

interface IMoveResult {
	canMove: boolean;
	objects: GameObject[];
}

export default GameObject;
