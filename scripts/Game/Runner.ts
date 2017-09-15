import { GameObject, BaseObject } from './GameObject';
import Map from './Map';
import Renderer from './Renderer';
import TickState from './TickState';

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private gameStarted: boolean;

	private map: Map;
	private animationSpeed: number;
	private renderer: Renderer;

	private frame: (now: number) => void;

	public constructor(map: Map, animationSpeed: number) {
		this.renderer = new Renderer('game-canvas', map.xSize, map.ySize);
		this.gameDone = false;
		this.gamePaused = false;
		this.gameStarted = false;
		this.map = map;
		this.animationSpeed = animationSpeed;
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

	public run() {
		this.gameStarted = true;
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
			const transientObjects = tickState.update(effectiveDeltaTime, this.map);
			const gameObjects = this.map.getGameObjects();

			const renderObjects = this.combineLists(gameObjects, transientObjects);
			const p = this.map.getPlayers();
			const firstPlayer = p && p.length > 0 && p[p.length - 1];

			const usePosition = true;

			// TODO: Allow user to change these values
			this.renderer.render(renderObjects, {
				povPosition: usePosition ? firstPlayer && firstPlayer.getPosition() : null,
				renderGrid: true,
				tiledRender: true,
				viewSize: Math.max(this.map.xSize, this.map.ySize) / 2,
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

	private combineLists(gameObjects: GameObject[], transientObjects: BaseObject[]): BaseObject[] {
		if (!transientObjects) return [...gameObjects];
		if (!gameObjects) return [...transientObjects];

		const removed: BaseObject[] = gameObjects.
			filter((go) => transientObjects.find((to) => go.ID === to.ID) === undefined);

		return removed.concat(transientObjects);
	}

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.map.getPlayers().length <= 1;
	}
}
