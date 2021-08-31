import React, { useCallback } from "react";
import { PowerupCost, PowerupType } from "../../types";
import { useAppContext } from "../Context";

import "./Options.scss";

const CHOICES = [
  {
    value: PowerupType.Sabotage,
    label: `${PowerupType.Sabotage} ($${PowerupCost[PowerupType.Sabotage]}M)`,
  },
  {
    value: PowerupType.Stimulus,
    label: `${PowerupType.Stimulus} ($${PowerupCost[PowerupType.Stimulus]}M)`,
  },
  {
    value: PowerupType.Stocks,
    label: `${PowerupType.Stocks} ($${PowerupCost[PowerupType.Stocks]}M)`,
  },
];

const Options = () => {
  const { options, changeOption, playing } = useAppContext();

  if (!options) {
    return null;
  }

  const updatePowerup = useCallback(
    (idx: number, val: PowerupType) => {
      const curr = options.powerupChoices.slice();
      curr[idx] = val;
      changeOption("powerupChoices", curr);
    },
    [options.powerups]
  );

  return (
    <div className="options">
      <h5>
        Powerups{" "}
        <input
          type="checkbox"
          checked={options.powerups}
          disabled={playing}
          onChange={() => changeOption("powerups", !options.powerups)}
        />
      </h5>
      {options.powerupChoices.map((choice, idx) => (
        <div key={idx} className="powerup-choice">
          <span>{idx + 1}.</span>

          <select
            value={choice}
            onChange={(e) => updatePowerup(idx, e.target.value as PowerupType)}
            disabled={!options.powerups || playing}
          >
            {CHOICES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export { Options };
