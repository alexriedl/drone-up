import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacmanModel } from 'Pacman/Model';
import PacEntity from './PacEntity';

export default class Pacman extends PacEntity {
	protected model: PacmanModel;

	public constructor(map: Map) {
		super(new PacmanModel(), map.metadata.startingTiles.pacman, Direction.LEFT, map);
	}

	protected tick(): void {
		const startingPixel = this.pixelPosition;
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
	}
}
