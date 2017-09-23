import { Drone, Spike, GameObject } from './GameObject';
import { vec2, vec3 } from '../Math';
import Renderer from './Renderer';
import TickState from './TickState';

export interface IRunnerOptions {
	animationSpeed: number;
	focusOnPlayerIndex: number;
	renderGrid: boolean;
}

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private gameStarted: boolean;

	private readonly worldSize: vec2;
	private readonly objects: GameObject[];
	private readonly players: Drone[];

	private readonly renderer: Renderer;

	private static defaultOptions: IRunnerOptions = {
		renderGrid: true,
		animationSpeed: 1,
		focusOnPlayerIndex: -1,
	};

	private frame: (now: number) => void;

	public constructor(players: Drone[], spikes: Spike[], worldSize: vec2) {
		this.renderer = new Renderer('game-canvas', worldSize.x, worldSize.y);
		this.players = players;
		this.objects = spikes.concat(players);
		this.worldSize = worldSize;
		this.gameDone = false;
		this.gamePaused = false;
		this.gameStarted = false;
	}

	public pause(): void {
		this.gamePaused = true;
	}

	public resume(): void {
		if (!this.isPaused()) return;
		this.gamePaused = false;
		requestAnimationFrame(this.frame);
	}

	public isPaused(): boolean {
		return this.gamePaused;
	}

	public isStarted(): boolean {
		return this.gameStarted;
	}

	public kill(): void {
		this.gameDone = true;
	}

	public run(options: IRunnerOptions) {
		const tickState = new TickState();
		this.gameStarted = true;
		let then;

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

			options = options || Runner.defaultOptions;

			const effectiveDeltaTime = deltaTime * options.animationSpeed;
			tickState.update(effectiveDeltaTime, this.players, this.objects, this.worldSize);

			this.renderer.render(this.objects, {
				povPosition: this.getPlayersPosition(options.focusOnPlayerIndex),
				viewSize: Math.min(this.worldSize.x, this.worldSize.y) / 2,
				renderGrid: options.renderGrid,
				tiledRender: true,
				debugGrid: false,
			});

			if (!tickState.isAnimating) {
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

	private getPlayersPosition(index: number): vec3 {
		if (index < 0) return null;
		const player = this.players[index];
		return player.isAlive() ? player.getPosition() : null;
	}

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.players.filter((p) => p.isAlive()).length <= 1;
	}
}
