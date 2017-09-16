import { AnimationType } from '../../Animations';
import { Controller, IScanResult } from '../Bot';
import { MarkList } from '../../Utils';
import { Model } from '../../Model';
import { vec2 } from '../../Math';
import BaseObject from './BaseObject';
import GameObject from './GameObject';
import Map from '../Map';
import ScanObject from './ScanObject';

export default class Drone extends GameObject {
	public constructor(ID: string, model: Model,  controller: Controller) {
		super(ID, model, controller);

		if (controller) {
			controller.setActions([
				'Scan',
				'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight',
				'PullUp', 'PullDown', 'PullLeft', 'PullRight',
				'PushUp', 'PushDown', 'PushLeft', 'PushRight',
			]);
		}
	}

	public scan(map: Map): BaseObject[] {
		this.controller.scanResult = Drone.scanMap(map, this);
		const scan = new ScanObject(`${this.ID}-scan`, this.position);
		return [scan];
	}

	public pullUp(map: Map): BaseObject[] {
		const toPull = map.getNextObjectUpFrom(this);
		return toPull.moveDown(map, AnimationType.Pull);
	}

	public pullDown(map: Map): BaseObject[] {
		const toPull = map.getNextObjectDownFrom(this);
		return toPull.moveUp(map, AnimationType.Pull);
	}

	public pullLeft(map: Map): BaseObject[] {
		const toPull = map.getNextObjectLeftFrom(this);
		return toPull.moveRight(map, AnimationType.Pull);
	}

	public pullRight(map: Map): BaseObject[] {
		const toPull = map.getNextObjectRightFrom(this);
		return toPull.moveLeft(map, AnimationType.Pull);
	}

	public pushUp(map: Map): BaseObject[] {
		const toPush = map.getNextObjectUpFrom(this);
		return toPush.moveUp(map, AnimationType.Push);
	}

	public pushDown(map: Map): BaseObject[] {
		const toPush = map.getNextObjectDownFrom(this);
		return toPush.moveDown(map, AnimationType.Push);
	}

	public pushLeft(map: Map): BaseObject[] {
		const toPush = map.getNextObjectLeftFrom(this);
		return toPush.moveLeft(map, AnimationType.Push);
	}

	public pushRight(map: Map): BaseObject[] {
		const toPush = map.getNextObjectRightFrom(this);
		return toPush.moveRight(map, AnimationType.Push);
	}

	public perform(action: string, map: Map): BaseObject[] {
		switch (action) {
			case 'PullUp': return this.pullUp(map);
			case 'PullDown': return this.pullDown(map);
			case 'PullLeft': return this.pullLeft(map);
			case 'PullRight': return this.pullRight(map);
			case 'PushUp': return this.pushUp(map);
			case 'PushDown': return this.pushDown(map);
			case 'PushLeft': return this.pushLeft(map);
			case 'PushRight': return this.pushRight(map);
			case 'Scan': return this.scan(map);
			default:
				return super.perform(action, map);
		}
	}

	protected static scanMap(map: Map, entity: Drone): IScanResult[] {
		const scanDistance = Math.ceil(.33 * Math.min(map.xSize, map.ySize, 15));
		const gameObjectsInRange: GameObject[] = [];
		const markList = new MarkList(map.xSize, map.ySize);

		markList.mark(entity.position, scanDistance);

		for (const scanned of map.getGameObjects()) {
			if (markList.isMarked(scanned.position)) {
				gameObjectsInRange.push(scanned);
			}
		}

		return gameObjectsInRange.map((gameObject) => {
			const type = gameObject.ID === entity.ID ? 'you' : gameObject.constructor.name;
			const x = gameObject.position.x - entity.position.x;
			const y = gameObject.position.y - entity.position.y;
			return { type, position: new vec2(x, y) };
		});
	}
}
