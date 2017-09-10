import { Drone, GameObject } from './GameObject';
import { Coordinate, Enums, MarkList, Random, Interfaces } from './Utils';
import { SimpleSpikeModel } from './Model';

export default class Map {
	private gameObjects: GameObject[];
	private players: Drone[];
	private spikes: GameObject[];
	private xSize: number;
	private ySize: number;

	public constructor(xSize: number, ySize: number) {
		this.xSize = xSize;
		this.ySize = ySize;
	}

	public initialize(randomizer: Random, players: Drone[], spikePercent: number) {
		const markedList = new MarkList(this.xSize, this.ySize);

		// first, generate all players and mark their "safe space" as invalid for further placements
		this.generatePlayers(randomizer, players, markedList);

		// then, generate spikes (up to the percentage or 1000 failures, whichever happens first)
		const spikeArray = this.generateSpikes(randomizer, spikePercent, markedList);

		this.players = players;
		this.spikes = spikeArray;
		this.gameObjects = spikeArray.concat(players);
	}

	public getGameObjects(): GameObject[] {
		return this.gameObjects;
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

	public removeCrashedDrones(): Drone[] {
		const crashed: Drone[] = [];
		const playerRemovalIndices = [];
		const gameObjectRemovalIndices = [];

		for (let i = 0, playerCount = this.players.length; i < playerCount; i++) {
			for (let j = 0, mapObjectCount = this.gameObjects.length; j < mapObjectCount; j++) {
				const player = this.players[i];
				const otherObject = this.gameObjects[j];

				if (player.ID !== otherObject.ID && player.position.equal(otherObject.position)) {
					crashed.push(player);
					playerRemovalIndices.push(i);
					gameObjectRemovalIndices.push(j);
				}
			}
		}

		for (const index of playerRemovalIndices) {
			this.players.splice(index, 1);
		}

		for (const index of gameObjectRemovalIndices) {
			this.gameObjects.splice(index, 1);
		}

		return crashed;
	}

	public scanFor(entity: GameObject): Interfaces.IScanResult[] {
		const scanDistance = Math.ceil(.33 * Math.min(this.xSize, this.ySize, 15));
		const gameObjectsInRange: GameObject[] = [];
		const markList = new MarkList(this.xSize, this.ySize);

		markList.mark(entity.position, scanDistance);

		for (const scanned of this.gameObjects) {
			if (markList.isMarked(scanned.position)) {
				gameObjectsInRange.push(scanned);
			}
		}

		return gameObjectsInRange.map(gameObject => {
			const type = gameObject.ID === entity.ID ? 'you' : gameObject.type.toString();
			let x = gameObject.position.x - entity.position.x;
			let y = gameObject.position.y - entity.position.y;
			return { type, x, y };
		});
	}

	// GetNextObjectUpFrom(this.Id) returns an ID of the next object up from the object with the given ID
	public getNextObjectUpFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.position.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.y - a.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectDownFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.position.x);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.y - b.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectLeftFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.position.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.x - a.position.x;
		});

		for (let k = 0; k < sortedObjects.length; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectRightFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.position.y);

		// sort the objects and find the ID -- we can then go one index further to find it
		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.x - b.position.x;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k].ID === entity.ID) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getAllObjectsOnSameY(y: number): GameObject[] {
		const sameYList = [];
		for (const mo of this.gameObjects) {
			if (mo.position.y === y) sameYList.push(mo);
		}
		return sameYList;
	}

	public getAllObjectsOnSameX(x: number): GameObject[] {
		const sameXList = [];
		for (const mo of this.gameObjects) {
			if (mo.position.x === x) sameXList.push(mo);
		}
		return sameXList;
	}

	private generatePlayers(randomizer: Random, players: Drone[], markedList: MarkList): void {
		for (const player of players) {
			let attempts = 0;
			let validSpot = false;

			while (!validSpot) {
				// only attempt up to 1000 times to prevent an infinite loop; if we can't place a player, bail out
				if (attempts > 1000) {
					alert('player could not be placed after 1000 attempts, aborting');
					return null;
				}

				const position = Coordinate.random(randomizer, this.xSize, this.ySize);
				const invalidPosition = markedList.isMarked(position);

				if (!invalidPosition) {
					player.position = position;
					validSpot = true;

					// add the player's "safe space" (anything a distance of <= 3 tiles away)
					markedList.mark(position, 3);
				}

				if (!validSpot) {
					attempts++;
				}
			}
		}
	}

	private generateSpikes(randomizer: Random, spikePercent: number, markedList: MarkList): GameObject[] {
		const spikeArray: GameObject[] = [];
		let spikesGenned = 0;
		let spikesFailed = 0;
		const neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;

		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			const position = Coordinate.random(randomizer, this.xSize, this.ySize);
			const invalidPosition = markedList.isMarked(position);

			if (!invalidPosition) {
				const ID = `__reservedSpikeNumber${spikesGenned + 1}__`;
				const model = new SimpleSpikeModel();
				const controller = undefined;
				spikeArray.push(new GameObject(ID, Enums.ObjectType.Spike, model, controller, position));

				// spikes only invalidate their tile, they get no "safe space"
				markedList.mark(position, 0);
			}

			if (invalidPosition) {
				spikesFailed++;
			}
			else {
				spikesGenned++;
			}
		}

		return spikeArray;
	}
}
