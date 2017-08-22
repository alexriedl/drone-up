class Map {
	constructor(xSize, ySize) {
		this.xSize = xSize;
		this.ySize = ySize;
	}

	initialize(randomizer, players, spikePercent) {
		var playerArray = [];
		var spikeArray = [];
		var invalidArray = [];

		// first, generate all players and mark their "safe space" as invalid for further placements
		this.generatePlayers(randomizer, players, playerArray, invalidArray);

		// then, generate spikes (up to the percentage or 1000 failures, whichever happens first)
		this.generateSpikes(randomizer, spikePercent, spikeArray, invalidArray);

		this.players = playerArray;
		this.spikes = spikeArray;
		this.mapObjects = playerArray.concat(spikeArray);
	}
	
	getMapObjects() {
		return this.mapObjects;
	}
	
	getXSize() {
		return thsi.xSize;
	}
	
	getYSize() {
		return thsi.xSize;
	}

	generatePlayers(randomizer, players, playerArray, invalidArray) {
		for (var p = 0, plen = players.length; p < plen; p++) {
			var player = players[p];
			var attempts = 0;
			var validSpot = false;
			while (!validSpot) {
				// only attempt up to 1000 times to prevent an infinite loop; if we can't place a player, bail out
				if (attempts > 1000) {
					alert('player could not be placed after 1000 attempts, aborting');
					return null;
				}

				var x = randomizer.next() % this.xSize;
				var y = randomizer.next() % this.ySize;

				// doublecheck all invalid spaces
				var attemptValid = this.checkInvalid(x, y, invalidArray);
				
				if (attemptValid) {
					playerArray.push({
						ID: player.ID,
						type: "drone",
						x: x,
						y: y
					})
					validSpot = true;

					// add the player's "safe space" (anything a distance of <= 3 tiles away)
					this.markInvalid(x, y, 3, invalidArray);
				}

				if (!validSpot) {
					attempts++;
				}
			}
		};
	}

	generateSpikes(randomizer, spikePercent, spikeArray, invalidArray) {
		var spikesGenned = 0;
		var spikesFailed = 0;
		var neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;
		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			var spikeId = '__reservedSpikeNumber' + (spikesGenned + 1) + '__';

			var x = randomizer.next() % this.xSize;
			var y = randomizer.next() % this.ySize;

			var attemptValid = this.checkInvalid(x, y, invalidArray);

			if (attemptValid) {
				spikeArray.push({
					ID: spikeId,
					type: "spike",
					x: x,
					y: y
				});

				// spikes only invalidate their tile, they get no "safe space"
				this.markInvalid(x, y, 0, invalidArray);
			}

			if (attemptValid) {
				spikesGenned++;
			} else {
				spikesFailed++;
			}
		}
	}

	checkInvalid(x, y, invalidArray) {
		var attemptValid = true;

		for (var i = 0, ilen = invalidArray.length; i < ilen && attemptValid; i++) {
			var inv = invalidArray[i];
			if (x === inv.x && y === inv.y) {
				attemptValid = false;
			}
		}

		return attemptValid;
	}

	markInvalid(x, y, numSpread, invalidArray) {
		if (numSpread < 0)
			return;

		// check if the current tile is invalid to avoid adding duplicates
		var invalidDoesNotExist = this.checkInvalid(x, y, invalidArray);
		if(invalidDoesNotExist) {
			invalidArray.push({x: x, y: y});
		}

		// recursively call out in cardinal directions
		this.markInvalid((x + 1) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid((x - 1 + this.xSize) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid(x, (y + 1) % this.ySize, numSpread - 1, invalidArray);
		this.markInvalid(x, (y - 1 + this.ySize) % this.ySize, numSpread - 1, invalidArray);
	}
	
	getCrashedDrones() {
		var crashed = [];
		for(var i = 0, playerCount = this.players.length; i < playerCount; i++) {
			for(var j = 0, mapObjectCount = this.mapObjects.length; j < mapObjectCount; j++) {
				var player = this.players[i];
				var otherObject = this.mapObjects[j];
				if(player.x === otherObject.x && player.y === otherObject.y && player.ID !== otherObject.ID) {
					crashed.push(player.ID);
				}
			}
		}
		
		return crashed;
	}
	
	move(Id, deltaX, deltaY) {
		var mapObject = null;
		var isPlayer = false;
		for(var i = 0, objectCount = this.mapObjects.length; i < objectCount; i++) {
			if(this.mapObjects[i].ID === Id) {
				mapObject = this.mapObjects[i];
			}
		}
		
		for(var j = 0, playerCount = this.players.length; j < playerCount; j++) {
			if(this.players[j].ID === Id) {
				isPlayer = true;
			}
		}
		
		if(mapObject !== null) {
			mapObject.x += deltaX;
			mapObject.y += deltaY;
			this.wrapCoordinates(mapObject);
		}
		
		if(!isPlayer) {
			for(var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
				if(this.mapObjects[k].x === mapObject.x && this.mapObjects[k].y === mapObject.y && this.mapObjects[k].ID !== mapObject.ID) {
					this.move(this.mapObjects[k].ID, deltaX, deltaY);
				}
			}
		}
	}
	
	wrapCoordinates(mapObject) {
		if(mapObject.x > this.xSize) { 
			mapObject.x = 0;
		}
		if(mapObject.x < 0) { 
			mapObject.x = this.xSize;
		}
		if(mapObject.y > this.ySize) { 
			mapObject.y = 0;
		}
		if(mapObject.y < 0) { 
			mapObject.y = this.ySize;
		}
	}
	
	scanFor(Id) {
		const scanDistance = 4;
		var gameObject = null;
		var scanSquares = [];
		var gameObjectsInRange = [];
		
		for(var i = 0, len = this.mapObjects.length; i < len; i++) {
			if(this.mapObjects[i].ID === Id){
				gameObject = this.mapObjects[i];
			}
		}
		
		if(gameObject !== null) {
			this.markInvalid(gameObject.x, gameObject.y, scanDistance, scanSquares);
		
			for(var j = 0, len = this.mapObjects.length; j < len; j++) {
				if(!this.checkInvalid(this.mapObjects[j].x, this.mapObjects[j].y, scanSquares)) {
					gameObjectsInRange.push(this.mapObjects[j]);
				}
			}
			
			for(var k = 0, scanLen = scanSquares.length; k < scanLen; k++) {
				scanSquares[k].type = "empty";
				for(var l = 0, objInRangeLen = gameObjectsInRange.length; l < objInRangeLen && scanSquares[k].type === "empty"; l++) {
					if(scanSquares[k].x === gameObjectsInRange[l].x && scanSquares[k].y === gameObjectsInRange[l].y) {
						if(gameObjectsInRange[l].ID === Id){
							scanSquares[k].type = "you";
						} else {
							scanSquares[k].type = gameObjectsInRange[l].type;
						}
					}
				}
			}
			
			for(var m = 0, len = scanSquares.length; m < len; m++) {
				var square = scanSquares[m];
				if(Math.abs(gameObject.x - scanSquares[m].x) > scanDistance) {
					if(gameObject.x - scanSquares[m].x < 0) {
						scanSquares[m].x = this.xSize + gameObject.x - scanSquares[m].x;
					} else if(gameObject.x + scanSquares[m].x > this.xSize) {
						0 - gameObject.x + scanSquares[m].x;
					}
				} else {
					if(gameObject.x > scanSquares[m].x) {
						scanSquares[m].x = gameObject.x - scanSquares[m].x;
					} else {
						scanSquares[m].x = scanSquares[m].x - gameObject.x
					}
				}
				
				if(Math.abs(gameObject.y - scanSquares[m].y) > scanDistance){
					if(gameObject.y - scanSquares[m].y < 0) {
						scanSquares[m].y = this.xSize + gameObject.y - scanSquares[m].y;
					} else if(gameObject.y + scanSquares[m].y > this.ySize) {
						0 - gameObject.y + scanSquares[m].y;
					}
				} else {
					if(gameObject.y > scanSquares[m].y) {
						scanSquares[m].y = gameObject.y - scanSquares[m].y;
					} else {
						scanSquares[m].y = scanSquares[m].y - gameObject.y
					}
				}
			}
		}
		
		return scanSquares;
	}
	
	//GetNextObjectUpFrom(this.Id) returns an ID of the next object up from the object with the given ID
	getNextObjectUpFrom(Id) {
		var referenceObject = undefined;
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount && referenceObject === undefined; k++) {
			if (this.mapObjects[k].ID === Id)
				referenceObject = this.mapObjects[k];
		}
		var lineObjects = this.getAllObjectsOnSameX(referenceObject.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		var sortedObjects = lineObjects.sort(function(a, b) {
			return b.y - a.y;
		});

		for(var k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === Id) {
				return sortedObjects[(k + 1) % sortedObjects.length].ID;
			}
		}
	}

	getNextObjectDownFrom(Id) {
		var referenceObject = undefined;
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount && referenceObject === undefined; k++) {
			if (this.mapObjects[k].ID === Id)
				referenceObject = this.mapObjects[k];
		}
		var lineObjects = this.getAllObjectsOnSameX(referenceObject.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		var sortedObjects = lineObjects.sort(function(a, b) {
			return a.y - b.y;
		});

		for(var k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === Id) {
				return sortedObjects[(k + 1) % sortedObjects.length].ID;
			}
		}
	}

	getNextObjectLeftFrom(Id) {
		var referenceObject = undefined;
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount && referenceObject === undefined; k++) {
			if (this.mapObjects[k].ID === Id)
				referenceObject = this.mapObjects[k];
		}
		var lineObjects = this.getAllObjectsOnSameY(referenceObject.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		var sortedObjects = lineObjects.sort(function(a, b) {
			return b.x - a.x;
		});

		for(var k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === Id) {
				return sortedObjects[(k + 1) % sortedObjects.length].ID;
			}
		}
	}

	getNextObjectRightFrom(Id) {
		var referenceObject = undefined;
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount && referenceObject === undefined; k++) {
			if (this.mapObjects[k].ID === Id)
				referenceObject = this.mapObjects[k];
		}
		var lineObjects = this.getAllObjectsOnSameY(referenceObject.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		var sortedObjects = lineObjects.sort(function(a, b) {
			return a.x - b.x;
		});

		for(var k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === Id) {
				return sortedObjects[(k + 1) % sortedObjects.length].ID;
			}
		}
	}

	getAllObjectsOnSameY(y) {
		var sameYList = [];
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
			if (this.mapObjects[k].y === y)
				sameYList.push(this.mapObjects[k]);
		}
		return sameYList;
	}

	getAllObjectsOnSameX(x) {
		var sameXList = [];
		for(var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
			if (this.mapObjects[k].x === x)
				sameXList.push(this.mapObjects[k]);
		}
		return sameXList;
	}
}