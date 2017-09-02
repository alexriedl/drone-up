import { Controller } from '../Bots/PremadeBots';
import { IMoveInfo, Animation } from '../Utils';
import GameObject from './GameObject';
import Map from '../Map';

export default class Drone extends GameObject {
	public constructor(ID: string, controller: Controller) {
		super(ID, "Drone", controller);
		controller.setActions(["Scan", "MoveUp", "MoveDown", "MoveLeft", "MoveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"]);
	}

	public scan(map: Map): void {
		var scanResult = map.scanFor(this.ID);
		this.controller.scanResult = scanResult;
	}

	public pullUp(map: Map): IMoveInfo[] {
		const toPull = map.getNextObjectUpFrom(this);
		return toPull.moveDown(map, Animation.Pull);
	}

	public pullDown(map: Map): IMoveInfo[] {
		var toPull = map.getNextObjectDownFrom(this);
		return toPull.moveUp(map, Animation.Pull);
	}

	public pullLeft(map: Map): IMoveInfo[] {
		var toPull = map.getNextObjectLeftFrom(this);
		return toPull.moveRight(map, Animation.Pull);
	}

	public pullRight(map: Map): IMoveInfo[] {
		var toPull = map.getNextObjectRightFrom(this);
		return toPull.moveLeft(map, Animation.Pull);
	}

	public pushUp(map: Map): IMoveInfo[] {
		var toPush = map.getNextObjectUpFrom(this);
		return toPush.moveUp(map, Animation.Push);
	}

	public pushDown(map: Map): IMoveInfo[] {
		var toPush = map.getNextObjectDownFrom(this);
		return toPush.moveDown(map, Animation.Push);
	}

	public pushLeft(map: Map): IMoveInfo[] {
		var toPush = map.getNextObjectLeftFrom(this);
		return toPush.moveLeft(map, Animation.Push);
	}

	public pushRight(map: Map): IMoveInfo[] {
		var toPush = map.getNextObjectRightFrom(this);
		return toPush.moveRight(map, Animation.Push);
	}

	public perform(action: string, map: Map): IMoveInfo[] {
		switch (action) {
			case "PullUp": return this.pullUp(map);
			case "PullDown": return this.pullDown(map);
			case "PullLeft": return this.pullLeft(map);
			case "PullRight": return this.pullRight(map);
			case "PushUp": return this.pushUp(map);
			case "PushDown": return this.pushDown(map);
			case "PushLeft": return this.pushLeft(map);
			case "PushRight": return this.pushRight(map);
			case "Scan":
				this.scan(map);
				break;
			default:
				return super.perform(action, map);
		}
	}
}
