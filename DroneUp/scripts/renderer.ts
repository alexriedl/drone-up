export interface ICoords {
  x: number;
  y: number;
}
export interface IEntity extends ICoords {
  ID: string;
}
export interface IMapState {
  invalidArray: ICoords[];
  mapObjects: IEntity[];
  players: IEntity[];
  spikes: IEntity[];
  xSize: number;
  ySize: number;
}
export interface IRenderContext {
  canvas: any;
  context: any;
  width: number;
  height: number;
  aspect: number;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export class Renderer {
  private tileSize: number = 1;
  private context: IRenderContext;
  private xScale: number;
  private yScale: number;
  private playerColors: { [id: string]: string } = {};

  public constructor(canvasId: string) {
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.log("Failed to find canvas");
      return;
    }
    let context = (<any>canvas).getContext("2d");
    if (!context) {
      console.log("Failed to get 2d context");
      return;
    }

    this.context = {
      canvas: canvas,
      context: context,
      width: canvas['width'],
      height: canvas['height'],
      aspect: canvas['width'] / canvas['height']
    }
  }

  public renderState(state: IMapState) {
    this.xScale = this.context.width / state.xSize;
    this.yScale = this.context.height / state.ySize;

    this.context.context.clearRect(0, 0, this.context.width, this.context.height);

    this.renderGrid(state.xSize, state.ySize);
    state.mapObjects.forEach(entity => {
      this.renderObject(entity);
    });
  }

  private getPlayerColor(id: string): string {
    if(!this.playerColors[id]) {
      this.playerColors[id] = getRandomColor();
    }

    return this.playerColors[id]
  }

  private renderObject(entity: IEntity) {
    const isPlayer = entity.ID.startsWith("player");
    const color = isPlayer ? this.getPlayerColor(entity.ID) : "gray";
    console.log("Rendering entity: " + entity.ID + " color: " + color);

    this.rectangle(entity.x, entity.y, this.tileSize, this.tileSize, color);
  }

  private renderGrid(width: number, height: number) {
    const step = this.tileSize;

    for (var x = 0; x <= width; x += step) {
      this.moveTo(x, 0);
      this.lineTo(x, height);
    }

    for (var y = 0; y <= height; y += step) {
      this.moveTo(0, y);
      this.lineTo(width, y);
    }

    this.stroke();
  }

  private moveTo(x: number, y: number) {
    this.context.context.moveTo(x * this.xScale, y * this.yScale * this.context.aspect);
  }

  private lineTo(x: number, y: number) {
    this.context.context.lineTo(x * this.xScale, y * this.yScale * this.context.aspect);
  }

  private rectangle(x: number, y: number, width: number, height: number, color: string) {
    const context = this.context.context;
    const aspect = this.context.aspect;

    context.fillStyle = color;
    context.fillRect(x * this.xScale, y * this.yScale * aspect, width * this.xScale, height * this.yScale * aspect);
  }

  private stroke(style: string = "black") {
    this.context.context.strokeStyle = style;
    this.context.context.stroke();
  }
}

export function test() {
  const renderer = new Renderer("game-canvas");

  renderer.renderState({
    invalidArray: [],
    mapObjects: [
      { ID: "player1", x: 7, y: 1 },
      { ID: "player2", x: 3, y: 1 },
      { ID: "player3", x: 15, y: 6 },
      { ID: "__reservedSpikeNumber1__", x: 3, y: 4 },
    ],
    players: [],
    spikes: [],
    xSize: 50,
    ySize: 50
  });

  setTimeout(function() {
    renderer.renderState({
      invalidArray: [],
      mapObjects: [
        { ID: "player1", x: 10, y: 1 },
        { ID: "player2", x: 15, y: 1 },
        { ID: "player3", x: 15, y: 7 },
        { ID: "__reservedSpikeNumber1__", x: 3, y: 4 },
      ],
      players: [],
      spikes: [],
      xSize: 50,
      ySize: 50
    });
  }, 3000);
}
