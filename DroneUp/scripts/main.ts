import Game from './Game';
import {LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot} from './PremadeBots'

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

var seed = 12345;
var playerControllers = [new LuigiBot(seed), new PushBot(seed), new PullBot(seed), new ChickenBot(seed), new RandomBot(seed), new ShoveBot(seed)];

var game = new Game(seed, 15, playerControllers, 50, 50);
game.start();
