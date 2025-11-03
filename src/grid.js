export class Grid {
  constructor(cols, rows, cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.cells = []; // будет заполнено снаружи
  }

  indexToCoord(ix) {
    const x = ix % this.cols;
    const y = Math.floor(ix / this.cols);
    return { x, y };
  }

  coordToIndex(x, y) {
    return y * this.cols + x;
  }

  inBounds(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  forEachCell(fn) {
    for (let i = 0; i < this.cells.length; i += 1) {
      fn(this.cells[i], i);
    }
  }

  getNeighbors(x, y, maxRadius = 5) {
    const coords = [];
    for (let r = 1; r <= maxRadius; r += 1) {
      for (let dx = -r; dx <= r; dx += 1) {
        for (let dy = -r; dy <= r; dy += 1) {
          if (Math.abs(dx) + Math.abs(dy) !== r) continue; // манхэттенов круг
          const nx = x + dx;
          const ny = y + dy;
          if (this.inBounds(nx, ny)) coords.push({ nx, ny, dist: Math.abs(dx) + Math.abs(dy) });
        }
      }
    }
    return coords;
  }
}
