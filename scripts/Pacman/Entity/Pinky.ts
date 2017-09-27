import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Pinky extends GhostEntity {
	public constructor(map: Map, pacmanTarget: PacEntity) {
		super(map.metadata.startingTiles.pinky, PacEntity.Direction.LEFT, Map.COLOR.PINKY.normalize(), map, pacmanTarget);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				// TODO: Need to introduce pinky target bug
				return this.pacmanTarget.tilePosition
					.add(PacEntity.Direction.getVector(this.pacmanTarget.facing))
					.scale(4);
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.pinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
