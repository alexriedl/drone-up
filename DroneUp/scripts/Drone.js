function Drone extends GameObject{
	constructor(controller, Id, map) {
		super(controller, Id, map);
		controller.actions = ["Scan", "moveUp", "moveDown", "moveLeft", "moveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
	}

	Scan() {
		var scanResult = this.map.ScanFor(this.Id);
		this.controller.ScanResult = scanResult;
	}

	PullUp() {
		var toPull = this.map.GetNextObjectUpFrom(this.Id);
		this.map.move(toPull, -1, 0);
	}

	PullDown() {
		var toPull = this.map.GetNextObjectDownFrom(this.Id);
		this.map.move(toPull, 1, 0);
	}

	PullLeft() {
		var toPull = map.GetNextObjectLeftFrom(this.Id);
		map.move(toPull, 0, 1);
	}

	PullRight() {
		var toPull = this.map.GetNextObjectRightFrom(this.Id);
		this.map.move(toPull, 0, -1);
	}

	PushUp() {
		var toPush =this. map.GetNextObjectUpFrom(this.Id);
		this.map.move(toPush, 1, 0);
	}

	PushDown() {
		var toPush = this.map.GetNextObjectDownFrom(this.Id);
		this.map.move(toPush, -1, 0);
	}

	PushLeft() {
		var toPush = map.GetNextObjectLeftFrom(this.Id);
		map.move(toPush, 0, -1);
	}

	PushRight() {
		var toPush = map.GetNextObjectRightFrom(this.Id);
		map.move(toPush, 0, 1);
	}

	Perform() {
		switch(action){
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
				this.PullUp(map);
				break;
			case "PullDown":
				this.PullDown(map);
				break;
			case "PullLeft":
				this.PullLeft(map);
				break;
			case "PullRight":
				this.PullRight(map);
				break;
			case "PushUp":
				this.PushUp(map);
				break;
			case "PushDown":
				this.PushDown(map);
				break;
			case "PushLeft":
				this.PushLeft(map);
				break;
			case "PushRight":
				this.PushRight(map);
				break;
			case "Scan":
				this.Scan(map);
				break;
			default:
		}
	}
}