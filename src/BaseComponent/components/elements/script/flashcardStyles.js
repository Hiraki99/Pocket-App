import {Dimensions} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';

const {width, height} = Dimensions.get('window');
const bottom = getStatusBarHeight() + (OS.IsAndroid ? 25 : 40);
const paddingBottom = OS.IsAndroid ? 45 : 48;

export default {
  wrap: {
    backgroundColor: '#000',
    position: 'relative',
    height: height,
  },
  bottomCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    overflow: 'visible',
    position: 'absolute',
    bottom: bottom,
    left: 0,
    right: 0,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: paddingBottom,
    maxHeight: OS.WIDTH,

    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 40,

    elevation: 2,
  },
  bottomNormal: {
    bottom: 0,
    position: 'relative',
  },
  listen: {
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  wordBorderWrap: {
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordBorder: {
    width: 16,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
  wordBorderSpace: {
    backgroundColor: colors.helpText2,
  },
  wordAnswerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  characterOptions: {
    backgroundColor: colors.mainBgColor,
    paddingVertical: 32,
    paddingHorizontal: 32,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  characterOption: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 10,
    width: 48,
    height: 48,
    borderRadius: 8,
    shadowColor: '#CBD3DD',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 3,
  },
  score: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  result: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctResult: {
    backgroundColor: '#18D63C',
  },
  wrongResult: {
    backgroundColor: '#FF3636',
  },
  resultBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    height: OS.GameImageWater,
    justifyContent: 'center',
    paddingTop: 0,
  },
  listenAnswerContainer: {
    height: OS.GameImageWater,
    justifyContent: 'center',
    paddingTop: 0,
  },
  imageQuestionContainer: {width: width, height: OS.GameImageWater},
  imageAnswerWrapper: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 8,
  },
  bottomAnswerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTimeout: {
    width: 56,
    height: 56,
  },
  videoFlashcard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  videoContentFlashCard: {
    backgroundColor: colors.white,
    paddingTop: 32,
    paddingHorizontal: 24,
    height: OS.HEIGHT - OS.headerHeight - getDimensionVideo169(OS.WIDTH) - 32,
  },
  videoFlashcardAndAnswer: {
    height: OS.HEIGHT - OS.headerHeight - getDimensionVideo169(OS.WIDTH) - 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  translateWrap: {
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
};
