import { Color } from '../Utils';
import SimpleRectangle from './SimpleRectangle';

const spikeColor = new Color(.6, .6, .6);

export default class SimpleSpike extends SimpleRectangle {
	public constructor() {
		super(spikeColor);
	}
}
