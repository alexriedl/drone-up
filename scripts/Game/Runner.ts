import { GameObject, BaseObject } from './GameObject';
import { vec3 } from '../Math';
import Map from './Map';
import Renderer from './Renderer';
import TickState from './TickState';

export interface IRunnerOptions {
	animationSpeed: number;
	focusOnPlayerId?: string;
	renderGrid: boolean;
}

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private gameStarted: boolean;

	private map: Map;
	private renderer: Renderer;

	private static defaultOptions: IRunnerOptions = {
		renderGrid: true,
		animationSpeed: 1,
		focusOnPlayerId: null,
	};

	private frame: (now: number) => void;

	public constructor(map: Map) {
		this.renderer = new Renderer('game-canvas', map.xSize, map.ySize);
		this.gameDone = false;
		this.gamePaused = false;
		this.gameStarted = false;
		this.map = map;
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
			const transientObjects = tickState.update(effectiveDeltaTime, this.map);
			const gameObjects = this.map.getGameObjects();

			const renderObjects = this.combineLists(gameObjects, transientObjects);

			this.renderer.render(renderObjects, {
				povPosition: options.focusOnPlayerId ? this.getPlayersPosition(options.focusOnPlayerId) : null,
				viewSize: Math.max(this.map.xSize, this.map.ySize) / 2,
				renderGrid: options.renderGrid,
				tiledRender: false,
				debugGrid: false,
			});

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

	private getPlayersPosition(ID: string): vec3 {
		// const player = this.map.getPlayers().find((p) => p.ID === ID);
		// TODO: Allow user to select which player to watch
		const players = this.map.getPlayers();
		const player = players[players.length - 1];
		return player && player.getPosition();
	}

	private combineLists(gameObjects: GameObject[], transientObjects: BaseObject[]): BaseObject[] {
		if (!transientObjects) return [...gameObjects];
		if (!gameObjects) return [...transientObjects];

		const removed: BaseObject[] = gameObjects.
			filter((go) => transientObjects.find((to) => go === to) === undefined);

		return removed.concat(transientObjects);
	}

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.map.getPlayers().length <= 1;
	}
}
