import { MoveAnimation } from '../../Animations';
import { Model } from '../../Model';
import { vec3 } from '../../Math';
import BaseObject from './BaseObject';
import Drone from './Drone';
import Map from '../Map';

abstract class GameObject extends BaseObject {
	protected canBump: boolean;
	public static PUSH_LIMIT: number = 0;

	public constructor(model: Model, position?: vec3, scale?: vec3) {
		super(model, position, scale);
		this.canBump = true;
	}

	public perform(action: string, map: Map): void {
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
	}

	public moveUp(map: Map, moveType?: any): void {
		return this.move(0, -1, map, moveType);
	}

	public moveDown(map: Map, moveType?: any): void {
		return this.move(0, 1, map, moveType);
	}

	public moveLeft(map: Map, moveType?: any): void {
		return this.move(-1, 0, map, moveType);
	}

	public moveRight(map: Map, moveType?: any): void {
		return this.move(1, 0, map, moveType);
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	protected move(deltaX: number, deltaY: number, map: Map,
		moveType: MoveAnimation.MoveType = MoveAnimation.MoveType.Basic): void {
		if (!GameObject.PUSH_LIMIT) this.internalMove(deltaX, deltaY, map, moveType);
		else this.internalMoveLimit(new vec3(deltaX, deltaY), map, GameObject.PUSH_LIMIT, moveType);
	}

	private internalMove(deltaX: number, deltaY: number, map: Map, moveType: MoveAnimation.MoveType,
		possibleAffected?: GameObject[]): void {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = map.getAllObjectsOnSameY(this.position.y);
			if (deltaY) possibleAffected = map.getAllObjectsOnSameX(this.position.x);
		}

		const startPos = this.position;
		this.position = this.position.addValues(deltaX, deltaY, 0);
		const endPos = this.position;
		this.position = GameObject.wrapCoordinates(this.position, map);

		this.setAnimation(new MoveAnimation(startPos, endPos, undefined, moveType));

		if (!(this instanceof Drone)) {
			const collisions = this.findAt(this.position, possibleAffected);
			for (const go of collisions) {
				// TODO: This needs to be smarter. Perhaps query that object the response of being bumped into.
				if (go instanceof Drone) continue;
				go.internalMove(deltaX, deltaY, map, MoveAnimation.MoveType.Bump, possibleAffected);
			}
		}
	}

	private internalMoveLimit(delta: vec3, map: Map, movesRemaining: number,
		moveType: any, possibleAffected?: GameObject[]): boolean {

		// TODO: If a drone is at the end of a chain, it will prevent the spikes from moving, and survive
		if (movesRemaining <= 0) return false;

		if (!possibleAffected) {
			if (delta.x) possibleAffected = map.getAllObjectsOnSameY(this.position.y);
			if (delta.y) possibleAffected = map.getAllObjectsOnSameX(this.position.x);
		}

		const startPos = this.position;
		let endPos = this.position.add(delta);
		let newPos = GameObject.wrapCoordinates(endPos, map);

		let canMove = true;

		if (this.canBump) {
			const collisions = this.findAt(newPos, possibleAffected);
			for (const go of collisions) {
				const childCanMove = go.internalMoveLimit(delta, map, movesRemaining - 1,
					MoveAnimation.MoveType.Bump, possibleAffected);
				if (!childCanMove) canMove = false;
			}
		}

		if (!canMove) {
			endPos = startPos;
			newPos = startPos;
		}

		this.setAnimation(new MoveAnimation(startPos, endPos, undefined, moveType));
		this.position = newPos;

		return canMove;
	}

	/**
	 * Clips position to map coordinates. Wraps position to oposite side of map if they are off of the board.
	 */
	protected static wrapCoordinates(position: vec3, map: Map): vec3 {
		const xMax = map.xSize - 1;
		const yMax = map.ySize - 1;

		let x = position.x;
		let y = position.y;

		if (x > xMax) x = 0;
		else if (x < 0) x = xMax;

		if (y > yMax) y = 0;
		else if (y < 0) y = yMax;

		return new vec3(x, y);
	}

	private findAt(pos: vec3, tests: GameObject[]): GameObject[] {
		const result = [];
		if (!tests) return result;

		for (const test of tests) {
			if (this !== test && pos.x === test.position.x && pos.y === test.position.y) {
				result.push(test);
			}
		}

		return result;
	}
}

export default GameObject;
