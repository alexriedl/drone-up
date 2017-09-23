import { Drone, Spike, GameObject, BaseObject } from './GameObject';
import { ResizeAnimation } from '../Animations';
import { vec2, vec3 } from '../Math';
import Renderer from './Renderer';

export interface IRunnerOptions {
	animationSpeed: number;
	focusOnPlayerIndex: number;
	renderGrid: boolean;
}
const defaultOptions: IRunnerOptions = {
	renderGrid: true,
	animationSpeed: 1,
	focusOnPlayerIndex: -1,
};

interface ITickState {
	loopPosition: number;
	animating: boolean;
	players: Drone[];
	objects: GameObject[];
	scene: BaseObject;
	worldSize: vec2;
	paused: boolean;
	gameOver: boolean;
}

export default class Runner {
	private readonly renderer: Renderer;
	private readonly tickState: ITickState;

	private frame: (now: number) => void;

	public constructor(players: Drone[], spikes: Spike[], worldSize: vec2) {
		this.renderer = new Renderer('game-canvas', worldSize.x, worldSize.y);

		const scene = new BaseObject(undefined);
		const objects = spikes.concat(players);
		objects.forEach((object) => object.setParent(scene));

		this.tickState = {
			animating: false,
			loopPosition: 0,
			objects,
			scene,
			players,
			worldSize,
			paused: false,
			gameOver: false,
		};
	}

	public pause(): void {
		this.tickState.paused = true;
	}

	public resume(): void {
		if (!this.isPaused()) return;
		this.tickState.paused = false;
		requestAnimationFrame(this.frame);
	}

	public isPaused(): boolean {
		return this.tickState.paused;
	}

	public kill(): void {
		this.tickState.gameOver = true;
	}

	public run(options: IRunnerOptions) {
		options = options || defaultOptions;
		const state = this.tickState;
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

			if (!state.gameOver) {
				const effectiveDeltaTime = deltaTime * options.animationSpeed;
				update(effectiveDeltaTime, state);
			}
			render(this.renderer, state, options);

			if (!state.animating) {
				this.checkGameDone(state);
			}

			if (this.isPaused()) {
				then = undefined;
			}
			else {
				requestAnimationFrame(this.frame);
			}
		};

		requestAnimationFrame(this.frame);
	}

	private checkGameDone(state: ITickState): void {
		state.gameOver = state.gameOver || state.players.filter((p) => p.isAlive()).length <= 1;
	}
}

function getPlayersPosition(state: ITickState, index: number): vec3 {
	if (index < 0 || state.gameOver) return null;
	const player = state.players[index];
	return player.isAlive() ? player.getPosition() : null;
}

function render(renderer: Renderer, state: ITickState, options: IRunnerOptions) {
	renderer.render(state.scene, {
		povPosition: getPlayersPosition(state, options.focusOnPlayerIndex),
		viewSize: Math.min(state.worldSize.x, state.worldSize.y) / 2,
		renderGrid: options.renderGrid,
		tiledRender: true,
		debugGrid: false,
	});
}

function update(deltaTime: number, state: ITickState) {
	// Get next animation
	if (!state.animating) {
		const player = findNextLivingDrone(state.players, state);
		const action = player.controller.getAction();
		player.perform(action, state.objects, state.worldSize);
	}

	// Update all objects
	state.animating = state.scene.update(deltaTime);

	// Remove dead players
	if (!state.animating) {
		state.animating = removeCrashedDrones(state.players, state.objects);
	}
}

function removeCrashedDrones(players: Drone[], objects: GameObject[]): boolean {
	const crashed: Drone[] = [];

	for (const player of players.filter((p) => p.isAlive())) {
		for (const object of objects) {
			if (player !== object && player.position.exactEquals(object.position)) {
				crashed.push(player);
			}
		}
	}

	let someoneIsAnimating = false;
	for (const dead of crashed) {
		const gameObjectsIndex = objects.indexOf(dead);
		if (gameObjectsIndex > -1) {
			objects.splice(gameObjectsIndex, 1);
		}

		dead.setAnimation(new ResizeAnimation(1, 7, 500), true);
		someoneIsAnimating = true;
	}

	return someoneIsAnimating;
}

function findNextLivingDrone(players: Drone[], state: ITickState): Drone {
	const starting = state.loopPosition;
	let player;
	do {
		state.loopPosition = (state.loopPosition + 1) % players.length;
		player = players[state.loopPosition];
		if (starting === state.loopPosition) return player;
	} while (!player || !player.isAlive());
	return player;
}
