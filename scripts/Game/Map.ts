import { ResizeAnimation } from '../Animations';
import { Drone, Spike, GameObject } from './GameObject';
import { MarkList, Random } from '../Utils';
import { Model } from '../Model';
import { vec3 } from '../Math';

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
		createSpikeModel: () => Model) {
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

	public removeCrashedDrones(): boolean {
		const crashed: Drone[] = [];

		for (const player of this.players.filter((p) => p.isAlive())) {
			for (const object of this.gameObjects) {
				if (player !== object && player.position.exactEquals(object.position)) {
					crashed.push(player);
				}
			}
		}

		let someoneIsAnimating = false;
		for (const dead of crashed) {
			const gameObjectsIndex = this.gameObjects.indexOf(dead);
			if (gameObjectsIndex > -1) {
				this.gameObjects.splice(gameObjectsIndex, 1);
			}

			// TODO: Dont mark drone dead here once map is a scene graph
			dead.alive = false;
			dead.setAnimation(new ResizeAnimation(1, 5, 200), true);
			someoneIsAnimating = true;
		}

		return someoneIsAnimating;
	}

	public getNextObjectUpFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.position.x);

		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.y - a.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === entity) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectDownFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameX(entity.position.x);

		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.y - b.position.y;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === entity) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectLeftFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.position.y);

		const sortedObjects = lineObjects.sort((a, b) => {
			return b.position.x - a.position.x;
		});

		for (let k = 0; k < sortedObjects.length; k++) {
			if (sortedObjects[k] === entity) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getNextObjectRightFrom(entity: GameObject): GameObject {
		const lineObjects = this.getAllObjectsOnSameY(entity.position.y);

		const sortedObjects = lineObjects.sort((a, b) => {
			return a.position.x - b.position.x;
		});

		for (let k = 0, objectCount = sortedObjects.length; k < objectCount; k++) {
			if (sortedObjects[k] === entity) {
				return sortedObjects[(k + 1) % sortedObjects.length];
			}
		}
	}

	public getAllObjectsOnSameY(y: number): GameObject[] {
		return this.gameObjects.filter((go) => go.position.y === y);
	}

	public getAllObjectsOnSameX(x: number): GameObject[] {
		return this.gameObjects.filter((go) => go.position.x === x);
	}

	private static randomPosition(randomzier: Random, maxX: number, maxY: number): vec3 {
		const x = randomzier.nextRangeInt(0, maxX);
		const y = randomzier.nextRangeInt(0, maxY);
		return new vec3(x, y);
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
		createSpikeModel: () => Model): Spike[] {
		const spikeArray: Spike[] = [];
		let spikesGenned = 0;
		let spikesFailed = 0;
		const neededSpikes = (this.xSize * this.ySize * spikePercent) / 100;

		while (spikesGenned < neededSpikes && spikesFailed < 1000) {
			const position = Map.randomPosition(randomizer, this.xSize, this.ySize);
			const invalidPosition = markedList.isMarked(position);

			if (!invalidPosition) {
				const model = createSpikeModel();
				spikeArray.push(new Spike(model, position));

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
