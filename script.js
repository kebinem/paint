const tools = document.querySelectorAll(".tool");
const colors = document.querySelector(".colors-list");
const leftBar = document.querySelector(".tools-board");
const fillColor = document.querySelector("#fill-color");
const colorPicker = document.querySelector("#color-picker");
const size = document.querySelector("#size-slider");
const clear = document.querySelector(".clear-canvas");
const save = document.querySelector(".save-img");
const canvas = document.querySelector("canvas");

ctx = canvas.getContext("2d", { willReadFrequently: true });

let preMouseX,
  preMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "rgb(0, 0, 0)";

const setCanvasBack = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBack();
});

const startDraw = (e) => {
  isDrawing = true;
  preMouseX = e.offsetX;
  preMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      preMouseX - e.offsetX,
      preMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    preMouseX - e.offsetX,
    preMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(preMouseX - e.offsetX, 2) +
      Math.sqrt(Math.pow(preMouseY - e.offsetY, 2))
  );
  ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(preMouseX, preMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  if (selectedTool === "rectangle") {
    drawRect(e);
  }

  if (selectedTool === "circle") {
    drawCircle(e);
  }

  if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

leftBar.addEventListener("click", (e) => {
  const tool = e.target.closest(".tool");
  if (tool) tools.forEach((tool) => tool.classList.remove("active"));
  tool?.classList.add("active");
  selectedTool = tool?.id ?? selectedTool;
});

colors.addEventListener("click", (e) => {
  const color = e.target.closest(".color");
  document.querySelector(".opacity")?.classList.remove("opacity");
  color.children[0].classList.add("opacity");
  selectedColor = window
    .getComputedStyle(color)
    .getPropertyValue("background-color");
});

size.addEventListener("change", () => {
  brushWidth = size.value;
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBack();
});

save.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "MyIMG.jpg";
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
