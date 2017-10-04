import { Direction } from 'Pacman/Utils';
import { GhostModel } from 'Pacman/Model';
import { Map } from 'Pacman/Map';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Blinky extends GhostEntity {
	protected model: GhostModel;

	public constructor(startTile: vec2, pacman: PacEntity) {
		super(new GhostModel('Images/blinky.png'), startTile, Direction.LEFT, pacman);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE: return this.pacman.tilePosition;
			case GhostEntity.GhostMode.SCATTER: return this.parent.metadata.scatterTargets.blinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
