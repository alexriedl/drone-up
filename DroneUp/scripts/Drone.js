class Drone extends GameObject{
	constructor(controller, ID, map) {
		super(controller, ID, map);
		controller.actions = ["Scan", "moveUp", "moveDown", "moveLeft", "moveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
	}

	scan() {
		var scanResult = this.map.ScanFor(this.ID);
		this.controller.ScanResult = scanResult;
	}

	pullUp() {
		var toPull = this.map.GetNextObjectUpFrom(this.ID);
		this.map.move(toPull, -1, 0);
	}

	pullDown() {
		var toPull = this.map.GetNextObjectDownFrom(this.ID);
		this.map.move(toPull, 1, 0);
	}

	pullLeft() {
		var toPull = map.GetNextObjectLeftFrom(this.ID);
		map.move(toPull, 0, 1);
	}

	pullRight() {
		var toPull = this.map.GetNextObjectRightFrom(this.ID);
		this.map.move(toPull, 0, -1);
	}

	pushUp() {
		var toPush =this. map.GetNextObjectUpFrom(this.ID);
		this.map.move(toPush, 1, 0);
	}

	pushDown() {
		var toPush = this.map.GetNextObjectDownFrom(this.ID);
		this.map.move(toPush, -1, 0);
	}

	pushLeft() {
		var toPush = map.GetNextObjectLeftFrom(this.ID);
		map.move(toPush, 0, -1);
	}

	pushRight() {
		var toPush = map.GetNextObjectRightFrom(this.ID);
		map.move(toPush, 0, 1);
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