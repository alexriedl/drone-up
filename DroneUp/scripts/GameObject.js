function GameObject(controller){
	this.controller = controller;
	controller.actions = ["MoveUp", "MoveDown", "MoveLeft", "MoveRight"];
};

GameObject.prototype.MoveUp = function(){
};

GameObject.prototype.MoveDown = function(){
};

GameObject.prototype.MoveLeft = function(){
};

GameObject.prototype.MoveRight = function(){
};

GameObject.prototype.Perform = function(action) {
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
	}
};