import { Original } from 'Pacman/Maps';
import { PacEntity } from 'Pacman/Entity';

import { Color } from 'Engine/Utils';
import { vec2 } from 'Engine/Math';
import Renderer from 'Engine/Renderer';

function start(): void {
	const background = Color.BLACK;
	let then;

	// TODO: Find a cleaner way to initialize the map?
	const map = new Original();
	const renderer = new Renderer('game-canvas', map.width, map.height);
	map.initialize(renderer.gl);

	// TODO: This 2 line statement is common. Make it easier to do it in one?
	const test = new PacEntity(map, new vec2(1, 4));
	test.setParent(map);

	const frame = (now: number) => {
		const deltaTime = now - then;
		{
			const skipFrame = !then;
			then = now;

			if (skipFrame) {
				requestAnimationFrame(frame);
				return;
			}
		}

		map.update(deltaTime);
		renderer.simpleRender(map, background);

		requestAnimationFrame(frame);
	};

	requestAnimationFrame(frame);
}

start();
