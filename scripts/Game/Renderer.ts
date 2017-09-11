import { Color } from '../Utils';
import { GameObject } from './GameObject';

import { Coordinate, Register } from '../Utils';
import { Grid, ShaderedGrid } from '../Model';

export default class Renderer {
	private gl: WebGLRenderingContext;
	private grid: ShaderedGrid;
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

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

		this.setBackgroundColor(Color.BLACK);
		this.clearScreen();

		this.xSize = xSize;
		this.ySize = ySize;

		this.grid = new ShaderedGrid(new Color(1, 0.6, 0), 1, xSize, ySize);
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

		// NOTE: Here to initialize any resources that are registered after startup
		Register.initializeRegistered(gl);

		{
			// TODO: Here temporarily until background objects are implemented
			const grid = this.grid;
			grid.useShader(gl);
			gl.uniformMatrix4fv(grid.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
			grid.render(gl);
		}

		for (const go of gameObjects) {
			if (!go.canRender()) continue;

			{
				// TODO: Only bind a shader if it is not currently in use
				go.model.useShader(gl);
				gl.uniformMatrix4fv(go.model.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
			}

			go.render(gl);
		}
	}
}
