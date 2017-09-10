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
	protected readonly gl: WebGLRenderingContext;
	protected readonly program: WebGLProgram;

	protected constructor(gl: WebGLRenderingContext) {
		this.gl = gl;

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

	public use(): void {
		this.gl.useProgram(this.program);
	}

	protected abstract getVertexSource(): string;
	protected abstract getFragmentSource(): string;

	protected getAttributeLocation(name: string): number {
		return this.gl.getAttribLocation(this.program, name);
	}

	protected getUniformLocation(name: string): WebGLUniformLocation {
		return this.gl.getUniformLocation(this.program, name);
	}
}

export default Shader;
