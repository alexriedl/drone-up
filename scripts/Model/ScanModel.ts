import { ScanShader } from './Shader';
import SimpleRectangle, { IRenderState } from './SimpleRectangle';

export default class ScanModel extends SimpleRectangle {
	protected shader: ScanShader;

	protected createShader(): ScanShader {
		return ScanShader.createShader();
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		super.updateUniforms(gl, renderState);
	}
}
