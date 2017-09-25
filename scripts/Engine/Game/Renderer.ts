import { Color, Register } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { SimpleTextureRectangle } from 'Engine/Model';
import { vec3, mat4 } from 'Engine/Math';

// TODO: Engine should not reference game code
import { GridModel } from 'DroneUp/Model';

export interface IRenderOptions {
	povPosition?: vec3;
	renderGrid?: boolean;
	tiledRender?: boolean;
	viewSize?: number;

	debugGrid?: boolean;
}

export interface IRenderTargetInfo {
	frameBuffer: WebGLFramebuffer;
	texture: WebGLTexture;
	offsetXTiles: number;
	offsetYTiles: number;
	height: number;
	width: number;
}

export default class Renderer {
	public gl: WebGLRenderingContext;
	private xSize: number;
	private ySize: number;

	private renderTarget: IRenderTargetInfo;
	private overflowXTiles: number = 0;
	private overflowYTiles: number = 0;

	private mapObject: Entity;
	private gridObject: Entity;

	private static defaultOptions: IRenderOptions = {
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
				offsetXTiles: (overdrawWidth / 2) / pixelsPerTile,
				offsetYTiles: (overdrawHeight / 2) / pixelsPerTile,
			};
		}

		const centerY = this.ySize / 2;
		const centerX = this.xSize / 2;

		const gridModel = new GridModel(new Color(1, 0.6, 0), xSize / 1000, xSize, ySize);
		this.gridObject = new Entity(gridModel,
			new vec3(centerX - 0.5, centerY - 0.5, -1),
			new vec3(xSize, ySize, 1));

		const gameModel = new SimpleTextureRectangle(this.renderTarget.texture);
		this.mapObject = new Entity(gameModel,
			new vec3(centerX, centerY),
			new vec3(xSize + extra, ySize + extra, 1));
	}

	protected static clearScreen(gl: WebGLRenderingContext): void {
		// tslint:disable-next-line:no-bitwise
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	public simpleRender(scene: Entity, background: Color = Color.BLACK.lighten(0.3)): void {
		const gl: WebGLRenderingContext = this.gl;

		Register.initializeGLItems(gl);

		const width = gl.canvas.clientWidth;
		const height = gl.canvas.clientHeight;

		gl.viewport(0, 0, width, height);
		gl.clearColor(background.r, background.g, background.b, 1.0);
		Renderer.clearScreen(gl);
		const orthoMatrix = mat4.ortho(0, this.xSize, this.ySize, 0, -1, 1);

		scene.render(gl, orthoMatrix);
	}

	// TODO: Update this to take the parent render node instead of a list of objects
	public render(scene: Entity, options: IRenderOptions = Renderer.defaultOptions): void {
		const gl: WebGLRenderingContext = this.gl;
		const background = Color.BLACK.lighten(.3);

		// NOTE: Expand options
		const position = options.povPosition;
		const renderGrid = options.renderGrid === undefined ? Renderer.defaultOptions.renderGrid : options.renderGrid;
		const tiledRender = options.tiledRender === undefined ? Renderer.defaultOptions.tiledRender : options.tiledRender;
		const viewSize = Math.min(options.viewSize || Renderer.defaultOptions.viewSize, this.xSize, this.ySize) / 2;
		const debugGrid = options.debugGrid === undefined ? Renderer.defaultOptions.debugGrid : options.debugGrid;

		Register.initializeGLItems(gl);

		// NOTE: Render to texture first
		{
			const offsetX = this.renderTarget.offsetXTiles;
			const offsetY = this.renderTarget.offsetYTiles;

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderTarget.frameBuffer);
			gl.viewport(0, 0, this.renderTarget.width, this.renderTarget.height);
			gl.clearColor(0, 0, 0, 0);
			Renderer.clearScreen(gl);
			const orthoMatrix = mat4.ortho(
				-offsetX, this.xSize + offsetX,
				-offsetY, this.ySize + offsetY,
				-1, 1);

			if (renderGrid && !debugGrid) this.gridObject.render(gl, orthoMatrix);
			scene.render(gl, orthoMatrix);

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
				orthoMatrix = mat4.ortho(
					-this.overflowXTiles / 2 - extra, this.xSize + this.overflowXTiles / 2 + extra,
					this.ySize + this.overflowYTiles / 2 + extra, -this.overflowYTiles / 2 - extra,
					-1, 1);
			}
			else {
				const aspect = height / width;
				const w = viewSize;
				const h = viewSize * aspect;

				orthoMatrix = mat4.ortho(
					position.x - w + 0.5, position.x + w + 0.5,
					position.y + h + 0.5, position.y - h + 0.5,
					-1, 1);
			}

			if (debugGrid) this.gridObject.render(gl, orthoMatrix);
			this.mapObject.render(gl, orthoMatrix);

			if (tiledRender) {
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(+this.xSize, 0, 0));
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(+this.xSize, +this.ySize, 0));
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(+this.xSize, -this.ySize, 0));

				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(-this.xSize, 0, 0));
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(-this.xSize, +this.ySize, 0));
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(-this.xSize, -this.ySize, 0));

				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(0, +this.ySize, 0));
				this.mapObject.render(gl, orthoMatrix, this.mapObject.position.addValues(0, -this.ySize, 0));
			}
		}
	}
}
