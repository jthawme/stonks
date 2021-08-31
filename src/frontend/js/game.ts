import {
  EventCallbacks,
  EventType,
  FrameState,
  GameOptions,
  PlayerState,
  PowerupCost,
  PowerupType,
  SaleSize,
  TransformType,
} from "./types";
import { clamp, randomArr } from "./utils";

const MIN_VALUE = -3;
const MAX_VALUE = 5;

const FPS = 30;
const TOTAL_SECONDS = 15;
const TOTAL_FRAMES = FPS * TOTAL_SECONDS;
const POWERUP_COOLDOWN = 1000;

const STARTING_STOCKS = 100;

const DEFAULT_GAME_STATE: FrameState = {
  frame: 0,
  totalFrames: TOTAL_FRAMES,
  stockValue: 0,
  valueIncrease: 1,
};

const DEFAULT_PLAYER_STATE: Pick<
  PlayerState,
  "sales" | "stocks" | "powerupTimestamp"
> = {
  stocks: STARTING_STOCKS,
  sales: 0,
  powerupTimestamp: 0,
};

const DEFAULT_OPTIONS: GameOptions = {
  powerups: true,
  powerupChoices: [PowerupType.Stocks, PowerupType.Sabotage],
};

const COLORS = ["red", "orange", "purple", "green"];

class StonksGame {
  gameState: FrameState;
  playing: boolean;
  lastFrame: number;
  lastFrameDt: number;

  events: Record<EventType, Array<(data: EventCallbacks) => void>>;
  players: Record<string, PlayerState>;

  timer: number;

  nextTransform?: TransformType;

  options: GameOptions;

  constructor() {
    this.gameState = { ...DEFAULT_GAME_STATE };
    this.playing = false;
    this.lastFrame = 0;
    this.lastFrameDt = 0;

    this.timer = 0;

    this.events = {
      start: [],
      update: [],
      end: [],
      sale: [],
      player: [],
      powerup: [],
      option: [],
    };

    this.options = { ...DEFAULT_OPTIONS };

    this.players = {};
  }

  on(evt: EventType, cb: (data: EventCallbacks) => void) {
    if (evt in this.events) {
      this.events[evt].push(cb);
    }
  }

  changeOption(option: keyof GameOptions, value: any) {
    this.options[option] = value;

    this.fire("option");
  }

  addPlayer(playerId: string) {
    const nextColor = COLORS.splice(0, 1).pop();

    if (!nextColor) {
      return;
    }

    this.players[playerId] = {
      ...DEFAULT_PLAYER_STATE,
      color: nextColor,
    };

    this.fire("player");
  }

  _getValueIncrease() {
    return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1) + MIN_VALUE);
  }

  _resetPlayers() {
    Object.keys(this.players).forEach(
      (playerKey) =>
        (this.players[playerKey] = {
          ...DEFAULT_PLAYER_STATE,
          color: this.players[playerKey].color,
        })
    );
  }

  fire(evt: EventType, data?: Partial<EventCallbacks>) {
    const d = {
      ...data,
      state: this.gameState,
      players: this.players,
      options: this.options,
    };
    this.events[evt].forEach((cb) => cb(d));
  }

  update() {
    this.gameState.frame++;
    this.gameState.stockValue = clamp(
      this.gameState.stockValue + this.gameState.valueIncrease,
      0,
      100
    );
    this.gameState.valueIncrease = clamp(this._getValueIncrease(), -3, 20);

    this.fire("update");

    if (this.gameState.frame >= TOTAL_FRAMES) {
      this.end();
    } else {
      this.schedule();
    }
  }

  schedule() {
    this.timer = window.setTimeout(() => {
      if (!this.playing) {
        return;
      }

      const time = performance.now();
      this.lastFrameDt = time - this.lastFrame;
      this.lastFrame = time;
      this.update();
    }, 1000 / 30);
  }

  start() {
    if (this.playing) {
      return;
    }

    this.gameState = { ...DEFAULT_GAME_STATE };
    this._resetPlayers();

    this.fire("start");

    this.playing = true;
    this.schedule();

    console.clear();
  }

  sell(playerId: string, size: SaleSize) {
    if (!this.playing) {
      return;
    }

    const buySize = size === SaleSize.Small ? 10 : 50;

    if (buySize > this.players[playerId].stocks) {
      return;
    }

    if (!this.nextTransform) {
      this.players[playerId].sales += this.gameState.stockValue * buySize;
      this.players[playerId].stocks -= buySize;
    } else {
      switch (this.nextTransform) {
        case TransformType.ZeroValue:
          this.players[playerId].stocks -= buySize;
      }
    }

    this.fire("sale", {
      player: this.players[playerId],
    });

    if (this.nextTransform !== TransformType.ZeroValue) {
      this.gameState.stockValue /= size === SaleSize.Small ? 2 : 5;
    }

    this.nextTransform = undefined;
  }

  powerupMoreStocks(playerId: string) {
    this.players[playerId].stocks += Math.ceil(Math.random() * 5) * 10;

    return {
      name: "More Stocks 💵",
      icon: "💵",
    };
  }

  powerupStimulus(playerId: string) {
    this.gameState.stockValue += 50;

    return {
      name: "Stimulus 📈",
      icon: "📈",
    };
  }

  powerupSabotage(playerId: string) {
    this.nextTransform = TransformType.ZeroValue;

    return {
      name: "Sabotage 🔪",
      icon: "🔪",
    };
  }

  powerup(playerId: string, powerupType: 0 | 1) {
    if (!this.playing || !this.options.powerups) {
      return;
    }

    const powerup = this.options.powerupChoices[powerupType];
    const cost = PowerupCost[powerup];

    const now = performance.now();

    if (
      this.players[playerId].sales < cost ||
      this.players[playerId].powerupTimestamp > now - POWERUP_COOLDOWN
    ) {
      return;
    }

    this.players[playerId].powerupTimestamp = now;
    this.players[playerId].sales -= cost;

    const getPowerup = () => {
      switch (powerup) {
        case PowerupType.Stocks:
          return this.powerupMoreStocks(playerId);
        case PowerupType.Stimulus:
          return this.powerupStimulus(playerId);
        case PowerupType.Sabotage:
          return this.powerupSabotage(playerId);
      }
    };

    this.fire("powerup", {
      powerup: {
        ...getPowerup(),
        playerId,
      },
      player: this.players[playerId],
    });
  }

  end() {
    this.playing = false;

    this.fire("end");
  }
}

export default StonksGame;
