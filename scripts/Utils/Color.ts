export default class Color {
	public readonly r: number;
	public readonly g: number;
	public readonly b: number;
	public readonly a: number;

	public static BLACK = new Color();
	public static WHITE = new Color(1, 1, 1);
	public static RED = new Color(1, 0, 0);
	public static GREEN = new Color(0, 1, 0);
	public static BLUE = new Color(0, 0, 1);

	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	/**
	 * Return the value of this color as an array
	 */
	public all(): number[] {
		return [this.r, this.g, this.b, this.a];
	}

	/**
	 * Create a new color a percentage lighter than this color.
	 * Parameter is a value between 0 and 1.
	 */
	public lighten(percent: number): Color {
		const r = Math.min(1, this.r + 1 * percent);
		const g = Math.min(1, this.g + 1 * percent);
		const b = Math.min(1, this.b + 1 * percent);
		return new Color(r, g, b, this.a);
	}
}
