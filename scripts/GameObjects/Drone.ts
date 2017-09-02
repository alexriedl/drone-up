import { Controller } from '../Bots/PremadeBots';
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

	public pullUp(map: Map): void {
		var toPull = map.getNextObjectUpFrom(this.ID);
		map.move(toPull, 0, -1);
	}

	public pullDown(map: Map): void {
		var toPull = map.getNextObjectDownFrom(this.ID);
		map.move(toPull, 0, 1);
	}

	public pullLeft(map: Map): void {
		var toPull = map.getNextObjectLeftFrom(this.ID);
		map.move(toPull, 1, 0);
	}

	public pullRight(map: Map): void {
		var toPull = map.getNextObjectRightFrom(this.ID);
		map.move(toPull, -1, 0);
	}

	public pushUp(map: Map): void {
		var toPush = map.getNextObjectUpFrom(this.ID);
		map.move(toPush, 0, -1);
	}

	public pushDown(map: Map): void {
		var toPush = map.getNextObjectDownFrom(this.ID);
		map.move(toPush, 0, 1);
	}

	public pushLeft(map: Map): void {
		var toPush = map.getNextObjectLeftFrom(this.ID);
		map.move(toPush, -1, 0);
	}

	public pushRight(map: Map): void {
		var toPush = map.getNextObjectRightFrom(this.ID);
		map.move(toPush, 1, 0);
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
			case "PullUp":
				this.pullUp(map);
				break;
			case "PullDown":
				this.pullDown(map);
				break;
			case "PullLeft":
				this.pullLeft(map);
				break;
			case "PullRight":
				this.pullRight(map);
				break;
			case "PushUp":
				this.pushUp(map);
				break;
			case "PushDown":
				this.pushDown(map);
				break;
			case "PushLeft":
				this.pushLeft(map);
				break;
			case "PushRight":
				this.pushRight(map);
				break;
			case "Scan":
				this.scan(map);
				break;
			default:
		}
	}
}
