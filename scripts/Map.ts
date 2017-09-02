import { Drone, GameObject } from './GameObjects';
import { Random, ICoords, ObjectType } from './Utils';

export default class Map {
	private mapObjects: GameObject[];
	private players: Drone[];
	private spikes: GameObject[];

	constructor(private xSize: number, private ySize: number) {
	}

	initialize(randomizer: Random, players: Drone[], spikePercent: number) {
		var spikeArray: GameObject[] = [];
		var invalidArray: ICoords[] = [];

		// first, generate all players and mark their "safe space" as invalid for further placements
		this.generatePlayers(randomizer, players, invalidArray);

		// then, generate spikes (up to the percentage or 1000 failures, whichever happens first)
		this.generateSpikes(randomizer, spikePercent, spikeArray, invalidArray);

		this.players = players;
		this.spikes = spikeArray;
		this.mapObjects = spikeArray.concat(players);
	}

	public getMapObjects(): GameObject[] {
		return this.mapObjects;
	}

	public getPlayers(): Drone[] {
		return this.players;
	}

	public getXSize(): number {
		return this.xSize;
	}

	public getYSize(): number {
		return this.ySize;
	}

	public generatePlayers(randomizer: Random, players: Drone[], invalidArray: ICoords[]): void {
		for (let p = 0, plen = players.length; p < plen; p++) {
			const player = players[p];
			let attempts = 0;
			let validSpot = false;
			while (!validSpot) {
				// only attempt up to 1000 times to prevent an infinite loop; if we can't place a player, bail out
				if (attempts > 1000) {
					alert('player could not be placed after 1000 attempts, aborting');
					return null;
				}

				const x = randomizer.next() % this.xSize;
				const y = randomizer.next() % this.ySize;

				// doublecheck all invalid spaces
				const attemptValid = this.checkInvalid(x, y, invalidArray);

				if (attemptValid) {
					player.x = x;
					player.y = y;
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

	public generateSpikes(randomizer: Random, spikePercent: number, spikeArray: GameObject[], invalidArray: ICoords[]) {
		var spikesGenned = 0;
		var spikesFailed = 0;
		var neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;
		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			var spikeId = '__reservedSpikeNumber' + (spikesGenned + 1) + '__';

			var x = randomizer.next() % this.xSize;
			var y = randomizer.next() % this.ySize;

			var attemptValid = this.checkInvalid(x, y, invalidArray);

			if (attemptValid) {
				spikeArray.push(new GameObject(spikeId, ObjectType.Spike, undefined, x, y));

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

	public checkInvalid(x: number, y: number, invalidArray: ICoords[]) {
		var attemptValid = true;

		for (var i = 0, ilen = invalidArray.length; i < ilen && attemptValid; i++) {
			var inv = invalidArray[i];
			if (x === inv.x && y === inv.y) {
				attemptValid = false;
			}
		}

		return attemptValid;
	}

	public markInvalid(x: number, y: number, numSpread: number, invalidArray: ICoords[]): void {
		if (numSpread < 0)
			return;

		// check if the current tile is invalid to avoid adding duplicates
		var invalidDoesNotExist = this.checkInvalid(x, y, invalidArray);
		if (invalidDoesNotExist) {
			invalidArray.push({ x: x, y: y });
		}

		// recursively call out in cardinal directions
		this.markInvalid((x + 1) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid((x - 1 + this.xSize) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid(x, (y + 1) % this.ySize, numSpread - 1, invalidArray);
		this.markInvalid(x, (y - 1 + this.ySize) % this.ySize, numSpread - 1, invalidArray);
	}

	public removeCrashedDrones(): Drone[] {
		let crashed: Drone[] = [];
		let playerRemovalIndices = [];
		let gameObjectRemovalIndices = [];

		for (var i = 0, playerCount = this.players.length; i < playerCount; i++) {
			for (var j = 0, mapObjectCount = this.mapObjects.length; j < mapObjectCount; j++) {
				var player = this.players[i];
				var otherObject = this.mapObjects[j];

				if(player.ID !== otherObject.ID && player.x === otherObject.x && player.y === otherObject.y) {
					crashed.push(player);
					playerRemovalIndices.push(i);
				}
			}
		}

		for (var j = 0, len = playerRemovalIndices.length; j < len; j++) {
			this.players.splice(playerRemovalIndices[j], 1);
		}

		for (let i = 0; i < crashed.length; i++) {
			const c = crashed[i];
			const index = this.mapObjects.indexOf(c);
			if(index > -1) {
				this.mapObjects.splice(index, 1);
			}
		}

		return crashed;
	}

	public scanFor(Id: string): GameObject[] {
		const scanDistance = Math.ceil(.33 * Math.min(this.xSize, this.ySize, 15));
		var gameObject = null;
		var scanSquares = [];
		var gameObjectsInRange = [];

		for (var i = 0, len = this.mapObjects.length; i < len; i++) {
			if (this.mapObjects[i].ID === Id) {
				gameObject = this.mapObjects[i];
			}
		}

		if (gameObject !== null) {
			this.markInvalid(gameObject.x, gameObject.y, scanDistance, scanSquares);

			for (var j = 0, len = this.mapObjects.length; j < len; j++) {
				if (!this.checkInvalid(this.mapObjects[j].x, this.mapObjects[j].y, scanSquares)) {
					gameObjectsInRange.push(this.mapObjects[j]);
				}
			}

			for (var k = 0, scanLen = scanSquares.length; k < scanLen; k++) {
				scanSquares[k].type = "empty";
				for (var l = 0, objInRangeLen = gameObjectsInRange.length; l < objInRangeLen && scanSquares[k].type === "empty"; l++) {
					if (scanSquares[k].x === gameObjectsInRange[l].x && scanSquares[k].y === gameObjectsInRange[l].y) {
						if (gameObjectsInRange[l].ID === Id) {
							scanSquares[k].type = "you";
						} else {
							scanSquares[k].type = gameObjectsInRange[l].type;
						}
					}
				}
			}

			for (var m = 0, len = scanSquares.length; m < len; m++) {
				var square = scanSquares[m];
				if (Math.abs(gameObject.x - scanSquares[m].x) > scanDistance) {
					if (gameObject.x - scanSquares[m].x < 0) {
						scanSquares[m].x = this.xSize + gameObject.x - scanSquares[m].x;
					} else if (gameObject.x + scanSquares[m].x > this.xSize) {
						0 - gameObject.x + scanSquares[m].x;
					}
				} else {
					if (gameObject.x > scanSquares[m].x) {
						scanSquares[m].x = gameObject.x - scanSquares[m].x;
					} else {
						scanSquares[m].x = scanSquares[m].x - gameObject.x
					}
				}

				if (Math.abs(gameObject.y - scanSquares[m].y) > scanDistance) {
					if (gameObject.y - scanSquares[m].y < 0) {
						scanSquares[m].y = this.xSize + gameObject.y - scanSquares[m].y;
					} else if (gameObject.y + scanSquares[m].y > this.ySize) {
						0 - gameObject.y + scanSquares[m].y;
					}
				} else {
					if (gameObject.y > scanSquares[m].y) {
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
	public getNextObjectUpFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort(function (a, b) {
			return b.y - a.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectDownFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort(function (a, b) {
			return a.y - b.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectLeftFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort(function (a, b) {
			return b.x - a.x;
		});

		for (let k = 0; k < sortedObjects.length; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectRightFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort(function (a, b) {
			return a.x - b.x;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getAllObjectsOnSameY(y: number): GameObject[] {
		var sameYList = [];
		for (var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
			if (this.mapObjects[k].y === y)
				sameYList.push(this.mapObjects[k]);
		}
		return sameYList;
	}

	public getAllObjectsOnSameX(x: number): GameObject[] {
		var sameXList = [];
		for (var k = 0, objectCount = this.mapObjects.length; k < objectCount; k++) {
			if (this.mapObjects[k].x === x)
				sameXList.push(this.mapObjects[k]);
		}
		return sameXList;
	}
}
