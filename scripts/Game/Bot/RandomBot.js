import Controller from './Controller';

export default class RandomBot extends Controller {
	getAction() {
		return this.actions[this.randomizer.next() % this.actions.length];
	}
}
