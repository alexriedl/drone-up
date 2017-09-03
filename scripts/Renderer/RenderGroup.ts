import { RenderObjectTypes } from './RenderObjects';

import Color from '../Utils/Color';

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

	public pushGrid(size: TSM.vec3, color: Color = new Color(1, 1, 1), thickness: number = 0.2,
		xSpace: number = 1, ySpace: number = 1): void {

		const halfWidth = size.x / 2;
		const halfHeight = size.y / 2;
		const halfXSpace = xSpace / 2;
		const halfYSpace = ySpace / 2;

		for (let x = 0; x < size.x; x += xSpace) {
			this.pushRectangle(new TSM.vec3([x - halfXSpace, halfHeight - halfXSpace, 0]),
				new TSM.vec3([thickness, size.y, 0]), color);
		}

		for (let y = 0; y < size.y; y += ySpace) {
			this.pushRectangle(new TSM.vec3([halfWidth - halfYSpace, y - halfYSpace, 0]),
				new TSM.vec3([size.x, thickness, 0]), color);
		}
	}
}
