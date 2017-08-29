import { RenderObjectTypes } from './RenderObjects';
import Color from './Color';

export default class RenderGroup {
  public objects: Object[] = [];

  // TODO: Allow custom shaders?
  public pushRectangle(origin: TSM.vec3, size: TSM.vec2, color: Color = new Color(1, 1, 1)): void {
    this.objects.push({
      type: RenderObjectTypes.Rectangle,
      origin: origin,
      size: size,
      color: color
    });
  }

  public pushGrid(size: TSM.vec2, color: Color = new Color(1, 1, 1), thickness: number = 0.2, space: number = 1): void {
    for (let x = 0; x < size.x; x += space) {
      this.pushRectangle(new TSM.vec3([x, 0, 0]), new TSM.vec2([thickness, size.y]), color);
    }

    for (let y = 0; y < size.y; y += space) {
      this.pushRectangle(new TSM.vec3([0, y, 0]), new TSM.vec2([size.x, thickness]), color);
    }
  }
}
