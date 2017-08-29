import Coords from './Coords';

export default class GameObject extends Coords {
	public readonly ID: string
	public readonly type: string;

	public constructor(ID: string, type: string, x?: number, y?: number) {
		super(x, y);
		this.ID = ID;
		this.type = type;
	}
}
