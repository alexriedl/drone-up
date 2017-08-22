import Game from './Game';

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};

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
