import PacMap from './PacMap';

export default class PacmanModel extends PacMap {
	protected get spriteCount(): number { return 9; }
	protected get source(): string { return 'Images/pacman.png'; }
	protected get left(): number[] { return [0, 1, 2, 1]; }
	protected get right(): number[] { return [0, 3, 4, 3]; }
	protected get up(): number[] { return [0, 5, 6, 5]; }
	protected get down(): number[] { return [0, 7, 8, 7]; }
}
