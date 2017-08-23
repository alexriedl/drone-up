import { IRenderObject, Rectangle, RenderObjectTypes } from './RenderObjects';
import { SimpleShaderProgramInfo, initWebGL, createShaderProgram } from './WebGL';
import Color, { BLACK } from './Color';
import Random from '../Random';
import RenderGroup from './RenderGroup';

const backgroundColor = BLACK;
const gridThickness = 0.05;
const gridColor = new Color(1, 0.7, 0);
const spikeColor = new Color(.6, .6, .6);

export interface ICoords {
  x: number;
  y: number;
}
export interface IEntity extends ICoords {
  ID: string;
}
export interface IMapState {
  mapObjects: IEntity[];
  xSize: number;
  ySize: number;
}

const random = new Random(12345);
const over = 2147483647;
function getRandomColor() {
  const r = () => {
    let result = 0;
    do {
      result = random.next() / over;
    } while (result < 0.3);
    return result;
  };
  return new Color(r(), r(), r());
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

  public constructor(canvasId: string) {
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

  public renderState(state: IMapState) {
    const group = new RenderGroup();

    group.pushGrid(new TSM.vec2([state.xSize, state.ySize]), gridColor, gridThickness, 1);

    const tileSize = new TSM.vec2([1, 1]);

    for (let i = 0; i < state.mapObjects.length; i++) {
      const entity = state.mapObjects[i];
      const isPlayer = entity.ID.startsWith("player");
      let color = isPlayer ? this.getPlayerColor(entity.ID) : spikeColor;

      group.pushRectangle(new TSM.vec3([entity.x, entity.y, 0]), tileSize, color);
    }

    this.renderOutput(group, state.xSize, state.ySize);
  }

  public renderAction(state: IMapState, entity: IEntity, action: string) {
    switch (action) {
      case "moveUp":
        break;
      case "moveDown":
        break;
      case "moveLeft":
        break;
      case "moveRight":
        break;
      case "PullUp":
        break;
      case "PullDown":
        break;
      case "PullLeft":
        break;
      case "PullRight":
        break;
      case "PushUp":
        break;
      case "PushDown":
        break;
      case "PushLeft":
        break;
      case "PushRight":
        break;
      case "Scan":
        break;
      default:
    }
  }

  /*************************************************************************
  *************************************************************************/

  private renderRectangle(gl: WebGLRenderingContext, object: Rectangle) {
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

    const modelViewMatrix = TSM.mat4.identity
      .copy()
      .translate(object.origin)
      .scale(new TSM.vec3([...object.size.xy, 1]));

    gl.uniformMatrix4fv(info.uniformLocations.modelViewMatrix, false, new Float32Array(modelViewMatrix.all()));

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  /*************************************************************************
  *************************************************************************/

  private renderOutput(group: RenderGroup, mapWidth: number, mapHeight) {
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

  private getPlayerColor(id: string): Color {
    if (!this.playerColors[id]) {
      this.playerColors[id] = getRandomColor();
    }

    return this.playerColors[id]
  }
}
