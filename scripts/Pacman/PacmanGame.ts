import { Direction } from 'Pacman/Utils';
import { Map, OriginalMap } from 'Pacman/Map';

import { Game } from 'Engine/Game';

const MILLISECONDS_PER_FRAME = (1 / 60) * 1000;

export default class PacmanGame extends Game {
	protected scene: Map;

	protected left: boolean;
	protected right: boolean;
	protected up: boolean;
	protected down: boolean;

	protected frameTime: number;

	public constructor(canvasId: string) {
		const map = new OriginalMap();
		super(canvasId, map.pixelDimensions);
		this.setScene(map);

		this.frameTime = 0;
	}

	protected initialize(gl: WebGLRenderingContext): void {
		this.scene.initialize(gl);
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
			this.scene.setPlayerDirection(d);
		}

		this.frameTime += deltaTime;
		while (this.frameTime >= MILLISECONDS_PER_FRAME) {
			this.frameTime -= MILLISECONDS_PER_FRAME;
			super.update(MILLISECONDS_PER_FRAME);
		}
	}
}
