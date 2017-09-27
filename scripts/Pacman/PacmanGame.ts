import { Map, OriginalMap } from 'Pacman/Map';
import { PacEntity, Blinky, Pinky, Inky, Clyde, GhostEntity, Pacman } from 'Pacman/Entity';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { Game, Renderer } from 'Engine/Game';
import { vec2 } from 'Engine/Math';

class GhostParent extends Entity {
	protected readonly children?: GhostEntity[] = [];
	private static nextModeDuration: number = 7 * 1000;
	private currentGhostMode: GhostEntity.GhostMode;
	private ghostModeDuration: number = 0;

	// TODO: Change ghost update. This could cause timing issues with ghost modes the way it works It
	// is possible to run more than a single tick per update, and updating mode time is only
	// happening once per update. The issue could be that the mode should change after the first
	// tick, but before the second tick for the ghosts
	public update(deltaTime: number): boolean {
		this.ghostModeDuration -= deltaTime;
		if (this.ghostModeDuration <= 0) {
			this.currentGhostMode = this.currentGhostMode === GhostEntity.GhostMode.SCATTER ?
				GhostEntity.GhostMode.CHASE : GhostEntity.GhostMode.SCATTER;
			this.ghostModeDuration += GhostParent.nextModeDuration;

			this.children.forEach((child) => {
				child.setGhostMode(this.currentGhostMode, false);
			});
		}

		return super.update(deltaTime);
	}

	public setupGhosts(map: Map, pacman: Pacman): void {
		const blinky = new Blinky(map, pacman);
		blinky.setParent(this);

		const pinky = new Pinky(map, pacman);
		pinky.setParent(this);

		const inky = new Inky(map, pacman);
		inky.setParent(this);

		const clyde = new Clyde(map, pacman);
		clyde.setParent(this);

		// NOTE: Used to force set all ghosts modes to the same value specified by the ghost parent
		this.update(0);
	}
}

// tslint:disable-next-line:max-classes-per-file
export default class PacmanGame extends Game {
	public map: Map;

	private pacman: Pacman;

	protected left: boolean;
	protected right: boolean;
	protected up: boolean;
	protected down: boolean;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, map.pixelDimensions);
		this.map = map;
		this.backgroundColor = Color.BLACK;
	}

	protected initialize(gl: WebGLRenderingContext): void {
		this.map.initialize(gl);
		this.addToScene(this.map);

		this.pacman = new Pacman(this.map);
		this.addToScene(this.pacman);

		const ghostParent = new GhostParent();
		ghostParent.setupGhosts(this.map, this.pacman);
		this.addToScene(ghostParent);
	}

	public onkeydown(event: KeyboardEvent): boolean {
		const stringCode = String.fromCharCode(event.keyCode);
		switch (stringCode) {
			case 'A': case '%': this.left = true; return false;
			case 'D': case "'": this.right = true; return false;
			case 'S': case '(': this.down = true; return false;
			case 'W': case '&': this.up = true; return false;
		}
	}

	public onkeyup(event: KeyboardEvent) {
		const stringCode = String.fromCharCode(event.keyCode);
		switch (stringCode) {
			case 'A': case '%': this.left = false; return false;
			case 'D': case "'": this.right = false; return false;
			case 'S': case '(': this.down = false; return false;
			case 'W': case '&': this.up = false; return false;
		}
	}

	protected update(deltaTime: number): void {
		let d;
		if (this.left) d = PacEntity.Direction.LEFT;
		if (this.right) d = PacEntity.Direction.RIGHT;
		if (this.up) d = PacEntity.Direction.UP;
		if (this.down) d = PacEntity.Direction.DOWN;
		if (d !== undefined) {
			this.pacman.setDesiredDirection(d);
		}

		super.update(deltaTime);
	}
}
