import { Random } from '../../Utils';
import { vec2 } from '../../Math';

export interface IScanResult {
	position: vec2;
	type: string;
}

abstract class Controller {
	public scanResult: IScanResult[];
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
