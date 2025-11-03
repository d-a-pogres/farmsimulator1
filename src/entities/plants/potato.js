import { Plant } from "../plant.js";

// Картошка: средняя влажность
export class Potato extends Plant {
  constructor(sprite) {
    super({
      name: "Картошка",
      minMoisture: 0.2,
      maxMoisture: 0.8,
      growthRate: 0.06,
      maxGrowth: 1.0,
      sprite
    });
    // устойчивость к кратковременному выходу из диапазона
    this.toleranceTicks = 2;
    this.offRangeCounter = 0;
  }

  step(moisture) {
    if (!this.canGrow(moisture)) {
      this.offRangeCounter += 1;
      if (this.offRangeCounter > this.toleranceTicks) {
        this.alive = false;
      }
      return;
    }
    this.offRangeCounter = 0;
    super.step(moisture);
  }
}
