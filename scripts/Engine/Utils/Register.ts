const registrar = {};

export function register<T>(type: { new(): T }, item: T) {
	const name = type.name;
	if (!registrar[name]) registrar[name] = [];
	registrar[name].push(item);
}

export function unregisterAll<T>(type: { new(): T }, action?: (item: T) => void) {
	const name = type.name;
	const items = registrar[name];
	delete registrar[name];
	if (items && action) {
		for (const item of items) {
			action(item);
		}
	}
}

class GLRegister {
	public initialize(gl: WebGLRenderingContext): void {
		return;
	}
}

export function registerGLItem(item: GLRegister) {
	register<GLRegister>(GLRegister, item);
}

export function initializeGLItems(gl: WebGLRenderingContext) {
	unregisterAll(GLRegister, (item: GLRegister): void => {
		item.initialize(gl);
	});
}
