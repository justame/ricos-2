export class Range {
  constructor(public from: number, public to: number) {
    if (from > to) {
      this.from = to;
      this.to = from;
    } else {
      this.from = from;
      this.to = to;
    }
  }

  equals(other: Range) {
    return this.from === other.from && this.to === other.to;
  }

  isEmpty() {
    return this.from === this.to;
  }

  toString() {
    return `(${this.from}, ${this.to})`;
  }

  static empty = new Range(0, 0);
}
