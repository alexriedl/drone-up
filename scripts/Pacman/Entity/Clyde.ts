import { Direction } from 'Pacman/Utils';
import { GhostModel } from 'Pacman/Model';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';

export default class Clyde extends GhostEntity {
	public constructor(startTile: vec2, pacman: PacEntity) {
		super(new GhostModel('Images/clyde.png'), startTile, Direction.DOWN, pacman);
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
