import { vec2 } from 'Engine/Math';
import Renderer from './Renderer';

export default abstract class Game {
	protected readonly renderer: Renderer;

	private then: number;
	private running: boolean = false;

	public constructor(canvasId: string, rendererDimensions: vec2) {
		this.renderer = new Renderer(canvasId, rendererDimensions.x, rendererDimensions.y);
		this.initialize(this.renderer.gl);
	}

	protected abstract initialize(gl: WebGLRenderingContext): void;
	protected abstract update(deltaTime: number): void;
	protected abstract render(renderer: Renderer): void;

	public start(): void {
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
		this.render(this.renderer);

		requestAnimationFrame(this.frame);
	}
}
