export class Pos {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = $state(x);
    this.y = $state(y);
  }

  static add(a: Pos, b: Pos): Pos {
    return new Pos(a.x + b.x, a.y + b.y);
  }

  static sub(a: Pos, b: Pos): Pos {
    return new Pos(a.x - b.x, a.y - b.y);
  }

  static mul(p: Pos, n: number): Pos {
    return new Pos(p.x * n, p.y * n);
  }

  static dist(a: Pos, b: Pos): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  static lerp(a: Pos, b: Pos, t: number): Pos {
    return Pos.add(a, Pos.mul(Pos.sub(b, a), t));
  }

  static reflect(a: Pos, b: Pos): Pos {
    return this.sub(this.mul(a, 2), b);
  }
}

export class Ellipse {
  constructor(
    public xOffset: number,
    public yOffset: number,
    public xAxis: number,
    public yAxis: number,
    public degrees: number,
  ) {}

  isInside(point: Pos): boolean {
    const theta = this.degrees * Math.PI / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    const local = new Pos(
      point.x - this.xOffset,
      point.y - this.yOffset,
    );

    const xPrime = local.x * cos + local.y * sin;
    const yPrime = -local.x * sin + local.y * cos;

    // normalized between 0 and 1
    const distance = (xPrime / this.xAxis) ** 2 + (yPrime / this.yAxis) ** 2;

    return distance < 1;
  }
}

export function ease(t: number): number {
  return t * (2 - t);
}

// https://github.com/cprosche/mulberry32
export function mulberry32(seed: number) {
  return function() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
