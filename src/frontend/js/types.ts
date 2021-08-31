export interface FrameState {
  frame: number;
  totalFrames: number;
  stockValue: number;
  valueIncrease: number;
}

export interface PlayerState {
  stocks: number;
  sales: number;
  color: string;
  powerupTimestamp: number;
}

export interface PlayerObject {
  id: string;
  controls: [string, string, string, string];
  gamepad?: Gamepad;
}

export interface GameOptions {
  powerups: boolean;
  powerupChoices: [PowerupType, PowerupType];
}

export type EventType =
  | "start"
  | "update"
  | "end"
  | "sale"
  | "player"
  | "powerup"
  | "option";

export type EventCallbacks = {
  options: GameOptions;
  state: FrameState;
  player?: PlayerState;
  powerup?: {
    name: string;
    playerId: string;
    icon: string;
  };
  players: Record<string, PlayerState>;
  message?: string;
};

export enum SaleSize {
  Small = "small",
  Large = "large",
}

export interface GamepadObject {
  playerId?: string;
  device: Gamepad;
}

export enum PowerupType {
  Stocks = "More Stocks",
  Stimulus = "Stimulus",
  Sabotage = "Sabotage",
}

export const PowerupCost: Record<PowerupType, number> = {
  [PowerupType.Stocks]: 1000,
  [PowerupType.Stimulus]: 500,
  [PowerupType.Sabotage]: 2000,
};

export enum TransformType {
  ZeroValue = "zerovalue",
}
