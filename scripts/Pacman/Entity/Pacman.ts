import { Direction } from 'Pacman/Utils';
import { Map } from '../Map';
import PacEntity from './PacEntity';

import { Color } from 'Engine/Utils';

export default class Pacman extends PacEntity {
	public constructor(map: Map) {
		super(map.metadata.startingTiles.pacman, Direction.LEFT, Color.YELLOW, map);
	}
}
