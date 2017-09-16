import { Color } from '../../Utils';
import { ResizeAnimation } from '../../Animations';
import { ScanModel } from '../../Model';
import { vec2 } from '../../Math';
import BaseObject from './BaseObject';

// NOTE: This is intentionally very basic. Probably could be used for more than just scan
export default class ScanObject extends BaseObject {
	public constructor(ID: string, position: vec2, color: Color = new Color(0.58, 0, 0.827)) {
		super(ID, position, new ScanModel(color));
		this.setAnimation(new ResizeAnimation(5, 1, 350));
	}
}
