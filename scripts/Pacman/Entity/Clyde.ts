import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Clyde extends GhostEntity {
	public constructor(map: Map, pacmanTarget: PacEntity) {
		super(map.metadata.startingTiles.clyde, PacEntity.Direction.DOWN, Map.COLOR.CLYDE.normalize(), map, pacmanTarget);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				const distance = this.tilePosition.dist(this.pacmanTarget.tilePosition);
				if (distance >= 8) return this.pacmanTarget.tilePosition;
				else return this.map.metadata.scatterTargets.clyde;
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.clyde;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
