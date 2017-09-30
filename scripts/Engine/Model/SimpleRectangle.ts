import { Buffer, RectangleBuffer } from 'Engine/Model/Buffer';
import { Color } from 'Engine/Utils';
import { mat4 } from 'Engine/Math';
import { SimpleShader } from 'Engine/Model/Shader';
import Model from './Model';

class SimpleRectangle extends Model {
	protected buffer: Buffer;
	protected shader: SimpleShader;
	protected color: Color;

	public constructor(color: Color) {
		super();
		this.color = color;
	}

	protected createShader(): SimpleShader {
		return SimpleShader.createShader();
	}

	protected createVertexBuffer(): Buffer {
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
