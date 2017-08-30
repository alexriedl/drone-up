import { Drone } from './GameObjects';
import Map from './Map';
import Renderer from './Renderer/OpenGLRenderer';
//import Renderer from './Renderer/SWRenderer';

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

	public updateAnimation(state: any): boolean {
		return true;
	}

	private animationState = {};

	public runWithState(tickState?: any): void {
		if(!tickState) {
			tickState = {
				isAnimating: false,
				loopPosition: 0
			};
		}

		if(!tickState.isAnimating) {
			tickState.loopPosition = (tickState.loopPosition + 1) % this.players.length;
			const player = this.players[tickState.loopPosition];
			const action = player.controller.getAction();
		}

		if(tickState.isAnimating) {
			const finished = this.updateAnimation(this.animationState);
			if(finished) {
				tickState.isAnimating = false;
			}
		}
	}

	public run(): void {
		if (!this.gameDone && !this.gamePaused) {
			for (var i = 0, len = this.players.length; i < len; i++) {
				if (this.players[i] !== undefined) {
					var action = this.players[i].controller.getAction();
					this.players[i].perform(action, this.map);
					this.renderer.renderAction(this.map, this.players[i], action);
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
			mapObjects: this.map.getMapObjects(),
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
