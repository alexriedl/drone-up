import { Register } from 'Engine/Utils';

export default abstract class Buffer {
	private buffer: WebGLBuffer;

	public constructor() {
		Register.registerGLItem(this);
	}

	public initialize(gl: WebGLRenderingContext): void {
		this.buffer = gl.createBuffer();
		this.setFullBuffer(gl, this.getValues());
	}

	protected setFullBuffer(gl: WebGLRenderingContext, values: number[]): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), this.getUsage(gl));
	}

	public getBuffer(): WebGLBuffer { return this.buffer; }
	protected getUsage(gl: WebGLRenderingContext): number { return gl.STATIC_DRAW; }
	protected abstract getValues(): number[];

	private static instances = {};
	protected static create<T extends Buffer>(type: { new (): T }): T {
		if (Buffer.instances[type.name]) return Buffer.instances[type.name];
		Buffer.instances[type.name] = new type();
		return Buffer.instances[type.name];
	}
}
