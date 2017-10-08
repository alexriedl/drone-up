import { Map } from 'Pacman/Map';

import { DynamicBuffer } from 'Engine/Model/Buffer';
import { SimpleRectangle } from 'Engine/Model';
import { vec2 } from 'Engine/Math';

export default class PelletModel extends SimpleRectangle {
	protected buffer: DynamicBuffer;
	private readonly pellets: vec2[];
	private readonly size: number;

	public constructor(pellets: vec2[], size: number = 2) {
		super(Map.COLOR.PELLET.normalize());
		this.pellets = pellets;
		this.size = size;
	}

	protected createVertexBuffer(): DynamicBuffer {
		return new DynamicBuffer();
	}

	public initialize(gl: WebGLRenderingContext): void {
		this.updateBuffer();
	}

	public updateBuffer(): void {
		this.buffer.setBuffer(getUpdatedBuffer(this.pellets, this.size));
	}

	public removePelletAt(coords: vec2): boolean {
		const index = this.pellets.findIndex((v) => v.exactEquals(coords));
		if (index > -1) {
			this.pellets.splice(index, 1);
			this.updateBuffer();
			return true;
		}

		return false;
	}

	protected draw(gl: WebGLRenderingContext): void {
		if (this.pellets.length > 0) {
			gl.drawArrays(gl.TRIANGLES, 0, this.pellets.length * 6);
		}
	}
}

function getUpdatedBuffer(pacs: vec2[], size: number): number[] {
	const data: number[] = [];
	const start = Map.PIXELS_PER_TILE / 2 - size / 2;
	for (const coord of pacs) {
		const l = coord.x * Map.PIXELS_PER_TILE + start;
		const r = l + size;
		const t = coord.y * Map.PIXELS_PER_TILE + start;
		const b = t + size;

		data.push(l, t, r, t, r, b);
		data.push(r, b, l, b, l, t);
	}
	return data;
}
