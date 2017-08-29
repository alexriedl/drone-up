import Color from './Color';

export enum RenderObjectTypes {
  Grid,
  Rectangle,
}

export interface IRenderObject {
  type: RenderObjectTypes;
  origin: TSM.vec3;
}

export interface Rectangle extends IRenderObject {
  size: TSM.vec2;
  color: Color;
}
