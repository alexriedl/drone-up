import Buffer from './Buffer';

export default class GridBuffer extends Buffer {
	private xSize: number;
	private ySize: number;

	protected setup(xSize: number, ySize: number) {
		this.xSize = xSize;
		this.ySize = ySize;
	}

	public initializeBuffer(gl: WebGLRenderingContext): WebGLBuffer {
		const positions: number[] = [];

		for (let x = 0; x <= this.xSize; x++) {
			positions.push(x, 0, x, this.ySize);
		}

		for (let y = 0; y <= this.ySize; y++) {
			positions.push(0, y, this.xSize, y);
		}

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		return vertexBuffer;
	}

	public static createGrid(xSize: number, ySize: number): GridBuffer {
		const key = `${xSize}x${ySize}`;
		const grid = Buffer.create<GridBuffer>(GridBuffer, key);
		grid.setup(xSize, ySize);
		return grid;
	}
}
