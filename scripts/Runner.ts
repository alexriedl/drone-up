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
	private players: Drone[];
	private gameDone: boolean;
	private gamePaused: boolean;
	private map: Map;
	private renderer: Renderer;

	public constructor(players: Drone[], map: Map) {
		this.players = players;
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
		this.run();
	}

	public runWithAnimations() {
		let then: number = 0;
		let animationState: IAnimationState;
		let tickState: ITickState = {
			isAnimating: false,
			loopPosition: 0
		};

		const frame = (now) => {
			now *= 0.001;
			const deltaTime = now - then;
			then = now;

			if (!tickState.isAnimating) {
				tickState.loopPosition = (tickState.loopPosition + 1) % this.players.length;
				const player = this.players[tickState.loopPosition];
				// TODO: player could be undefined. Skip?
				const action = player.controller.getAction();
				const infos = player.perform(action, this.map);

				if (action && infos) {
					animationState = {
						index: 0,
						moveInfos: infos,
						gameObjects: this.map.getMapObjects().filter(go => !infos.some(info => info.ID === go.ID)),
						xSize: this.map.getXSize(),
						ySize: this.map.getYSize(),
					};

					tickState.isAnimating = true;
				}
				else {
					// TODO: Run the the next iteration right away?
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
				let finished = animationState.index > 10;
				if (finished) {
					this.removeDeceased();
					tickState.isAnimating = false;
				}
			}
			else {
				this.renderUi();
			}

			if(!this.gameDone && !this.gamePaused) {
				requestAnimationFrame(frame);
			}
		};

		requestAnimationFrame(frame);
	}

	public run(): void {
		if (!this.gameDone && !this.gamePaused) {
			for (var i = 0, len = this.players.length; i < len; i++) {
				if (this.players[i] !== undefined) {
					var action = this.players[i].controller.getAction();
					this.players[i].perform(action, this.map);
				}
				this.removeDeceased();
			}
			this.checkGameDone();
			this.renderUi();

			if (!this.gameDone) {
				setTimeout(() => this.run(), 333);
			}
		}
	}

	public kill(): void {
		this.gameDone = true;
	}

	public renderUi(): void {
		this.renderer.renderState({
			gameObjects: this.map.getMapObjects(),
			xSize: this.map.getXSize(),
			ySize: this.map.getYSize()
		});
	}

	public checkGameDone(): void {
		let dronesLeft = 0;
		for (let i = 0, len = this.players.length; i < len; i++) {
			if (this.players[i].type !== undefined && this.players[i].type === "Drone") {
				dronesLeft++;
			}
		}

		this.gameDone = dronesLeft <= 1;
	}

	public removeDeceased(): void {
		let collisions = this.map.getCrashedDrones();
		let indicesToRemove = [];

		for (let i = 0, len = this.players.length; i < len; i++) {
			for (let j = 0, collisionLen = collisions.length; j < collisionLen; j++) {
				if (this.players[i].ID === collisions[j]) {
					indicesToRemove.push(i);
				}
			}
		}

		for (let j = 0, len = indicesToRemove.length; j < len; j++) {
			this.players.splice(indicesToRemove[j], 1);
		}
	}
};