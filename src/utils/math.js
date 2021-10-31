export const toRads = (degrees) => degrees * (Math.PI / 180);

export const toDegrees = (rads) => rads * (180 / Math.PI);

export const distanceBetweenTwoPoints = (x1, y1, x2, y2) => {
  return Math.sqrt(
    Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)
  );
};

export const angleBetweenThreeDots = (x1, y1, x2, y2, x3, y3) => {
  const P12 = distanceBetweenTwoPoints(x1, y1, x2, y2);
  const P23 = distanceBetweenTwoPoints(x2, y2, x3, y3);
  const P13 = distanceBetweenTwoPoints(x1, y1, x3, y3);

  const buf = ((P12 ** 2) + (P23 ** 2) - (P13 ** 2)) / (2 * P12 * P23);

  return Math.acos(buf);
};

export const collisionPointOfLines = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  let x, y;

  x = ((x1*y2 -  y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  y = ((x1*y2 -  y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
  return [x, y];
};

export const slopeOfLine = (x1, y1, x2, y2) => (y2-y1) / (x2-x1);

export const yInterceptOfLine = (x1, y1, x2, y2) => {
  const slope = slopeOfLine(x1, y1, x2, y2);
  return y1 - (slope * x1);
}

export const pointOnLine = (slope, yIntercept, x) => {
  return [x, x*slope + yIntercept];
}

export const lineAndCircleIntersectionPoints = (centerX, centerY, r, lineX1, lineY1, lineX2, lineY2) => {
  const slope = slopeOfLine(lineX1, lineY1, lineX2, lineY2);
  const yIntercept = yInterceptOfLine(lineX1, lineY1, lineX2, lineY2);
  const a = 1 + Math.pow(slope, 2);
  const b = -centerX * 2 + (slope * (yIntercept - centerY)) * 2;
  const c = Math.pow(centerX, 2) + Math.pow(yIntercept - centerY, 2) - Math.pow(r, 2);

  const d = Math.pow(b, 2) - 4 * a * c;
  if (d >= 0) {
    const intersectionsX = [
        (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
        (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    ];
    if (d === 0) {
        // only 1 intersection
        return [pointOnLine(slope, yIntercept, intersectionsX[0])];
    }
    return intersectionsX.map(x => pointOnLine(slope, yIntercept, x));
  }
  
  // no intersection
  return [];
}