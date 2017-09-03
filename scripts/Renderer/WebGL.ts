export interface ISimpleShaderProgramInfo {
	program: WebGLProgram;
	attributeLocations: {
		positionAttributeLocation: number,
	};
	uniformLocations: {
		projectionMatrix: WebGLUniformLocation,
		modelViewMatrix: WebGLUniformLocation,
		colorVector: WebGLUniformLocation,
	};
}

export function initWebGL(canvas): WebGLRenderingContext {
	const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser may not support it.');
	}

	return gl;
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader: WebGLShader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

export function createShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string,
	fragmentShaderSource: string): ISimpleShaderProgramInfo {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	if (!vertexShader || !fragmentShader) {
		console.log('Failed to compile one of the shaders...');
		return;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	// TODO: Make this function more generic, and able to take any shader programs and not hard code the attribute bindings
	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return {
			program,
			attributeLocations: {
				positionAttributeLocation: gl.getAttribLocation(program, 'a_position'),
			},
			uniformLocations: {
				modelViewMatrix: gl.getUniformLocation(program, 'u_model_view_matrix'),
				projectionMatrix: gl.getUniformLocation(program, 'u_projection_matrix'),
				colorVector: gl.getUniformLocation(program, 'u_color_vector'),
			},
		};
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}
