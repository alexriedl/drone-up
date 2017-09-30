import { Direction } from 'Pacman/Utils';
import { Map } from 'Pacman/Map';
import { BlinkyModel } from 'Pacman/Model';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Blinky extends GhostEntity {
	protected model: BlinkyModel;

	public constructor(map: Map, pacman: PacEntity) {
		super(new BlinkyModel(), map.metadata.startingTiles.blinky, Direction.LEFT, map, pacman);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE: return this.pacman.tilePosition;
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.blinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
