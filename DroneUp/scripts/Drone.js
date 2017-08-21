function Drone(controller, Id){
	this.Id = Id;
	this.controller = controller;
	controller.actions = ["Scan", "moveUp", "moveDown", "moveLeft", "moveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
};

Drone.prototype = GameObject.prototype;

Drone.prototype.Scan = function(map){
	var scanResult = map.ScanFor(this.Id);
	controller.ScanResult = scanResult;
};

Drone.prototype.PullUp = function(map) {
	var toPull = map.GetNextObjectUpFrom(this.Id);
	map.move(toPull, -1, 0);
};

Drone.prototype.PullDown = function(map) {
	var toPull = map.GetNextObjectDownFrom(this.Id);
	map.move(toPull, 1, 0);
};

Drone.prototype.PullLeft = function(map) {
	var toPull = map.GetNextObjectLeftFrom(this.Id);
	map.move(toPull, 0, 1);
};

Drone.prototype.PullRIght = function(map) {
	var toPull = map.GetNextObjectRightFrom(this.Id);
	map.move(toPull, 0, -1);
};

Drone.prototype.PushUp = function(map) {
	var toPush = map.GetNextObjectUpFrom(this.Id);
	map.move(toPush, 1, 0);
};

Drone.prototype.PushDown = function(map) {
	var toPush = map.GetNextObjectDownFrom(this.Id);
	map.move(toPush, -1, 0);
};

Drone.prototype.PushLeft = function(map) {
	var toPush = map.GetNextObjectLeftFrom(this.Id);
	map.move(toPush, 0, -1);
};

Drone.prototype.PushRight = function(map) {
	var toPush = map.GetNextObjectRightFrom(this.Id);
	map.move(toPush, 0, 1);
};

Drone.prototype.Perform = function(action, map) {
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
};