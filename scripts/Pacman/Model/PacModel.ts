import { Map } from 'Pacman/Map';

import { Color } from 'Engine/Utils';
import { DynamicBuffer } from 'Engine/Model/Buffer';
import { SimpleRectangle } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

export default class PacModel extends SimpleRectangle {
	protected buffer: DynamicBuffer;
	private pacs: vec2[];
	private hasBeenInitialized: boolean = false;

	public constructor(pacs: vec2[]) {
		super(new Color(1, 1, 1));
		this.pacs = pacs;
	}

	protected createVertexBuffer(): DynamicBuffer {
		return new DynamicBuffer();
	}

	protected updateBuffer(): number[] {
		const data: number[] = [];
		for (const coord of this.pacs) {
			const l = (coord.x - 0) * Map.PIXELS_PER_TILE + 2;
			const r = l + 2;
			const t = (coord.y - 0) * Map.PIXELS_PER_TILE + 2;
			const b = t + 2;

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
