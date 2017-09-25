import { OriginalMap } from 'Pacman/Map';
import { PacEntity } from 'Pacman/Entity';

import { Color } from 'Engine/Utils';
import { Game, Renderer } from 'Engine/Game';
import { vec2 } from 'Engine/Math';

export default class PacmanGame extends Game {
	public map: OriginalMap;
	private static readonly background = Color.BLACK;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, new vec2(map.width, map.height));
		this.map = map;
	}

	protected initialize(gl: WebGLRenderingContext): void {
		this.map.initialize(gl);

		const test = new PacEntity(this.map, new vec2(1, 4))
			.setParent(this.map);
	}

	protected update(deltaTime: number): void {
		this.map.update(deltaTime);
	}

	protected render(renderer: Renderer): void {
		renderer.simpleRender(this.map, PacmanGame.background);
	}
}
