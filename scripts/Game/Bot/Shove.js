import Controller from './Controller';

export default class Shove extends Controller {
	nextAction = 0;

	getAction() {
		this.nextAction = (this.nextAction + 1) % 3;
		switch (this.nextAction) {
			case 0: return this.pushRight();
			case 1: return this.pushUp();
			default: return this.moveRight();
		}
	}
}
