import PacMap from './PacMap';

export default class GhostModel extends PacMap {
	protected readonly source;
	protected readonly spriteCount = 8;
	protected readonly left = [4, 5];
	protected readonly right = [6, 7];
	protected readonly up = [0, 1];
	protected readonly down = [2, 3];

	public constructor(source: string) {
		super();
		this.source = source;
	}
}
