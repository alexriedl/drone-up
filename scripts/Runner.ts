import { Drone, GameObject } from './GameObjects';
import { IMoveInfo, Random } from './Utils';
import Map from './Map';
import Renderer from './Renderer/OpenGLRenderer';

export interface IAnimationState {
	moveInfos: IMoveInfo[];
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
	private animationSpeed: number = .5;

	private frame: (now: number) => void;

	public constructor(map: Map, randomizer: Random) {
		this.gameDone = false;
		this.gamePaused = false;
		this.map = map;
		this.renderer = new Renderer("game-canvas", randomizer);
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

	private checkGameDone(): void {
		this.gameDone = this.gameDone || this.map.getPlayers().length <= 1;
	}

	public run() {
		let then;
		let animationState: IAnimationState;
		let tickState: ITickState = {
			isAnimating: false,
			loopPosition: 0
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
				tickState.loopPosition = (tickState.loopPosition + 1) % players.length;;
				const player = players[tickState.loopPosition];
				const action = player.controller.getAction();
				const infos = player.perform(action, this.map);

				if (action && infos && infos.length > 0) {
					// Adjust animations' duration based on animation speed
					if (this.animationSpeed && this.animationSpeed !== 1)
						infos.forEach(info => info.durationMs /= this.animationSpeed);

					animationState = {
						moveInfos: infos,
						gameObjects: this.map.getMapObjects().filter(go => !infos.some(info => info.ID === go.ID)),
						xSize: this.map.getXSize(),
						ySize: this.map.getYSize(),
					};

					tickState.isAnimating = true;
				}
			}

			// TODO: Animation update logic should NOT be in the runner
			if (tickState.isAnimating) {
				let finished = true;

				for (let i = 0; i < animationState.moveInfos.length; i++) {
					const info = animationState.moveInfos[i];
					if(info.durationMs <= 0) continue;

					let effectiveDeltaTime = deltaTime;
					if(effectiveDeltaTime > info.durationMs)
						effectiveDeltaTime = info.durationMs;

					info.curPos.x += (info.endPos.x - info.curPos.x) / info.durationMs * effectiveDeltaTime;
					info.curPos.y += (info.endPos.y - info.curPos.y) / info.durationMs * effectiveDeltaTime;

					info.durationMs -= effectiveDeltaTime;
					if(info.durationMs > 0)
						finished = false;
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

			if(this.gameDone || this.gamePaused) {
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
};
