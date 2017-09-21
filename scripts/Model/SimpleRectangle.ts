import { Color } from '../Utils';
import { RectangleBuffer } from './Buffer';
import { SimpleShader } from './Shader';
import { vec3, mat4 } from '../Math';
import Model from './Model';

export interface IRenderState {
	mvpMatrix: mat4;
}

class SimpleRectangle extends Model<IRenderState> {
	protected buffer: RectangleBuffer;
	protected shader: SimpleShader;
	protected color: Color;

	public constructor(color: Color) {
		super();
		this.color = color;
	}

	protected createShader(): SimpleShader {
		return SimpleShader.createShader();
	}

	protected createBuffer(): RectangleBuffer {
		return RectangleBuffer.createBuffer();
	}

	protected calculateState(vpMatrix: mat4, position: vec3, scale: vec3): IRenderState {
		const offset = new vec3(-scale.x / 2, -scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		const mvpMatrix = modelMatrix.mul(vpMatrix);

		return { mvpMatrix };
	}

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		const vertexBuffer = this.buffer.getBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;

		gl.uniformMatrix4fv(shader.uniformMVPMatrixLocation, false, renderState.mvpMatrix.toFloat32Array());
		gl.uniform4fv(shader.uniformColorLocation, this.color.toFloat32Array());
	}

	protected draw(gl: WebGLRenderingContext, renderState: IRenderState): void {
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

}

export default SimpleRectangle;
