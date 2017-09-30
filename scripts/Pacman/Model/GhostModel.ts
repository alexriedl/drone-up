import PacMap from './PacMap';

export default class GhostModel extends PacMap {
	protected source;
	protected spriteCount = 8;
	protected left = [4, 5];
	protected right = [6, 7];
	protected up = [0, 1];
	protected down = [2, 3];

	public constructor(source: string) {
		super();
		this.source = source;
	}
}
