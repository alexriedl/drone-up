export interface ICoords {
  x: number;
  y: number;
}
export interface IEntity extends ICoords {
  ID: string;
}
export interface IMapState {
  invalidArray: ICoords[];
  mapObjects: IEntity[];
  players: IEntity[];
  spikes: IEntity[];
  xSize: number;
  ySize: number;
}

export enum RenderObjectTypes {
  Grid,
  Rectangle,
}
export class Color {
  constructor(public r: number = 0, public g: number = 0, public b: number = 0) {
  }
}
export interface IRenderObject {
  type: RenderObjectTypes;
  origin: TSM.vec3;
}
export interface Rectangle extends IRenderObject {
  size: TSM.vec2;
  color: Color;
}
export interface SimpleShaderProgramInfo {
  program: WebGLProgram;
  attributeLocations: {
    positionAttributeLocation: number,
    colorAttributeLocation: number,
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation,
  };
}

function getRandomColor() {
  return new Color(Math.random(), Math.random(), Math.random());
}


function initWebGL(canvas) {
  let gl = <WebGLRenderingContext>(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }

  return gl;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  var shader: WebGLShader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): SimpleShaderProgramInfo {
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if(!vertexShader || !fragmentShader) {
    console.log("Failed to compile one of the shaders...");
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return {
      program: program,
      attributeLocations: {
        colorAttributeLocation: gl.getAttribLocation(program, "a_color"),
        positionAttributeLocation: gl.getAttribLocation(program, "a_position")
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, 'u_projection_matrix'),
        modelViewMatrix: gl.getUniformLocation(program, 'u_model_view_matrix'),
      }
    }
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.programInfo = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    this.initializeRectangleBuffers(gl);
  }

  public initializeRectangleBuffers(gl: WebGLRenderingContext) {
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

    group.pushGrid(new TSM.vec2([state.xSize, state.ySize]), new Color(1, 0.7, 0), 1, 0.05);

    const tileSize = new TSM.vec2([1, 1]);
    const spikeColor = new Color(.6, .6, .6);

    for(let i = 0; i < state.mapObjects.length; i++) {
      const entity = state.mapObjects[i];
      const isPlayer = entity.ID.startsWith("player");
      let color = isPlayer ? this.getPlayerColor(entity.ID) : spikeColor;

      group.pushRectangle(new TSM.vec3([entity.x, entity.y, 0]), tileSize, color);
    }

    this.renderOutput(group, state.xSize, state.ySize);
  }

  /*************************************************************************
  *************************************************************************/

  private renderRectangle(gl: WebGLRenderingContext, object: Rectangle) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
    const info = this.programInfo;

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(info.attributeLocations.positionAttributeLocation, size, type, normalize, stride, offset)
    gl.enableVertexAttribArray(info.attributeLocations.positionAttributeLocation);

    var colors = [
      object.color.r, object.color.g, object.color.b, 1,
      object.color.r, object.color.g, object.color.b, 1,
      object.color.r, object.color.g, object.color.b, 1,
      object.color.r, object.color.g, object.color.b, 1,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(info.attributeLocations.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(info.attributeLocations.colorAttributeLocation);

    const modelViewMatrix = TSM.mat4.identity
      .copy()
      .translate(object.origin)
      .scale(new TSM.vec3([...object.size.xy, 1]));

    gl.uniformMatrix4fv(
      info.uniformLocations.modelViewMatrix,
      false,
      new Float32Array(modelViewMatrix.all()));

    var primitiveType = gl.TRIANGLE_FAN;
    var offset = 0;
    var count = 4;
    gl.drawArrays(primitiveType, offset, count);
  }

  /*************************************************************************
  *************************************************************************/

  public renderOutput(group: RenderGroup, mapWidth: number, mapHeight) {
    const gl: WebGLRenderingContext = this.gl;
    const info = this.programInfo;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas['width'], this.canvas['height']);
    gl.useProgram(info.program);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    const left = 0;
    const right = mapWidth;
    const bottom = mapHeight / aspect;
    const top = 0;
    const orthoMatrix = TSM.mat4.orthographic(left, right, bottom, top, -1, 1);

    gl.uniformMatrix4fv(
      info.uniformLocations.projectionMatrix,
      false,
      new Float32Array(orthoMatrix.all()));

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
    if(!this.playerColors[id]) {
      this.playerColors[id] = getRandomColor();
    }

    return this.playerColors[id]
  }
}

export class RenderGroup {
  public objects: Object[] = [];

  public pushRectangle(origin: TSM.vec3, size: TSM.vec2, color: Color = new Color(1, 1, 1)) {
    this.objects.push({
      type: RenderObjectTypes.Rectangle,
      origin: origin,
      size: size,
      color: color
    });
  }

  public pushGrid(size: TSM.vec2, color: Color = new Color(1, 1, 1), space: number = 1, width: number = 0.2) {
    const borderWidth = width;
    const borderColor = color;

    for(let x = 0; x < size.x; x += space) {
      this.pushRectangle(new TSM.vec3([x, 0, 0]), new TSM.vec2([borderWidth, size.y]), borderColor);
    }

    for(let y = 0; y < size.y; y += space) {
      this.pushRectangle(new TSM.vec3([0, y, 0]), new TSM.vec2([size.x, borderWidth]), borderColor);
    }
  }
}
