import { Register } from '../../Utils';

abstract class Buffer {
	private buffer: WebGLBuffer;

	public constructor() {
		Register.registerGLItem(this);
	}

	public initialize(gl: WebGLRenderingContext): void {
		this.buffer = this.initializeBuffer(gl);
	}

	public getBuffer(): WebGLBuffer {
		return this.buffer;
	}

	public abstract initializeBuffer(gl: WebGLRenderingContext): WebGLBuffer;

	private static instances = {};
	protected static create<T extends Buffer>(type: { new (): T }, modifier?: string): T {
		const key = modifier ? `${type.name}-${modifier}` : type.name;
		if (Buffer.instances[key]) return Buffer.instances[key];
		Buffer.instances[key] = new type();
		return Buffer.instances[key];
	}
}

export default Buffer;
