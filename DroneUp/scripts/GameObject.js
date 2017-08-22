export default class GameObject {
	constructor(controller, ID, map) {
		this.ID = ID;
		this.controller = controller;
		controller.actions = ["MoveUp", "MoveDown", "MoveLeft", "MoveRight"];
		this.map = map;
	}

	moveUp() {
		this.map.move(this.ID, 1, 0);
	}

	moveDown() {
		this.map.move(this.ID, -1, 0);
	}

	moveLeft() {
		this.map.move(this.ID, 0, -1);
	}

	moveRight() {
		this.map.move(this.ID, 0, 1);
	}

	perform(action) {
		switch(action){
			case "MoveUp":
				this.moveUp();
				break;
			case "MoveDown":
				this.moveDown();
				break;
			case "MoveLeft":
				this.moveLeft();
				break;
			case "MoveRight":
				this.moveRight();
				break;
		}
	}
}
