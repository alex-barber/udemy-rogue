import { Map } from 'rot-js';
import Player from './Player';

class World {
  constructor(width, height, tilesize) {
    this.width = width;
    this.height = height;
    this.tilesize = tilesize;
    this.entities = [new Player(0, 0, 16)];
    this.history = ['You enter the dungeon', '---'];

    this.worldmap = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      this.worldmap[x] = new Array(this.height);
    }
    // this.createRandomMap();
    // this.createCellularMap();
  }

  get player() {
    return this.entities[0];
  }

  add(entity) {
    this.entities.push(entity);
  }

  remove(entity) {
    this.entities = this.entities.filter(e => e !== entity);
  }

  moveToSpace(entity) {
    for (let x = entity.x; x < this.width; x++) {
      for (let y = entity.y; y < this.height; y++) {
        if (this.worldmap[x][y] === 0 && !this.getEntityAtLocation(x, y)) {
          entity.x = x;
          entity.y = y;
          return;
        }
      }
    }
  }

  const;

  isWall(x, y) {
    return (
      this.worldmap[x] === undefined ||
      this.worldmap[y] === undefined ||
      this.worldmap[x][y] === 1
    );
  }

  movePlayer(dx, dy) {
    let tempPlayer = this.player.copyPlayer();
    tempPlayer.move(dx, dy);
    let entity = this.getEntityAtLocation(tempPlayer.x, tempPlayer.y);
    console.log('ENTITY', entity);
    if (entity) {
      console.log(entity);
      entity.action('bump', this);
      return;
    }
    if (this.isWall(tempPlayer.x, tempPlayer.y)) {
      console.log(`Way blocked at ${tempPlayer.x}:${tempPlayer.y}`);
    } else {
      this.player.move(dx, dy);
    }
  }

  createCellularMap() {
    const startTime = Date.now();
    console.log('starting mapgen', startTime);
    var map = new Map.Cellular(this.width, this.height, { connected: true });
    map.randomize(0.54);
    var userCallBack = (x, y, value) => {
      if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
        this.worldmap[x][y] = 1;
        return;
      }
      this.worldmap[x][y] = value === 0 ? 1 : 0;
    };
    map.create(userCallBack);
    map.connect(userCallBack, 1);
    const endtime = (startTime - Date.now()) / 1000;
    console.log('ending mapgen, time:', endtime);
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
    this.entities.forEach(entity => {
      // console.log(entity);
      entity.draw(context);
    });
  }

  getEntityAtLocation(x, y) {
    // console.log(x,y, this.entities)
    return this.entities.find(entity => {
      return entity.x === x && entity.y === y;
    });
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

  addToHistory(history) {
    this.history.push(history);
    if (this.history.length > 6) this.history.shift();
  }
}

export default World;
