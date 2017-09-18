import { Color } from '../Utils';
import { RectangleBuffer } from './Buffer';
import { ResizeAnimation, MoveAnimation, Animation } from '../Animations';
import { SimpleShader } from './Shader';
import { vec2, vec3, mat4 } from '../Math';
import Model from './Model';

export interface IRenderState {
	size: vec3;
	position: vec2;
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

	protected setupRenderState(position?: vec2, animation?: Animation): IRenderState {
		let bonusSize = 0;
		if (animation) {
			if (animation instanceof MoveAnimation) {
				bonusSize = this.getAnimationBonusSize(animation.extraInfo);
				const p = animation.getProgressPercent();
				if (p < 0.1) bonusSize = 10 * p * bonusSize;
				else if (p > 0.9) bonusSize = 10 * (1 - p) * bonusSize;
				position = animation.position;
			}
			else if (animation instanceof ResizeAnimation) {
				bonusSize = animation.size;
			}
		}
		const size = new vec3(1 + bonusSize, 1 + bonusSize, 1);
		position = position || new vec2();

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

		const offset = new vec3(0.5 - size.x / 2, 0.5 - size.y / 2, 0);
		const modelViewMatrix = mat4.fromTranslation(position.toVec3().add(offset)).scale(size);

		gl.uniformMatrix4fv(shader.uniformModelViewMatrixLocation, false, modelViewMatrix.toFloat32Array());
		gl.uniform4fv(shader.uniformColorLocation, this.color.toFloat32Array());
	}

	protected draw(gl: WebGLRenderingContext, renderState: IRenderState): void {
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}

	protected getAnimationBonusSize(extraInfo: MoveAnimation.MoveType): number {
		switch (extraInfo) {
			case MoveAnimation.MoveType.Basic: return 0.5;
			case MoveAnimation.MoveType.Pull: return -0.5;
			case MoveAnimation.MoveType.Push: return -0.5;
			default: return 0;
		}
	}
}

export default SimpleRectangle;
