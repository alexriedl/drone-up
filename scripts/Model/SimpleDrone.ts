import { Color } from '../Utils';
import Renderer from '../Renderer';
import SimpleRectangle from './SimpleRectangle';

export default class SimpleDrone extends SimpleRectangle {
	public constructor(renderer: Renderer, color: Color) {
		super(renderer, color);
	}
}
