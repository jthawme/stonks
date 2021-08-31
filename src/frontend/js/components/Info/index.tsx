import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppContext } from "../Context";

import "./Info.scss";

interface InfoProps {
  className?: string;
}

const Info: React.FC<InfoProps> = ({ className }) => {
  const { stockValue } = useAppContext();
  const [lastValue, setLastValue] = useState(0);
  const [highest, setHighest] = useState(0);
  const [direction, setDirection] = useState("increase");

  useEffect(() => {
    setLastValue(stockValue);
    setDirection(lastValue < stockValue ? "increase" : "decrease");
    if (stockValue > highest) {
      setHighest(stockValue);
    }
  }, [stockValue]);

  return (
    <div className={`info-container ${className}`}>
      <div className={`column value ${direction}`}>
        ${Math.round(stockValue)}M
      </div>
      <div className={`column value`}>HGHST ${Math.round(highest)}M</div>
      <div className={`column ticker`}>
        <span className="ticker-tape">
          SELL SELL SELL SELL SELL SELL SELL SELL SELL
        </span>
      </div>
    </div>
  );
};

export { Info };
