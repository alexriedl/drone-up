import { BlinkyModel } from 'Pacman/Model';
import { Direction } from 'Pacman/Utils';
import { Map } from '../Map';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Pinky extends GhostEntity {
	public constructor(map: Map, pacman: PacEntity) {
		super(new BlinkyModel(), map.metadata.startingTiles.pinky, Direction.UP, map, pacman);
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				// TODO: Need to introduce pinky target bug
				return this.pacman.tilePosition.add(Direction.getVector(this.pacman.facing).scale(4));
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.pinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
