import { lerp, mapRange } from 'canvas-sketch-util/math';
import { JP, CN, KR, duration } from '../const';

export const drawKanji2dGrid = ({map, context, width, height, textColorTo, textColorFrom, 
                                 playhead, time, margin, settings, noiseRnd}) => {
  const { dataset, spacing, pixelRatio, fontSize } = settings.data;
  context.font = `${fontSize * pixelRatio}px sans-serif`;
  const { width: kanjiWidth, emHeightAscent, emHeightDescent } = context.measureText('本');
  const kanjiHeight = (emHeightAscent || 0 + emHeightDescent || 0) || (fontSize * pixelRatio);

  for (let h = 0; h < map.length; h++) {
    for (let v = 0; v < map[h].length; v++) {
      const horizontalKanjis = map.length;
      const verticalKanjis = map[h].length;
      const ent = map[h][v];
      if (ent.type === 'skip' || ent.type === 'empty') continue;

      const horizontal01 = h / (horizontalKanjis - 1); // from 0.0 to 1.0
      const vertical01 = v / (verticalKanjis - 1); // from 0.0 to 1.0

      const x = Math.round(lerp((margin * pixelRatio), width - (margin * pixelRatio) - kanjiWidth, horizontal01));
      const y = Math.round(lerp((margin * pixelRatio) + kanjiHeight, height - (margin * pixelRatio), vertical01));

      let noiseValue;
      if (settings.animate) {
        const time01 = mapRange(time, 0, duration, 0, 1);
        const invertedTime = time01 < 0.5 ? time : (1 - time);
        noiseValue = mapRange(noiseRnd.noise3D(horizontal01, vertical01, playhead, invertedTime, 1), -1, 1, 0, 1);
      } else {
        noiseValue = mapRange(noiseRnd.noise2D(horizontal01, vertical01, 1), -1, 1, 0, 1);
      }
      

      let noiseValueConverted;
      if (dataset === JP) noiseValueConverted = mapRange(noiseValue, 0, 1, 0.05, 0.95);
      else noiseValueConverted = mapRange(noiseValue, 0, 1, 0.15, 0.95);

      const textColor = textColorFrom.calculatePointAtGradient(textColorTo, noiseValueConverted).asHex();
      context.fillStyle = textColor;

      const totalFontSize = (pixelRatio * fontSize * ent.size + (spacing * pixelRatio * (ent.size - 1) * 1.2));
      context.font = `400 ${totalFontSize}px "${ent.font}"`;
      // TODO: we probably need to optimize this somehow, drawing text is very expensive. 
      // Maybe predraw every gliph on sketch initialization?
      context.fillText(
        ent.kanji,
        x,
        y,
      );
      
    }
  }
};