export function initWebGL(canvas): WebGLRenderingContext {
	const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser may not support it.');
	}

	return gl;
}
