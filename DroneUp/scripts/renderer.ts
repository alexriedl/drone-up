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
  origin: ICoords;
}
export class Rectangle implements IRenderObject {
  public constructor(
    public width: number,
    public height: number,
    public origin: ICoords = { x: 0, y: 0 },
    public color: IColor = { r: 1, g: 1, b: 1 }
  ) { }
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

  private vertexShaderSource = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }
  `;
  private fragmentShaderSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }
  `;

  public Initialize(canvasId: string) {
    let canvas = document.getElementById(canvasId);

    this.gl = InitWebGL(canvas);
    if (!this.gl) return;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.program = CreateShaderProgram(this.gl, this.vertexShaderSource, this.fragmentShaderSource);
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
  }

  /*************************************************************************
  *************************************************************************/

  private RenderRectangle(gl: WebGLRenderingContext, object: Rectangle) {
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset)

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }

  /*************************************************************************
  *************************************************************************/

  public RenderOutput(group: RenderGroup) {
    const gl: WebGLRenderingContext = this.gl;

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas['width'], this.canvas['height']);
    gl.useProgram(this.program);

    group.objects.forEach(object => {
      switch (typeof object) {
        case typeof Rectangle:
          this.RenderRectangle(gl, <Rectangle>object);
          break;
      }
    });
  }
}

export class RenderGroup {
  public objects: IRenderObject[] = [];

  public PushRectangle(object: Rectangle) {
    this.objects.push(object);
  }
}

export function test() {
  const renderer = new Renderer();
  renderer.Initialize("game-canvas");

  const frame = new RenderGroup();
  frame.PushRectangle(new Rectangle(10, 10));

  renderer.RenderOutput(frame);
}
