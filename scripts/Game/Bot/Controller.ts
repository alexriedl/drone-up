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

	private internalAction: string;

	constructor(randomizer: Random) {
		this.randomizer = randomizer;
	}

	protected abstract getAction(): string;

	protected moveRight(): void { this.internalAction = 'MoveRight'; }
	protected moveLeft(): void { this.internalAction = 'MoveLeft'; }
	protected moveUp(): void { this.internalAction = 'MoveUp'; }
	protected moveDown(): void { this.internalAction = 'MoveDown'; }

	protected pushRight(): void { this.internalAction = 'PushRight'; }
	protected pushLeft(): void { this.internalAction = 'PushLeft'; }
	protected pushUp(): void { this.internalAction = 'PushUp'; }
	protected pushDown(): void { this.internalAction = 'PushDown'; }

	protected pullRight(): void { this.internalAction = 'PullRight'; }
	protected pullLeft(): void { this.internalAction = 'PullLeft'; }
	protected pullUp(): void { this.internalAction = 'PullUp'; }
	protected pullDown(): void { this.internalAction = 'PullDown'; }

	public runController(): string {
		const action = this.getAction() || this.internalAction;
		this.internalAction = '';
		return action;
	}

	public setActions(actions: string[]) {
		this.actions = actions;
	}
}

export default Controller;
