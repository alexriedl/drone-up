import { Controller, IScanResult } from '../Bot';
import { MarkList } from '../../Utils';
import { Model } from '../../Model';
import { MoveAnimation} from '../../Animations';
import { vec2 } from '../../Math';
import BaseObject from './BaseObject';
import GameObject from './GameObject';
import Map from '../Map';
import ScanObject from './ScanObject';

export default class Drone extends GameObject {
	public constructor(model: Model,  controller: Controller) {
		super(model, controller);
		this.canBump = false;

		if (controller) {
			controller.setActions([
				'Scan',
				'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight',
				'PullUp', 'PullDown', 'PullLeft', 'PullRight',
				'PushUp', 'PushDown', 'PushLeft', 'PushRight',
			]);
		}
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

	protected scan(map: Map): BaseObject[] {
		this.controller.scanResult = Drone.scanMap(map, this);
		const scan = new ScanObject(this.position);
		return [scan];
	}

	protected pullUp(map: Map): BaseObject[] {
		const toPull = map.getNextObjectUpFrom(this);
		return toPull.moveDown(map, MoveAnimation.MoveType.Pull);
	}

	protected pullDown(map: Map): BaseObject[] {
		const toPull = map.getNextObjectDownFrom(this);
		return toPull.moveUp(map, MoveAnimation.MoveType.Pull);
	}

	protected pullLeft(map: Map): BaseObject[] {
		const toPull = map.getNextObjectLeftFrom(this);
		return toPull.moveRight(map, MoveAnimation.MoveType.Pull);
	}

	protected pullRight(map: Map): BaseObject[] {
		const toPull = map.getNextObjectRightFrom(this);
		return toPull.moveLeft(map, MoveAnimation.MoveType.Pull);
	}

	protected pushUp(map: Map): BaseObject[] {
		const toPush = map.getNextObjectUpFrom(this);
		return toPush.moveUp(map, MoveAnimation.MoveType.Push);
	}

	protected pushDown(map: Map): BaseObject[] {
		const toPush = map.getNextObjectDownFrom(this);
		return toPush.moveDown(map, MoveAnimation.MoveType.Push);
	}

	protected pushLeft(map: Map): BaseObject[] {
		const toPush = map.getNextObjectLeftFrom(this);
		return toPush.moveLeft(map, MoveAnimation.MoveType.Push);
	}

	protected pushRight(map: Map): BaseObject[] {
		const toPush = map.getNextObjectRightFrom(this);
		return toPush.moveRight(map, MoveAnimation.MoveType.Push);
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
			const type = gameObject === entity ? 'you' : gameObject.constructor.name.toLowerCase();
			const x = gameObject.position.x - entity.position.x;
			const y = gameObject.position.y - entity.position.y;
			return { type, position: new vec2(x, y) };
		});
	}
}
