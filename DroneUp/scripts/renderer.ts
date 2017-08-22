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

export class Renderer {
  private context: IRenderContext;
  private xScale: number;
  private yScale: number;

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
    this.renderGrid(state.xSize, state.ySize);
    state.mapObjects.forEach(object => {
      //this.renderObject();
    });
  }

  private

  private renderGrid(width: number, height: number) {
    const step = 1;

    for (var x = 0; x <= width; x += step) {
      this.moveTo(x, 0);
      this.lineTo(x, width);
    }

    for (var x = 0; x <= height; x += step) {
      this.moveTo(0, x);
      this.lineTo(height, x);
    }

    this.stroke();
  }

  private moveTo(x: number, y: number) {
    this.context.context.moveTo(x * this.xScale, y * this.yScale * this.context.aspect);
  }

  private lineTo(x: number, y: number) {
    this.context.context.lineTo(x * this.xScale, y * this.yScale * this.context.aspect);
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
    mapObjects: [],
    players: [],
    spikes: [],
    xSize: 30,
    ySize: 30
  });
}
