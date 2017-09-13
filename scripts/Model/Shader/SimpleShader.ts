import Shader from './Shader';

const vertexShaderSource = `
attribute vec4 a_position;

uniform mat4 u_model_view;
uniform mat4 u_projection;

void main() {
	gl_Position = u_projection * u_model_view * a_position;
}`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;

void main() {
	gl_FragColor = u_color;
}`;

export default class SimpleShader extends Shader {
	public attributePositionLocation: number;
	public uniformModelViewMatrixLocation: WebGLUniformLocation;
	public uniformProjectionMatrixLocation: WebGLUniformLocation;
	public uniformColorLocation: WebGLUniformLocation;

	public initialize(gl: WebGLRenderingContext) {
		super.initialize(gl);

		this.attributePositionLocation = this.getAttributeLocation(gl, 'a_position');
		this.uniformModelViewMatrixLocation = this.getUniformLocation(gl, 'u_model_view');
		this.uniformProjectionMatrixLocation = this.getUniformLocation(gl, 'u_projection');
		this.uniformColorLocation = this.getUniformLocation(gl, 'u_color');
	}

	public getVertexSource(): string {
		return vertexShaderSource;
	}

	public getFragmentSource(): string {
		return fragmentShaderSource;
	}

	public static createShader(): SimpleShader {
		return Shader.create<SimpleShader>(SimpleShader);
	}
}
