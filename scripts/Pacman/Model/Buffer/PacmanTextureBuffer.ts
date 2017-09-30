import { Buffer } from 'Engine/Model/Buffer';

export default class PacmanTextureBuffer extends Buffer {
	protected getValues(): number[] {
		return [
		];
	}

	public static createBuffer(): PacmanTextureBuffer {
		return Buffer.create(PacmanTextureBuffer);
	}
}
