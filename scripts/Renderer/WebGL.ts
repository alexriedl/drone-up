export interface SimpleShaderProgramInfo {
	program: WebGLProgram;
	attributeLocations: {
		positionAttributeLocation: number,
		colorAttributeLocation: number,
	};
	uniformLocations: {
		projectionMatrix: WebGLUniformLocation,
		modelViewMatrix: WebGLUniformLocation,
	};
}

export function initWebGL(canvas): WebGLRenderingContext {
	let gl = <WebGLRenderingContext>(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser may not support it.');
	}

	return gl;
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	var shader: WebGLShader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

export function createShaderProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): SimpleShaderProgramInfo {
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	if (!vertexShader || !fragmentShader) {
		console.log("Failed to compile one of the shaders...");
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	// TODO: Make this function more generic, and able to take any shader programs and not hard code the attribute bindings
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return {
			program: program,
			attributeLocations: {
				colorAttributeLocation: gl.getAttribLocation(program, "a_color"),
				positionAttributeLocation: gl.getAttribLocation(program, "a_position")
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(program, 'u_projection_matrix'),
				modelViewMatrix: gl.getUniformLocation(program, 'u_model_view_matrix'),
			}
		}
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

