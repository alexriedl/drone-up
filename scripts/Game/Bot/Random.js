import Controller from './Controller';

export default class Random extends Controller {
	actions = [
		'Scan',
		'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight',
		'PullUp', 'PullDown', 'PullLeft', 'PullRight',
		'PushUp', 'PushDown', 'PushLeft', 'PushRight',
	];

	getAction() {
		return this.actions[this.randomizer.next() % this.actions.length];
	}
}
