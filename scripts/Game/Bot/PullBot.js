import Controller from './Controller';

export default class PullBot extends Controller {
	getAction() {
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
