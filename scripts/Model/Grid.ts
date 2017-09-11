import { Coordinate, Color } from '../Utils';
import { GridBuffer } from './Buffer';
import { Register } from '../Utils';
import { SimpleShader } from './Shader';
import Model from './Model';

export default class Grid extends Model {
	protected buffer: GridBuffer;
	protected shader: SimpleShader;
	protected color: Color;

	private readonly total: number;

	public constructor(color: Color, xSize: number, ySize: number) {
		super();

		this.color = color;
		this.total = (xSize * 2 + 2) + (ySize * 2 + 2);

		this.shader = SimpleShader.createShader();
		this.buffer = GridBuffer.createGrid(xSize, ySize);
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected renderModel(gl: WebGLRenderingContext): void {
		const shader = this.shader;
		const vertexBuffer = this.buffer.getBuffer();
		gl.lineWidth(1);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);

		const modelViewMatrix = TSM.mat4.identity;
		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformColorLocation, new Float32Array(this.color.all()));

		gl.drawArrays(gl.LINES, 0, this.total);
	}
}
