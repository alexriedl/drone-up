import { Color } from '../Utils';
import SimpleRectangle from './SimpleRectangle';

export default class SimpleDrone extends SimpleRectangle {
	public constructor(color: Color) {
		super(color);
	}
}
