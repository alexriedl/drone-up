import Buffer from './Buffer';

export default class CustomBuffer extends Buffer {
	private values: number[];

	public constructor(values: number[]) {
		super();
		this.values = values;
	}

	protected getValues(): number[] {
		const v = this.values;
		this.values = undefined;
		return v;
	}
}
