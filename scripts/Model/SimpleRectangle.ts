import { Color } from '../Utils';
import { mat4 } from '../Math';
import { RectangleBuffer } from './Buffer';
import { SimpleShader } from './Shader';
import Model from './Model';

class SimpleRectangle extends Model {
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

	protected updateAttributes(gl: WebGLRenderingContext): void {
		const shader = this.shader;
		const vertexBuffer = this.buffer.getBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);
	}

	protected updateUniforms(gl: WebGLRenderingContext, mvpMatrix: mat4): void {
		const shader = this.shader;

		gl.uniformMatrix4fv(shader.uniformMVPMatrixLocation, false, mvpMatrix.toFloat32Array());
		gl.uniform4fv(shader.uniformColorLocation, this.color.toFloat32Array());
	}

	protected draw(gl: WebGLRenderingContext): void {
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}
}

export default SimpleRectangle;
