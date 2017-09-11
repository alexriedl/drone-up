import Controller from './Controller';

export default class PushBot extends Controller {
	getAction() {
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
