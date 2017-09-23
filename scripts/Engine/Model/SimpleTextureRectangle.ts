import { Color } from 'Engine/Utils';
import { SimpleTextureShader } from 'Engine/Model/Shader';
import SimpleRectangle from './SimpleRectangle';

export default class SimpleTextureRectangle extends SimpleRectangle {
	protected texture: WebGLTexture;
	protected shader: SimpleTextureShader;

	public constructor(texture: WebGLTexture) {
		super(new Color(1, 1, 1));
		this.texture = texture;
	}

	protected createShader(): SimpleTextureShader {
		return SimpleTextureShader.createShader();
	}

	protected updateAttributes(gl: WebGLRenderingContext): void {
		super.updateAttributes(gl);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}
