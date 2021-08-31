import React from "react";
import { useAppContext } from "../Context";

import "./Players.scss";

const Players = () => {
  const { players, gamepads, assignGamepad, options } = useAppContext();

  return (
    <>
      <div className="players">
        {players.map((player) => {
          return (
            <div
              className="player"
              key={player.id}
              style={
                { "--player-color": player.state.color } as React.CSSProperties
              }
            >
              <h5>{player.id}</h5>
              {gamepads.length > 0 && (
                <select
                  value={player.gamepad?.index.toString() || "-1"}
                  onChange={(e) =>
                    assignGamepad(player.id, parseInt(e.target.value, 10))
                  }
                >
                  <option value="-1">-</option>
                  {gamepads.map((gp) => (
                    <option
                      key={gp.device.id}
                      value={gp.device.index.toString()}
                    >
                      {gp.device.id} ({gp.playerId || "n/a"})
                    </option>
                  ))}
                </select>
              )}
              <div className="controls">
                <span className="control">{player.controls[0]}</span> small sell
                (10)
                <br />
                <span className="control">{player.controls[1]}</span> big sell
                (50)
                {options?.powerups && (
                  <>
                    <br />
                    <span className="control">{player.controls[2]}</span>{" "}
                    powerup 1
                    <br />
                    <span className="control">{player.controls[3]}</span>{" "}
                    powerup 2
                  </>
                )}
              </div>

              <ul className="player-scores">
                <li>
                  Sales: <em>${Math.round(player.state.sales)}M</em>
                </li>
                <li>
                  Stocks: <em>{player.state.stocks}</em>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { Players };
