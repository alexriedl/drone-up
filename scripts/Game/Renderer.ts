import { Color } from '../Utils';
import { BaseObject } from './GameObject';

import { Register } from '../Utils';
import { GridModel, SimpleTextureRectangle } from '../Model';

export default class Renderer {
	private gl: WebGLRenderingContext;
	private grid: GridModel;
	private xSize: number;
	private ySize: number;

	private overflowXTiles: number = 0;
	private overflowYTiles: number = 0;

	private targetWidth: number;
	private targetHeight: number;
	private targetTexture: WebGLTexture;
	private frameBuffer: WebGLFramebuffer;
	private outputModel: SimpleTextureRectangle;

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
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const backgroundColor = Color.BLACK.lighten(.15);
		this.gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);
		Renderer.clearScreen(gl);

		this.xSize = xSize;
		this.ySize = ySize;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const pixelsPerTile = Math.min(canvasWidth / this.xSize, canvasHeight / this.ySize);
		const overflowXPixels = canvasWidth - this.xSize * pixelsPerTile;
		const overflowYPixels = canvasHeight - this.ySize * pixelsPerTile;

		// NOTE: Setup viewport into canvas, and how much extra space is available around map
		{
			const width = gl.canvas.clientWidth;
			const height = gl.canvas.clientHeight;
			gl.viewport(0, 0, width, height);

			this.overflowXTiles = overflowXPixels / pixelsPerTile;
			this.overflowYTiles = overflowYPixels / pixelsPerTile;
		}

		// NOTE: Create texture
		{
			const width = canvasWidth - overflowXPixels;
			const height = canvasHeight - overflowYPixels;

			this.targetWidth = width;
			this.targetHeight = height;

			this.targetTexture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
			const level = 0;
			const internalFormat = gl.RGBA;
			const border = 0;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;
			const data = null;
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
										width, height, border,
										format, type, data);

			// set the filtering so we don't need mips
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			// NOTE: Setup framebuffer
			this.frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, level);

			// NOTE: Unbind all the things
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}

		this.grid = new GridModel(new Color(1, 0.6, 0), xSize / 1000, xSize, ySize);
		this.outputModel = new SimpleTextureRectangle(this.targetTexture, xSize, ySize);
	}

	protected static clearScreen(gl: WebGLRenderingContext): void {
		// tslint:disable-next-line:no-bitwise
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	/*************************************************************************
	*************************************************************************/

	public renderMap(objects: BaseObject[]): void {
		const gl: WebGLRenderingContext = this.gl;

		// NOTE: Here to initialize any resources that are registered after startup
		Register.initializeRegistered(gl);

		Renderer.clearScreen(gl);

		const orthoMatrix = TSM.mat4.orthographic(
			-this.overflowXTiles / 2, this.xSize + this.overflowXTiles / 2,
			this.ySize + this.overflowYTiles / 2, -this.overflowYTiles / 2,
			-1, 1);

		Renderer.renderGrid(gl, orthoMatrix, this.grid);
		Renderer.renderObjects(gl, orthoMatrix, objects);
	}

	/**
	 * This can be expanded to only render a section of the map. Then re-render the map
	 * in different spots to make it look continuous.
	 */
	public renderSection(objects: BaseObject[]): void {
		const gl: WebGLRenderingContext = this.gl;
		const gridBackground = Color.BLACK.lighten(.15);
		const borderBackground = Color.BLACK.lighten(.3);

		Register.initializeRegistered(gl);

		// NOTE: Render to texture first
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
			gl.viewport(0, 0, this.targetWidth, this.targetHeight);
			gl.clearColor(gridBackground.r, gridBackground.g, gridBackground.b, 1.0);
			Renderer.clearScreen(gl);
			const orthoMatrix = TSM.mat4.orthographic(0, this.xSize, this.ySize, 0, -1, 1);
			Renderer.renderObjects(gl, orthoMatrix, objects);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}

		// NOTE: Render target texture to screen
		{
			const width = gl.canvas.clientWidth;
			const height = gl.canvas.clientHeight;
			gl.viewport(0, 0, width, height);
			gl.clearColor(borderBackground.r, borderBackground.g, borderBackground.b, 1.0);
			Renderer.clearScreen(gl);

			const pixelsPerTile = Math.min(width / this.xSize, height / this.ySize);
			const orthoMatrix = TSM.mat4.orthographic(0, width / pixelsPerTile, height / pixelsPerTile, 0, -1, 1);

			Renderer.renderGrid(gl, orthoMatrix, this.grid);
			Renderer.renderOutput(gl, orthoMatrix, this.outputModel);
		}
	}

	protected static renderGrid(gl: WebGLRenderingContext, orthoMatrix: TSM.mat4, grid: GridModel) {
		grid.useShader(gl);
		gl.uniformMatrix4fv(grid.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
		grid.render(gl);
	}

	protected static renderOutput(gl: WebGLRenderingContext, orthoMatrix: TSM.mat4, output: SimpleTextureRectangle) {
		output.useShader(gl);
		gl.uniformMatrix4fv(output.getModelViewMatrixUniformLocation(), false, new Float32Array(orthoMatrix.all()));
		output.render(gl);
	}

	protected static renderObjects(gl: WebGLRenderingContext, orthoMatrix: TSM.mat4, objects: BaseObject[]) {
		// TODO: Sort objects before rendering
		/*
		 By:
			- Distance?
			- Transparency
			- Same shader program
		 */

		const ortho = new Float32Array(orthoMatrix.all());
		for (const o of objects) {
			if (!o.canRender()) continue;

			{
				// TODO: Only bind a shader if it is not currently in use
				o.model.useShader(gl);
				gl.uniformMatrix4fv(o.model.getModelViewMatrixUniformLocation(), false, ortho);
			}

			o.render(gl);
		}
	}
}
