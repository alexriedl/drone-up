import Buffer from './Buffer';

export default class RectangleBuffer extends Buffer {
	public initializeBuffer(gl: WebGLRenderingContext): WebGLBuffer {
		const positions = [
			-0.5, -0.5,
			+0.5, -0.5,
			+0.5, +0.5,
			-0.5, +0.5,
		];

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		return vertexBuffer;
	}

	public static createBuffer(): RectangleBuffer {
		return Buffer.create(RectangleBuffer);
	}
}
