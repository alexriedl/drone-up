import Controller from './Controller';

export default class Shove extends Controller {
	nextAction = 0;

	getAction() {
		this.nextAction = (this.nextAction + 1) % 3;
		switch (this.nextAction) {
			case 0: this.pushRight(); break;
			case 1: this.pushUp(); break;
			case 2: this.moveRight(); break;
		}
	}
}
