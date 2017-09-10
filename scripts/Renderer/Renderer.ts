import { Animation, AnimationType } from '../Animations';
import { createShaderProgram, initWebGL, ISimpleShaderProgramInfo } from './WebGL';
import { GameObject } from '../GameObject';
import { IRectangle, IRenderObject, RenderObjectTypes } from './RenderObjects';
import { Random } from '../Utils';
import Color, { BLACK } from '../Utils/Color';
import Map from '../Map';
import RenderGroup from './RenderGroup';

// NOTE: Configurable options
const backgroundColor = BLACK;
const gridThickness = 0.05;
const gridColor = new Color(1, 0.7, 0);
const spikeColor = new Color(.6, .6, .6);

// NOTE: Not intended to change
const tileSize = new TSM.vec3([1, 1, 0]);
const halfTileSize = new TSM.vec3([tileSize.x / 2, tileSize.y / 2, tileSize.z / 2]);

export interface IMapState {
	gameObjects: GameObject[];
	xSize: number;
	ySize: number;
}

const vertexShaderSource = `
	attribute vec4 a_position;

	uniform mat4 u_model_view_matrix;
	uniform mat4 u_projection_matrix;
	uniform vec4 u_color_vector;

	varying lowp vec4 v_color;

	void main() {
		gl_Position = u_projection_matrix * u_model_view_matrix * a_position;
		v_color = u_color_vector;
	}`;
const fragmentShaderSource = `
	precision mediump float;
	varying lowp vec4 v_color;

	void main() {
		gl_FragColor = v_color;
	}`;

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext;
	private programInfo: ISimpleShaderProgramInfo;

	private rectangleVertexBuffer: WebGLBuffer;
	private rectangleColorBuffer: WebGLBuffer;

	private randomizer: Random;

	public constructor(canvasId: string, randomizer: Random) {
		this.randomizer = randomizer;
		this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

		const gl = initWebGL(this.canvas);
		if (!gl) return;

		this.gl = gl;

		gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.programInfo = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

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

	/*************************************************************************
	*************************************************************************/

	private renderRectangle(gl: WebGLRenderingContext, object: IRectangle): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
		const info = this.programInfo;

		gl.vertexAttribPointer(info.attributeLocations.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(info.attributeLocations.positionAttributeLocation);

		const offset = new TSM.vec3([halfTileSize.x - object.size.x / 2, halfTileSize.y - object.size.y / 2, 0]);
		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(object.origin.add(offset))
			.scale(new TSM.vec3([...object.size.xy, 1, 0]));

		gl.uniformMatrix4fv(info.uniformLocations.modelViewMatrix, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(info.uniformLocations.colorVector, new Float32Array(object.color.all()));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	/*************************************************************************
	*************************************************************************/

	public renderGroup(group: RenderGroup, mapWidth: number, mapHeight): void {
		const gl: WebGLRenderingContext = this.gl;
		const info = this.programInfo;

		// NOTE: Basic rendering setup
		{
			gl.clear(this.gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			gl.useProgram(info.program);

			const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
			const orthoMatrix = TSM.mat4.orthographic(0, mapWidth, mapHeight / aspect, 0, -1, 1);

			gl.uniformMatrix4fv(
				info.uniformLocations.projectionMatrix,
				false,
				new Float32Array(orthoMatrix.all()));
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

	private getBonusSize(animation: Animation): number {
		switch (animation.animationType) {
			case AnimationType.Move: return 0.5;
			case AnimationType.Bump: return 0.25;
			case AnimationType.Pull:
			case AnimationType.Push:
				return -0.5;
		}
		return 0;
	}
}
