import { Drone, GameObject } from './GameObjects';
import { IMoveInfo } from './Utils';
import Map from './Map';
import Renderer from './Renderer/OpenGLRenderer';
//import Renderer from './Renderer/SWRenderer';

export interface IAnimationState {
	index: number;
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

	private frame: (now: number) => void;

	public constructor(map: Map) {
		this.gameDone = false;
		this.gamePaused = false;
		this.map = map;
		this.renderer = new Renderer("game-canvas");
	}

	public pause(): void {
		this.gamePaused = true;
	}

	public resume(): void {
		this.gamePaused = false;
		this.frame(Date.now());
	}

	public kill(): void {
		this.gameDone = true;
	}

	public isGameDone(): boolean {
		return this.map.getPlayers().length <= 1;
	}

	public runWithAnimations() {
		let then: number = 0;
		let animationState: IAnimationState;
		let tickState: ITickState = {
			isAnimating: false,
			loopPosition: 0
		};

		this.frame = (now: number) => {
			now *= 0.001;
			const deltaTime = now - then;
			then = now;

			const players = this.map.getPlayers();

			if (!tickState.isAnimating) {
				tickState.loopPosition = (tickState.loopPosition + 1) % players.length;;
				const player = players[tickState.loopPosition];
				const action = player.controller.getAction();
				const infos = player.perform(action, this.map);

				if (action && infos && infos.length > 0) {
					animationState = {
						index: 0,
						moveInfos: infos,
						gameObjects: this.map.getMapObjects().filter(go => !infos.some(info => info.ID === go.ID)),
						xSize: this.map.getXSize(),
						ySize: this.map.getYSize(),
					};

					tickState.isAnimating = true;
				}
			}

			if (tickState.isAnimating) {
				const speed = 0.1;
				animationState.index++;

				// Update animation state

				for(let i = 0; i < animationState.moveInfos.length; i++) {
					const info = animationState.moveInfos[i];

					// TODO: Come up with a more reliable way to know animations are finished
					info.curPos.x += Math.sign(info.endPos.x - info.startPos.x) * speed;
					info.curPos.y += Math.sign(info.endPos.y - info.startPos.y) * speed;
				}

				// Render animation state
				this.renderer.renderAnimationState(animationState);

				// TODO: Come up with a more reliable way to know animations are finished
				let finished = animationState.index > 9;
				if (finished) {
					const deadDrones = this.map.removeCrashedDrones();
					tickState.isAnimating = false;
				}
			}
			else {
				this.renderer.renderState({
					gameObjects: this.map.getMapObjects(),
					xSize: this.map.getXSize(),
					ySize: this.map.getYSize()
				});
			}

			if(!this.gameDone && !this.gamePaused) {
				requestAnimationFrame(this.frame);
			}
		};

		requestAnimationFrame(this.frame);
	}
};
