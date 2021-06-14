import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, Platform} from 'react-native';

import {colors} from '~/themes';
const THEME_COLOR = {
  default: {
    origin: {
      main: 'rgba(255, 179, 0, 0.8)',
      normal: 'rgba(255, 255, 255, 0.3)',
    },
    active: {
      main: colors.successChoice,
      normal: colors.white,
    },
  },
  white: {
    origin: {
      main: colors.warning,
      normal: colors.normalText,
    },
    active: {
      main: colors.milanoRed,
      normal: colors.primary,
    },
  },
};

const TextKaraoke = (props) => {
  // const currentTime = useSelector(
  //   (state) => state.config.currentTime,
  //   shallowEqual,
  // );
  // const selected = React.useRef({});
  const {item, theme, onScrollToSentence, customStyle, index, active} = props;

  React.useEffect(() => {
    if (active && index > -1) {
      onScrollToSentence(index);
    }
  }, [active, item, onScrollToSentence, index]);

  const getColor = React.useCallback((theme, active, main) => {
    return THEME_COLOR[theme][active ? 'active' : 'origin'][
      main ? 'main' : 'normal'
    ];
  }, []);

  if (active) {
    return (
      <Text
        style={[
          styles.text,
          customStyle,
          {
            color: getColor(theme, true, item.main),
          },
        ]}>
        {item.text}
      </Text>
    );
  }

  return (
    <Text
      style={[
        styles.text,
        customStyle,
        {
          color: getColor(theme, false, item.main),
        },
      ]}>
      {item.text}
    </Text>
  );
};
TextKaraoke.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  currentTime: PropTypes.number,
  isSelectSentence: PropTypes.bool,
  sentence: PropTypes.object,
  theme: PropTypes.string,
  onScrollToSentence: PropTypes.func,
  customStyle: PropTypes.object,
};
TextKaraoke.defaultProps = {
  item: {},
  index: -1,
  sentence: null,
  currentTime: 0,
  isSelectSentence: false,
  theme: 'default',
  onScrollToSentence: () => {},
  customStyle: {},
};
const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    zIndex: 1000,
    position: 'relative',
    ...Platform.select({
      ios: {
        fontFamily: 'CircularStd-Book',
      },
      android: {
        fontFamily: 'CircularStd-Bold',
      },
    }),
    fontWeight: '800',
  },
});
export default TextKaraoke;
