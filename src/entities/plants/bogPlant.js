import { Plant } from "../plant.js";

export class BogPlant extends Plant {
  constructor(sprite) {
    super({
      name: "Болотник",
      minMoisture: 0.6,
      maxMoisture: 1.0,
      growthRate: 0.08,
      maxGrowth: 1.0,
      sprite
    });
    this.superWetBonus = 0.02;
  }

  step(moisture) {
    super.step(moisture);
    if (this.alive && moisture > 0.85) {
      this.growth = Math.min(this.growth + this.superWetBonus, this.maxGrowth);
    }
  }
}
