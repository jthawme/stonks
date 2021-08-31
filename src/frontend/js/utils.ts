export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const randomArr = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
