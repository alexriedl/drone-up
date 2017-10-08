import PacMap from './PacMap';

export default class DeadModel extends PacMap {
	private static readonly FRAMES: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	protected readonly spriteCount: number = DeadModel.FRAMES.length;
	protected readonly source: string = 'Images/dead.png';
	protected readonly left: number[] = DeadModel.FRAMES;
	protected readonly right: number[] = DeadModel.FRAMES;
	protected readonly up: number[] = DeadModel.FRAMES;
	protected readonly down: number[] = DeadModel.FRAMES;
	protected readonly textureWidth: number = 16 * 4;
	protected readonly textureHeight: number = 16 * 3;

	public constructor() {
		super();
		this.goUp();
	}
}
