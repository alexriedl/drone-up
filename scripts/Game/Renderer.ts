import { Color } from '../Utils';
import { GameObject } from './GameObject';

import { Coordinate, Register } from '../Utils';
import { Grid } from '../Model';

export default class Renderer {
	private gl: WebGLRenderingContext;
	private grid: Grid;
	private xSize: number;
	private ySize: number;

	public constructor(canvasId: string, xSize: number, ySize: number) {
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
		if (!gl) {
			alert('Unable to initialize WebGL. Your browser may not support it.');
			return;
		}

		this.gl = gl;

		this.setBackgroundColor(Color.BLACK);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		this.clearScreen();

		this.xSize = xSize;
		this.ySize = ySize;

		this.grid = new Grid(new Color(1, 0.6, 0), xSize, ySize);
	}

	public setBackgroundColor(color: Color): void {
		this.gl.clearColor(color.r, color.g, color.b, 1.0);
	}

	public clearScreen(): void {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	public getGlContext(): WebGLRenderingContext {
		return this.gl;
	}

	/*************************************************************************
	*************************************************************************/

	public renderMap(gameObjects: GameObject[]): void {
		const gl: WebGLRenderingContext = this.gl;
		const width = gl.canvas.clientWidth;
		const height = gl.canvas.clientHeight;

		// NOTE: Basic rendering setup
		this.clearScreen();
		gl.viewport(0, 0, width, height);

		const aspect = width / height;
		const orthoMatrix = TSM.mat4.orthographic(0, this.xSize, this.ySize, 0, -1, 1);

		// TODO: Sort objects before rendering
		/*
		 By:
			- Distance?
			- Transparency
			- Same shader program
		 */

		Register.initializeRegistered(gl);

		// NOTE: Here temporarily until background objects are implemented
		this.grid.useShader(gl);
		gl.uniformMatrix4fv(this.grid.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
		this.grid.render(gl, new Coordinate(0, 0));

		for (const go of gameObjects) {
			if (!go.canRender()) continue;

			// TODO: Only bind a shader if it is not currently in use
			go.model.useShader(gl);
			gl.uniformMatrix4fv(go.model.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
			go.render(gl);
		}
	}
}
