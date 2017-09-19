import { Color } from '../Utils';
import { SimpleTextureShader } from './Shader';
import { vec2, vec3, mat4 } from '../Math';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

export default class SimpleTextureRectangle extends SimpleRectangle {
	protected texture: WebGLTexture;
	protected shader: SimpleTextureShader;
	protected xSize: number;
	protected ySize: number;

	public constructor(texture: WebGLTexture, xSize: number, ySize: number) {
		super(new Color(1, 1, 1));

		this.texture = texture;
		this.xSize = xSize;
		this.ySize = ySize;
	}

	protected createShader(): SimpleTextureShader {
		return SimpleTextureShader.createShader();
	}

	protected calculateState(vpMatrix: mat4, position: vec2 = new vec2()): IRenderState {
		const size = new vec3(this.xSize, this.ySize, 1);
		const offset = new vec3(0.5 - size.x / 2, 0.5 - size.y / 2, 0);
		const modelMatrix = mat4.fromTranslation(position.toVec3().add(offset)).scale(size);
		// const mvpMatrix = modelMatrix.mul(vpMatrix);
		// const mvpMatrix = vpMatrix.mul(modelMatrix);

		return { modelMatrix, orthoMatrix: vpMatrix };
	}

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		return super.updateAttributes(gl, renderState);
	}
}
