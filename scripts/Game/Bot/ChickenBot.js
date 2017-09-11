import Controller from './Controller';

export default class ChickenBot extends Controller {
	getAction() {
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
