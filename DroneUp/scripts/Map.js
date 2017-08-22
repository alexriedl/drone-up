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
		
		for(var j = 0, playerCount = this.players.length; j < playerCount; i++) {
			if(this.players[i].ID === Id) {
				isPlayer = true;
			}
		}
		
		if(mapObject !== null) {
			mapObject.x += deltaX;
			mapObject.y += deltaY;
		}
		
		if(!isPlayer) {
			for(var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
				if(this.mapObjects[k].x === mapObject.x && this.mapObjects[k].y === mapObject.y && this.mapObjects[k].ID !== mapObject.ID) {
					move(this.mapObjects[k].ID, deltaX, deltaY);
				}
			}
		}
	}
	
	//ScanFor(Id) returns the game objects visible to the object with the given ID
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