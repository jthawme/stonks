import React from "react";
import { useAppContext } from "../Context";

import "./Messages.scss";

const Messages = () => {
  const { messages } = useAppContext();

  return (
    <div className="messages">
      {messages.map((msg, idx) => (
        <span key={idx}>{msg}</span>
      ))}
    </div>
  );
};

export { Messages };
