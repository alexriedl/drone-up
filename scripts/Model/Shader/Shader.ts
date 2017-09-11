import { Register } from '../../Utils';

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader: WebGLShader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

abstract class Shader {
	protected program: WebGLProgram;

	/**
	 * Not intended to be a public constructor, but needs to be because of the generic/inheritance version
	 * of the singleton being used... DO NOT CALL THIS DIRECTLY!
	 * Use <My Shader>.create(); instead
	 */
	public constructor() {
		Register.register(this);
	}

	public use(gl: WebGLRenderingContext): void {
		gl.useProgram(this.program);
	}

	public initialize(gl: WebGLRenderingContext) {
		const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.getVertexSource());
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, this.getFragmentSource());

		if (!vertexShader || !fragmentShader) {
			console.log('Failed to compile one of the shaders...');
			return;
		}

		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);

		const success = gl.getProgramParameter(this.program, gl.LINK_STATUS);
		if(!success) {
			console.log(gl.getProgramInfoLog(this.program));
			gl.deleteProgram(this.program);
			this.program = undefined;
		}
	}

	protected abstract getVertexSource(): string;
	protected abstract getFragmentSource(): string;

	protected getAttributeLocation(gl: WebGLRenderingContext, name: string): number {
		return gl.getAttribLocation(this.program, name);
	}

	protected getUniformLocation(gl: WebGLRenderingContext, name: string): WebGLUniformLocation {
		return gl.getUniformLocation(this.program, name);
	}

	private static instances = {};
	protected static create<T extends Shader>(type: { new (): T }, modifier?: string): T {
		const key = modifier ? `${type.name}-${modifier}` : type.name;
		if (Shader.instances[key]) return Shader.instances[key];
		Shader.instances[key] = new type();
		return Shader.instances[key];
	}
}

export default Shader;
