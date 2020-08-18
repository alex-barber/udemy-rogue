import { Map } from 'rot-js';

class World {
  constructor(width, height, tilesize) {
    this.width = width;
    this.height = height;
    this.tilesize = tilesize;
    this.worldmap = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      this.worldmap[x] = new Array(this.height);
    }
    // this.createRandomMap();
    this.createCellularMap();
  }

  createCellularMap() {
    const startTime = Date.now()
    console.log('starting mapgen', startTime)
    var map = new Map.Cellular(this.width, this.height, { connected: true });
    map.randomize(0.54);
    var userCallBack = (x, y, value) => {
      if (x === 0 || y === 0 || x === (this.width - 1) || y === (this.height -1) ) {
        this.worldmap[x][y] = 1;
        return;
      }
      this.worldmap[x][y] = value === 0 ? 1 : 0;
    };
    map.create(userCallBack);
    map.connect(userCallBack, 1);
    const endtime = (startTime - Date.now()) / 1000
    console.log('ending mapgen, time:', endtime  )
  }

  // createRandomMap() {
  //   for (let x = 0; x < this.width; x++) {
  //     for (let y = 0; y < this.height; y++) {
  //       this.worldmap[x][y] = Math.round(Math.random());
  //     }
  //   }
  // }

  draw(context) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.worldmap[x][y] === 1) this.drawWall(context, x, y);
      }
    }
  }

  drawWall(context, x, y) {
    context.fillStyle = '#000';
    context.fillRect(
      x * this.tilesize,
      y * this.tilesize,
      this.tilesize,
      this.tilesize
    );
  }
}

export default World;
