import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacmanModel } from 'Pacman/Model';
import PacEntity from './PacEntity';

export default class Pacman extends PacEntity {
	protected model: PacmanModel;
	protected deadTicks: number = 0;

	public constructor(map: Map) {
		super(new PacmanModel(), map.metadata.startingTiles.pacman, Direction.LEFT, map);
	}

	protected tick(): void {
		if (this.deadTicks > 0) {
			this.deadTicks--;
			return;
		}

		const startingPixel = this.pixelPosition;
		const startingTile = this.tilePosition;

		super.tick();

		if (!startingPixel.exactEquals(this.pixelPosition)) {
			switch (this.facing) {
				case Direction.LEFT: this.model.goLeft(); break;
				case Direction.RIGHT: this.model.goRight(); break;
				case Direction.UP: this.model.goUp(); break;
				case Direction.DOWN: this.model.goDown(); break;
			}
			this.model.nextFrame();
		}

		if (!startingTile.exactEquals(this.tilePosition)) {
			const atePac = this.parent.removePacAt(this.tilePosition);
			if (atePac) this.deadTicks++;
		}
	}
}
