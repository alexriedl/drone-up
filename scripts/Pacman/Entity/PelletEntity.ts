import { PelletModel } from 'Pacman/Model';

import { Entity } from 'Engine/Entity';
import { vec2 } from 'Engine/Math';

export default class EnergizerEntity extends Entity {
	private flip = 300;
	private flicker: boolean;
	private pelletModel: PelletModel;
	protected model: PelletModel;

	public constructor(pellets: vec2[], size: number = 2, flicker: boolean = false) {
		super();

		this.flicker = flicker;
		this.pelletModel = new PelletModel(pellets, size);
		this.model = this.pelletModel;
	}

	public update(deltaTime: number): boolean {
		if (!this.flicker) return;

		this.flip -= deltaTime;
		if (this.flip <= 0) {
			this.flip += 300;
			this.model = !!this.model ? undefined : this.pelletModel;
		}
		return super.update(deltaTime);
	}

	public removePelletAt(coords: vec2): boolean {
		return this.pelletModel.removePelletAt(coords);
	}
}
