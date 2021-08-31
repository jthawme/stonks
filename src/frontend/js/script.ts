// import SocketIO from 'socket.io-client';
import React from "react";
import ReactDOM from "react-dom";
import { Main } from "./components/Main";

// import StonksGame from "./game";
// import { EventCallbacks, FrameState, SaleSize } from "./types";

// // const io = new SocketIO();

// const WIDTH = 640;
// const HEIGHT = 480;

// const startBtn = document.getElementById("start") as HTMLButtonElement;
// const canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
// const ctx = canvasEl.getContext("2d");

// canvasEl.width = WIDTH;
// canvasEl.height = HEIGHT;

// const game = new StonksGame();

// game.addPlayer("player1");
// game.addPlayer("player2");

// const updatePlayers = ({ players }: EventCallbacks) => {
//   Object.keys(players).forEach((playerKey) => {
//     const el = document.querySelector(`.${playerKey}`);
//     (el.querySelector(".money") as HTMLSpanElement).innerText = `$${Math.round(
//       players[playerKey].sales
//     )}`;
//     (el.querySelector(
//       ".stocks"
//     ) as HTMLSpanElement).innerText = `${players[playerKey].stocks}`;
//   });
// };

// const lastPos = {
//   x: 0,
//   y: HEIGHT,
// };

// const getDimensionsFromState = ({ state }: EventCallbacks) => {
//   return {
//     x: (state.frame / state.totalFrames) * WIDTH,
//     y: HEIGHT - (state.stockValue / 100) * HEIGHT,
//   };
// };

// game.on("start", (state) => {
//   ctx.clearRect(0, 0, WIDTH, HEIGHT);
//   lastPos.x = 0;
//   lastPos.y = HEIGHT;
//   updatePlayers(state);
// });

// game.on("update", (state) => {
//   ctx.beginPath();
//   ctx.moveTo(lastPos.x, lastPos.y);

//   const { x, y } = getDimensionsFromState(state);

//   ctx.lineTo(x, y);
//   ctx.stroke();
//   lastPos.x = x;
//   lastPos.y = y;
// });

// game.on("end", (state) => {
//   startBtn.disabled = false;

//   updatePlayers(state);
// });

// game.on("sale", (state) => {
//   const { x, y } = getDimensionsFromState(state);

//   ctx.beginPath();
//   ctx.arc(x, y, 10, 0, Math.PI * 2);
//   ctx.fillStyle = state.player === "player1" ? "red" : "blue";
//   ctx.fill();

//   updatePlayers(state);
// });

// startBtn.addEventListener(
//   "click",
//   () => {
//     game.start();
//     startBtn.disabled = true;
//   },
//   false
// );

// const KEYS = ["q", "w", "o", "p"];

// window.addEventListener("keyup", (e) => {
//   if (KEYS.includes(e.key)) {
//     const player = ["q", "w"].includes(e.key) ? "player1" : "player2";
//     const size = ["w", "p"].includes(e.key) ? SaleSize.Large : SaleSize.Small;

//     game.sell(player, size);
//   }
// });

ReactDOM.render(React.createElement(Main), document.getElementById("app"));
