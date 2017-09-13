import { ResizeAnimation, MoveAnimation, Animation, AnimationType } from '../Animations';
import { Coordinate, Color } from '../Utils';
import { RectangleBuffer } from './Buffer';
import { SimpleShader } from './Shader';
import Model from './Model';

export interface IRenderState {
	size: TSM.vec3;
	position: Coordinate;
}

abstract class SimpleRectangle extends Model {
	protected buffer: RectangleBuffer;
	protected shader: SimpleShader;
	protected color: Color;

	public constructor(color: Color) {
		super();
		this.color = color;
	}

	protected createShader(): SimpleShader {
		return SimpleShader.createShader();
	}

	protected createBuffer(): RectangleBuffer {
		return RectangleBuffer.createBuffer();
	}

	public getModelViewMatrixUniformLocation(): WebGLUniformLocation {
		return this.shader.uniformProjectionMatrixLocation;
	}

	protected setupRenderState(position?: Coordinate, animation?: Animation): IRenderState {
		let bonusSize = 0;
		if (animation) {
			if (animation instanceof MoveAnimation) {
				bonusSize = this.getAnimationBonusSize(animation);
				position = animation.position;
			}
			else if (animation instanceof ResizeAnimation) {
				bonusSize = animation.size;
			}
		}
		const size = new TSM.vec3([1 + bonusSize, 1 + bonusSize, 1]);
		position = position || new Coordinate(0, 0);

		return {
			size,
			position,
		};
	}

	protected updateAttributes(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		const vertexBuffer = this.buffer.getBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(shader.attributePositionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.attributePositionLocation);
	}

	protected updateUniforms(gl: WebGLRenderingContext, renderState: IRenderState): void {
		const shader = this.shader;
		const size = renderState.size;
		const position = renderState.position;

		const offset = new TSM.vec3([0.5 - size.x / 2, 0.5 - size.y / 2, 0]);
		const modelViewMatrix = TSM.mat4.identity
			.copy()
			.translate(position.vec3().add(offset))
			.scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, new Float32Array(modelViewMatrix.all()));
		gl.uniform4fv(shader.uniformColorLocation, new Float32Array(this.color.all()));
	}

	protected draw(gl: WebGLRenderingContext, renderState: IRenderState): void {
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
