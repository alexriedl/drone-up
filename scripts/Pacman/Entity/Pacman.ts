import { Direction } from 'Pacman/Utils';
import { PacMap, PacmanModel, DeadModel } from 'Pacman/Model';
import PacEntity from './PacEntity';

import { vec2 } from 'Engine/Math';

export default class Pacman extends PacEntity {
	protected model: PacMap;
	protected deadTicks: number;
	protected alive: boolean;

	protected mainModel: PacmanModel;
	protected deadModel: DeadModel;

	private deadAnimationFinished: () => void;

	public constructor(startTile: vec2) {
		const mainModel = new PacmanModel();
		const deadModel = new DeadModel();

		super(mainModel, startTile, Direction.LEFT);

		this.deadTicks = 0;
		this.alive = true;

		this.mainModel = mainModel;
		this.deadModel = deadModel;
	}

	public get isAlive(): boolean { return this.alive; }

	protected onPixelChange(oldPixelPos: vec2): void {
		switch (this.facing) {
			case Direction.LEFT: this.model.goLeft(); break;
			case Direction.RIGHT: this.model.goRight(); break;
			case Direction.UP: this.model.goUp(); break;
			case Direction.DOWN: this.model.goDown(); break;
		}
		this.model.nextFrame();
	}

	protected onTileChange(oldPixelPos: vec2): void {
		const deadFrames = this.parent.removePelletAt(this.tilePosition);
		if (deadFrames > 0) {
			this.deadTicks += deadFrames;
		}
	}

	protected tick(): void {
		if (this.deadTicks > 0) {
			this.deadTicks--;
			return;
		}

		if (this.isAlive) {
			super.tick();
		}
		else {
			this.deadTicks = 3;
			if (this.model) this.model.nextFrame(this.deadAnimationFinished);
		}
	}

	public kill(animationFinished: () => void): void {
		this.alive = false;
		this.model = this.deadModel;
		this.deadTicks = 3;
		this.deadAnimationFinished = () => {
			this.model = undefined;
			animationFinished();
		};
	}
}
