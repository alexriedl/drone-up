import Shader from './Shader';

const vertexShaderSource = `
attribute vec4 a_position;

uniform mat4 u_model_view;
uniform mat4 u_projection;

varying lowp vec2 v_uv;

void main() {
	gl_Position = u_projection * u_model_view * a_position;
	v_uv = a_position.xy;
}`;

const fragmentShaderSource = `
precision mediump float;

uniform float u_x_count;
uniform float u_y_count;
uniform float u_grid_thickness;
uniform vec4 u_grid_color;

varying lowp vec2 v_uv;

bool onGrid(float pos) {
	float f = fract(pos);
	return f < u_grid_thickness || f > 1.0 - u_grid_thickness;
}

void main() {
	bool onXGrid = onGrid(v_uv.x * u_x_count);
	bool onYGrid = onGrid(v_uv.y * u_y_count);
	gl_FragColor = onXGrid || onYGrid ? u_grid_color : vec4(0.0, 0.0, 0.0, 0.0);
}`;

export default class GridShader extends Shader {
	public attributePositionLocation: number;
	public uniformModelViewMatrixLocation: WebGLUniformLocation;
	public uniformProjectionMatrixLocation: WebGLUniformLocation;
	public uniformColorLocation: WebGLUniformLocation;
	public uniformGridThicknessLocation: WebGLUniformLocation;
	public uniformXCountLocation: WebGLUniformLocation;
	public uniformYCountLocation: WebGLUniformLocation;

	public initialize(gl: WebGLRenderingContext) {
		super.initialize(gl);

		this.attributePositionLocation = this.getAttributeLocation(gl, 'a_position');
		this.uniformModelViewMatrixLocation = this.getUniformLocation(gl, 'u_model_view');
		this.uniformProjectionMatrixLocation = this.getUniformLocation(gl, 'u_projection');
		this.uniformColorLocation = this.getUniformLocation(gl, 'u_grid_color');
		this.uniformGridThicknessLocation = this.getUniformLocation(gl, 'u_grid_thickness');
		this.uniformXCountLocation = this.getUniformLocation(gl, 'u_x_count');
		this.uniformYCountLocation = this.getUniformLocation(gl, 'u_y_count');
	}

	public getVertexSource(): string {
		return vertexShaderSource;
	}

	public getFragmentSource(): string {
		return fragmentShaderSource;
	}

	public static createShader(): GridShader {
		return Shader.create<GridShader>(GridShader);
	}
}
