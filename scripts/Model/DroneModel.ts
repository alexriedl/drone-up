import { Color } from '../Utils';
import SimpleRectangle from './SimpleRectangle';

export default class DroneModel extends SimpleRectangle {
	public constructor(color: Color) {
		super(color);
	}
}
