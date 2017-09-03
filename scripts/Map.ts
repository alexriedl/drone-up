import { Drone, GameObject } from './GameObjects';
import { ICoords, ObjectType, Random } from './Utils';

export default class Map {
	private mapObjects: GameObject[];
	private players: Drone[];
	private spikes: GameObject[];

	constructor(private xSize: number, private ySize: number) {
	}

	public initialize(randomizer: Random, players: Drone[], spikePercent: number) {
		const spikeArray: GameObject[] = [];
		const invalidArray: ICoords[] = [];

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

	public checkInvalid(x: number, y: number, invalidArray: ICoords[]) {
		for (const inv of invalidArray) {
			if (x === inv.x && y === inv.y) {
				return false;
			}
		}

		return true;
	}

	public markInvalid(x: number, y: number, numSpread: number, invalidArray: ICoords[]): void {
		if (numSpread < 0) return;

		// check if the current tile is invalid to avoid adding duplicates
		const invalidDoesNotExist = this.checkInvalid(x, y, invalidArray);
		if (invalidDoesNotExist) {
			invalidArray.push({ x, y });
		}

		// recursively call out in cardinal directions
		this.markInvalid((x + 1) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid((x - 1 + this.xSize) % this.xSize, y, numSpread - 1, invalidArray);
		this.markInvalid(x, (y + 1) % this.ySize, numSpread - 1, invalidArray);
		this.markInvalid(x, (y - 1 + this.ySize) % this.ySize, numSpread - 1, invalidArray);
	}

	public removeCrashedDrones(): Drone[] {
		const crashed: Drone[] = [];
		const playerRemovalIndices = [];
		const gameObjectRemovalIndices = [];

		for (let i = 0, playerCount = this.players.length; i < playerCount; i++) {
			for (let j = 0, mapObjectCount = this.mapObjects.length; j < mapObjectCount; j++) {
				const player = this.players[i];
				const otherObject = this.mapObjects[j];

				if (player.ID !== otherObject.ID && player.x === otherObject.x && player.y === otherObject.y) {
					crashed.push(player);
					playerRemovalIndices.push(i);
				}
			}
		}

		for (let j = 0, len = playerRemovalIndices.length; j < len; j++) {
			this.players.splice(playerRemovalIndices[j], 1);
		}

		for (const c of crashed) {
			const index = this.mapObjects.indexOf(c);
			if (index > -1) {
				this.mapObjects.splice(index, 1);
			}
		}

		return crashed;
	}

	public scanFor(entity: GameObject): GameObject[] {
		const scanDistance = Math.ceil(.33 * Math.min(this.xSize, this.ySize, 15));
		const scanSquares = [];
		const gameObjectsInRange = [];

		this.markInvalid(entity.x, entity.y, scanDistance, scanSquares);

		for (const scanned of this.mapObjects) {
			if (!this.checkInvalid(scanned.x, scanned.y, scanSquares)) {
				gameObjectsInRange.push({...scanned});
			}
		}

		for (const scanned of scanSquares) {
			scanned.type = 'empty';
			for (const gameObject of gameObjectsInRange) {
				if (scanned.x === gameObject.x && scanned.y === gameObject.y) {
					if (gameObject.ID === entity.ID) {
						scanned.type = 'you';
						break;
					}
					else {
						scanned.type = gameObject.type;
					}
				}
			}
		}

		for (const square of scanSquares) {
			if (Math.abs(entity.x - square.x) > scanDistance) {
				if (entity.x - square.x < 0) {
					square.x = this.xSize + entity.x - square.x;
				} else if (entity.x + square.x > this.xSize) {
					// 0 - entity.x + square.x;
				}
			} else {
				if (entity.x > square.x) {
					square.x = entity.x - square.x;
				} else {
					square.x = square.x - entity.x;
				}
			}

			if (Math.abs(entity.y - square.y) > scanDistance) {
				if (entity.y - square.y < 0) {
					square.y = this.xSize + entity.y - square.y;
				} else if (entity.y + square.y > this.ySize) {
					// 0 - entity.y + square.y;
				}
			} else {
				if (entity.y > square.y) {
					square.y = entity.y - square.y;
				} else {
					square.y = square.y - entity.y;
				}
			}
		}

		return scanSquares;
	}

	// GetNextObjectUpFrom(this.Id) returns an ID of the next object up from the object with the given ID
	public getNextObjectUpFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort((a, b) => {
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
		const sortedObjects = lineObjects.sort((a, b) => {
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
		const sortedObjects = lineObjects.sort((a, b) => {
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
		const sortedObjects = lineObjects.sort((a, b) => {
			return a.x - b.x;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getAllObjectsOnSameY(y: number): GameObject[] {
		const sameYList = [];
		for (const mo of this.mapObjects) {
			if (mo.y === y) sameYList.push(mo);
		}
		return sameYList;
	}

	public getAllObjectsOnSameX(x: number): GameObject[] {
		const sameXList = [];
		for (const mo of this.mapObjects) {
			if (mo.x === x) sameXList.push(mo);
		}
		return sameXList;
	}

	private generatePlayers(randomizer: Random, players: Drone[], invalidArray: ICoords[]): void {
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
		}
	}

	private generateSpikes(randomizer: Random, spikePercent: number, spikeArray: GameObject[], invalidArray: ICoords[]) {
		let spikesGenned = 0;
		let spikesFailed = 0;
		const neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;
		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			const spikeId = '__reservedSpikeNumber' + (spikesGenned + 1) + '__';

			const x = randomizer.next() % this.xSize;
			const y = randomizer.next() % this.ySize;

			const attemptValid = this.checkInvalid(x, y, invalidArray);

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
}
