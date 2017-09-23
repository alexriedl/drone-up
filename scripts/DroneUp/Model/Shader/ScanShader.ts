import { Shader, SimpleShader } from 'Engine/Model/Shader';

const vertexShaderSource = `
attribute vec4 a_position;
uniform mat4 u_mvp_matrix;

varying lowp vec2 v_uv;

void main() {
	gl_Position = u_mvp_matrix * a_position;
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

export default class ScanShader extends SimpleShader {
	public getVertexSource(): string {
		return vertexShaderSource;
	}

	public getFragmentSource(): string {
		return fragmentShaderSource;
	}

	public static createShader(): ScanShader {
		return Shader.create(ScanShader);
	}
}
