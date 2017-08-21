import '@diamondlovesyou/tsm';

export enum RenderObjectTypes {
  Rectangle,
}
export interface ICoords {
  x: number;
  y: number;
}
export interface IColor {
  r: number;
  g: number;
  b: number;
}
export interface IRenderObject {
  type: RenderObjectTypes;
  origin: ICoords;
}
export interface Rectangle extends IRenderObject {
  width: number;
  height: number;
  color: IColor;
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

function CreateShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
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
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export class Renderer {
  private canvas: HTMLElement;
  private gl: WebGLRenderingContext;
  private program: WebGLShader;

  private positionAttributeLocation: number;
  private positionAttributeColor: number;

  private rectangleVertexBuffer: WebGLBuffer;
  private rectangleColorBuffer: WebGLBuffer;

  private vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;

  varying lowp vec4 v_color;

  void main() {
    gl_Position = a_position;
    v_color = a_color;
  }
  `;
  private fragmentShaderSource = `
  precision mediump float;
  varying lowp vec4 v_color;

  void main() {
    gl_FragColor = v_color;
    // gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }
  `;

  public Initialize(canvasId: string) {
    this.canvas = document.getElementById(canvasId);

    const gl = InitWebGL(this.canvas);
    if (!gl) return;

    this.gl = gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.program = CreateShaderProgram(gl, this.vertexShaderSource, this.fragmentShaderSource);
    this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    this.positionAttributeColor = gl.getAttribLocation(this.program, "a_color");

    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.enableVertexAttribArray(this.positionAttributeColor);

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
      // object.color.r, object.color.b, object.color.g, 1,
      // object.color.r, object.color.b, object.color.g, 1,
      // object.color.r, object.color.b, object.color.g, 1,
      // object.color.r, object.color.b, object.color.g, 1,
    ];
    this.rectangleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    this.rectangleColorBuffer = gl.createBuffer();
  }

  /*************************************************************************
  *************************************************************************/

  private RenderRectangle(gl: WebGLRenderingContext, object: Rectangle) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleVertexBuffer);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset)

    var colors = [
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
      object.color.r, object.color.b, object.color.g, 1,
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.positionAttributeColor, 4, gl.FLOAT, false, 0, 0);

    var primitiveType = gl.TRIANGLE_FAN;
    var offset = 0;
    var count = 4;
    gl.drawArrays(primitiveType, offset, count);
  }

  /*************************************************************************
  *************************************************************************/

  public RenderOutput(group: RenderGroup) {
    const gl: WebGLRenderingContext = this.gl;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas['width'], this.canvas['height']);
    gl.useProgram(this.program);

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

  public PushRectangle(origin: ICoords, width: number, height: number) {
    this.objects.push({
      type: RenderObjectTypes.Rectangle,
      origin: origin,
      width: width,
      height: height,
      color: { r: 0.5, g: 1, b: 1 },
    });
  }
}

export function test() {
  console.log("Setting up");
  const renderer = new Renderer();
  renderer.Initialize("game-canvas");

  console.log("Building frame");
  const frame = new RenderGroup();
  frame.PushRectangle({x: 0, y: 0}, 10, 10);

  console.log("Rendering");
  renderer.RenderOutput(frame);
}
