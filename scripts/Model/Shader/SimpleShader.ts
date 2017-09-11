import Shader from './Shader';

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

export default class SimpleShader extends Shader {
	public attributePositionLocation: number;
	public uniformModelViewMatrixLocation: WebGLUniformLocation;
	public uniformProjectionMatrixLocation: WebGLUniformLocation;
	public uniformColorLocation: WebGLUniformLocation;

	public initialize(gl: WebGLRenderingContext) {
		super.initialize(gl);

		this.attributePositionLocation = this.getAttributeLocation(gl, 'a_position');
		this.uniformModelViewMatrixLocation = this.getUniformLocation(gl, 'u_model_view_matrix');
		this.uniformProjectionMatrixLocation = this.getUniformLocation(gl, 'u_projection_matrix');
		this.uniformColorLocation = this.getUniformLocation(gl, 'u_color_vector');
	}

	protected getVertexSource(): string {
		return vertexShaderSource;
	}

	protected getFragmentSource(): string {
		return fragmentShaderSource;
	}

	public static createShader(): SimpleShader {
		return Shader.create<SimpleShader>(SimpleShader);
	}
}
