import PacmanGame from 'Pacman/PacmanGame';

const game = new PacmanGame('game-canvas');
document.onkeydown = (event: KeyboardEvent) => game.onkeydown(event);
document.onkeyup = (event: KeyboardEvent) => game.onkeyup(event);
game.start();
