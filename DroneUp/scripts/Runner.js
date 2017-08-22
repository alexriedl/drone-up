class Runner {
	constructor(gameObjectArray, map) {
		this.gameObjects = gameObjectArray;
		this.gameDone = false;
		this.map = map;
	}
	
	run() {
		while(!this.gameDone) {
			for(var i = 0, len = this.gameObjects.length; i < len; i++) {
				var action = this.gameObjects[i].controller.getAction();
				this.gameObjects[i].perform(action, this.map);
				this.removeDeceased();
				this.checkGameDone();
			}
		}
	}
	
	checkGameDone() {
		var dronesLeft = 0;
		for(var i=0, len = this.gameObjects.length; i < len; i++) {
			if(typeof this.gameObjects[i] === "Drone") {
				dronesLeft++;
			}
		}
		
		this.gameDone = dronesLeft <= 1;
	}

	removeDeceased(){
		var collisions = this.map.getCrashedDrones();
		for(var i=0, len = this.gameObjects.length; i < len; i++) {
			for(var j=0, collisionLen = collisions.length; j < collisionLen; j++){
				if(this.gameObject[i].Id === collisions[j]){
					gameObject.splice(i, 1);
				}
			}
		}
	}
};