import { Direction } from 'Pacman/Utils';
import { GhostParent, Pacman } from 'Pacman/Entity';
import { Map, OriginalMap } from 'Pacman/Map';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { Game, Renderer } from 'Engine/Game';
import { vec2 } from 'Engine/Math';

export default class PacmanGame extends Game {
	public map: Map;

	private pacman: Pacman;

	protected left: boolean;
	protected right: boolean;
	protected up: boolean;
	protected down: boolean;

	protected introTime: number;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, map.pixelDimensions);
		this.map = map;
		this.backgroundColor = Color.BLACK;
		this.introTime = 3 * 1000;
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
		if (this.left) d = Direction.LEFT;
		if (this.right) d = Direction.RIGHT;
		if (this.up) d = Direction.UP;
		if (this.down) d = Direction.DOWN;
		if (d !== undefined) {
			this.pacman.setDesiredDirection(d);
		}

		if (this.introTime > 0) {
			this.introTime -= deltaTime;
		}
		else {
			super.update(deltaTime);
		}
	}
}
