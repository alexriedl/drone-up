class Map {
	constructor(xSize, ySize) {
		this.xSize = xSize;
		this.ySize = ySize;

	}

	initialize(randomizer, player, spikePercent) {
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
		
		this.Draw(playerArray, spikeArray, invalidArray);
	}
	
	Draw(playerArray, spikeArray, invalidArray){
		var mapVisual = "";
		for(var x = 0; x < this.xSize; x++){
			for(var y = 0; y < this.ySize; y++){
				var thisSpot = " ";
				for(var p = 0; p < playerArray.length; p++){
					if(playerArray[p].x === x && playerArray[p].y === y){
						if(thisSpot === " "){
							thisSpot = "P";
						}
					}
				}
				for(var s = 0; s < spikeArray.length; s++){
					if(spikeArray[s].x === x && spikeArray[s].y === y){
						if(thisSpot === " "){
							thisSpot = "S";
						}
					}
				}
				for(var i = 0; i < invalidArray.length; i++){
					if(invalidArray[i].x === x && invalidArray[i].y === y){
						if(thisSpot === " "){
							thisSpot = "i";
						}
					}
				}
				mapVisual += thisSpot;
			}
			mapVisual += "\n";
		}
		
		this.visual = mapVisual;
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
}

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

var players = [];
players.push({ID: 'player1'});
players.push({ID: 'player2'});
players.push({ID: 'player3'});
players.push({ID: 'player4'});
players.push({ID: 'player5'});
players.push({ID: 'player6'});
var map = new Map(30, 30);
map.initialize(new Random(12345), players, 15);
console.log(map);