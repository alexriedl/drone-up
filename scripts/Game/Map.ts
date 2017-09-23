import { ResizeAnimation } from '../Animations';
import { Drone, Spike, GameObject } from './GameObject';

export default class Map {
	public readonly xSize: number;
	public readonly ySize: number;
	private gameObjects: GameObject[];
	private players: Drone[];

	public constructor(xSize: number, ySize: number, players: Drone[], spikes: Spike[]) {
		this.xSize = xSize;
		this.ySize = ySize;

		this.players = players;
		this.gameObjects = spikes.concat(players);
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
}
