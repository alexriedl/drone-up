//import Renderer from './Renderer';
import Renderer from './OpenGLRenderer';

export default class Runner {
	constructor(gameObjectArray, map) {
		this.gameObjects = gameObjectArray;
		this.gameDone = false;
		this.map = map;
		this.renderer = new Renderer("game-canvas");
	}

	run = () => {
		if(!this.gameDone) {
			for(var i = 0, len = this.gameObjects.length; i < len; i++) {
				if(this.gameObjects[i] !== undefined) {
					var action = this.gameObjects[i].controller.getAction();
					this.gameObjects[i].perform(action, this.map);
				}
				this.removeDeceased();
			}
			this.checkGameDone();
			this.renderUi();

			if(!this.gameDone) {
				setTimeout(this.run, 333);
			}
		}
	}

	renderUi() {
		this.renderer.renderState({
			invalidArray: [],
			mapObjects: this.map.getMapObjects(),
			players: [],
			spikes: [],
			xSize: this.map.getXSize(),
			ySize: this.map.getYSize()
		});
	}

	checkGameDone() {
		var dronesLeft = 0;
		for(var i=0, len = this.gameObjects.length; i < len; i++) {
			if(this.gameObjects[i].type !== undefined && this.gameObjects[i].type ===  "Drone") {
				dronesLeft++;
			}
		}

		this.gameDone = dronesLeft <= 1;
	}

	removeDeceased(){
		var collisions = this.map.getCrashedDrones();
		var indicesToRemove = [];

		for(var i=0, len = this.gameObjects.length; i < len; i++) {
			for(var j=0, collisionLen = collisions.length; j < collisionLen; j++){
				if(this.gameObjects[i].ID === collisions[j]){
					indicesToRemove.push(i);
				}
			}
		}

		for(var j=0, len = indicesToRemove.length; j < len; j++) {
			this.gameObjects.splice(indicesToRemove[j], 1);
		}
	}
};
