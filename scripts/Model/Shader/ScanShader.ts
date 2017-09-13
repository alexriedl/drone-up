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
uniform vec4 u_color;
const float u_wave_count = 3.0;

varying lowp vec2 v_uv;

const float THICKNESS = 0.07;

void main() {
	vec2 pos = vec2(0.5) - v_uv;
	float d = distance(pos, vec2(0.0));

	float f = fract(d * 2.0 * u_wave_count);
	gl_FragColor = d < 0.5 && d > 0.1 && (f < THICKNESS || f > 1.0 - THICKNESS) ? u_color : vec4(0.0);
}`;

export default class ScanShader extends Shader {
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

	public static createShader(): ScanShader {
		return Shader.create<ScanShader>(ScanShader);
	}
}
