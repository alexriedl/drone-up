function GameObject(controller, Id){
	this.Id = Id;
	this.controller = controller;
	controller.actions = ["MoveUp", "MoveDown", "MoveLeft", "MoveRight"];
};

GameObject.prototype.MoveUp = function(map){
	map.Move(this.Id, 1, 0);
};

GameObject.prototype.MoveDown = function(map){
	map.Move(this.Id, -1, 0);
};

GameObject.prototype.MoveLeft = function(map){
	map.Move(this.Id, 0, -1);
};

GameObject.prototype.MoveRight = function(map){
	map.Move(this.Id, 0, 1);
};

GameObject.prototype.Perform = function(action, map) {
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
	}
};