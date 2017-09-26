import { Map, OriginalMap } from 'Pacman/Map';
import { PacEntity } from 'Pacman/Entity';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { Game, Renderer } from 'Engine/Game';
import { vec2 } from 'Engine/Math';

export default class PacmanGame extends Game {
	private static readonly background = Color.BLACK;
	private randomizer: Random;
	private scene: Entity;
	private pacman: PacEntity;
	public map: Map;

	protected left: boolean;
	protected right: boolean;
	protected up: boolean;
	protected down: boolean;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, map.pixelDimensions);
		this.scene = new Entity();
		this.map = map;

		// TODO: Actually set the random seed
		this.randomizer = new Random(0);
	}

	protected initialize(gl: WebGLRenderingContext): void {
		this.map.initialize(gl);
		this.map.setParent(this.scene);

		const startingPositions = this.map.startingPositions;
		this.pacman = new PacEntity(startingPositions.pacman, PacEntity.Direction.LEFT, this.map, this.randomizer);
		this.pacman.setParent(this.scene);
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

		this.scene.update(deltaTime);
	}

	protected render(renderer: Renderer): void {
		renderer.simpleRender(this.scene, PacmanGame.background);
	}
}
