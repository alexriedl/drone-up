export default class Color {
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 1) {
	}
}

export const BLACK = new Color();
export const WHITE = new Color(1, 1, 1);
export const RED = new Color(1, 0, 0);
export const GREEN = new Color(0, 1, 0);
export const BLUE = new Color(0, 0, 1);
