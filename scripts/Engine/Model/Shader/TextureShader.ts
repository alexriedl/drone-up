import Shader from './Shader';
import SimpleTextureShader from './SimpleTextureShader';

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec2 a_texcoord;
uniform mat4 u_mvp_matrix;

varying vec2 v_texcoord;

void main() {
	gl_Position = u_mvp_matrix * a_position;
	v_texcoord = a_texcoord;
}`;

export default class TextureShader extends SimpleTextureShader {
	public attributeTexCoordLocation: number;

	public initialize(gl: WebGLRenderingContext) {
		super.initialize(gl);

		this.attributeTexCoordLocation = this.getAttributeLocation(gl, 'a_texcoord');
	}

	public getVertexSource(): string {
		return vertexShaderSource;
	}

	public static createShader(): TextureShader {
		return Shader.create(TextureShader);
	}
}
