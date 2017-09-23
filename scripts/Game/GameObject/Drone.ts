import { Controller, IScanResult } from '../Bot';
import { MarkList } from '../../Engine/Utils';
import { Model } from '../../Engine/Model';
import { MoveAnimation} from '../Animations';
import { vec2, vec3 } from '../../Engine/Math';
import Entity from '../../Engine/Entity';
import GameObject from './GameObject';
import ScanObject from './ScanObject';

export default class Drone extends GameObject {
	public readonly controller?: Controller;
	public alive: boolean = true;

	public constructor(model: Model,  controller: Controller, position: vec3, scale?: vec3) {
		super(model, position, scale);
		this.canBump = false;
		this.controller = controller;
	}

	public setParent(parent: Entity): void {
		super.setParent(parent);
		if (!parent) this.alive = false;
	}

	public isAlive(): boolean {
		return this.alive;
	}

	public perform(action: string, objects: GameObject[], worldSize: vec2): void {
		switch (action) {
			case 'PullUp': return this.pullUp(objects, worldSize);
			case 'PullDown': return this.pullDown(objects, worldSize);
			case 'PullLeft': return this.pullLeft(objects, worldSize);
			case 'PullRight': return this.pullRight(objects, worldSize);
			case 'PushUp': return this.pushUp(objects, worldSize);
			case 'PushDown': return this.pushDown(objects, worldSize);
			case 'PushLeft': return this.pushLeft(objects, worldSize);
			case 'PushRight': return this.pushRight(objects, worldSize);
			case 'Scan': return this.scan(objects, worldSize);
			default:
				return super.perform(action, objects, worldSize);
		}
	}

	protected scan(objects: GameObject[], worldSize: vec2): void {
		this.controller.scanResult = Drone.scanMap(objects, this, worldSize);

		// tslint:disable-next-line:no-unused-expression
		new ScanObject(this);
	}

	protected pullUp(objects: GameObject[], worldSize: vec2): void {
		const toPull = this.getNextObjectUpFrom(objects);
		return toPull.moveDown(objects, worldSize, MoveAnimation.MoveType.Pull);
	}

	protected pullDown(objects: GameObject[], worldSize: vec2): void {
		const toPull = this.getNextObjectDownFrom(objects);
		return toPull.moveUp(objects, worldSize, MoveAnimation.MoveType.Pull);
	}

	protected pullLeft(objects: GameObject[], worldSize: vec2): void {
		const toPull = this.getNextObjectLeftFrom(objects);
		return toPull.moveRight(objects, worldSize, MoveAnimation.MoveType.Pull);
	}

	protected pullRight(objects: GameObject[], worldSize: vec2): void {
		const toPull = this.getNextObjectRightFrom(objects);
		return toPull.moveLeft(objects, worldSize, MoveAnimation.MoveType.Pull);
	}

	protected pushUp(objects: GameObject[], worldSize: vec2): void {
		const toPush = this.getNextObjectUpFrom(objects);
		return toPush.moveUp(objects, worldSize, MoveAnimation.MoveType.Push);
	}

	protected pushDown(objects: GameObject[], worldSize: vec2): void {
		const toPush = this.getNextObjectDownFrom(objects);
		return toPush.moveDown(objects, worldSize, MoveAnimation.MoveType.Push);
	}

	protected pushLeft(objects: GameObject[], worldSize: vec2): void {
		const toPush = this.getNextObjectLeftFrom(objects);
		return toPush.moveLeft(objects, worldSize, MoveAnimation.MoveType.Push);
	}

	protected pushRight(objects: GameObject[], worldSize: vec2): void {
		const toPush = this.getNextObjectRightFrom(objects);
		return toPush.moveRight(objects, worldSize, MoveAnimation.MoveType.Push);
	}

	protected static scanMap(objects: GameObject[], entity: Drone, worldSize: vec2): IScanResult[] {
		const scanDistance = Math.ceil(.33 * Math.min(worldSize.x, worldSize.y, 15));
		const gameObjectsInRange: GameObject[] = [];
		const markList = new MarkList(worldSize.x, worldSize.y);

		markList.mark(entity.position, scanDistance);

		for (const scanned of objects) {
			if (markList.isMarked(scanned.position)) {
				gameObjectsInRange.push(scanned);
			}
		}

		return gameObjectsInRange.map((gameObject) => {
			const type = gameObject === entity ? 'you' : gameObject.constructor.name.toLowerCase();
			const x = gameObject.position.x - entity.position.x;
			const y = gameObject.position.y - entity.position.y;
			return { type, position: new vec2(x, y) };
		});
	}

	private getNextObjectUpFrom(objects: GameObject[]): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(objects);

		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.y - a.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === this) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	private getNextObjectDownFrom(objects: GameObject[]): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(objects);

		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.y - b.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === this) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	private getNextObjectLeftFrom(objects: GameObject[]): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(objects);

		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.x - a.position.x;
		});

		for (let k = 0; k < sortedObjects.length; k++) {
			if (sortedObjects[k] === this) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	private getNextObjectRightFrom(objects: GameObject[]): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(objects);

		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.x - b.position.x;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === this) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}
}
