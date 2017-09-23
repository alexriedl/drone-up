import { ScanShader } from 'Engine/Model/Shader';
import SimpleRectangle from './SimpleRectangle';

export default class ScanModel extends SimpleRectangle {
	protected shader: ScanShader;

	protected createShader(): ScanShader {
		return ScanShader.createShader();
	}
}
