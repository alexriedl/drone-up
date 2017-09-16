import { vec4 } from '../Math';

export default class Color extends vec4 {
	public constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
		super(r, g, b, a);
	}

	public static BLACK = new Color();
	public static WHITE = new Color(1, 1, 1);
	public static RED = new Color(1, 0, 0);
	public static GREEN = new Color(0, 1, 0);
	public static BLUE = new Color(0, 0, 1);

	/**
	 * Create a new color a percentage lighter than this color.
	 * Parameter is a value between 0 and 1.
	 *
	 * NOTE: This is an extremely nieve way of doing a lighten. Do
	 * not rely on this being perfect
	 */
	public lighten(percent: number): Color {
		const r = Math.min(1, this.r + 1 * percent);
		const g = Math.min(1, this.g + 1 * percent);
		const b = Math.min(1, this.b + 1 * percent);
		return new Color(r, g, b, this.a);
	}

	/**
	 * Create a new color a percentage darken than this color.
	 * Parameter is a value between 0 and 1.
	 *
	 * NOTE: This is an extremely nieve way of doing a darken. Do
	 * not rely on this being perfect
	 */
	public darken(percent: number): Color {
		const r = Math.max(0, this.r - 1 * percent);
		const g = Math.max(0, this.g - 1 * percent);
		const b = Math.max(0, this.b - 1 * percent);
		return new Color(r, g, b, this.a);
	}
}
