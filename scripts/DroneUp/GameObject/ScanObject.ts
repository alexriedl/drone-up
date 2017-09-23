import { ResizeAnimation } from 'DroneUp/Animations';
import GameObject from './GameObject';

import { Color } from 'Engine/Utils';
import { ScanModel } from 'Engine/Model';

// NOTE: This is intentionally very basic. Probably could be used for more than just scan
export default class ScanObject extends GameObject {
	public constructor(parent: GameObject, color: Color = new Color(0.58, 0, 0.827)) {
		super(new ScanModel(color));
		this.setParent(parent);

		this.setAnimation(new ResizeAnimation(5, 1, 350), true);
	}
}
