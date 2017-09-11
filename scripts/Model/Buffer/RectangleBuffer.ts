import Buffer from './Buffer';

export default class RectangleBuffer extends Buffer {
	public initializeBuffer(gl: WebGLRenderingContext): WebGLBuffer {
		const positions = [
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		];

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		return vertexBuffer;
	}

	public static create(): RectangleBuffer {
		return Buffer.create<RectangleBuffer>(RectangleBuffer);
	}
}
