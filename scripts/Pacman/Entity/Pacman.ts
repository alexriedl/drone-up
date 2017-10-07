import { Direction } from 'Pacman/Utils';
import { PacmanModel } from 'Pacman/Model';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';

export default class Pacman extends PacEntity {
	protected model: PacmanModel;
	protected deadTicks: number = 0;

	public constructor(startTile: vec2) {
		super(new PacmanModel(), startTile, Direction.LEFT);
	}

	protected onPixelChange(oldPixelPos: vec2): void {
		switch (this.facing) {
			case Direction.LEFT: this.model.goLeft(); break;
			case Direction.RIGHT: this.model.goRight(); break;
			case Direction.UP: this.model.goUp(); break;
			case Direction.DOWN: this.model.goDown(); break;
		}
		this.model.nextFrame();
	}

	protected onTileChange(oldPixelPos: vec2): void {
		const deadFrames = this.parent.removePacAt(this.tilePosition);
		if (deadFrames > 0) {
			this.deadTicks += deadFrames;
		}
	}

	protected tick(): void {
		if (this.deadTicks > 0) {
			this.deadTicks--;
			return;
		}

		super.tick();
	}
}
