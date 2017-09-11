export interface IRegisterObject {
	initialize: (gl: WebGLRenderingContext, extraInfo?: () => any) => void;
}

let pendingThings: any[] = [];

export function register(thing: IRegisterObject) {
	pendingThings.push(thing);
}

export function initializeRegistered(gl: WebGLRenderingContext) {
	const things = pendingThings;
	pendingThings = [];
	for (const thing of things) {
		thing.initialize(gl);
	}
}
