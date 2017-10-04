import { Map } from 'Pacman/Map';

import { Color } from 'Engine/Utils';
import { DynamicBuffer } from 'Engine/Model/Buffer';
import { SimpleRectangle } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

export default class PacModel extends SimpleRectangle {
	protected buffer: DynamicBuffer;
	private readonly pacs: vec2[];
	private readonly size: number;
	private hasBeenInitialized: boolean = false;

	public constructor(pacs: vec2[], size: number = 2) {
		super(new Color(1, 1, 1));
		this.pacs = pacs;
		this.size = size;
	}

	protected createVertexBuffer(): DynamicBuffer {
		return new DynamicBuffer();
	}

	protected updateBuffer(): number[] {
		const data: number[] = [];
		const start = Map.PIXELS_PER_TILE / 2 - this.size / 2;
		for (const coord of this.pacs) {
			const l = coord.x * Map.PIXELS_PER_TILE + start;
			const r = l + this.size;
			const t = coord.y * Map.PIXELS_PER_TILE + start;
			const b = t + this.size;

			data.push(l, t, r, t, r, b);
			data.push(r, b, l, b, l, t);
		}
		return data;
	}

	public removePacAt(coords: vec2): boolean {
		const index = this.pacs.findIndex((v) => v.exactEquals(coords));
		if (index > -1) {
			this.pacs.splice(index, 1);
			this.buffer.setBuffer(this.updateBuffer());
			return true;
		}

		return false;
	}

	protected draw(gl: WebGLRenderingContext): void {
		if (!this.hasBeenInitialized) {
			this.buffer.setBuffer(this.updateBuffer());
			this.hasBeenInitialized = true;
		}

		if (this.pacs.length > 0) {
			gl.drawArrays(gl.TRIANGLES, 0, this.pacs.length * 6);
		}
	}
}
