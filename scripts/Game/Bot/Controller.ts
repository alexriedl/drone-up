import { Random, Interfaces } from '../../Utils';

abstract class Controller {
	public scanResult: Interfaces.IScanResult[];
	protected actions: string[];
	protected readonly randomizer: Random;

	constructor(randomizer: Random) {
		this.randomizer = randomizer;
	}

	public abstract getAction(): string;

	public setActions(actions: string[]) {
		this.actions = actions;
	}
}

export default Controller;
