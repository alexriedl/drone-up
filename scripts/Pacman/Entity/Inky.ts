import { Direction } from 'Pacman/Utils';
import { GhostModel } from 'Pacman/Model';
import { Map } from 'Pacman/Map';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Inky extends GhostEntity {
	private blinky: PacEntity;

	public constructor(startTile: vec2, pacman: PacEntity, blinky: PacEntity) {
		super(new GhostModel('Images/inky.png'), startTile, Direction.DOWN, pacman);
		this.blinky = blinky;
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				const pacmanFacing = Direction.getVector(this.pacman.facing).scale(2);
				const crossTile = this.pacman.tilePosition.add(pacmanFacing);
				const diff = this.blinky.tilePosition.sub(crossTile);
				const target = crossTile.sub(diff);
				return target;
			case GhostEntity.GhostMode.SCATTER: return this.parent.metadata.scatterTargets.inky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
