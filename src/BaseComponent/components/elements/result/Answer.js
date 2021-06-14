import React from 'react';
import {Image, ImageBackground} from 'react-native';
import {View as AnimateView} from 'react-native-animatable';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

class Answer extends React.PureComponent {
  render = () => {
    const {isCorrect, timeout, maxHeight} = this.props;

    if (timeout) {
      return (
        <AnimateView
          style={[
            styles.result,
            {backgroundColor: '#FF3636'},
            maxHeight > 0 ? {height: maxHeight} : {},
          ]}
          animation="fadeInUp"
          useNativeDriver={true}
          easing="ease-in-out"
          duration={300}>
          <ImageBackground
            source={isCorrect ? images.correctBg : images.wrongBg}
            resizeMode="cover"
            style={styles.resultBg}>
            <Image source={images.oops} style={styles.iconTimeout} />
            <Text color={colors.white} h2 bold paddingVertical={8}>
              {translate('Opps! Tràn nước')}
            </Text>
          </ImageBackground>
        </AnimateView>
      );
    }
    return (
      <AnimateView
        style={[
          styles.result,
          {backgroundColor: isCorrect ? '#18D63C' : '#FF3636'},
          maxHeight > 0 ? {height: maxHeight} : {},
        ]}
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={300}>
        <ImageBackground
          source={isCorrect ? images.correctBg : images.wrongBg}
          resizeMode="cover"
          style={styles.resultBg}>
          {isCorrect && (
            <Image source={images.checkSuccess} style={styles.iconTimeout} />
          )}

          {!isCorrect && (
            <Image source={images.wrong} style={styles.iconTimeout} />
          )}

          <Text color={colors.white} h2 bold paddingVertical={8}>
            {isCorrect ? translate('Xuất sắc') : translate('Sai mất rồi')}
          </Text>
        </ImageBackground>
      </AnimateView>
    );
  };
}

const styles = {
  result: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    height: OS.Game,
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    justifyContent: 'center',
    elevate: 2,
    zIndex: 1000,
  },
  iconTimeout: {
    width: 56,
    height: 56,
    marginTop: -20,
  },
  correctResult: {
    backgroundColor: '#18D63C',
  },
  wrongResult: {
    backgroundColor: '#FF3636',
  },
  resultBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

Answer.propTypes = {
  isCorrect: PropTypes.bool,
  timeout: PropTypes.bool,
  maxHeight: PropTypes.number,
};

Answer.defaultProps = {
  isCorrect: false,
  timeout: false,
  maxHeight: 0,
};

export default Answer;
