class Map {
	constructor(randomizer, players, spikePercent, xSize, ySize) {
		var playerArray = [];
		var spikeArray = [];

		// first, generate all players (attempt up to 1000 times, if this fails bail out)
		for (var p = 0, plen = players.length; p < plen; p++) {
			var player = players[p];
			var attempts = 0;
			var validSpot = false;
			while (!validSpot) {
				if (attempts > 1000) {
					alert('player could not be placed after 1000 attempts, aborting');
					return null;
				}

				var x = randomizer.next() % xSize;
				var y = randomizer.next() % ySize;

				var attemptValid = true;
				for (var o = 0, olen = playerArray.length; o < olen && attemptValid; o++) {
					var obj = playerArray[o];
					// players get a "safe space" of 3 (manhattan) distance from other things
					if ((Math.abs(x - obj.x) + Math.abs(y - obj.y)) <= 3) {
						attemptValid = false;
					}
				}
				if (attemptValid) {
					playerArray.push({
						ID: player.ID,
						x: x,
						y: y
					})
					validSpot = true;
				}

				if (!validSpot) {
					attempts++;
				}
			}
		};

		// then, generate spikes (up to the percentage or 1000 failures, whichever happens first)
		var spikesGenned = 0;
		var spikesFailed = 0;
		var neededSpikes = (xSize * ySize * spikePercent) / 100
		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			var spikeId = '__reservedSpikeNumber' + (spikesGenned + 1) + '__';

			var x = randomizer.next() % xSize;
			var y = randomizer.next() % ySize;

			var attemptValid = true;
			// first check against players (they still get a safe space)
			for (var o = 0, olen = playerArray.length; o < olen && attemptValid; o++) {
				var obj = playerArray[o];
				if ((Math.abs(x - obj.x) + Math.abs(y - obj.y)) <= 3) {
					attemptValid = false;
				}
			}
			// then check against the other spikes (which don't get a safe space)
			for (var o = 0, olen = spikeArray.length; o < olen && attemptValid; o++) {
				var obj = spikeArray[o];
				if ((Math.abs(x - obj.x) + Math.abs(y - obj.y)) === 0) {
					attemptValid = false;
				}
			}
			if (attemptValid) {
				spikeArray.push({
					ID: spikeId,
					x: x,
					y: y
				})
			}

			if (attemptValid) {
				spikesGenned++;
			} else {
				spikesFailed++;
			}
		}

		this.players = playerArray;
		this.spikes = spikeArray;
		this.mapObjects = playerArray.concat(spikeArray);
		this.xSize = xSize;
		this.ySize = ySize;
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
var player1 = {ID: 'player1'};
players.push(player1);
var player2 = {ID: 'player2'};
players.push(player2);
var player3 = {ID: 'player3'};
players.push(player3);
var player4 = {ID: 'player4'};
players.push(player4);
var map = new Map(new Random(5), players, 15, 10, 10);

