import React, {useCallback} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {IntonationType} from '~/BaseComponent/components/elements/script/speak/IntonationSentence';
import {colors, images} from '~/themes';

const IntonationWord = (props) => {
  const {word, hasSpace, result} = props;
  const {value, type} = word;

  const renderText = useCallback(() => {
    const colorStyle = result
      ? {color: colors.black} //{color: result.isCorrect ? colors.good : colors.bad}
      : {color: colors.primary};

    let textStyle = styles.textNormalStyle;
    if (type > IntonationType.NEUTRAL) {
      textStyle = result ? styles.textNormalStyle : styles.textStressStyle;
    }
    const text = hasSpace ? ' ' + value : value;
    if (type > IntonationType.NEUTRAL) {
      return <Text style={[textStyle, colorStyle]}>{text}</Text>;
    }
    return <Text style={textStyle}>{text}</Text>;
  }, [value, type, hasSpace, result]);

  const renderIntonation = useCallback(() => {
    const colorStyle = result
      ? {tintColor: result.isCorrect ? colors.good : colors.bad}
      : {};
    if (type === IntonationType.FALLING) {
      return (
        <Image
          style={[styles.intonationFalling, colorStyle]}
          source={images.intonation_falling}
          resizeMode={'contain'}
        />
      );
    }
    if (type === IntonationType.RISING) {
      return (
        <Image
          style={[styles.intonationRising, colorStyle]}
          source={images.intonation_rising}
          resizeMode={'contain'}
        />
      );
    }
    if (type === IntonationType.RISING_FALLING) {
      return (
        <View style={styles.intonationRisingFallingWrapper}>
          <Image
            style={[styles.intonationRisingFalling, colorStyle]}
            source={images.intonation_rising_falling}
            resizeMode={'contain'}
          />
        </View>
      );
    }
    if (type === IntonationType.FALLING_RISING) {
      return (
        <View style={styles.intonationRisingFallingWrapper}>
          <Image
            style={[styles.intonationRisingFalling, colorStyle]}
            source={images.intonation_falling_rising}
            resizeMode={'contain'}
          />
        </View>
      );
    }
    return null;
  }, [type, result]);

  const renderContent = useCallback(() => {
    return (
      <View style={styles.content}>
        {renderText()}
        {renderIntonation()}
      </View>
    );
  }, [renderText, renderIntonation]);

  return renderContent();
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 5,
    paddingTop: 5,
  },
  textStressStyle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  textNormalStyle: {
    fontSize: 19,
  },
  intonationFalling: {
    position: 'absolute',
    height: 13,
    width: 13,
    top: 0,
    right: 0,
  },
  intonationRising: {
    position: 'absolute',
    height: 13,
    width: 13,
    top: 0,
    right: 0,
  },
  intonationRisingFallingWrapper: {
    height: 13,
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
  },
  intonationRisingFalling: {
    height: 13,
    width: 15,
    top: 0,
  },
});

IntonationWord.propTypes = {
  word: PropTypes.object,
  hasSpace: PropTypes.bool,
  result: PropTypes.object,
};

IntonationWord.defaultProps = {
  word: {},
  hasSpace: false,
  result: null,
};

export default IntonationWord;
