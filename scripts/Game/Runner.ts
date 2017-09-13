import { GameObject, BaseObject } from './GameObject';
import Map from './Map';
import Renderer from './Renderer';
import TickState from './TickState';

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private map: Map;
	private animationSpeed: number;
	private renderer: Renderer;

	private frame: (now: number) => void;

	public constructor(map: Map, animationSpeed: number) {
		this.renderer = new Renderer('game-canvas', map.xSize, map.ySize);
		this.gameDone = false;
		this.gamePaused = false;
		this.map = map;
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
			const transientObjects = tickState.update(effectiveDeltaTime, this.map);
			const gameObjects = this.map.getGameObjects();
			this.renderer.renderMap(this.combineLists(gameObjects, transientObjects));

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
