import { Color } from './utils/colors';
import jpData from './data/jp.json';
import cnData from './data/cn.json';
import krData from './data/kr.json';


export const STYLE_FLAG_COLORS = 'flagColors';
export const STYLE_FLAG = 'flag';

export const JP = 'jp';
export const CN = 'cn';
export const KR = 'kr';

export const availableDatasets = {
  [JP]: ['Japanese', 'JP'],
  [CN]: ['Chinese', 'CN'],
  [KR]: ['Korean', 'KR'],
};

export const availableStyles = {
  [STYLE_FLAG_COLORS]: 'Flag colors',
  [STYLE_FLAG]: 'Flag'
};

export const datasets = {
  [JP]: jpData,
  [CN]: cnData,
  [KR]: krData,
};

export const colors = {
  [JP]: {
    'background': Color.fromHex('#FFFFFF'),
    'accent': Color.fromHex('#BC002D'),
  },
  [CN]: {
    'background': Color.fromHex('#C8102E'),
    'accent': Color.fromHex('#FCE300'),
  },
  [KR]: {
    'background': Color.fromHex('#FFFFFF'),
    'accentRed': Color.fromHex('#C8102E'),
    'accentBlue': Color.fromHex('#002F6C'),
    'accentBlack': Color.fromHex('#000000')
  }
};

export const defaultDataset = JP;

export const backgroundColor = '#BC002D';
export const textColor = '#FFFFFF';
export const defaultFontSize = 32;
export const estKanjiSpacing = 48;
export const margin = 30;
export const fps = 30;
export const duration = fps * 60 * 60;
export const defaultStyle = STYLE_FLAG_COLORS;

export const availableFonts = {
  [JP]: [
    'Noto Serif JP',
    'Zen Antique Soft',
    'Zen Maru Gothic',
  ],
  [CN]: [
    'Liu Jian Mao Cao',
    'Ma Shan Zheng',
    'Noto Sans SC',
    'Noto Serif SC',
    'Zhi Mang Xing',
  ],
  [KR]: [
    'Noto Sans KR',
    'Nanum Gothic Coding',
    'Nanum Myeongjo',
    'Song Myung',
    'Gamja Flower',
  ],
};

export const defaultSettings = {
  dimensions: [1024, 1024],
  units: "px",
  styleCanvas: false,
  hotkeys: false,
  animate: false,
  duration,
  fps,
};