import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacmanModel } from 'Pacman/Model';

import PacEntity from './PacEntity';

import { Color } from 'Engine/Utils';

export default class Pacman extends PacEntity {
	protected model: PacmanModel;
	private frameBurn: number;

	public constructor(map: Map) {
		super(map.metadata.startingTiles.pacman, Direction.LEFT, Color.YELLOW, map);
		this.model = new PacmanModel();
		this.frameBurn = 0;
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
