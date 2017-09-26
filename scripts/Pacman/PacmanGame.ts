import { Map, OriginalMap } from 'Pacman/Map';
import { PacEntity } from 'Pacman/Entity';

import { Color, Random } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { Game, Renderer } from 'Engine/Game';
import { vec2 } from 'Engine/Math';

export default class PacmanGame extends Game {
	public map: Map;
	private scene: Entity;
	private randomizer: Random;
	private static readonly background = Color.BLACK;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, map.dimensions);
		this.scene = new Entity();
		this.map = map;

		// TODO: Actually set the random seed
		this.randomizer = new Random(0);
	}

	protected initialize(gl: WebGLRenderingContext): void {
		this.map.initialize(gl);
		this.map.setParent(this.scene);

		const startingPositions = this.map.startingPositions;
		const pacman = new PacEntity(startingPositions.pacman, PacEntity.Direction.LEFT, this.map, this.randomizer);
		pacman.setParent(this.scene);
	}

	protected update(deltaTime: number): void {
		this.scene.update(deltaTime);
	}

	protected render(renderer: Renderer): void {
		renderer.simpleRender(this.scene, PacmanGame.background);
	}
}
