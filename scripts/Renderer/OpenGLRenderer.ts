import { Animation, AnimationType } from '../Animations';
import { GameObject } from '../GameObjects';
import { IAnimationState } from "../Runner";
import { IRenderObject, Rectangle, RenderObjectTypes } from './RenderObjects';
import { Random } from '../Utils';
import { SimpleShaderProgramInfo, initWebGL, createShaderProgram } from './WebGL';
import Color, { BLACK } from '../Utils/Color';
import Map from '../Map';
import RenderGroup from './RenderGroup';

const backgroundColor = BLACK;
const gridThickness = 0.05;
const gridColor = new Color(1, 0.7, 0);
const spikeColor = new Color(.6, .6, .6);
const tileSize = new TSM.vec3([1, 1, 0]);
const halfTileSize = new TSM.vec3([0.5, 0.5, 0]);

export interface IMapState {
	gameObjects: GameObject[];
	xSize: number;
	ySize: number;
}

const vertexShaderSource = `
	attribute vec4 a_position;
	attribute vec4 a_color;

	uniform mat4 u_model_view_matrix;
	uniform mat4 u_projection_matrix;

	varying lowp vec4 v_color;

	void main() {
		gl_Position = u_projection_matrix * u_model_view_matrix * a_position;
		v_color = a_color;
	}`;
const fragmentShaderSource = `
	precision mediump float;
	varying lowp vec4 v_color;

	void main() {
		gl_FragColor = v_color;
	}`;


export default class Renderer {
	private playerColors: { [id: string]: Color } = {};
	private canvas: HTMLElement;
	private gl: WebGLRenderingContext;
	private programInfo: SimpleShaderProgramInfo;

	private rectangleVertexBuffer: WebGLBuffer;
	private rectangleColorBuffer: WebGLBuffer;

	private randomizer: Random;

	public constructor(canvasId: string, randomizer: Random) {
		this.randomizer = randomizer;
		this.canvas = document.getElementById(canvasId);

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
		var positions = [
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		];
		this.rectangleVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		var colors = [
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
		];
		this.rectangleColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	}

	public renderMap(map: Map): void {
		this.renderState({
			gameObjects: map.getMapObjects(),
			xSize: map.getXSize(),
			ySize: map.getYSize()
		});
	}

	public renderState(state: IMapState): void {
		const group = new RenderGroup();
		this.pushState(group, state);
		this.renderOutput(group, state.xSize, state.ySize);
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

	public renderAnimationState(state: IAnimationState): void {
		const group = new RenderGroup();

		this.pushState(group, state);

		for (let i = 0; i < state.animations.length; i++) {
			const animation = state.animations[i];
			const isPlayer = animation.objectID.startsWith("player");
			let color = isPlayer ? this.getPlayerColor(animation.objectID) : spikeColor;

			const bonusSize = this.getBonusSize(animation);
			const animationSize = new TSM.vec3([1 + bonusSize, 1 + bonusSize, 0]);

			// TODO: The object and/or the animation needs to know how to render itself.
			group.pushRectangle(new TSM.vec3([animation.position.x, animation.position.y, 0]), animationSize, color);
		}

		this.renderOutput(group, state.xSize, state.ySize);
	}

	private pushState(group: RenderGroup, state: IMapState) {
		group.pushGrid(new TSM.vec3([state.xSize, state.ySize, 0]), gridColor, gridThickness, 1);

		for (let i = 0; i < state.gameObjects.length; i++) {
			const entity = state.gameObjects[i];
			const isPlayer = entity.ID.startsWith("player");
			let color = isPlayer ? this.getPlayerColor(entity.ID) : spikeColor;

			group.pushRectangle(new TSM.vec3([entity.x, entity.y, 0]), tileSize, color);
		}
	}

	/*************************************************************************
	*************************************************************************/

	private renderRectangle(gl: WebGLRenderingContext, object: Rectangle): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
		const info = this.programInfo;

		gl.vertexAttribPointer(info.attributeLocations.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(info.attributeLocations.positionAttributeLocation);

		var colors = [
			object.color.r, object.color.g, object.color.b, object.color.a,
			object.color.r, object.color.g, object.color.b, object.color.a,
			object.color.r, object.color.g, object.color.b, object.color.a,
			object.color.r, object.color.g, object.color.b, object.color.a,
		];
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		gl.vertexAttribPointer(info.attributeLocations.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(info.attributeLocations.colorAttributeLocation);

		const offset = new TSM.vec3([halfTileSize.x - object.size.x / 2, halfTileSize.y - object.size.y / 2, 0]);
		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(object.origin.add(offset))
			.scale(new TSM.vec3([...object.size.xy, 1, 0]));

		gl.uniformMatrix4fv(info.uniformLocations.modelViewMatrix, false, new Float32Array(modelViewMatrix.all()));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	/*************************************************************************
	*************************************************************************/

	private renderOutput(group: RenderGroup, mapWidth: number, mapHeight): void {
		const gl: WebGLRenderingContext = this.gl;
		const info = this.programInfo;

		// NOTE: Basic rendering setup
		{
			gl.clear(this.gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.viewport(0, 0, this.canvas['width'], this.canvas['height']);
			gl.useProgram(info.program);

			const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
			const orthoMatrix = TSM.mat4.orthographic(0, mapWidth, mapHeight / aspect, 0, -1, 1);

			gl.uniformMatrix4fv(
				info.uniformLocations.projectionMatrix,
				false,
				new Float32Array(orthoMatrix.all()));
		}

		group.objects.forEach(o => {
			switch ((<IRenderObject>o).type) {
				case RenderObjectTypes.Rectangle:
					this.renderRectangle(gl, <Rectangle>o);
					break;
				default:
					console.log("UNKNOWN OBJECT");
			}
		});
	}

	private predefinedColors: Color[] = [
		// new Color(0, 0, 0),
		new Color(0, 0, 1),
		new Color(0, 1, 0),
		new Color(0, 1, 1),
		new Color(1, 0, 0),
		new Color(1, 0, 1),
		new Color(1, 1, 0),
		// new Color(1, 1, 1),
	];

	private getPlayerColor(id: string): Color {
		if (!this.playerColors[id]) {
			if (this.predefinedColors && this.predefinedColors.length > 0) {
				this.playerColors[id] = this.predefinedColors.pop()
			}
			else {
				const r = () => this.randomizer.nextRangeFloat(0.3, 1);
				this.playerColors[id] = new Color(r(), r(), r());
			}
		}

		return this.playerColors[id]
	}
}
