import { Direction } from 'Pacman/Utils';
import { Map } from '../Map';
import { BlinkyModel } from 'Pacman/Model';
import GhostEntity from './GhostEntity';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';
import { Color, Random } from 'Engine/Utils';

export default class Inky extends GhostEntity {
	private blinky: PacEntity;

	public constructor(map: Map, pacman: PacEntity, blinky: PacEntity) {
		super(new BlinkyModel(), map.metadata.startingTiles.inky, Direction.DOWN, map, pacman);
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
			case GhostEntity.GhostMode.SCATTER: return this.map.metadata.scatterTargets.pinky;
			// TODO: Add logic to get frightened target tile, or change the logic to not use target tiles during that mode
		}
	}
}
