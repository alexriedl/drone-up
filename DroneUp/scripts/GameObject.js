class GameObject {
	constructor(controller, Id, map) {
		this.Id = Id;
		this.controller = controller;
		controller.actions = ["MoveUp", "MoveDown", "MoveLeft", "MoveRight"];
		this.map = map;
	}

	MoveUp() {
		this.map.Move(this.Id, 1, 0);
	}

	MoveDown() {
		this.map.Move(this.Id, -1, 0);
	}

	MoveLeft() {
		this.map.Move(this.Id, 0, -1);
	}

	MoveRight() {
		this.map.Move(this.Id, 0, 1);
	}

	Perform = function(action) {
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
	}
}