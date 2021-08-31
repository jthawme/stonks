import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as GameControl from "../../controller";
import StonksGame from "../../game";
import {
  EventCallbacks,
  EventType,
  GameOptions,
  GamepadObject,
  PlayerObject,
  PlayerState,
  PowerupType,
  SaleSize,
} from "../../types";

interface ExpandedPlayer extends PlayerObject {
  state: PlayerState;
  gamepad?: Gamepad;
}

interface AppContextProps {
  play: () => void;
  onEvent: (evt: EventType, cb: (state: EventCallbacks) => void) => void;
  addPlayer: () => void;
  playing: boolean;
  players: ExpandedPlayer[];
  gamepads: GamepadObject[];
  assignGamepad: (playerId: string, gamepadIndex: number) => void;
  stockValue: number;
  winner?: ExpandedPlayer;
  messages: string[];
  addMessage: (msg: string) => void;
  options?: GameOptions;
  changeOption: (option: keyof GameOptions, value: any) => void;
}

const CONTROLLER_SETS: Array<[string, string, string, string]> = [
  ["q", "w", "e", "r"],
  ["i", "o", "p", "["],
  ["z", "x", "c", "v"],
  ["m", ",", ".", "/"],
];

enum GamepadButton {
  Primary = 0,
  Secondary = 1,
  PowerupOne = 2,
  PowerupTwo = 3,
  Start = 9,
}

const AppContext = createContext<AppContextProps>({
  play: () => {},
  onEvent: () => {},
  playing: false,
  addPlayer: () => {},
  players: [],
  gamepads: [],
  assignGamepad: () => {},
  stockValue: 0,
  messages: [],
  addMessage: () => {},
  changeOption: () => {},
});

const AppContainer: React.FC = ({ children }) => {
  const gameRef = useRef<StonksGame>(new StonksGame());
  const [playing, setPlaying] = useState(false);
  const [scores, setScores] = useState<Record<string, PlayerState>>({});
  const [players, setPlayers] = useState<PlayerObject[]>([]);
  const [gamepads, setGamepads] = useState<GamepadObject[]>([]);
  const [stockValue, setStockValue] = useState<number>(0);
  const [winnerId, setWinnerId] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const [options, setOptions] = useState<GameOptions>(gameRef.current.options);

  const keyBindings = useRef<Record<string, () => void>>({});

  const expandedPlayers = useMemo(() => {
    return players.map((player) => {
      return {
        ...player,
        state: scores[player.id],
      };
    });
  }, [players, scores, gamepads]);

  const winner = useMemo(() => {
    return expandedPlayers.find((p) => p.id === winnerId);
  }, [expandedPlayers, winnerId]);

  const play = useCallback(() => {
    gameRef.current.start();
  }, []);

  const onEvent = useCallback(
    (evt: EventType, cb: (state: EventCallbacks) => void) => {
      gameRef.current.on(evt, cb);
    },
    []
  );

  const addPlayer = useCallback(() => {
    setPlayers((currentPlayers) => {
      const nextControllerSet = CONTROLLER_SETS.shift();

      if (nextControllerSet) {
        const id = `Player ${currentPlayers.length + 1}`;

        keyBindings.current[nextControllerSet[0]] = () => {
          gameRef.current.sell(id, SaleSize.Small);
        };
        keyBindings.current[nextControllerSet[1]] = () => {
          gameRef.current.sell(id, SaleSize.Large);
        };
        keyBindings.current[nextControllerSet[2]] = () => {
          gameRef.current.powerup(id, 0);
        };
        keyBindings.current[nextControllerSet[3]] = () => {
          gameRef.current.powerup(id, 1);
        };

        gameRef.current.addPlayer(id);
        return [
          ...currentPlayers,
          {
            id,
            controls: nextControllerSet,
          },
        ];
      } else {
        return currentPlayers;
      }
    });
  }, []);

  const assignGamepad = useCallback(
    (playerId: string, deviceIndex: number) => {
      const device = gamepads.find((gp) => gp.device.index === deviceIndex);
      const playerIndex = players.findIndex((p) => p.id === playerId);
      const currentGamepad = players[playerIndex].gamepad;

      if (deviceIndex === -1 && currentGamepad) {
        GameControl.removeMap(currentGamepad);
      }

      const currentPlayers = players.slice();
      currentPlayers[playerIndex] = {
        ...currentPlayers[playerIndex],
        gamepad: deviceIndex === -1 || !device ? undefined : device.device,
      };
      setPlayers(currentPlayers);

      if (!device) {
        return;
      }

      const controller = GameControl.addMap(device.device);
      controller.start();
      controller.onPress((pressed) => {
        if (pressed.includes(GamepadButton.Primary)) {
          gameRef.current.sell(playerId, SaleSize.Small);
        }
        if (pressed.includes(GamepadButton.Secondary)) {
          gameRef.current.sell(playerId, SaleSize.Large);
        }
        if (pressed.includes(GamepadButton.PowerupOne)) {
          gameRef.current.powerup(playerId, 0);
        }
        if (pressed.includes(GamepadButton.PowerupTwo)) {
          gameRef.current.powerup(playerId, 1);
        }

        if (playerIndex === 0 && pressed.includes(GamepadButton.Start)) {
          gameRef.current.start();
        }
      });
    },
    [gamepads, players]
  );

  const changeOption = useCallback((option: keyof GameOptions, value: any) => {
    gameRef.current.changeOption(option, value);
  }, []);

  useEffect(() => {
    gameRef.current.on("option", (state) => {
      setOptions({ ...state.options });
    });

    gameRef.current.on("start", (state) => {
      setWinnerId(undefined);
      setScores({ ...state.players });
      setPlaying(true);
    });

    gameRef.current.on("end", (state) => {
      setPlaying(false);

      const playerTallies: Array<PlayerState & { id: string }> = [];

      Object.keys(state.players).forEach((key) => {
        playerTallies.push({
          ...state.players[key],
          id: key,
        });
      });

      playerTallies.sort((a, b) => {
        return b.sales - a.sales;
      });

      const newWinner = playerTallies.shift();
      setWinnerId(newWinner?.id);
    });

    gameRef.current.on("update", (state) => {
      if (state.state.frame % 5 === 0) {
        setStockValue(state.state.stockValue);
      }
    });

    gameRef.current.on("player", (state) => {
      setScores({ ...state.players });
    });

    gameRef.current.on("sale", (state) => {
      setScores({ ...state.players });
    });

    gameRef.current.on("powerup", (state) => {
      addMessage(`${state.powerup?.playerId} bought ${state.powerup?.name}`);
    });

    window.addEventListener("keyup", (e) => {
      if (keyBindings.current[e.key]) {
        keyBindings.current[e.key]();
      }
    });

    window.addEventListener("gamepadconnected", (event) => {
      setGamepads((currentGamePads) => {
        if (!event.gamepad) {
          return currentGamePads;
        }

        return [
          ...currentGamePads,
          {
            playerId: undefined,
            device: event.gamepad,
          },
        ];
      });
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      setGamepads((gamepads) => {
        const curr = gamepads.slice();
        const idx = curr.findIndex((gp) => gp.device.id === event.gamepad?.id);

        curr.splice(idx, 1);

        return curr;
      });
    });
  }, []);

  const addMessage = useCallback((msg: string) => {
    setMessages((curr) => {
      return [msg, ...curr];
    });
  }, []);

  const value = {
    play,
    onEvent,
    playing,
    addPlayer,
    players: expandedPlayers,
    gamepads,
    assignGamepad,
    stockValue,
    winner,
    messages,
    addMessage,
    options,
    changeOption,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppContainer, useAppContext };
