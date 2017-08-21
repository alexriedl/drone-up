function Runner(gameObjectArray, map) {
	this.gameObjects = gameObjectArray;
	this.gameDone = false;
	this.map = map;
};

Runner.prototype.Run = function() {
	while(!GameDone) {
		for(var i = 0, len = this.gameObjects.length; i < len; i++) {
			var action = this.gameObjects[i].controller.GetAction();
			this.gameObjects[i].perform(action, this.map);
			this.RemoveDeceased();
			this.CheckGameDone();
		}
	}
};
	
Runner.prototype.CheckGameDone = function() {
	var dronesLeft = 0;
	for(var i=0, len = this.gameObjects.length; i < len; i++) {
		if(typeof this.gameObjects[i] === "Drone") {
			dronesLeft++;
		}
	}
	
	this.gameDone = dronesLeft <= 1;
};

Runner.prototype.RemoveDeceased = function(){
	var collisions = this.map.getCrashedDrones();
	for(var i=0, len = this.gameObjects.length; i < len; i++) {
		for(var j=0, collisionLen = collisions.length; j < collisionLen; j++){
			if(this.gameObject[i].Id === collisions[j]){
				gameObject.splice(i, 1);
			}
		}
	}
};