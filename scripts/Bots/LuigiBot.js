import Controller from './Controller';

export default class LuigiBot extends Controller {
	getAction() {
		if (this.randomizer.nextFloat() > 0.2) return 'Scan';
		return 'MoveRight';
	}
}
