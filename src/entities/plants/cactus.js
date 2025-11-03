import { Plant } from "../plant.js";

export class Cactus extends Plant {
  constructor(sprite) {
    super({
      name: "Кактус",
      minMoisture: 0.0,
      maxMoisture: 0.45,
      growthRate: 0.08,
      maxGrowth: 1.0,
      sprite
    });

    this.slowZone = 0.3;          // зона замедления роста
    this.overWetLimit = 0.6;      // критическая влажность
    this.toleranceTicks = 3;      // сколько шагов терпит переувлажнение
    this.offRangeCounter = 0;
  }

  step(moisture) {
    if (!this.alive) return;

    // Проверка на критическое переувлажнение
    if (moisture > this.overWetLimit) {
      this.offRangeCounter++;
      if (this.offRangeCounter > this.toleranceTicks) {
        this.alive = false;
      }
      return;
    }

    // Если в допустимом диапазоне — растет
    if (this.canGrow(moisture)) {
      const prevGrowth = this.growth;
      super.step(moisture);

      // Замедление роста в "пограничной зоне"
      if (moisture > this.slowZone) {
        this.growth = prevGrowth + (this.growth - prevGrowth) * 0.5;
      }

      this.offRangeCounter = 0; // сброс счётчика
    } else {
      return;
    }
  }
}
