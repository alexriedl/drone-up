/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};

export class Controller {
	constructor(seed) {
		this.randomizer = new Random(seed);
	}
	getAction() {
		return this.actions[this.randomizer.next() % this.actions.length];
	}
}

export class LuigiBot extends Controller {
	getAction() {
		return "Scan";
	}
}

export class PushBot extends Controller {
	getAction() {
		var action = this.randomizer.next() % 4;
		switch(action) {
			case 1:
				return "PushUp";
				break;
			case 2:
				return "PushDown";
				break;
			case 3:
				return "PushLeft";
				break;
			case 4:
			default:
				return "PushRight";
				break;
		}
	}
}

export class PullBot extends Controller {
	getAction() {
		var action = this.randomizer.next() % 4;
		switch(action) {
			case 1:
				return "PullUp";
				break;
			case 2:
				return "PullDown";
				break;
			case 3:
				return "PullLeft";
				break;
			case 4:
			default:
				return "PullRight";
				break;
		}
	}
}

export class ChickenBot extends Controller {
	getAction() {
		var action = this.randomizer.next() % 4;
		switch(action) {
			case 1:
				return "MoveUp";
				break;
			case 2:
				return "MoveDown";
				break;
			case 3:
				return "MoveLeft";
				break;
			case 4:
			default:
				return "MoveRight";
				break;
		}
	}
}

export class ShoveBot extends Controller {
	getAction() {
		if (this.nextAction === undefined)
			this.nextAction = 0;

		var action;
		switch(this.nextAction) {
			case 0:
				action = "PushRight";
				break;
			case 1:
				action = "PushUp";
				break;
			case 2:
				action = "MoveRight";
				break;
		}
		this.nextAction = (this.nextAction + 1) % 3;
		return action;
	}
}

export class RandomBot extends Controller {
	getAction() {
		return this.actions[this.randomizer.next() % this.actions.length];
	}
}