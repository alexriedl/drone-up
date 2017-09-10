import { Animation, AnimationType } from '../Animations';
import { Controller } from '../Bots/PremadeBots';
import { Model } from '../Model';
import { ObjectType } from '../Utils';
import GameObject from './GameObject';
import Map from '../Map';

export default class Drone extends GameObject {
	public constructor(ID: string, model: Model,  controller: Controller) {
		super(ID, ObjectType.Drone, model, controller);
		controller.setActions([
			'Scan',
			'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight',
			'PullUp', 'PullDown', 'PullRight', 'PullLeft',
			'PushUp', 'PushDown', 'PushRight', 'PushLeft',
		]);
	}

	public scan(map: Map): Animation[] {
		const scanResult = map.scanFor(this);
		this.controller.scanResult = scanResult;
		return [];
	}

	public pullUp(map: Map): Animation[] {
		const toPull = map.getNextObjectUpFrom(this);
		return toPull.moveDown(map, AnimationType.Pull);
	}

	public pullDown(map: Map): Animation[] {
		const toPull = map.getNextObjectDownFrom(this);
		return toPull.moveUp(map, AnimationType.Pull);
	}

	public pullLeft(map: Map): Animation[] {
		const toPull = map.getNextObjectLeftFrom(this);
		return toPull.moveRight(map, AnimationType.Pull);
	}

	public pullRight(map: Map): Animation[] {
		const toPull = map.getNextObjectRightFrom(this);
		return toPull.moveLeft(map, AnimationType.Pull);
	}

	public pushUp(map: Map): Animation[] {
		const toPush = map.getNextObjectUpFrom(this);
		return toPush.moveUp(map, AnimationType.Push);
	}

	public pushDown(map: Map): Animation[] {
		const toPush = map.getNextObjectDownFrom(this);
		return toPush.moveDown(map, AnimationType.Push);
	}

	public pushLeft(map: Map): Animation[] {
		const toPush = map.getNextObjectLeftFrom(this);
		return toPush.moveLeft(map, AnimationType.Push);
	}

	public pushRight(map: Map): Animation[] {
		const toPush = map.getNextObjectRightFrom(this);
		return toPush.moveRight(map, AnimationType.Push);
	}

	public perform(action: string, map: Map): Animation[] {
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
}
