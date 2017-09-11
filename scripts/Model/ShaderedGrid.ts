import { Coordinate, Color } from '../Utils';
import { RectangleBuffer } from './Buffer';
import { Register } from '../Utils';
import { GridShader } from './Shader';
import Model from './Model';

export default class ShaderedGrid extends Model {
	protected buffer: RectangleBuffer;
	protected shader: GridShader;
	protected gridColor: Color;
	protected gridThickness: number;
	protected xSize: number;
	protected ySize: number;

	public constructor(gridColor: Color, gridThickness: number, xSize: number, ySize: number) {
		super();

		this.gridColor = gridColor;
		this.gridThickness = gridThickness / 50;
		this.xSize = xSize;
		this.ySize = ySize;

		this.shader = GridShader.createShader();
		this.buffer = RectangleBuffer.createBuffer();
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected renderModel(gl: WebGLRenderingContext, position: Coordinate): void {
		const shader = this.shader;
		const vertexBuffer = this.buffer.getBuffer();
		const size = new TSM.vec3([this.xSize, this.ySize, 1]);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);

		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(position.vec3())
			.scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformGridColorLocation, new Float32Array(this.gridColor.all()));
		gl.uniform1f(shader.uniformGridThicknessLocation, this.gridThickness);
		gl.uniform1f(shader.uniformXCountLocation, this.xSize);
		gl.uniform1f(shader.uniformYCountLocation, this.ySize);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}
}
