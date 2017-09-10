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

export default class SimpleVBO extends Shader {
	public readonly attributePositionLocation: number;
	public readonly uniformModelViewMatrixLocation: WebGLUniformLocation;
	public readonly uniformProjectionMatrixLocation: WebGLUniformLocation;
	public readonly uniformColorLocation: WebGLUniformLocation;

	protected constructor(gl: WebGLRenderingContext) {
		super(gl);

		this.attributePositionLocation = this.getAttributeLocation('a_position');
		this.uniformModelViewMatrixLocation = this.getUniformLocation('u_model_view_matrix');
		this.uniformProjectionMatrixLocation = this.getUniformLocation('u_projection_matrix');
		this.uniformColorLocation = this.getUniformLocation('u_color_vector');
	}

	protected getVertexSource(): string {
		return vertexShaderSource;
	}

	protected getFragmentSource(): string {
		return fragmentShaderSource;
	}

	private static staticShader: SimpleVBO;
	public static create(gl?: WebGLRenderingContext): SimpleVBO {
		if (SimpleVBO.staticShader) return SimpleVBO.staticShader;
		if (!gl) {
			console.error("No gl context to initialize shader with");
			return null;
		}

		SimpleVBO.staticShader = new SimpleVBO(gl);
		return SimpleVBO.staticShader;
	}
}
