import { Random } from './Utils';
import Map from './Map';
import Renderer from './Renderer/Renderer';
import TickState from './TickState';

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private map: Map;
	private renderer: Renderer;
	private animationSpeed: number = 1;

	private frame: (now: number) => void;

	public constructor(map: Map, randomizer: Random) {
		this.gameDone = false;
		this.gamePaused = false;
		this.map = map;
		this.renderer = new Renderer('game-canvas', randomizer);
	}

	public pause(): void {
		this.gamePaused = true;
	}

	public resume(): void {
		this.gamePaused = false;
		requestAnimationFrame(this.frame);
	}

	public kill(): void {
		this.gameDone = true;
	}

	public run() {
		let then;
		const tickState = new TickState();

		this.frame = (now: number) => {
			const deltaTime = now - then;

			// NOTE: Skip bad frames. This should only happen on startup and after pausing.
			{
				const skipFrame = !then;
				then = now;

				if (skipFrame) {
					requestAnimationFrame(this.frame);
					return;
				}
			}

			const effectiveDeltaTime = deltaTime * this.animationSpeed;
			tickState.update(effectiveDeltaTime, this.map);
			this.renderer.renderMap(this.map);

			if (!tickState.isAnimating()) {
				this.checkGameDone();
			}

			if (this.gameDone || this.gamePaused) {
				then = undefined;
			}
			else {
				requestAnimationFrame(this.frame);
			}
		};

		requestAnimationFrame(this.frame);
	}

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.map.getPlayers().length <= 1;
	}
}
