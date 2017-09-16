import { Drone, Spike, GameObject } from './GameObject';
import { MarkList, Random, Interfaces } from '../Utils';
import { Model } from '../Model';
import { vec2 } from '../Math';

export default class Map {
	public readonly xSize: number;
	public readonly ySize: number;
	private gameObjects: GameObject[];
	private players: Drone[];

	public constructor(xSize: number, ySize: number) {
		this.xSize = xSize;
		this.ySize = ySize;
	}

	public initialize(randomizer: Random, players: Drone[], spikePercent: number,
		createSpikeModel: (id: string) => Model) {
		const markedList = new MarkList(this.xSize, this.ySize);

		// first, generate all players and mark their "safe space" as invalid for further placements
		this.generatePlayers(randomizer, players, markedList);

		// then, generate spikes (up to the percentage or 1000 failures, whichever happens first)
		const spikeArray = this.generateSpikes(randomizer, spikePercent, markedList, createSpikeModel);

		this.players = players;
		this.gameObjects = spikeArray.concat(players);
	}

	public getGameObjects(): GameObject[] {
		return this.gameObjects;
	}

	public getPlayers(): Drone[] {
		return this.players;
	}

	public removeCrashedDrones(): Drone[] {
		const crashed: Drone[] = [];

		for (let i = 0, playerCount = this.players.length; i < playerCount; i++) {
			for (const otherObject of this.gameObjects) {
				const player = this.players[i];

				if (player.ID !== otherObject.ID && player.position.exactEquals(otherObject.position)) {
					crashed.push(player);
				}
			}
		}

		for (const dead of crashed) {
			const gameObjectsIndex = this.gameObjects.indexOf(dead);
			if (gameObjectsIndex > -1) {
				this.gameObjects.splice(gameObjectsIndex, 1);
			}

			const playerIndex = this.players.indexOf(dead);
			if (playerIndex > -1) {
				this.players.splice(playerIndex, 1);
			}
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

		return gameObjectsInRange.map((gameObject) => {
			const type = gameObject.ID === entity.ID ? 'you' : gameObject.type.toString();
			const x = gameObject.position.x - entity.position.x;
			const y = gameObject.position.y - entity.position.y;
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

	private static randomPosition(randomzier: Random, maxX: number, maxY: number): vec2 {
		const x = randomzier.nextRangeInt(0, maxX);
		const y = randomzier.nextRangeInt(0, maxY);
		return new vec2(x, y);
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

				const position = Map.randomPosition(randomizer, this.xSize, this.ySize);
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

	private generateSpikes(randomizer: Random, spikePercent: number, markedList: MarkList,
		createSpikeModel: (id: string) => Model): Spike[] {
		const spikeArray: Spike[] = [];
		let spikesGenned = 0;
		let spikesFailed = 0;
		const neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;

		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			const position = Map.randomPosition(randomizer, this.xSize, this.ySize);
			const invalidPosition = markedList.isMarked(position);

			if (!invalidPosition) {
				const ID = `__reservedSpikeNumber${spikesGenned + 1}__`;
				const model = createSpikeModel(ID);
				spikeArray.push(new Spike(ID, model, position));

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
