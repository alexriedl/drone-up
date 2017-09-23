import { Random } from 'Engine/Utils';
import { vec2 } from 'Engine/Math';

export interface IScanResult {
	position: vec2;
	type: string;
}

abstract class Controller {
	public scanResult: IScanResult[];
	protected readonly randomizer: Random;

	constructor(randomizer: Random) {
		this.randomizer = randomizer;
	}

	public abstract getAction(): string;

	protected moveRight(): string { return 'MoveRight'; }
	protected moveLeft(): string { return 'MoveLeft'; }
	protected moveUp(): string { return 'MoveUp'; }
	protected moveDown(): string { return 'MoveDown'; }

	protected pushRight(): string { return 'PushRight'; }
	protected pushLeft(): string { return 'PushLeft'; }
	protected pushUp(): string { return 'PushUp'; }
	protected pushDown(): string { return 'PushDown'; }

	protected pullRight(): string { return 'PullRight'; }
	protected pullLeft(): string { return 'PullLeft'; }
	protected pullUp(): string { return 'PullUp'; }
	protected pullDown(): string { return 'PullDown'; }
}

export default Controller;
