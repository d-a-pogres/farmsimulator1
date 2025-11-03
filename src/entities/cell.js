// Базовая клетка и два наследника: Земля, Вода
// У земли есть увлажненность, зависящая от ближайших блоков воды.
// Внешний вид земли плавно меняется от желтого к темно-коричневому при увеличении влажности.

export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = "cell"; // базовый
    this.plant = null; // ссылка на растение (если посажено)
  }

  isWater() {
    return this.type === "water";
  }

  isLand() {
    return this.type === "land";
  }

  // Общая отрисовка — переопределяется наследниками при необходимости
  render(ctx, size) {
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(this.x * size, this.y * size, size, size);
  }
}

export class WaterCell extends Cell {
  constructor(x, y) {
    super(x, y);
    this.type = "water";
  }

  render(ctx, size) {
    // простая заливка водой
    ctx.fillStyle = "#4da6ff";
    ctx.fillRect(this.x * size, this.y * size, size, size);
  }
}

export class LandCell extends Cell {
  constructor(x, y) {
    super(x, y);
    this.type = "land";
    this.moisture = 0; // 0..1
  }

  updateMoisture(grid) {
    // Расчет на основе количества/удаленности ближайших водных клеток.
    // Суммируем вклад 1 / dist для водных соседей в радиусе, нормируем.
    const maxRadius = 6;
    const neighbors = grid.getNeighbors(this.x, this.y, maxRadius);
    let sum = 0;
    for (const n of neighbors) {
      const idx = grid.coordToIndex(n.nx, n.ny);
      const c = grid.cells[idx];
      if (c && c.isWater()) {
        sum += 1 / n.dist;
      }
    }
    // Нормировка: примерно переводим в диапазон 0..1
    // Чем больше водных клеток рядом, тем выше влажность
    const normalized = Math.min(sum / 2.5, 1); // коэффициент подбирается экспериментально
    this.moisture = normalized;
  }

  render(ctx, size) {
    // Градиент от желтого (низкая влажность) к темно-коричневому (высокая)
    const low = { r: 220, g: 180, b: 60 }; // желтоватый
    const high = { r: 85, g: 55, b: 35 }; // темно-коричневый
    const t = this.moisture;
    const r = Math.round(low.r * (1 - t) + high.r * t);
    const g = Math.round(low.g * (1 - t) + high.g * t);
    const b = Math.round(low.b * (1 - t) + high.b * t);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(this.x * size, this.y * size, size, size);

    // Если есть растение — отрисуем поверх
    if (this.plant) {
      this.plant.render(ctx, size, this.x, this.y);
    }
  }
}
