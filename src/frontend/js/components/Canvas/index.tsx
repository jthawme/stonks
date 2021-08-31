import React, { useCallback, useEffect, useRef } from "react";
import { EventCallbacks } from "../../types";
import { useAppContext } from "../Context";

const getDimensionsFromState = ({ state }: EventCallbacks) => {
  return {
    x: state.frame / state.totalFrames,
    y: 1 - state.stockValue / 100,
  };
};

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas: React.FC<CanvasProps> = ({ width = 640, height = 480 }) => {
  const { onEvent } = useAppContext();
  const canvasRef = useRef<HTMLCanvasElement | null>();
  const widthRef = useRef<number>(width);
  const heightRef = useRef<number>(height);

  const onRef = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef.current = el;

    if (el) {
      el.width = width;
      el.height = height;

      const ctx = el.getContext("2d") as CanvasRenderingContext2D;

      const lastPos = {
        x: 0,
        y: height,
      };

      const wid = (perc = 1) => widthRef.current * perc;
      const hei = (perc = 1) =>
        heightRef.current * (perc * 0.9) + heightRef.current * 0.05;

      const drawAtPerc = (perc: number) => {
        ctx.save();
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(0, hei(perc));
        ctx.lineTo(wid(), hei(perc));
        ctx.stroke();
        ctx.restore();
      };

      onEvent("start", (state) => {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "#03166e";
        ctx.fillRect(0, 0, wid(), hei());

        drawAtPerc(0.25);
        drawAtPerc(0.5);
        drawAtPerc(0.75);

        lastPos.x = 0;
        lastPos.y = 1;
        // updatePlayers(state);
      });

      onEvent("update", (state) => {
        ctx.beginPath();
        ctx.moveTo(wid(lastPos.x), hei(lastPos.y));

        const { x, y } = getDimensionsFromState(state);

        ctx.lineTo(wid(x), hei(y));
        ctx.stroke();
        lastPos.x = x;
        lastPos.y = y;
      });

      onEvent("sale", (state) => {
        const { x, y } = getDimensionsFromState(state);

        ctx.beginPath();
        ctx.arc(wid(x), hei(y), 10, 0, Math.PI * 2);
        if (state.player) {
          ctx.fillStyle = state.player.color;
        }
        ctx.fill();
      });

      onEvent("powerup", (state) => {
        const { x, y } = getDimensionsFromState(state);

        ctx.save();
        ctx.beginPath();
        ctx.arc(wid(x), hei(y), 16, 0, Math.PI * 2);
        if (state.player) {
          ctx.strokeStyle = state.player.color;
        }
        ctx.stroke();

        ctx.restore();

        if (state.powerup) {
          // The size of the emoji is set with the font
          ctx.font = "20px serif";
          // use these alignment properties for "better" positioning
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // draw the emoji
          ctx.fillText(state.powerup.icon, wid(x), hei(y) + 4);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      widthRef.current = width;
      heightRef.current = height;
    }
  }, [width, height]);

  return (
    <canvas
      style={{ width: `${width}px`, height: `${height}px` }}
      ref={onRef}
    />
  );
};

export { Canvas };
