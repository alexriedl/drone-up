import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { PacmanModel } from 'Pacman/Model';

import PacEntity from './PacEntity';

import { Color } from 'Engine/Utils';

export default class Pacman extends PacEntity {
	public constructor(map: Map) {
		super(map.metadata.startingTiles.pacman, Direction.LEFT, Color.YELLOW, map);
		this.model = new PacmanModel();
	}
}
