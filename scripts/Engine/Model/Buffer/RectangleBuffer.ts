import Buffer from './Buffer';

export default class RectangleBuffer extends Buffer {
	protected getValues(): number[] {
		return [
			-0.5, -0.5,
			+0.5, -0.5,
			+0.5, +0.5,
			-0.5, +0.5,
		];
	}

	public static createBuffer(): RectangleBuffer {
		return Buffer.create(RectangleBuffer);
	}
}
