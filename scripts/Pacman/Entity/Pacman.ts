import PacEntity from './PacEntity';
import { Map } from '../Map';

import { Color } from 'Engine/Utils';

export default class Pacman extends PacEntity {
	public constructor(map: Map) {
		super(map.startingPositions.pacman, PacEntity.Direction.LEFT, Color.YELLOW, map);
	}
}
