import GameObject from './GameObject';

export default class Drone extends GameObject{
	constructor(controller, ID, map) {
		super(controller, ID, map);
		controller.actions = ["Scan", "moveUp", "moveDown", "moveLeft", "moveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
		this.type = "Drone";
	}

	scan() {
		var scanResult = this.map.scanFor(this.ID);
		this.controller.scanResult = scanResult;
	}

	pullUp() {
		var toPull = this.map.getNextObjectUpFrom(this.ID);
		this.map.move(toPull, 0, -1);
	}

	pullDown() {
		var toPull = this.map.getNextObjectDownFrom(this.ID);
		this.map.move(toPull, 0, 1);
	}

	pullLeft() {
		var toPull = this.map.getNextObjectLeftFrom(this.ID);
		this.map.move(toPull, 1, 0);
	}

	pullRight() {
		var toPull = this.map.getNextObjectRightFrom(this.ID);
		this.map.move(toPull, -1, 0);
	}

	pushUp() {
		var toPush = this.map.getNextObjectUpFrom(this.ID);
		this.map.move(toPush, 0, -1);
	}

	pushDown() {
		var toPush = this.map.getNextObjectDownFrom(this.ID);
		this.map.move(toPush, 0, 1);
	}

	pushLeft() {
		var toPush = this.map.getNextObjectLeftFrom(this.ID);
		this.map.move(toPush, -1, 0);
	}

	pushRight() {
		var toPush = this.map.getNextObjectRightFrom(this.ID);
		this.map.move(toPush, 1, 0);
	}

	perform(action) {
		switch(action){
			case "moveUp":
				this.moveUp();
				break;
			case "moveDown":
				this.moveDown();
				break;
			case "moveLeft":
				this.moveLeft();
				break;
			case "moveRight":
				this.moveRight();
				break;
			case "PullUp":
				this.pullUp();
				break;
			case "PullDown":
				this.pullDown();
				break;
			case "PullLeft":
				this.pullLeft();
				break;
			case "PullRight":
				this.pullRight();
				break;
			case "PushUp":
				this.pushUp();
				break;
			case "PushDown":
				this.pushDown();
				break;
			case "PushLeft":
				this.pushLeft();
				break;
			case "PushRight":
				this.pushRight();
				break;
			case "Scan":
				this.scan();
				break;
			default:
		}
	}
}
