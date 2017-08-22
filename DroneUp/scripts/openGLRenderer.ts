export enum RenderObjectTypes {
  Rectangle,
}
export interface IColor {
  r: number;
  g: number;
  b: number;
}
export interface IRenderObject {
  type: RenderObjectTypes;
  origin: TSM.vec3;
}
export interface Rectangle extends IRenderObject {
  size: TSM.vec2;
  color: IColor;
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

function InitWebGL(canvas) {
  let gl = <WebGLRenderingContext>(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }

  return gl;
}

function CreateShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
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

function CreateShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): SimpleShaderProgramInfo {
  var vertexShader = CreateShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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


export class Renderer {
  private canvas: HTMLElement;
  private gl: WebGLRenderingContext;
  private programInfo: SimpleShaderProgramInfo;

  private rectangleVertexBuffer: WebGLBuffer;
  private rectangleColorBuffer: WebGLBuffer;

  public Initialize(canvasId: string) {
    this.canvas = document.getElementById(canvasId);

    const gl = InitWebGL(this.canvas);
    if (!gl) return;

    this.gl = gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.programInfo = CreateShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    this.InitializeRectangleBuffers(gl);
  }

  public InitializeRectangleBuffers(gl: WebGLRenderingContext) {
    var positions = [
      -0.5, -0.5,
      0.5, -0.5,
      0.5, 0.5,
      -0.5, 0.5,
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

  /*************************************************************************
  *************************************************************************/

  private RenderRectangle(gl: WebGLRenderingContext, object: Rectangle) {
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
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(info.attributeLocations.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(info.attributeLocations.colorAttributeLocation);

    // const modelViewMatrix = TSM.mat4.identity;
    // modelViewMatrix.translate(object.origin);
    // modelViewMatrix.scale(new TSM.vec3([...object.size.xy, 1]));

    const modelViewMatrix = TSM.mat4.identity
      .translate(object.origin)
      .scale(new TSM.vec3([...object.size.xy, 1]));
console.log(new TSM.vec3([...object.size.xy, 1]));

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

  public RenderOutput(group: RenderGroup) {
    const gl: WebGLRenderingContext = this.gl;
    const info = this.programInfo;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas['width'], this.canvas['height']);
    gl.useProgram(info.program);

    // const fieldOfView = 45 * Math.PI / 180;   // in radians
    // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // const zNear = 0.1;
    // const zFar = 100.0;
    // const projectionMatrix = TSM.mat4.perspective(fieldOfView, aspect, zNear, zFar)

    const halfSize = 20;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    const left = -halfSize;
    const right = halfSize;
    const bottom = -halfSize / aspect;
    const top = halfSize / aspect;
    const orthoMatrix = TSM.mat4.orthographic(left, right, bottom, top, -1, 1);

    gl.uniformMatrix4fv(
      info.uniformLocations.projectionMatrix,
      false,
      new Float32Array(orthoMatrix.all()));

    group.objects.forEach(o => {
      switch ((<IRenderObject>o).type) {
        case RenderObjectTypes.Rectangle:
          this.RenderRectangle(gl, <Rectangle>o);
          break;
        default:
          console.log("UNKNOWN OBJECT");
      }
    });
  }
}

export class RenderGroup {
  public objects: Object[] = [];

  public PushRectangle(origin: TSM.vec3, size: TSM.vec2, color: IColor = { r: 1, g: 1, b: 1 }) {
    this.objects.push({
      type: RenderObjectTypes.Rectangle,
      origin: origin,
      size: size,
      color: color
    });
  }
}

export function test() {
  console.log("Setting up");
  const renderer = new Renderer();
  renderer.Initialize("game-canvas");

  let state = {
    startX: 0.5,
    endX: -0.5,
    currentX: 0,
    increment: -1
  };
  let then = 0;
  const render = ((now) => {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    state = updateState(deltaTime, state);
    renderState(renderer, state);

    setTimeout(() => requestAnimationFrame(render), 30);
  });
  requestAnimationFrame(render);
}

export interface IState {
  startX: number;
  endX: number;
  currentX: number;
  increment: number;
}

function swop(state: IState) {
  return {
    increment: -state.increment,
    endX: state.startX,
    startX: state.endX,
    currentX: state.endX
  };
}

function updateState(deltaTime, state: IState): IState {
  state.currentX += state.increment * deltaTime;
  if((state.increment < 0 && state.currentX < state.endX) ||
    (state.increment > 0 && state.currentX > state.endX)) {
      return swop(state);
  }

  return state
}

function renderState(renderer: Renderer, state: IState) {
  const frame = new RenderGroup();
  frame.PushRectangle(new TSM.vec3([state.currentX, 0, 0]), new TSM.vec2([1, 1]));

  renderer.RenderOutput(frame);
}
