import { Direction } from 'Pacman/Utils';
import { GhostModel } from 'Pacman/Model';
import { Map } from 'Pacman/Map';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Clyde extends GhostEntity {
	public constructor(map: Map, pacman: PacEntity) {
		super(new GhostModel('Images/clyde.png'), map.metadata.startingTiles.clyde, Direction.DOWN, map, pacman);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				const distance = this.tilePosition.dist(this.pacman.tilePosition);
				if (distance >= 8) return this.pacman.tilePosition;
				else return this.parent.metadata.scatterTargets.clyde;
			case GhostEntity.GhostMode.SCATTER: return this.parent.metadata.scatterTargets.clyde;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
