class Runner {
	constructor(gameObjectArray, map) {
		this.gameObjects = gameObjectArray;
		this.gameDone = false;
		this.map = map;
	}
	
	run() {
		while(!this.gameDone) {
			for(var i = 0, len = this.gameObjects.length; i < len; i++) {
				if(this.gameObjects[i] !== undefined) {
					var action = this.gameObjects[i].controller.getAction();
					this.gameObjects[i].perform(action, this.map);
				}
				this.removeDeceased();
			}
			this.checkGameDone();
		}
		
		this.winner = null;
		for(var i = 0, len = this.gameObjects.length; i < len; i++) {
			this.winner = this.gameObjects[i];
		}
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