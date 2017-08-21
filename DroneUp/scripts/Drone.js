function Drone(controller){
	this.controller = controller;
	controller.actions = ["Scan", "MoveUp", "MoveDown", "MoveLeft", "MoveRight", "PullUp", "PullDown", "PullRight", "PullLeft", "PushUp", "PushDown", "PushRight", "PushLeft"];
};

Drone.prototype = GameObject.prototype;

Drone.prototype.Scan = function(){
};

Drone.prototype.PullUp = function() {
};

Drone.prototype.PullDown = function() {
};

Drone.prototype.PullLeft = function() {
};

Drone.prototype.PullRIght = function() {
};

Drone.prototype.PushUp = function() {
};

Drone.prototype.PushDown = function() {
};

Drone.prototype.PushLeft = function() {
};

Drone.prototype.PushRIght = function() {
};

Drone.prototype.Perform = function(action) {
	switch(action){
		case "MoveUp":
			this.MoveUp();
			break;
		case "MoveDown":
			this.MoveDown();
			break;
		case "MoveLeft":
			this.MoveLeft();
			break;
		case "MoveRight":
			this.MoveRight();
			break;
		case "PullUp":
			this.PullUp();
			break;
		case "PullDown":
			this.PullDown();
			break;
		case "PullLeft":
			this.PullLeft();
			break;
		case "PullRight":
			this.PullRight();
			break;
		case "PushUp":
			this.PushUp();
			break;
		case "PushDown":
			this.PushDown();
			break;
		case "PushLeft":
			this.PushLeft();
			break;
		case "PushRight":
			this.PushRight();
			break;
		case "Scan":
			this.Scan();
			break;
		default:
	}
};