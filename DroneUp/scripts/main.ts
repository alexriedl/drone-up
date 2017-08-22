import Game from './Game';
import Random from './Random';

class Controller {
  private randomizer;
  private actions;

  constructor() {
    this.randomizer = new Random(12345);
  }
  getAction() {
    return this.actions[this.randomizer.next() % this.actions.length];
  }
}
var playerControllers = [new Controller(), new Controller(), new Controller()];

var game = new Game(12345, 15, playerControllers, 50, 50);
game.start();
