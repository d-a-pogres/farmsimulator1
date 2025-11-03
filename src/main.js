import { Grid } from "./grid.js";
import { Cell, WaterCell, LandCell } from "./entities/cell.js";
import { BogPlant } from "./entities/plants/bogPlant.js";
import { Potato } from "./entities/plants/potato.js";
import { Cactus } from "./entities/plants/cactus.js";

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const CELL_SIZE = 40;
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);

// Загрузка спрайтов
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const sprites = {
  bog: loadImage("./assets/bog.png.png"),
  potato: loadImage("./assets/potato.png.png"),
  cactus: loadImage("./assets/cactus.png.png")
};

const grid = new Grid(COLS, ROWS, CELL_SIZE);

// Инициализация клеток: по умолчанию земля, несколько точек воды
grid.cells = new Array(COLS * ROWS)
  .fill(null)
  .map((_, i) => {
    const { x, y } = grid.indexToCoord(i);
    return new LandCell(x, y);
  });

// Начальные водные блоки
seedWater([
  { x: 3, y: 3 },
  { x: 10, y: 6 },
  { x: 15, y: 15 }
]);

function seedWater(list) {
  for (const pos of list) {
    const idx = grid.coordToIndex(pos.x, pos.y);
    grid.cells[idx] = new WaterCell(pos.x, pos.y);
  }
  updateAllMoisture();
}

function updateAllMoisture() {
  grid.forEachCell((cell) => {
    if (cell.isLand()) cell.updateMoisture(grid);
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEachCell((cell) => {
    cell.render(ctx, CELL_SIZE);
    // сетка
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.strokeRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
}

// Инструменты
const toolsState = {
  selected: "shovel" // shovel | seed-bog | seed-potato | seed-cactus | bucket-add | bucket-remove
};

const toolLabel = document.getElementById("selected-tool");
document.querySelectorAll(".tools button").forEach((btn) => {
  btn.addEventListener("click", () => {
    toolsState.selected = btn.dataset.tool;
    toolLabel.textContent = `Инструмент: ${btn.textContent}`;
  });
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const cx = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const cy = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  if (!grid.inBounds(cx, cy)) return;
  const idx = grid.coordToIndex(cx, cy);
  const cell = grid.cells[idx];

  switch (toolsState.selected) {
    case "shovel":
      // Лопата: выкапываем растение
      if (cell.isLand() && cell.plant) {
        cell.plant = null;
      }
      break;
    case "seed-bog":
      if (cell.isLand() && !cell.plant) {
        cell.plant = new BogPlant(sprites.bog);
      }
      break;
    case "seed-potato":
      if (cell.isLand() && !cell.plant) {
        cell.plant = new Potato(sprites.potato);
      }
      break;
    case "seed-cactus":
      if (cell.isLand() && !cell.plant) {
        cell.plant = new Cactus(sprites.cactus);
      }
      break;
    case "bucket-add":
      // Ведро: вылить воду => превращаем клетку в воду
      grid.cells[idx] = new WaterCell(cx, cy);
      updateAllMoisture();
      break;
    case "bucket-remove":
      // Ведро: забрать воду => превращаем клетку в землю
      grid.cells[idx] = new LandCell(cx, cy);
      updateAllMoisture();
      break;
    default:
      break;
  }

  render();
});

// Шаг симуляции: обновление растений по влажности раз в 1 сек
setInterval(() => {
  updateAllMoisture();
  grid.forEachCell((cell) => {
    if (cell.isLand() && cell.plant) {
      cell.plant.step(cell.moisture);
    }
  });
  render();
}, 1000);

// Первый рендер
updateAllMoisture();
render();
