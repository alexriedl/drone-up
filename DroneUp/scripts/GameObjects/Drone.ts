import { Controller } from '../Bots/PremadeBots';
import Entity from './Entity';
import Map from '../Map';

export default class Drone extends Entity {
	public constructor(controller: Controller, ID: string) {
		super(controller, "Drone", ID);
		controller.setActions(["Scan", "moveUp", "moveDown", "moveLeft", "moveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"]);
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
			case "moveUp":
				this.moveUp(map);
				break;
			case "moveDown":
				this.moveDown(map);
				break;
			case "moveLeft":
				this.moveLeft(map);
				break;
			case "moveRight":
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
