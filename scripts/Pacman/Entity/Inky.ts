import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';
import { Map } from '../Map';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Inky extends GhostEntity {
	public constructor(map: Map, pacmanTarget: PacEntity) {
		super(map.metadata.startingTiles.inky, PacEntity.Direction.DOWN, Map.COLOR.INKY.normalize(), map, pacmanTarget);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				const crossTile = this.pacmanTarget.tilePosition
					.add(PacEntity.Direction.getVector(this.pacmanTarget.facing))
					.scale(2);
				const dist = crossTile.sub(this.tilePosition);
				return this.tilePosition.add(dist.scale(2));
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.pinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
