import { Animation } from './Animations';
import { Drone, GameObject } from './GameObjects';
import { Random } from './Utils';

import Map from './Map';
import Renderer from './Renderer/OpenGLRenderer';

export interface IAnimationState {
	animations: Animation[];
	gameObjects: GameObject[];
	xSize: number;
	ySize: number;
}

export interface ITickState {
	isAnimating: boolean;
	loopPosition: number;
}

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
		let animationState: IAnimationState;
		const tickState: ITickState = {
			isAnimating: false,
			loopPosition: 0,
		};

		this.frame = (now: number) => {
			const deltaTime = now - then;

			// NOTE: Ignore bad frames
			{
				let skipFrame = false;
				if (!then) skipFrame = true;

				then = now;

				if (skipFrame) {
					requestAnimationFrame(this.frame);
					return;
				}
			}

			const players = this.map.getPlayers();

			if (!tickState.isAnimating) {
				tickState.loopPosition = (tickState.loopPosition + 1) % players.length;
				const player = players[tickState.loopPosition];
				const action = player.controller.getAction();
				const animations = player.perform(action, this.map);

				if (action && animations && animations.length > 0) {
					// Adjust animations' duration based on animation speed
					if (this.animationSpeed && this.animationSpeed !== 1) {
						animations.forEach((info) => info.durationMs /= this.animationSpeed);
					}

					animationState = {
						animations,
						gameObjects: this.map.getMapObjects().filter((go) => !animations.some((info) => info.objectID === go.ID)),
						xSize: this.map.getXSize(),
						ySize: this.map.getYSize(),
					};

					tickState.isAnimating = true;
				}
			}

			if (tickState.isAnimating) {
				let finished = true;

				for (const animation of animationState.animations) {
					if (!animation.update(deltaTime)) finished = false;
				}

				this.renderer.renderAnimationState(animationState);

				if (finished) {
					// TODO: Find a way to animate dead drones
					const deadDrones = this.map.removeCrashedDrones();
					tickState.isAnimating = false;
				}
			}
			else {
				this.renderer.renderMap(this.map);
			}

			if (!tickState.isAnimating) {
				this.checkGameDone();
			}

			if (this.gameDone || this.gamePaused) {
				then = undefined;
			}
			else {
				requestAnimationFrame(this.frame);
			}

			if (this.gameDone) {
				this.renderer.renderMap(this.map);
			}
		};

		requestAnimationFrame(this.frame);
	}

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.map.getPlayers().length <= 1;
	}
}
