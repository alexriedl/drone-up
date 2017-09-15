import { Coordinate, Color } from '../Utils';
import { BaseObject } from './GameObject';

import { Register } from '../Utils';
import { Model, GridModel, SimpleTextureRectangle } from '../Model';

export interface IRenderOptions {
	povPosition?: Coordinate;
	renderGrid?: boolean;
	tiledRender?: boolean;
	viewSize?: number;

	debugGrid?: boolean;
}

export interface IRenderTargetInfo {
	frameBuffer: WebGLFramebuffer;
	texture: WebGLTexture;
	offsetX: number;
	offsetY: number;
	height: number;
	width: number;
}

export default class Renderer {
	private gl: WebGLRenderingContext;
	private gridModel: GridModel;
	private xSize: number;
	private ySize: number;

	private overflowXTiles: number = 0;
	private overflowYTiles: number = 0;

	private renderTarget: IRenderTargetInfo;
	private outputModel: SimpleTextureRectangle;

	private defaultOptions: IRenderOptions = {
		povPosition: null,
		renderGrid: true,
		tiledRender: true,
		viewSize: 10,
	};

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

		this.xSize = xSize;
		this.ySize = ySize;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;
		const pixelsPerTile = Math.min(canvasWidth / this.xSize, canvasHeight / this.ySize);
		const overflowXPixels = canvasWidth - this.xSize * pixelsPerTile;
		const overflowYPixels = canvasHeight - this.ySize * pixelsPerTile;

		this.overflowXTiles = overflowXPixels / pixelsPerTile;
		this.overflowYTiles = overflowYPixels / pixelsPerTile;

		// NOTE: Create texture
		const extra = 6;
		{
			const boardWidth = xSize * pixelsPerTile;
			const overdrawWidth = extra * pixelsPerTile;
			const textureWidth = boardWidth + overdrawWidth;

			const boardHeight = ySize * pixelsPerTile;
			const overdrawHeight = extra * pixelsPerTile;
			const textureHeight = boardHeight + overdrawHeight;

			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
										textureWidth, textureHeight, 0,
										gl.RGBA, gl.UNSIGNED_BYTE, null);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			// NOTE: Setup framebuffer
			const frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

			// NOTE: Unbind all the things
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			this.renderTarget = {
				frameBuffer,
				texture,
				width: textureWidth,
				height: textureHeight,
				offsetX: overdrawWidth / 2,
				offsetY: overdrawHeight / 2,
			};
		}

		this.gridModel = new GridModel(new Color(1, 0.6, 0), xSize / 1000, xSize, ySize);
		this.outputModel = new SimpleTextureRectangle(this.renderTarget.texture, xSize + extra, ySize + extra);
	}

	protected static clearScreen(gl: WebGLRenderingContext): void {
		// tslint:disable-next-line:no-bitwise
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	public render(objects: BaseObject[], options: IRenderOptions = this.defaultOptions): void {
		const gl: WebGLRenderingContext = this.gl;
		const background = Color.BLACK.lighten(.3);

		// NOTE: Expand options
		const position = options.povPosition;
		const renderGrid = options.renderGrid === undefined ? this.defaultOptions.renderGrid : options.renderGrid;
		const tiledRender = options.tiledRender === undefined ? this.defaultOptions.tiledRender : options.tiledRender;
		const viewSize = Math.min(options.viewSize || this.defaultOptions.viewSize, this.xSize, this.ySize) / 2;
		const debugGrid = options.debugGrid === undefined ? this.defaultOptions.debugGrid : options.debugGrid;

		Register.initializeRegistered(this.gl);

		// NOTE: Render to texture first
		{
			const canvasWidth = gl.canvas.clientWidth;
			const canvasHeight = gl.canvas.clientHeight;
			const pixelsPerTile = Math.min(canvasWidth / this.xSize, canvasHeight / this.ySize);
			const offsetX = this.renderTarget.offsetX / pixelsPerTile;
			const offsetY = this.renderTarget.offsetY / pixelsPerTile;

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderTarget.frameBuffer);
			gl.viewport(0, 0, this.renderTarget.width, this.renderTarget.height);
			gl.clearColor(0, 0, 0, 0);
			Renderer.clearScreen(gl);
			const orthoMatrix = TSM.mat4.orthographic(
				-offsetX, this.xSize + offsetX,
				-offsetY, this.ySize + offsetY,
				-1, 1);

			if (renderGrid && !debugGrid) Renderer.renderModel(gl, orthoMatrix, this.gridModel);
			Renderer.renderObjects(gl, orthoMatrix, objects);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}

		// NOTE: Render target texture to screen
		{
			const width = gl.canvas.clientWidth;
			const height = gl.canvas.clientHeight;

			gl.viewport(0, 0, width, height);
			gl.clearColor(background.r, background.g, background.b, 1.0);
			Renderer.clearScreen(gl);

			let orthoMatrix;
			if (!position) {
				const extra = 2;
				orthoMatrix = TSM.mat4.orthographic(
					-this.overflowXTiles / 2 - extra, this.xSize + this.overflowXTiles / 2 + extra,
					this.ySize + this.overflowYTiles / 2 + extra, -this.overflowYTiles / 2 - extra,
					-1, 1);
			}
			else {
				const aspect = height / width;
				const w = viewSize;
				const h = viewSize * aspect;

				orthoMatrix = TSM.mat4.orthographic(
					position.x - w + 0.5, position.x + w + 0.5,
					position.y + h + 0.5, position.y - h + 0.5,
					-1, 1);
			}

			if (debugGrid) Renderer.renderModel(gl, orthoMatrix, this.gridModel);

			// NOTE: This positioning seems odd...
			const centerY = (this.ySize - 1) / 2;
			const centerX = (this.xSize - 1) / 2;
			const rightBorder = centerX + this.xSize;
			const leftBorder = centerX - this.xSize;
			const bottomBorder = centerY + this.ySize;
			const topBorder = centerY - this.ySize;
			Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, centerY));

			// TODO: Cleanup how tiling works.
			if (tiledRender) {
				if (!position) {
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, centerY));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, topBorder));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, bottomBorder));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, centerY));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, topBorder));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, bottomBorder));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, topBorder));
					Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, bottomBorder));
				}
				else {
					if (position.x > this.xSize / 2) {
						Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, centerY));
						if (position.y < this.ySize / 2) {
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, topBorder));
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, topBorder));
						}
						else {
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(rightBorder, bottomBorder));
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, bottomBorder));
						}
					}
					else {
						Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, centerY));
						if (position.y < this.ySize / 2) {
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, topBorder));
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, topBorder));
						}
						else {
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(leftBorder, bottomBorder));
							Renderer.renderModel(gl, orthoMatrix, this.outputModel, new Coordinate(centerX, bottomBorder));
						}
					}
				}
			}
		}
	}

	protected static renderModel(gl: WebGLRenderingContext, orthoMatrix: TSM.mat4, model: Model,
		position: Coordinate = new Coordinate(0, 0)) {
		model.useShader(gl, new Float32Array(orthoMatrix.all()));
		model.render(gl, position);
	}

	protected static renderObjects(gl: WebGLRenderingContext, orthoMatrix: TSM.mat4, objects: BaseObject[]) {
		// TODO: Sort objects before rendering
		/*
		 By:
			- Distance?
			- Transparency
			- Same shader program
		 */

		let shader;
		const ortho = new Float32Array(orthoMatrix.all());
		for (const o of objects) {
			if (!o.canRender()) continue;

			const objectsShader = o.model.getShader();
			if (shader !== objectsShader) {
				o.model.useShader(gl, ortho);
				shader = objectsShader;
			}

			o.render(gl);
		}
	}
}
