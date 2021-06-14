import {Dimensions, Platform, PixelRatio} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import DeviceInfo from 'react-native-device-info';

const statusHeight = getStatusBarHeight();
const {width, height} = Dimensions.get('screen');
const isAndroid = Platform.OS === 'android';
const headerHeight = isAndroid ? 64 : 56;
const ratioAspectWithDesign = PixelRatio.get() / 3;
const hasNotch = DeviceInfo.hasNotch();

export const OS = {
  IsAndroid: isAndroid,
  HEIGHT: height,
  WIDTH: width,
  scaleXByDesign: width / 375,
  scaleYByDesign: height / 812,
  statusBarHeight: statusHeight,
  basePixelRatio: 3,
  ratioAspectWithDesign,
  headerHeight,
  Game: ((height - headerHeight) * 45) / 100,
  GameImageWater: ((height - headerHeight) * 55) / 100 + 16,
  MAX_SHUFFLE: 25,
  MAX_ANSWER_PICTURE: 12,
  BASE_TIME: 12,
  MIN_TIME: 3,
  TRANSLATE_Y: isAndroid ? 40 : 70,
  RANGE_INTERPOLE: 230,
  hasNotch,
};

export const ConfigAnimationAndroid = {
  sentenceActivity: {
    from: {
      transform: [
        {
          translateY: 350,
        },
      ],
    },
    to: {
      transform: [
        {
          translateY: 0,
        },
      ],
    },
  },
};

export const STATE_AUDIO = {
  PAUSE: 'pause',
  PLAYING: 'playing',
  STOP: 'stop',
};

export const TAB_LIVE = {
  LESSON: 'LESSON',
  DOCS: 'DOCS',
  DISCUSS: 'DISCUSS',
};

export const FIXED_POSITION_SUBVIEW = {
  VERTICAL: {
    topLeft: {
      x: 10,
      y: OS.statusBarHeight + 110,
      name: 'topLeft',
    },
    topRight: {
      x: OS.WIDTH - 122,
      y: OS.statusBarHeight + 110,
      name: 'topRight',
    },
    bottomLeft: {
      x: 10,
      y: OS.HEIGHT - 84 - 150 - 10,
      name: 'bottomLeft',
    },
    bottomRight: {
      x: OS.WIDTH - 122,
      y: OS.HEIGHT - 84 - 150 - 10,
      name: 'bottomRight',
    },
  },
  HORIZONTAL: {
    topLeft: {
      x: OS.statusBarHeight,
      y: 20,
      name: 'topLeft',
    },
    topRight: {
      x: OS.HEIGHT - 182,
      y: 20,
      name: 'topRight',
    },
    bottomLeft: {
      x: OS.statusBarHeight,
      y: OS.WIDTH - 84 - 150,
      name: 'bottomLeft',
    },
    bottomRight: {
      x: OS.HEIGHT - 182,
      y: OS.WIDTH - 84 - 150,
      name: 'bottomRight',
    },
  },
};
