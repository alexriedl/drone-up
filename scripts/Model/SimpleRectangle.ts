import { Animation, AnimationType } from '../Animations';
import { Coordinate, Color } from '../Utils';
import { SimpleVBO } from '../Shader';
import Model from './Model';
import Renderer from '../Renderer';

function initializeVertexBuffer(gl: WebGLRenderingContext): WebGLBuffer  {
	const positions = [
		0, 0,
		1, 0,
		1, 1,
		0, 1,
	];

	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return vertexBuffer;
}

abstract class SimpleRectangle extends Model {
	private static vertexBuffer: WebGLBuffer;
	protected shader: SimpleVBO;
	protected color: Color;

	public constructor(renderer: Renderer, color: Color) {
		super();
		this.color = color;

		// TODO: Move gl specific work outside of the constructor to be initialized in a static manor
		const gl = renderer.getGlContext();
		SimpleVBO.create(gl); // NOTE: Used to initialize the shader in a static context - only 1 ever gets created

		if (!this.shader) {
			this.shader = SimpleVBO.create();
		}

		if (!SimpleRectangle.vertexBuffer) {
			SimpleRectangle.vertexBuffer = initializeVertexBuffer(gl);
		}
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected renderModel(renderer: Renderer, position: Coordinate, animation?: Animation): void {
		let bonusSize = animation && this.getAnimationBonusSize(animation) || 0;
		const size = new TSM.vec3([1 + bonusSize, 1 + bonusSize, 1]);

		const gl = renderer.getGlContext();
		const shader = this.shader;
		const vertexBuffer = SimpleRectangle.vertexBuffer;

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);

		const offset = new TSM.vec3([0.5 - size.x / 2, 0.5 - size.y / 2, 0]);
		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(position.vec3().add(offset))
			.scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformColorLocation, new Float32Array(this.color.all()));

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	private getAnimationBonusSize(animation: Animation): number {
		switch (animation.animationType) {
			case AnimationType.Move: return 0.5;
			case AnimationType.Bump: return 0.25;
			case AnimationType.Pull:
			case AnimationType.Push:
				return -0.5;
		}
	}

}

export default SimpleRectangle;
