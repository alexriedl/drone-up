import { Random, Interfaces } from '../Utils';

abstract class Controller {
	public scanResult: Interfaces.IScanResult[];
	protected actions: string[];

	constructor(protected readonly randomizer: Random) { }
	public abstract getAction(): string;

	public setActions(actions: string[]) {
		this.actions = actions;
	}
}

export default Controller;
