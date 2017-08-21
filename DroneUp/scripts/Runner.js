function Runner(gameObjectArray) {
	this.gameObjects = gameObjectArray;
	this.gameDone = false;
}

Runner.prototype.Run = function() {
	while(!GameDone) {
		for(var i = 0, len = this.gameObjects.length; i < len; i++) {
			var action = this.gameObjects[i].controller.GetAction();
			this.gameObjects[i].perform(action);
			this.CheckGameDone();
		}
	}
};
	
Runner.prototype.CheckGameDone = function() {
	var dronesLeft = 0;
	for(var i=0, len = gameObjects.length; i < len; i++) {
		if(typeof gameObjects[i] === Drone) {
			dronesLeft++;
		}
	}
	
	gameDone = dronesLeft > 1;
};