import { padStart } from 'lodash'

export class Color {
  static fromHex(hex) {
    let raw = hex.replace('#', '');
    const isShortForm = hex.length === 3 || hex.length === 4;
    const r = isShortForm ? raw[0] : raw.slice(0, 2);
    const g = isShortForm ? raw[1] : raw.slice(2, 4);
    const b = isShortForm ? raw[2] : raw.slice(4, 6);
    const a = isShortForm ? raw[3] : raw.slice(6, 8);

    return new Color(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16))
  } 

  constructor(r, g, b, a) {
    if (r instanceof Color) {
      this._red = r.red;
      this._green = r.green;
      this._blue = r.blue;
      this._alpha = r.alpha;
    } else {
      this._red = r;
      this._green = g;
      this._blue = b;
      this._alpha = a || 255;
    }
  }

  get red () {
    return this._red;
  }

  set red (value) {
    if (typeof value === 'string') {
      this._red = numberToHex(value)
    } else {
      this._red = value;
    }
  }

  get green () {
    return this._green;
  }

  set green (value) {
    if (typeof value === 'string') {
      this._green = numberToHex(value)
    } else {
      this._green = value;
    }
  }

  get blue () {
    return this._blue;
  }

  set blue (value) {
    if (typeof value === 'string') {
      this._blue = numberToHex(value)
    } else {
      this._blue = value;
    }
  }

  get alpha () {
    return this._alpha;
  }

  set alpha (value) {
    if (typeof value === 'string') {
      this._alpha = numberToHex(value)
    } else {
      this._alpha = value;
    }
  }

  asHex(withAlpha = true) {
    let color = '#' + numberToHex(this.red) + numberToHex(this.green) + numberToHex(this.blue);
    if (withAlpha) color += numberToHex(this.alpha);
    return color.toUpperCase();
  }

  calculatePointAtGradient(colorTo, percent, withAlpha = true) {
    const resultRed = this.red + percent * (colorTo.red - this.red);
    const resultGreen = this.green + percent * (colorTo.green - this.green);
    const resultBlue = this.blue + percent * (colorTo.blue - this.blue);
    const resultAlpha = withAlpha ? this.alpha + percent * (colorTo.alpha - this.alpha) : null;

    return new Color(resultRed, resultGreen, resultBlue, resultAlpha);
  }

  copy() {
    return new Color(this);
  }
}

const numberToHex = (num, padTo=2) => {
  let hex = Math.round(num).toString(16);
  if (hex.length < padTo) {
    return padStart(hex, padTo, '0');
  }
  return hex
}