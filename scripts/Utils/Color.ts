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

	public all(): number[] {
		return [this.r, this.g, this.b, this.a];
	}
}
