import { GameObject } from '../GameObject';
import { Random } from '../Utils';

export abstract class Controller {
	public scanResult: GameObject[];
	protected actions: string[];

	constructor(protected readonly randomizer: Random) { }
	public abstract getAction(): string;

	public setActions(actions: string[]) {
		this.actions = actions;
	}
}

export class LuigiBot extends Controller {
	public getAction(): string {
		if (this.randomizer.nextFloat() > 0.2) return 'Scan';
		return 'MoveRight';
	}
}

export class PushBot extends Controller {
	public getAction(): string {
		var action = this.randomizer.next() % 4;
		switch (action) {
			case 1:
				return 'PushUp';
			case 2:
				return 'PushDown';
			case 3:
				return 'PushLeft';
			case 4:
			default:
				return 'PushRight';
		}
	}
}

export class PullBot extends Controller {
	public getAction(): string {
		var action = this.randomizer.next() % 4;
		switch (action) {
			case 1:
				return 'PullUp';
			case 2:
				return 'PullDown';
			case 3:
				return 'PullLeft';
			case 4:
			default:
				return 'PullRight';
		}
	}
}

export class ChickenBot extends Controller {
	public getAction(): string {
		var action = this.randomizer.next() % 4;
		switch (action) {
			case 1:
				return 'MoveUp';
			case 2:
				return 'MoveDown';
			case 3:
				return 'MoveLeft';
			case 4:
			default:
				return 'MoveRight';
		}
	}
}

export class ShoveBot extends Controller {
	private nextAction: number = 0;

	public getAction(): string {
		var action;
		switch (this.nextAction) {
			case 0:
				action = 'PushRight';
				break;
			case 1:
				action = 'PushUp';
				break;
			case 2:
				action = 'MoveRight';
				break;
		}
		this.nextAction = (this.nextAction + 1) % 3;
		return action;
	}
}

export class RandomBot extends Controller {
	public getAction(): string {
		return this.actions[this.randomizer.next() % this.actions.length];
	}
}
