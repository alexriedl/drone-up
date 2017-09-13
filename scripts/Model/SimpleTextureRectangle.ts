import { Animation } from '../Animations';
import { Coordinate, Color } from '../Utils';
import { SimpleTextureShader } from './Shader';
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

	protected setupRenderState(position?: Coordinate, animation?: Animation): IRenderState {
		return {
			...super.setupRenderState(position, animation),
			size: new TSM.vec3([this.xSize, this.ySize, 1]),
		};
	}

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		return super.updateAttributes(gl, renderState);
	}
}
