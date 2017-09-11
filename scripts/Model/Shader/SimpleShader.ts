import Shader from './Shader';

const vertexShaderSource = `
attribute vec4 a_position;

uniform mat4 u_model_view_mat;
uniform mat4 u_projection_mat;

void main() {
	gl_Position = u_projection_mat * u_model_view_mat * a_position;
}`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color_vec;

void main() {
	gl_FragColor = u_color_vec;
}`;

export default class SimpleShader extends Shader {
	public attributePositionLocation: number;
	public uniformModelViewMatrixLocation: WebGLUniformLocation;
	public uniformProjectionMatrixLocation: WebGLUniformLocation;
	public uniformColorLocation: WebGLUniformLocation;

	public initialize(gl: WebGLRenderingContext) {
		super.initialize(gl);

		this.attributePositionLocation = this.getAttributeLocation(gl, 'a_position');
		this.uniformModelViewMatrixLocation = this.getUniformLocation(gl, 'u_model_view_mat');
		this.uniformProjectionMatrixLocation = this.getUniformLocation(gl, 'u_projection_mat');
		this.uniformColorLocation = this.getUniformLocation(gl, 'u_color_vec');
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
