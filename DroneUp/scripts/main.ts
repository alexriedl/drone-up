import Game from './Game';
import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './PremadeBots'

var game;
var seed;

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

var main = function () {
  document.getElementById("startButton").onclick = () => {
    if (game) {
      console.log("Killing old game");
      game.kill();
    }
    startGame();
  }
};

var startGame = function () {
  console.log("Starting up new game");
  seed = 12345;

  var playerControllers = [
    new LuigiBot(seed),
    new PushBot(seed),
    new PullBot(seed),
    new ChickenBot(seed),
    new RandomBot(seed),
    new ShoveBot(seed)
  ];

  game = new Game(seed, 15, playerControllers, 50, 50);
  game.start();
};

main();
