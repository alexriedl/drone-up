import Shader from './Shader';
import SimpleShader from './SimpleShader';

const vertexShaderSource = `
attribute vec4 a_position;
uniform mat4 u_mvp_matrix;

varying vec2 v_texcoord;

void main() {
	gl_Position = u_mvp_matrix * a_position;
	v_texcoord = a_position.xy + vec2(0.5);
}`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;
uniform sampler2D u_texture;

varying vec2 v_texcoord;

void main() {
	gl_FragColor = texture2D(u_texture, v_texcoord);
}`;

export default class SimpleTextureShader extends SimpleShader {
	public getVertexSource(): string {
		return vertexShaderSource;
	}

	public getFragmentSource(): string {
		return fragmentShaderSource;
	}

	public static createShader(): SimpleTextureShader {
		return Shader.create(SimpleTextureShader);
	}
}
