// Базовый класс Растение: общая логика роста/гибели и визуализации
export class Plant {
  constructor(config) {
    this.name = config.name;
    this.minMoisture = config.minMoisture;
    this.maxMoisture = config.maxMoisture;
    this.growthRate = config.growthRate; // прирост на шаг
    this.maxGrowth = config.maxGrowth; // максимум степени роста
    this.sprite = config.sprite; // Image объект
    this.growth = 0; // текущая степень роста
    this.alive = true;
  }

  canGrow(moisture) {
    return moisture >= this.minMoisture && moisture <= this.maxMoisture;
  }

  step(moisture) {
    if (!this.alive) return;
    if (!this.canGrow(moisture)) {
      // Если влажность не подходит — растение погибает
      this.alive = false;
      return;
    }
    this.growth = Math.min(this.growth + this.growthRate, this.maxGrowth);

    console.log(this.name, this.growth.toFixed(2), this.alive);
  }

  render(ctx, size, x, y) {
    if (!this.alive) {
      // серый силуэт погибшего растения
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#555";
      ctx.fillRect(x * size + size * 0.25, y * size + size * 0.25, size * 0.5, size * 0.5);
      ctx.globalAlpha = 1;
      return;
    }
    if (this.sprite && this.sprite.complete) {
      const scale = 0.4 + 0.6 * (this.growth / this.maxGrowth);
      const w = size * scale;
      const h = size * scale;
      const ox = x * size + (size - w) / 2;
      const oy = y * size + (size - h) / 2;
      ctx.drawImage(this.sprite, ox, oy, w, h);
    } else {
      // fallback — зелёный квадрат, масштабируемый по росту
      const scale = 0.3 + 0.7 * (this.growth / this.maxGrowth);
      const w = size * scale;
      const h = size * scale;
      const ox = x * size + (size - w) / 2;
      const oy = y * size + (size - h) / 2;
      ctx.fillStyle = "#2e8b57";
      ctx.fillRect(ox, oy, w, h);
    }
  }
}
