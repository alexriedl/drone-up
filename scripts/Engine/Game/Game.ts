import { Color } from 'Engine/Utils';
import { Entity } from 'Engine/Entity';
import { vec2 } from 'Engine/Math';
import Renderer from './Renderer';

export default abstract class Game {
	protected readonly renderer: Renderer;

	// TODO: Perhaps extend entity to make a real scene? Allow a color to be set
	private scene: Entity;
	public backgroundColor: Color;

	private then: number;
	private running: boolean = false;
	private initialized: boolean = false;

	public constructor(canvasId: string, rendererDimensions: vec2, scene: Entity = new Entity()) {
		this.renderer = new Renderer(canvasId, rendererDimensions.x, rendererDimensions.y);
		this.scene = scene;
	}

	protected abstract initialize(gl: WebGLRenderingContext): void;

	/**
	 * Set the scene for the game. The default update/render functions redirect logic to this scene.
	 * The old scene will be returned
	 */
	public setScene(scene: Entity): Entity {
		const old = this.scene;
		this.scene = scene;
		return old;
	}

	// TODO: This could be very confusing when compared to simply calling setparent directly
	public addToScene(entity: Entity): void {
		if (this.scene) entity.setParent(this.scene);
	}

	protected update(deltaTime: number): void {
		if (this.scene) this.scene.update(deltaTime);
	}

	protected render(renderer: Renderer): void {
		renderer.simpleRender(this.scene, this.backgroundColor);
	}

	public start(): void {
		if (!this.initialized) {
			this.initialize(this.renderer.gl);
			this.initialized = true;
		}
		if (this.running) return;
		this.running = true;
		requestAnimationFrame(this.frame);
	}

	public stop(): void {
		this.running = false;
	}

	protected frame = (now: number) => {
		if (!this.running) {
			this.then = undefined;
			return;
		}

		const deltaTime = now - this.then;
		{
			const skipFrame = !this.then;
			this.then = now;

			if (skipFrame) {
				requestAnimationFrame(this.frame);
				return;
			}
		}

		this.update(deltaTime);
		// TODO: Update renderer to be more generic and the full renderer does not need to be passed to the render function
		this.render(this.renderer);

		requestAnimationFrame(this.frame);
	}
}
