type ButtonEventType = "press";

const getController = (deviceIndex: number): Gamepad => {
  const gamepads: any = navigator.getGamepads();
  return gamepads[deviceIndex];
};

class GameController {
  device: Gamepad;

  buttonState: Record<number, boolean>;
  events: Record<ButtonEventType, Array<(btns: number[]) => void>>;

  raf: number;

  constructor(device: Gamepad) {
    this.device = device;

    this.buttonState = {};

    this.events = {
      press: [],
    };

    this.raf = 0;
  }

  update() {
    const controller = getController(this.device.index) as Gamepad;

    const pressed: number[] = [];

    for (let i = 0; i < controller.buttons.length; i++) {
      if (this.buttonState[i] !== controller.buttons[i].pressed) {
        this.buttonState[i] = controller.buttons[i].pressed;

        if (controller.buttons[i].pressed) {
          pressed.push(i);
        }
      }
    }

    if (pressed.length) {
      this.events.press.forEach((cb) => cb(pressed));
    }

    this.raf = requestAnimationFrame(() => this.update());
  }

  onPress(cb: (btns: number[]) => void) {
    this.events.press.push(cb);
  }

  start() {
    this.raf = requestAnimationFrame(() => this.update());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

const controllers: GameController[] = [];

export const addMap = (device: Gamepad) => {
  removeMap(device);

  const c = new GameController(device);
  controllers.push(c);

  return c;
};

export const removeMap = (device: Gamepad) => {
  const previousIdx = controllers.findIndex(
    (c) => c.device.index === device.index
  );

  if (previousIdx >= 0) {
    controllers[previousIdx].destroy();
    controllers.splice(previousIdx, 1);
  }
};
