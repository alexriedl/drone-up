import { Drone, Spike, GameObject } from './GameObject';
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
	worldSize: vec2;
}

export default class Runner {
	private gameDone: boolean;
	private gamePaused: boolean;
	private gameStarted: boolean;

	private readonly renderer: Renderer;
	private readonly tickState: ITickState;

	private frame: (now: number) => void;

	public constructor(players: Drone[], spikes: Spike[], worldSize: vec2) {
		this.renderer = new Renderer('game-canvas', worldSize.x, worldSize.y);
		this.gameDone = false;
		this.gamePaused = false;
		this.gameStarted = false;

		this.tickState = {
			animating: false,
			loopPosition: 0,
			objects: spikes.concat(players),
			players,
			worldSize,
		};
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

			const state = this.tickState;
			options = options || defaultOptions;

			const effectiveDeltaTime = deltaTime * options.animationSpeed;
			update(effectiveDeltaTime, this.tickState);

			this.renderer.render(state.objects, {
				povPosition: getPlayersPosition(state, options.focusOnPlayerIndex),
				viewSize: Math.min(state.worldSize.x, state.worldSize.y) / 2,
				renderGrid: options.renderGrid,
				tiledRender: true,
				debugGrid: false,
			});

			if (!state.animating) {
				this.checkGameDone(state);
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

	private checkGameDone(state: ITickState): void {
		this.gameDone = this.gameDone || state.players.filter((p) => p.isAlive()).length <= 1;
	}
}

function getPlayersPosition(state: ITickState, index: number): vec3 {
	if (index < 0) return null;
	const player = state.players[index];
	return player.isAlive() ? player.getPosition() : null;
}

function update(deltaTime: number, state: ITickState) {
	// Get next animation
	if (!state.animating) {
		const player = findNextLivingDrone(state.players, state);
		const action = player.controller.getAction();
		player.perform(action, state.objects, state.worldSize);
	}

	// Update all objects
	state.animating = false;
	for (const object of state.objects) {
		const finished = object.update(deltaTime);
		if (!finished) state.animating = true;
	}

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

		// TODO: Dont mark drone dead here once map is a scene graph
		dead.alive = false;
		dead.setAnimation(new ResizeAnimation(1, 5, 200), true);
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
