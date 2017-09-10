import { Color } from '../Utils';
import { RenderObjectTypes } from './RenderObjects';

export default class RenderGroup {
	public objects: any[] = [];

	// TODO: Allow custom shaders?
	public pushRectangle(origin: TSM.vec3, size: TSM.vec3, color: Color = new Color(1, 1, 1)): void {
		this.objects.push({
			type: RenderObjectTypes.Rectangle,
			origin,
			size,
			color,
		});
	}

	public pushGrid(size: TSM.vec3, color: Color = new Color(1, 1, 1), thickness: number = 0.2): void {
		const halfWidth = size.x / 2;
		const halfHeight = size.y / 2;

		for (let x = 0; x < size.x; x++) {
			this.pushRectangle(new TSM.vec3([x - 0.5, halfHeight - 0.5, 0]),
				new TSM.vec3([thickness, size.y, 0]), color);
		}

		for (let y = 0; y < size.y; y++) {
			this.pushRectangle(new TSM.vec3([halfWidth - 0.5, y - 0.5, 0]),
				new TSM.vec3([size.x, thickness, 0]), color);
		}
	}
}
