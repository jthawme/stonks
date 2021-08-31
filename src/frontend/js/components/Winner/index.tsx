import React from "react";
import { useAppContext } from "../Context";

import "./Winner.scss";

const Winner = () => {
  const { winner } = useAppContext();

  if (!winner) {
    return null;
  }

  return (
    <div
      className="winner"
      style={{ "--player-color": winner.state.color } as React.CSSProperties}
    >
      <span>{winner.id} wins</span>
    </div>
  );
};

export { Winner };
