import { Coordinate, Color } from '../Utils';
import { SimpleVBO } from '../Shader';
import Model from './Model';
import Renderer from '../Renderer';

function initializeVertexBuffer(gl: WebGLRenderingContext, xSize: number, ySize: number): WebGLBuffer  {
	const positions: number[] = [];

	for(let x = 0; x <= xSize; x++) {
		positions.push(x, 0, x, ySize);
	}

	for(let y = 0; y <= ySize; y++) {
		positions.push(0, y, xSize, y);
	}

	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return vertexBuffer;
}

export default class Grid extends Model {
	private static vertexBuffer: WebGLBuffer;
	protected shader: SimpleVBO;
	protected color: Color;

	private readonly xSize: number;
	private readonly ySize: number;
	private readonly total: number;

	public constructor(renderer: Renderer, color: Color, xSize: number, ySize: number) {
		super();
		this.color = color;

		this.xSize = xSize;
		this.ySize = ySize;
		this.total = (this.xSize * 2 + 2) + (this.ySize * 2 + 2);

		// TODO: Move gl specific work outside of the constructor to be initialized in a static manor
		const gl = renderer.getGlContext();
		SimpleVBO.create(gl); // NOTE: Used to initialize the shader in a static context - only 1 ever gets created

		if (!Grid.vertexBuffer) {
			Grid.vertexBuffer = initializeVertexBuffer(gl, xSize, ySize);
		}

		this.shader = SimpleVBO.create();
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected renderModel(renderer: Renderer): void {
		const gl = renderer.getGlContext();
		const shader = this.shader;
		const vertexBuffer = Grid.vertexBuffer;
		gl.lineWidth(2);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);

		const modelViewMatrix = TSM.mat4.identity
		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformColorLocation, new Float32Array(this.color.all()));

		gl.drawArrays(gl.LINES, 0, this.total);
	}
}
