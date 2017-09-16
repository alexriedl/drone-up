import { Animation } from '../Animations';
import { Color } from '../Utils';
import { GridShader } from './Shader';
import { vec2, vec3, mat4 } from '../Math';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

export default class GridModel extends SimpleRectangle {
	protected shader: GridShader;
	protected gridThickness: number;
	protected xSize: number;
	protected ySize: number;

	public constructor(gridColor: Color, gridThickness: number, xSize: number, ySize: number) {
		super(gridColor);

		this.gridThickness = gridThickness;
		this.xSize = xSize;
		this.ySize = ySize;
	}

	protected createShader(): GridShader {
		return GridShader.createShader();
	}

	protected setupRenderState(position?: vec2, animation?: Animation): IRenderState {
		return {
			...super.setupRenderState(position, animation),
			size: new vec3(this.xSize, this.ySize, 1),
		};
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		const size = renderState.size;
		const position = renderState.position;
		const modelViewMatrix = mat4.fromTranslation(position.toVec3()).scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, modelViewMatrix.toFloat32Array());
		gl.uniform4fv(shader.uniformColorLocation, this.color.toFloat32Array());
		gl.uniform1f(shader.uniformGridThicknessLocation, this.gridThickness);
		gl.uniform1f(shader.uniformXCountLocation, this.xSize);
		gl.uniform1f(shader.uniformYCountLocation, this.ySize);
	}
}
