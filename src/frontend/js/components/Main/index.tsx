import React from "react";
import useMeasure from "react-use-measure";

import { Actions } from "../Actions";
import { Options } from "../Options";
import { Canvas } from "../Canvas";
import { AppContainer } from "../Context";
import { Info } from "../Info";
import { Messages } from "../Messages";
import { Players } from "../Players";
import { Winner } from "../Winner";

import "./Main.scss";

const Main: React.FC = () => {
  const [ref, bounds] = useMeasure();

  return (
    <AppContainer>
      <div className="wrapper">
        <aside>
          <Actions />
          <Options />
          <Players />
          <Messages />
        </aside>
        <Info className="info" />
        <main ref={ref}>
          <Winner />
          <Canvas width={bounds.width} height={bounds.height} />
        </main>
      </div>
    </AppContainer>
  );
};

export { Main };
