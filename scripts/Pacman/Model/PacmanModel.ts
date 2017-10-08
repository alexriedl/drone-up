import PacMap from './PacMap';

export default class PacmanModel extends PacMap {
	protected readonly spriteCount: number = 9;
	protected readonly source: string = 'Images/pacman.png';
	protected readonly left: number[] = [0, 1, 2, 1];
	protected readonly right: number[] = [0, 3, 4, 3];
	protected readonly up: number[] = [0, 5, 6, 5];
	protected readonly down: number[] = [0, 7, 8, 7];
}
