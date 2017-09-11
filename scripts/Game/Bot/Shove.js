import Controller from './Controller';

export default class Shove extends Controller {
	nextAction = 0;

	getAction() {
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
