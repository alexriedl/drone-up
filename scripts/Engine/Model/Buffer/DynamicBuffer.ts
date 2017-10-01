import Buffer from './Buffer';

export default class DynamicBuffer extends Buffer {
	private gl: WebGLRenderingContext;

	public initialize(gl: WebGLRenderingContext): void {
		super.initialize(gl);
		// TODO: Do not store GL as property of buffer...
		this.gl = gl;
	}

	public getValues(): number[] { return []; }
	protected getUsage(gl: WebGLRenderingContext): number { return gl.DYNAMIC_DRAW; }

	public setBuffer(values: number[]): void {
		this.setFullBuffer(this.gl, values);
	}

	/**
	 * Update the data in a buffer. Unless the size of the data is changing, this is the prefered
	 * method of updating (over "setBuffer")
	 */
	public updateBuffer(values: number[], offset: number = 0): void {
		const gl = this.gl;
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(values));
	}
}
