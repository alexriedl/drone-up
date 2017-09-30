import PacMap from './PacMap';

export default class BlinkyModel extends PacMap {
	protected get spriteCount(): number { return 8; }
	protected get source(): string { return 'Images/blinky.png'; }
	protected get left(): number[] { return [4, 5]; }
	protected get right(): number[] { return [6, 7]; }
	protected get up(): number[] { return [0, 1]; }
	protected get down(): number[] { return [2, 3]; }
}
