import { Color, Random } from './Utils';
import { Renderer, RenderGroup } from './Renderer';
import Map from './Map';
import TickState from './TickState';

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private map: Map;
	private renderer: Renderer;
	private animationSpeed: number;

	private frame: (now: number) => void;

	public constructor(map: Map, randomizer: Random, animationSpeed: number = 1) {
		this.gameDone = false;
		this.gamePaused = false;
		this.map = map;
		this.renderer = new Renderer('game-canvas', randomizer);
		this.animationSpeed = animationSpeed;
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
			this.renderGame();

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

	private renderGame(): void {
		const group = new RenderGroup();
		const renderer = this.renderer;
		const map = this.map;

		const gridThickness = 0.05;
		const gridColor = new Color(1, 0.7, 0);
		group.pushGrid(new TSM.vec3([map.getXSize(), map.getYSize(), 0]), gridColor, gridThickness);

		for (const go of map.getGameObjects()) {
			go.render(group);
		}

		renderer.renderGroup(group, map.getXSize(), map.getYSize());
	}
}
