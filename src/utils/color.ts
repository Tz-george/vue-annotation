

export function hex2int(hex: string) {
  return parseInt(hex, 16);
}

export function hsl2rgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  // tslint:disable-next-line:variable-name one-variable-per-declaration
  let _r, _g, _b;
  if (h < 360) { [_r, _g, _b] = [c, 0, x]; }
  if (h < 300) { [_r, _g, _b] = [x, 0, c]; }
  if (h < 240) { [_r, _g, _b] = [0, x, c]; }
  if (h < 180) { [_r, _g, _b] = [0, c, x]; }
  if (h < 120) { [_r, _g, _b] = [x, c, 0]; }
  if (h < 60) { [_r, _g, _b] = [c, x, 0]; }
  return {
    // @ts-ignore
    r: (_r + m) * 255,
    // @ts-ignore
    g: (_g + m) * 255,
    // @ts-ignore
    b: (_b + m) * 255,
  };
}

export function rgb2hsl(r: number, g: number, b: number) {
  enum HSL {
    H, S, L,
  }

  // @ts-ignore
  const [R, G, B] = [r / 255, g / 255, b / 255];

  // tslint:disable-next-line:one-variable-per-declaration
  const min = Math.min(R, G, B), max = Math.max(R, G, B);

  const l = (min + max) / 2;

  const s = (max - min) / (max + min);
  let h = 0;
  switch ([R, G, B].indexOf(max)) {
    case HSL.H:
      h = (G - B) / (max - min);
      break;
    case HSL.S:
      h = 2 + (B - R) / (max - min);
      break;
    case HSL.L:
      h = 4 + (R - G) / (max - min);
      break;
  }

  // @ts-ignore
  h *= 60;

  return {h, s, l};

}

export function getRgbFromString(color: string) {
  // tslint:disable-next-line:variable-name one-variable-per-declaration
  let r, g, b;
  if (color.match('rgb')) {
    // @ts-ignore
    [r, g, b] = color.split(',').map((item) => item.match(/\d+/)[0]);
  } else if (color.match('#')) {
    [r, g, b] = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)];
    [r, g, b] = [hex2int(r), hex2int(g), hex2int(b)];
  } else {
    [r, g, b] = [0, 0, 0];
  }
  // @ts-ignore
  return {r: +r, g: +g, b: +b};
}

export function randomColor(): string {
  const h = Math.random() * 360;
  const s = .7;
  const l = .6;

  const {r, g, b} = hsl2rgb(h, s, l);

  // @ts-ignore
  return `rgb(${r}, ${g}, ${b})`;
}
