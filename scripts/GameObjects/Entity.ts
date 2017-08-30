import { Controller } from '../Bots/PremadeBots';
import GameObject from './GameObject';
import Map from '../Map';

export default class Entity extends GameObject {
	public readonly controller: Controller;

	public constructor(controller: Controller, ID: string, type: string) {
		super(ID, type);

		if (controller) {
			this.controller = controller;
			this.controller.setActions(["MoveUp", "MoveDown", "MoveLeft", "MoveRight"]);
		}
	}

	public moveUp(map: Map): void {
		map.move(this.ID, 1, 0);
	}

	public moveDown(map: Map): void {
		map.move(this.ID, -1, 0);
	}

	public moveLeft(map: Map): void {
		map.move(this.ID, 0, -1);
	}

	public moveRight(map: Map): void {
		map.move(this.ID, 0, 1);
	}

	public perform(action: string, map: Map): void {
		switch (action) {
			case "MoveUp":
				this.moveUp(map);
				break;
			case "MoveDown":
				this.moveDown(map);
				break;
			case "MoveLeft":
				this.moveLeft(map);
				break;
			case "MoveRight":
				this.moveRight(map);
				break;
		}
	}
}

