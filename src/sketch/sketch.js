
import { random } from 'canvas-sketch-util';

import { margin, datasets, colors, STYLE_FLAG_COLORS, STYLE_FLAG, duration, availableFonts, JP, CN, KR } from '../const'
import { Color } from '../utils/colors';
import { toRads } from '../utils/math';
import { drawFlagAccents, drawFlagBackground, getFlagAccentsPath } from './flags';
import { drawKanji2dGrid } from './grid';

const generateKanjii2dMap = (dataset, width, height, rnd, fontRnd, font) => {
  const canFitBigKanji = (arr, x, y, size) => {
    if (arr.length <= x + size) return false;
    if (y - size < 0) return false;
    for (let i = x; i < x + size; i++) {
      for (let j = y; j > y - size; j--) {
        if (arr[i][j].type === 'skip') return false;
      }
    }
    return true;
  }

  const placeBigKanji = (arr, x, y, kanji, size) => {
    for (let i = x; i < x + size; i++) {
      for (let j = y; j > y - size; j--) {
        if (i === x && j === y) {
          arr[i][j] = {
            type: 'kanji',
            font: font === 'mix' ? fontRnd.pick(availableFonts[dataset]) : font,
            kanji,
            size,
          };
        } else {
          arr[i][j] = {
            type: 'skip'
          };
        }
      }
    }
  };


  let maxKanjiSize = 3;
  if (width + height > 100) maxKanjiSize = 4;
  if (width + height > 200) maxKanjiSize = 5;
  const bigKanjiChances = [0.02, 0.005, 0.001, 0.0005];
  let arr = new Array(width).fill('').map(() => {
    return new Array(height).fill('').map(() => {
      return {
        type: 'empty'
      };
    });
  });
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const ent = arr[x][y];
      if (ent.type !== 'empty') continue;
      const kanji = rnd.pick(datasets[dataset]);
      ent.type = 'kanji';
      ent.kanji = kanji;
      ent.font = font === 'mix' ? fontRnd.pick(availableFonts[dataset]) : font;
      ent.size = 1;
      for (let i = maxKanjiSize - 2; i >= 0; i--) {
        const size = i + 2;
        if (rnd.chance(bigKanjiChances[i]) && canFitBigKanji(arr, x, y, size)) {
          placeBigKanji(arr, x, y, kanji, size);
          break;
        }
      }
    }
  }
  return arr;
};


export const sketch = ({ canvas, context, data, settings }) => {
  const { width, height } = canvas;
  console.log('Canvas size:', width, height);
  console.log('Settings:', settings);
  console.log('Data:', data);
  const { bleed } = settings;
  const { pixelRatio, font, fontSize, seed, spacing, style, dataset, fillWhite } = data;

  // We need different random generators so they work a bit more independent (e.g. changing font to 'mix' won't change kanjis on map)
  const drawMapRnd = random.createRandom(seed);
  const createMapRnd = random.createRandom(seed);
  const fontRnd = random.createRandom(seed);
  const krAccentColorRnd = random.createRandom(seed);

  const activeWidth = Math.round((width - bleed * 2) - (margin * 2 * pixelRatio));
  const activeHeight = Math.round((height - bleed * 2) - (margin * 2 * pixelRatio));

  context.font = `${fontSize * pixelRatio}px sans-serif`;
  const { width: kanjiWidth, emHeightAscent, emHeightDescent } = context.measureText('本');
  const kanjiHeight = (emHeightAscent || 0 + emHeightDescent || 0) || (fontSize * pixelRatio);

  const horizontalKanjis = Math.floor(activeWidth / ((spacing * pixelRatio) + kanjiWidth));
  const verticalKanjis = Math.floor(activeHeight / ((spacing * pixelRatio) + kanjiHeight));
  console.log("Horizontal kanjis to draw:", horizontalKanjis);
  console.log("Vertical kanjis to draw:", verticalKanjis);

  const map = generateKanjii2dMap(dataset, horizontalKanjis, verticalKanjis, createMapRnd, fontRnd, font);
  let accentColor;
  if (dataset === KR) {
    accentColor = krAccentColorRnd.pick([colors[KR].accentBlue, colors[KR].accentRed, colors[KR].accentBlack]);
  } else {
    accentColor = colors[dataset].accent;
  }

  return ({ context, width, height, playhead, time, trimWidth, trimHeight, bleed }) => {
    const drawMap = (textColorFrom, textColorTo) => drawKanji2dGrid({
      map,
      context,
      time,
      playhead,
      margin,
      width: trimWidth,
      height: trimHeight,
      textColorFrom,
      textColorTo,
      settings,
      noiseRnd: drawMapRnd,
    });

    const translateForBleed = () => {
      context.translate(bleed, bleed);
    }

    const transalateBack = () => {
      context.translate(-bleed, -bleed);
    };

    if (style === STYLE_FLAG_COLORS) {
      if (dataset === JP) {
        context.fillStyle = colors[dataset].accent.asHex();
        context.fillRect(0, 0, width, height);
        translateForBleed();
        drawMap(colors[dataset].background, colors[dataset].accent);
        transalateBack();
      } else if (dataset === CN) {
        context.fillStyle = colors[dataset].background.asHex();
        context.fillRect(0, 0, width, height);
        translateForBleed();
        drawMap(colors[dataset].accent, colors[dataset].background);
        transalateBack();
      } else {
        context.fillStyle = accentColor.asHex();
        context.fillRect(0, 0, width, height);
        translateForBleed();
        drawMap(colors[dataset].background, accentColor);
        transalateBack();
      }
    } else {
      drawFlagBackground(context, dataset, width, height, fillWhite);
      translateForBleed();
      drawMap(accentColor, colors[dataset].background);
      drawFlagAccents(context, dataset, trimWidth, trimHeight);
      if (dataset === KR) {
        const rotate90 = () => {
          context.translate(trimWidth/2, trimHeight/2);
          context.rotate(toRads(90));
          context.translate(-trimHeight/2, -trimWidth/2);
        };

        const rotateBack = () => {
          context.translate(trimHeight/2, trimWidth/2);
          context.rotate(toRads(-90));
          context.translate(-trimWidth/2, -trimHeight/2);
        };

        const vertical = trimHeight > trimWidth;
        const useHeight = vertical ? trimWidth : trimHeight;
        const useWidth = vertical ? trimHeight : trimWidth;
        const {redCircles, blueCircles, blackLines} = getFlagAccentsPath(dataset, useWidth, useHeight);
        const circlePaths = [...redCircles, ...blueCircles];
        const white = Color.fromHex('#FFFFFF');
        
        circlePaths.forEach(path => {
          context.save();
          if (vertical) rotate90();
          context.clip(path);
          if (vertical) rotateBack();
          drawMap(white, white);
          context.restore();
        });
        const angles = [
          toRads(56.4),
          toRads(56.4 + 67.2),
          toRads(56.4 + 67.2 + 112.8), 
          toRads(56.4 + 67.2 + 112.8 + 67.2), 
        ]
        for (let i = 0; i < 4; i++) {
          context.save();
          context.translate(trimWidth/2, trimHeight/2);
          context.rotate(angles[i]);
          context.translate(-trimWidth/2, -trimHeight/2);
          if (vertical) rotate90();
          context.clip(blackLines[i]);
          if (vertical) rotateBack();
          context.translate(trimWidth/2, trimHeight/2);
          context.rotate((Math.PI * 2) - angles[i]);
          context.translate(-trimWidth/2, -trimHeight/2);
          drawMap(white, white);
          context.restore();
        }
      } else {
        context.clip(getFlagAccentsPath(dataset, trimWidth, trimHeight));
        drawMap(colors[dataset].background, accentColor);
      }
      transalateBack();
    }
  };
}