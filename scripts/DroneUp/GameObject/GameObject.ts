import { Animation, MoveAnimation, ResizeAnimation } from 'DroneUp/Animations';
import Drone from './Drone';

import { Model } from 'Engine/Model';
import { vec2, vec3 } from 'Engine/Math';
import { Entity } from 'Engine/Entity';

export default abstract class GameObject extends Entity {
	protected canBump: boolean;
	public static PUSH_LIMIT: number = 0;

	private animation?: Animation;
	private removeAtEndOfAnimation: boolean = false;

	public constructor(model: Model, position: vec3 = new vec3(), scale: vec3 = new vec3(1, 1, 1)) {
		super(model, position, scale);
		this.canBump = true;
	}

	public setAnimation(animation: Animation, removeAtEndOfAnimation: boolean = false): void {
		this.animation = animation;
		this.removeAtEndOfAnimation = removeAtEndOfAnimation;
	}

	public getAnimation(): Animation {
		return this.animation;
	}

	public getRenderingPosition(): vec3 {
		if (this.animation && this.animation instanceof MoveAnimation) {
			return this.animation.position;
		}
		return super.getRenderingPosition();
	}

	public getRenderingScale(): vec3 {
		if (this.animation) {
			if (this.animation instanceof ResizeAnimation) {
				const s = this.animation.size;
				return new vec3(s, s, 1);
			}
			else if (this.animation instanceof MoveAnimation) {
				const bonusSize = this.animation.bonusSize;
				return super.getRenderingScale().addValues(bonusSize, bonusSize, 0);
			}
		}

		return super.getRenderingScale();
	}

	public update(deltaTime: number): boolean {
		const childrenAnimating = super.update(deltaTime);

		if (!this.animation) return childrenAnimating;

		const stillAnimating = this.animation.update(deltaTime);
		if (!stillAnimating) {
			this.animation = undefined;
			if (this.removeAtEndOfAnimation) this.setParent(undefined);
		}

		return stillAnimating || childrenAnimating;
	}

	public perform(action: string, objects: GameObject[], worldSize: vec2): void {
		switch (action) {
			case 'MoveUp':
				return this.moveUp(objects, worldSize);
			case 'MoveDown':
				return this.moveDown(objects, worldSize);
			case 'MoveLeft':
				return this.moveLeft(objects, worldSize);
			case 'MoveRight':
				return this.moveRight(objects, worldSize);
		}
	}

	public moveUp(objects: GameObject[], worldSize: vec2, moveType?: MoveAnimation.MoveType): void {
		return this.move(0, -1, objects, worldSize, moveType);
	}

	public moveDown(objects: GameObject[], worldSize: vec2, moveType?: MoveAnimation.MoveType): void {
		return this.move(0, 1, objects, worldSize, moveType);
	}

	public moveLeft(objects: GameObject[], worldSize: vec2, moveType?: MoveAnimation.MoveType): void {
		return this.move(-1, 0, objects, worldSize, moveType);
	}

	public moveRight(objects: GameObject[], worldSize: vec2, moveType?: MoveAnimation.MoveType): void {
		return this.move(1, 0, objects, worldSize, moveType);
	}

	/**
	 * Returns an array of affected objects. Assumes a change in either x or y direction, but not both.
	 * Also assumes either delta is -1, 0, or 1
	 */
	protected move(deltaX: number, deltaY: number, objects: GameObject[], worldSize: vec2,
		moveType: MoveAnimation.MoveType = MoveAnimation.MoveType.Basic): void {
		if (!GameObject.PUSH_LIMIT) this.internalMove(deltaX, deltaY, objects, worldSize, moveType);
		else this.internalMoveLimit(new vec3(deltaX, deltaY), objects, worldSize, GameObject.PUSH_LIMIT, moveType);
	}

	private internalMove(deltaX: number, deltaY: number, objects: GameObject[], worldSize: vec2,
		moveType: MoveAnimation.MoveType, possibleAffected?: GameObject[]): void {
		if (!possibleAffected) {
			if (deltaX) possibleAffected = this.getAllObjectsOnSameY(objects);
			if (deltaY) possibleAffected = this.getAllObjectsOnSameX(objects);
		}

		const startPos = this.position;
		this.position = this.position.addValues(deltaX, deltaY, 0);
		const endPos = this.position;
		this.position = GameObject.wrapCoordinates(this.position, worldSize);

		this.setAnimation(new MoveAnimation(startPos, endPos, undefined, moveType));

		if (!(this instanceof Drone)) {
			const collisions = GameObject.findAt(this, this.position, possibleAffected);
			for (const go of collisions) {
				// TODO: This needs to be smarter. Perhaps query that object the response of being bumped into.
				if (go instanceof Drone) continue;
				go.internalMove(deltaX, deltaY, objects, worldSize, MoveAnimation.MoveType.Bump, possibleAffected);
			}
		}
	}

	private internalMoveLimit(delta: vec3, objects: GameObject[], worldSize: vec2, movesRemaining: number,
		moveType: MoveAnimation.MoveType, possibleAffected?: GameObject[]): boolean {

		// TODO: If a drone is at the end of a chain, it will prevent the spikes from moving, and survive
		if (movesRemaining <= 0) return false;

		if (!possibleAffected) {
			if (delta.x) possibleAffected = this.getAllObjectsOnSameY(objects);
			if (delta.y) possibleAffected = this.getAllObjectsOnSameX(objects);
		}

		const startPos = this.position;
		let endPos = this.position.add(delta);
		let newPos = GameObject.wrapCoordinates(endPos, worldSize);

		let canMove = true;

		if (this.canBump) {
			const collisions = GameObject.findAt(this, newPos, possibleAffected);
			for (const go of collisions) {
				const childCanMove = go.internalMoveLimit(delta, objects, worldSize, movesRemaining - 1,
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
	protected static wrapCoordinates(position: vec3, worldSize: vec2): vec3 {
		const xMax = worldSize.x - 1;
		const yMax = worldSize.y - 1;

		let x = position.x;
		let y = position.y;

		if (x > xMax) x = 0;
		else if (x < 0) x = xMax;

		if (y > yMax) y = 0;
		else if (y < 0) y = yMax;

		return new vec3(x, y);
	}

	protected getAllObjectsOnSameY(objects: GameObject[]): GameObject[] {
		return objects.filter((go) => go.position.y === this.position.y);
	}

	protected getAllObjectsOnSameX(objects: GameObject[]): GameObject[] {
		return objects.filter((go) => go.position.x === this.position.x);
	}

	private static findAt(entity: GameObject, pos: vec3, tests: GameObject[]): GameObject[] {
		const result = [];
		if (!tests) return result;

		for (const test of tests) {
			if (entity !== test && pos.x === test.position.x && pos.y === test.position.y) {
				result.push(test);
			}
		}

		return result;
	}
}
