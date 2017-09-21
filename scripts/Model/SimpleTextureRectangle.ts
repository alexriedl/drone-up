import { Color } from '../Utils';
import { SimpleTextureShader } from './Shader';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

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

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		super.updateAttributes(gl, renderState);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}
