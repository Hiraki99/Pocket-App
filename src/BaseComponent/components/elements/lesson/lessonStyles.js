import {Dimensions} from 'react-native';

import {OS} from '~/constants/os';
const {width: viewportWidth} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const slideWidth = wp(78);
const itemHorizontalMargin = wp(1);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 15;

export default {
  slideInnerContainer: {
    width: itemWidth,
    // height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 3,
  },
  imageContainer: {
    paddingTop: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  image: {
    width: slideWidth,
    height:
      OS.scaleYByDesign > OS.ratioAspectWithDesign
        ? 175 * OS.scaleYByDesign
        : 175 * OS.ratioAspectWithDesign,
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
};
