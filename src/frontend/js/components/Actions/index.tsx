import React from "react";
import { useAppContext } from "../Context";

import "./Actions.scss";

const Actions = () => {
  const { play, playing, addPlayer, players } = useAppContext();

  return (
    <div className="actions">
      <button
        onClick={() => addPlayer()}
        disabled={playing || players.length >= 4}
      >
        Add Player
      </button>
      <button onClick={() => play()} disabled={playing}>
        Play
      </button>
    </div>
  );
};

export { Actions };
