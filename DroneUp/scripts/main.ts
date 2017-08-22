import Game from './Game';
import { LuigiBot, PushBot, PullBot, ChickenBot, RandomBot, ShoveBot } from './PremadeBots'

if(window['running']) {
  console.log("Game is already running, but was told to run again.");
}
else {
  window['running'] = true;

  var seed = 12345;
  var playerControllers = [new LuigiBot(seed), new PushBot(seed), new PullBot(seed), new ChickenBot(seed), new RandomBot(seed), new ShoveBot(seed)];

  var game = new Game(seed, 15, playerControllers, 50, 50);
  game.start();
}
