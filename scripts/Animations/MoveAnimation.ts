import Animation from './Animation';
import { vec2 } from '../Math';

export class MoveAnimation extends Animation<MoveAnimation.MoveType> {
	public position: vec2;
	protected startPos: vec2;
	protected endPos: vec2;

	public constructor(startPos: vec2, endPos: vec2, duration: number = 250, moveType: MoveAnimation.MoveType) {
		super(duration, moveType);

		this.position = startPos;
		this.startPos = startPos;
		this.endPos = endPos;
	}

	public update(deltaTimeMs: number): boolean {
		const p = this.getProgressPercent();
		const x = (1 - p) * this.startPos.x + p * this.endPos.x;
		const y = (1 - p) * this.startPos.y + p * this.endPos.y;
		this.position = new vec2(x, y);
		return super.update(deltaTimeMs);
	}
}

// tslint:disable-next-line:no-namespace
// tslint:disable-next-line:no-internal-module
export module MoveAnimation {
	export enum MoveType {
		Basic, // Move on entity's own
		Bump, // Get physically pushed
		Pull, // Pulled with gun
		Push, // Pushed with gun
	}
}

export default MoveAnimation;
