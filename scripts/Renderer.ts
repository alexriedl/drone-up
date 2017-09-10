import { Color } from './Utils';
import { GameObject } from './GameObject';
import Map from './Map';

import { Coordinate } from './Utils';
import { Grid } from './Model';

export default class Renderer {
	private gl: WebGLRenderingContext;

	public constructor(canvasId: string) {
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

	public renderMap(map: Map): void {
		const gl: WebGLRenderingContext = this.gl;
		const width = gl.canvas.clientWidth;
		const height = gl.canvas.clientHeight;

		// NOTE: Basic rendering setup
		this.clearScreen();
		gl.viewport(0, 0, width, height);

		const aspect = width / height
		const orthoMatrix = TSM.mat4.orthographic(0, map.xSize, map.ySize, 0, -1, 1);

		// TODO: Sort objects before rendering
		/*
		 By:
			- Distance?
			- Transparency
			- Same shader program
		 */

		// NOTE: Here temporarily until background objects are implemented
		const grid = new Grid(this, new Color(0.6, 0.6, 0), map.xSize, map.ySize);
		grid.useShader();
		gl.uniformMatrix4fv(grid.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
		grid.render(this, null);

		for (const go of map.getGameObjects()) {
			if (!go.canRender()) continue;

			// TODO: Only bind a shader if it is not currently in use
			go.model.useShader();
			gl.uniformMatrix4fv(go.model.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
			go.render(this);
		}
	}
}
