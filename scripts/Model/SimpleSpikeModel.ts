import { Animation, AnimationType } from '../Animations';
import { Coordinate, Color } from '../Utils';
import { RenderGroup } from '../Renderer';
import Model from './Model';

const spikeColor = new Color(.6, .6, .6);

export default class SimpleSpikeModel extends Model {
	protected renderModel(group: RenderGroup, position: Coordinate, animation?: Animation): void {
		let bonusSize = 0;
		if(animation) {
			switch (animation.animationType) {
				case AnimationType.Move: bonusSize = 0.5; break;
				case AnimationType.Bump: bonusSize = 0.25; break;
				case AnimationType.Pull:
				case AnimationType.Push:
					bonusSize = -0.5; break;
			}
		}
		const animationSize = new TSM.vec3([1 + bonusSize, 1 + bonusSize, 0]);
		group.pushRectangle(new TSM.vec3([position.x, position.y, 0]), animationSize, spikeColor);
	}
}
