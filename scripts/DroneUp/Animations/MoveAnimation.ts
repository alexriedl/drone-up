import { vec3 } from 'Engine/Math';
import Animation from './Animation';

export class MoveAnimation extends Animation<MoveAnimation.MoveType> {
	public position: vec3;
	public bonusSize: number;
	protected startPos: vec3;
	protected endPos: vec3;

	public constructor(startPos: vec3, endPos: vec3, duration: number = 250, moveType: MoveAnimation.MoveType) {
		super(duration, moveType);

		this.bonusSize = 0;
		this.position = startPos;
		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		const p = this.getProgressPercent();
		this.position = this.startPos.lerp(this.endPos, p);

		const bonusSize = this.getAnimationBonusSize();
		if (p < 0.1) this.bonusSize = 10 * p * bonusSize;
		else if (p > 0.9) this.bonusSize = 10 * (1 - p) * bonusSize;

		return super.update(deltaTimeMs);
	}

	protected getAnimationBonusSize(): number {
		switch (this.extraInfo) {
			case MoveAnimation.MoveType.Basic: return 0.5;
			case MoveAnimation.MoveType.Pull: return -0.5;
			case MoveAnimation.MoveType.Push: return -0.5;
			default: return 0;
		}
	}
}

export namespace MoveAnimation {
	export enum MoveType {
		Basic, // Move on entity's own
		Bump, // Get physically pushed
		Pull, // Pulled with gun
		Push, // Pushed with gun
	}
}

export default MoveAnimation;
