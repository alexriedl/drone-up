import { Direction } from 'Pacman/Utils';
import { GhostModel } from 'Pacman/Model';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';

export default class Inky extends GhostEntity {
	private blinky: PacEntity;

	public constructor(pacman: PacEntity, blinky: PacEntity) {
		super(new GhostModel('Images/inky.png'), pacman);
		this.blinky = blinky;
	}

	public getTargetTile(): vec2 {
		switch (this.ghostMode) {
			case GhostEntity.GhostMode.CHASE:
				let pacmanFacing = Direction.getVector(this.pacman.facing).scale(2);

				// NOTE: Re-implementation of original pacman bug
				if (this.pacman.facing === Direction.UP) pacmanFacing = pacmanFacing.addValues(-2, 0);

				const crossTile = this.pacman.tilePosition.add(pacmanFacing);
				const diff = this.blinky.tilePosition.sub(crossTile);
				const target = crossTile.sub(diff);
				return target;
			case GhostEntity.GhostMode.SCATTER: return this.parent.metadata.scatterTargets.inky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
