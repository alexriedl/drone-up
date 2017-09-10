import { Color } from '../Utils';

export enum RenderObjectTypes {
	Rectangle,
}

export interface IRenderObject {
	type: RenderObjectTypes;
	origin: TSM.vec3;
}

export interface IRectangle extends IRenderObject {
	size: TSM.vec3;
	color: Color;
}
