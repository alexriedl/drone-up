import { Color } from '../Utils';
import { SimpleTextureShader } from './Shader';
import { vec3, mat4 } from '../Math';
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

	protected calculateState(vpMatrix: mat4, position: vec3, scale: vec3): IRenderState {
		const offset = new vec3(-scale.x / 2, -scale.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.add(offset)).scale(scale);
		// const mvpMatrix = modelMatrix.mul(vpMatrix);
		// const mvpMatrix = vpMatrix.mul(modelMatrix);

		return { modelMatrix, orthoMatrix: vpMatrix };
	}

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		return super.updateAttributes(gl, renderState);
	}
}
