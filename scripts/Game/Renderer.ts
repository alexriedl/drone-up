import { Color } from '../Utils';
import { BaseObject } from './GameObject';

import { Register } from '../Utils';
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

		// gl.enable(gl.DEPTH_TEST);
		// gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		this.setBackgroundColor(Color.BLACK.lighten(.15));
		this.clearScreen();

		this.xSize = xSize;
		this.ySize = ySize;

		this.grid = new Grid(new Color(1, 0.6, 0), 2 / 100, xSize, ySize);
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

	public renderMap(objects: BaseObject[]): void {
		const gl: WebGLRenderingContext = this.gl;
		const width = gl.canvas.clientWidth;
		const height = gl.canvas.clientHeight;

		// NOTE: Basic rendering setup
		this.clearScreen();
		gl.viewport(0, 0, width, height);

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

		for (const o of objects) {
			if (!o.canRender()) continue;

			{
				// TODO: Only bind a shader if it is not currently in use
				o.model.useShader(gl);
				gl.uniformMatrix4fv(o.model.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
			}

			o.render(gl);
		}
	}
}
