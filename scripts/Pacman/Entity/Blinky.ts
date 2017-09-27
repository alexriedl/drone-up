import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Blinky extends GhostEntity {
	public constructor(map: Map, pacmanTarget: PacEntity) {
		super(map.startingPositions.blinky, PacEntity.Direction.LEFT, Color.RED, map, pacmanTarget);
	}

	public getTargetTile(): vec2 {
		return this.pacmanTarget.tilePosition;
	}
}
