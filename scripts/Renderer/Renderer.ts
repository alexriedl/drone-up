import { Color } from '../Utils';
import { initWebGL } from './WebGL';
import { IRectangle, IRenderObject, RenderObjectTypes } from './RenderObjects';
import { SimpleVBO } from './Shader';
import RenderGroup from './RenderGroup';

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext;

	private shader: SimpleVBO;
	private rectangleVertexBuffer: WebGLBuffer;
	private rectangleColorBuffer: WebGLBuffer;

	public constructor(canvasId: string) {
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

		const gl = initWebGL(this.canvas);
		if (!gl) return;

		this.gl = gl;

		this.shader = new SimpleVBO(gl);

		this.setBackgroundColor(Color.BLACK);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		this.clearScreen();

		// TODO: Break this out somehow
		// NOTE: initialize rectangle buffers
		const positions = [
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		];
		this.rectangleVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	}

	public setBackgroundColor(color: Color): void {
		this.gl.clearColor(color.r, color.g, color.b, 1.0);
	}

	public clearScreen(): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	/*************************************************************************
	*************************************************************************/

	private renderRectangle(gl: WebGLRenderingContext, object: IRectangle): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);

		gl.vertexAttribPointer(this.shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.shader.attributePositionLocation);

		const offset = new TSM.vec3([0.5 - object.size.x / 2, 0.5 - object.size.y / 2, 0]);
		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(object.origin.add(offset))
			.scale(new TSM.vec3([...object.size.xy, 1, 0]));

		gl.uniformMatrix4fv(this.shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(this.shader.uniformColorLocation, new Float32Array(object.color.all()));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	/*************************************************************************
	*************************************************************************/

	public renderGroup(group: RenderGroup, mapWidth: number, mapHeight): void {
		const gl: WebGLRenderingContext = this.gl;

		// NOTE: Basic rendering setup
		{
			this.clearScreen();
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			this.shader.use();

			const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
			const orthoMatrix = TSM.mat4.orthographic(0, mapWidth, mapHeight / aspect, 0, -1, 1);

			gl.uniformMatrix4fv(this.shader.uniformProjectionMatrixLocation, false, new Float32Array(orthoMatrix.all()));
		}

		// TODO: Sort objects before rendering
		/*
		 By:
			- Distance?
			- Transparency
			- Same shader program
		 */

		for (const o of group.objects) {
			switch ((o as IRenderObject).type) {
				case RenderObjectTypes.Rectangle:
					this.renderRectangle(gl, o as IRectangle);
					break;
				default:
					console.log('UNKNOWN OBJECT');
			}
		}
	}
}
