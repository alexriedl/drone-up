import { RenderObjectTypes } from './RenderObjects';
import Color from '../Utils/Color';

export default class RenderGroup {
	public objects: Object[] = [];

	// TODO: Allow custom shaders?
	public pushRectangle(origin: TSM.vec3, size: TSM.vec3, color: Color = new Color(1, 1, 1)): void {
		this.objects.push({
			type: RenderObjectTypes.Rectangle,
			origin: origin,
			size: size,
			color: color
		});
	}

	public pushGrid(size: TSM.vec3, color: Color = new Color(1, 1, 1), thickness: number = 0.2, space: number = 1): void {
		const halfWidth = size.x / 2;
		const halfHeight = size.y / 2;
		const halfSpace = space / 2;

		for (let x = 0; x < size.x; x += space) {
			this.pushRectangle(new TSM.vec3([x - halfSpace, halfHeight - halfSpace, 0]), new TSM.vec3([thickness, size.y, 0]), color);
		}

		for (let y = 0; y < size.y; y += space) {
			this.pushRectangle(new TSM.vec3([halfWidth - halfSpace, y - halfSpace, 0]), new TSM.vec3([size.x, thickness, 0]), color);
		}
	}
}
