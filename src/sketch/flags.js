import { CN, colors, JP, KR, margin } from '../const';
import { angleBetweenThreeDots, distanceBetweenTwoPoints, lineAndCircleIntersectionPoints, toDegrees, toRads } from '../utils/math';

const getCNStarPath = (R, x, y, rot) => {
  // Source: https://developpaper.com/introduction-to-canvas-draw-the-national-flag-with-canvas/
  const path = new Path2D();
  for (var i = 0; i < 5; i++ ) {
    path.lineTo(Math.cos((18+i*72-rot)/180*Math.PI)*R + x,-Math.sin((18+i*72-rot)/180*Math.PI)*R + y);
    path.lineTo(Math.cos((54+i*72-rot)/180*Math.PI)*R/2.4 + x,-Math.sin((54+i*72-rot)/180*Math.PI)*R/2.4 + y);
  };
  path.closePath();
  return path;
}

const getCNStarsPath = (width, height) => {
  // tl -- top left quadrant
  const tlSectionWidth = width / 2;
  const tlSectionHeight = height / 2;

  const tlSectionRowSize = Math.min(tlSectionWidth / 15, tlSectionHeight / 10);

  const x1 = tlSectionRowSize * 3, y1 = tlSectionRowSize * 5;
  const mainPath = getCNStarPath(x1, y1, tlSectionRowSize * 5, 0);
  const starPosition = [
    [10, 2, 22],
    [12, 4, 43],
    [12, 7, 357],
    [10, 9, 21],
  ];
  for (var j = 0; j < starPosition.length; j++){
      const [leftOffset, topOffset, rot] = starPosition[j];
      const x = tlSectionRowSize * leftOffset;
      const y = tlSectionRowSize * topOffset;
      const p = getCNStarPath(tlSectionRowSize, x , y, rot);
      mainPath.addPath(p);
  }
  return mainPath;
}

const getJPCirclePath = (width, height) => {
  const path = new Path2D();
  const radius = (Math.min(width, height) * (3/5)) / 2;
  path.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
  return path;
}

const getKRRedCirclePath = (width, height) => {
  const path = new Path2D();
  const rotated = width < height;
  const isolatedWidth = (height / 2) * 3;
  const widthMargin = (width - isolatedWidth) / 2;
  const middleX = width / 2;
  const middleY = height / 2;
  const bigCircleR = height / 4;
  const smallCircleR = bigCircleR / 2;

  const angle = angleBetweenThreeDots(widthMargin + isolatedWidth, height, middleX, middleY, middleX + 100, middleY);
  path.arc(middleX, middleY, bigCircleR, angle, angle + Math.PI, true);
  path.closePath();
  
  const smallCirclePath = new Path2D();

  let intersectionPoints = lineAndCircleIntersectionPoints(middleX, middleY, bigCircleR, middleX, middleY, widthMargin + isolatedWidth, height);
  const smallCircleEndX = Math.min(intersectionPoints[0][0], intersectionPoints[1][0]);
  const smallCircleEndY = Math.min(intersectionPoints[0][1], intersectionPoints[1][1]);

  intersectionPoints = lineAndCircleIntersectionPoints(smallCircleEndX, smallCircleEndY, smallCircleR, middleX, middleY, widthMargin + isolatedWidth, height); 
  const smallCircleCenterX = Math.max(intersectionPoints[0][0], intersectionPoints[1][0]);
  const smallCircleCenterY = Math.max(intersectionPoints[0][1], intersectionPoints[1][1]);


  smallCirclePath.arc(smallCircleCenterX, smallCircleCenterY, smallCircleR, angle - toRads(1), angle + toRads(1) + Math.PI, false);
  
  return [path, smallCirclePath];
}

const getKRBlueCirclePath = (width, height) => {
  const path = new Path2D();
  const rotated = width < height;
  const isolatedWidth = (height / 2) * 3;
  const widthMargin = (width - isolatedWidth) / 2;
  const middleX = width / 2;
  const middleY = height / 2;
  const bigCircleR = height / 4;
  const smallCircleR = bigCircleR / 2;

  const angle = angleBetweenThreeDots(widthMargin + isolatedWidth, height, middleX, middleY, middleX + 100, middleY);

  path.arc(middleX, middleY, bigCircleR, angle + Math.PI, angle, true);
  path.closePath();
  
  const smallCirclePath = new Path2D();

  let intersectionPoints = lineAndCircleIntersectionPoints(middleX, middleY, bigCircleR, middleX, middleY, widthMargin + isolatedWidth, height);
  const smallCircleEndX = Math.max(intersectionPoints[0][0], intersectionPoints[1][0]);
  const smallCircleEndY = Math.max(intersectionPoints[0][1], intersectionPoints[1][1]);

  intersectionPoints = lineAndCircleIntersectionPoints(smallCircleEndX, smallCircleEndY, smallCircleR, middleX, middleY, widthMargin + isolatedWidth, height); 
  const smallCircleCenterX = Math.min(intersectionPoints[0][0], intersectionPoints[1][0]);
  const smallCircleCenterY = Math.min(intersectionPoints[0][1], intersectionPoints[1][1]);

  smallCirclePath.arc(smallCircleCenterX, smallCircleCenterY, smallCircleR, angle - toRads(1) + Math.PI, angle + toRads(1), false);
  
  return [path, smallCirclePath];
}

const getKRBlackLinesPath = (width, height) => {
  const path1 = new Path2D();
  const path2 = new Path2D();
  const path3 = new Path2D();
  const path4 = new Path2D();
  const rotated = width < height;
  const isolatedWidth = (height / 2) * 3;
  const widthMargin = (width - isolatedWidth) / 2;
  const middleX = width / 2;
  const middleY = height / 2;
  const bigCircleR = height / 4;
  const lineThickness = height / 24;
  const lineSize = height / 4;
  const lineSpacing = height / 48;
  const halfLineSize = lineSize / 2 - (lineSpacing / 2);
  const distanceFromBigCircle = height / 8;
  const distanceFromCenter = distanceFromBigCircle + bigCircleR;
  const angle = angleBetweenThreeDots(widthMargin + isolatedWidth, height, middleX, middleY, middleX + 100, middleY);
  
  path1.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - lineThickness, halfLineSize, lineThickness);
  path1.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - lineThickness, halfLineSize, lineThickness);

  path1.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, lineSize, lineThickness);

  path1.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), halfLineSize, lineThickness);
  path1.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), halfLineSize, lineThickness);

  path2.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - lineThickness, halfLineSize, lineThickness);
  path2.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - lineThickness, halfLineSize, lineThickness);

  path2.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, halfLineSize, lineThickness);
  path2.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, halfLineSize, lineThickness);
  
  path2.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), halfLineSize, lineThickness);
  path2.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), halfLineSize, lineThickness);


  path3.rect(middleX - lineSize / 2, middleY - distanceFromCenter - lineThickness, lineSize, lineThickness);
  path3.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, halfLineSize, lineThickness);
  path3.rect(middleX + (lineSpacing / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, halfLineSize, lineThickness);
  path3.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), lineSize, lineThickness);

  path4.rect(middleX - lineSize / 2, middleY - distanceFromCenter - lineThickness, lineSize, lineThickness);
  path4.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 2) - lineSpacing, lineSize, lineThickness);
  path4.rect(middleX - (lineSize / 2), middleY - distanceFromCenter - (lineThickness * 3) - (lineSpacing * 2), lineSize, lineThickness);

  return [path1, path2, path3, path4];
}

export const drawFlagBackground = (context, countryCode, width, height, fillWhite) => {
  if (!fillWhite && [KR, JP].includes(countryCode)) {
    context.fillStyle = '#00000000'; // Transperent;
  } else {
    context.fillStyle = colors[countryCode].background.asHex();
  }
  context.fillRect(0, 0, width, height);
}

export const drawFlagAccents = (context, countryCode, width, height) => {
  if (countryCode === JP) {
    context.fillStyle = colors[countryCode].accent.asHex();
    context.fill(getJPCirclePath(width, height));
  } else if (countryCode === CN) {
    context.fillStyle = colors[countryCode].accent.asHex();
    context.fill(getCNStarsPath(width, height));
  } else {
    const vertical = height > width;
    const useHeight = vertical ? width : height;
    const useWidth = vertical ? height : width;
    const [bigRedCircle, smallRedCircle] = getKRRedCirclePath(useWidth, useHeight);
    const [bigBlueCircle, smallBlueCircle] = getKRBlueCirclePath(useWidth, useHeight);

    if (vertical) {
      context.translate(width/2, height/2);
      context.rotate(toRads(90));
      context.translate(-height/2, -width/2);
    }
    context.fillStyle = colors[KR].accentRed.asHex();
    context.fill(bigRedCircle);
    context.fillStyle = colors[KR].accentBlue.asHex();
    context.fill(bigBlueCircle);

    context.fillStyle = colors[KR].accentRed.asHex();
    context.fill(smallRedCircle);
    context.fillStyle = colors[KR].accentBlue.asHex();
    context.fill(smallBlueCircle);


    const lines = getKRBlackLinesPath(useWidth, useHeight);
    const angles = [
      toRads(56.4),
      toRads(67.2),
      toRads(112.8), 
      toRads(67.2), 
    ]
    context.fillStyle = colors[KR].accentBlack.asHex();
    for (let i = 0; i < 4; i++) {
      context.translate(useWidth/2, useHeight/2);
      context.rotate(angles[i]);
      context.translate(-useWidth/2, -useHeight/2);
      context.fill(lines[i]);
    }
    context.translate(useWidth/2, useHeight/2);
    context.rotate(toRads(56.4));
    context.translate(-useWidth/2, -useHeight/2);
    if (vertical) {
      context.translate(height/2, width/2);
      context.rotate(toRads(-90));
      context.translate(-width/2, -height/2);
    }
  }
};

export const getFlagAccentsPath = (countryCode, width, height) => {
  if (countryCode === JP) {
    return getJPCirclePath(width, height);
  } else if (countryCode === CN) {
    return getCNStarsPath(width, height);
  } else {
    return {
      redCircles: getKRRedCirclePath(width, height),
      blueCircles: getKRBlueCirclePath(width, height),
      blackLines: getKRBlackLinesPath(width, height)
    };
  }
}