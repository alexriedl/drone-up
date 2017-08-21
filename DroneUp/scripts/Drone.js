function Drone(controller, Id){
	this.Id = Id;
	this.controller = controller;
	controller.actions = ["Scan", "MoveUp", "MoveDown", "MoveLeft", "MoveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
};

Drone.prototype = GameObject.prototype;

Drone.prototype.Scan = function(map){
	var scanResult = map.ScanFor(this.Id);
	controller.ScanResult = scanResult;
};

Drone.prototype.PullUp = function(map) {
	var toPull = map.GetNextObjectUpFrom(this.Id);
	map.Move(toPull, -1, 0);
};

Drone.prototype.PullDown = function(map) {
	var toPull = map.GetNextObjectDownFrom(this.Id);
	map.Move(toPull, 1, 0);
};

Drone.prototype.PullLeft = function(map) {
	var toPull = map.GetNextObjectLeftFrom(this.Id);
	map.Move(toPull, 0, 1);
};

Drone.prototype.PullRIght = function(map) {
	var toPull = map.GetNextObjectRightFrom(this.Id);
	map.Move(toPull, 0, -1);
};

Drone.prototype.PushUp = function(map) {
	var toPush = map.GetNextObjectUpFrom(this.Id);
	map.Move(toPush, 1, 0);
};

Drone.prototype.PushDown = function(map) {
	var toPush = map.GetNextObjectDownFrom(this.Id);
	map.Move(toPush, -1, 0);
};

Drone.prototype.PushLeft = function(map) {
	var toPush = map.GetNextObjectLeftFrom(this.Id);
	map.Move(toPush, 0, -1);
};

Drone.prototype.PushRight = function(map) {
	var toPush = map.GetNextObjectRightFrom(this.Id);
	map.Move(toPush, 0, 1);
};

Drone.prototype.Perform = function(action, map) {
	switch(action){
		case "MoveUp":
			this.MoveUp(map);
			break;
		case "MoveDown":
			this.MoveDown(map);
			break;
		case "MoveLeft":
			this.MoveLeft(map);
			break;
		case "MoveRight":
			this.MoveRight(map);
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