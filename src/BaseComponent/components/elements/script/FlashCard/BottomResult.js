import React from 'react';
import {Image, ImageBackground} from 'react-native';
import {View as AnimateView} from 'react-native-animatable';
import PropTypes from 'prop-types';

import styles from '~/BaseComponent/components/elements/script/flashcardStyles';
import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';

export default class BottomResult extends React.PureComponent {
  render() {
    const {isCorrect, correctAnswer} = this.props;

    return (
      <AnimateView
        style={[
          styles.result,
          isCorrect ? styles.correctResult : styles.wrongResult,
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

          <Text color={colors.white} h2 bold>
            {isCorrect ? translate('Xuất sắc!') : translate('Sai mất rồi!')}
          </Text>

          {!isCorrect && correctAnswer && (
            <>
              {correctAnswer.length < 40 && (
                <Text
                  center
                  color={colors.white}
                  fontSize={19}
                  bold
                  style={{paddingHorizontal: 24}}>
                  {translate('Đáp án là:')}{' '}
                  <Text
                    center
                    style={{
                      lineHeight: 26,
                    }}>
                    <HighLightText
                      content={correctAnswer}
                      fontSize={19}
                      bold
                      center
                      colorHighLight={'rgb(248, 147, 31)'}
                      color={colors.white}
                    />
                  </Text>
                </Text>
              )}

              {correctAnswer.length >= 40 && (
                <>
                  <Text center color={colors.white} fontSize={24} bold>
                    {translate('Đáp án là:')}
                  </Text>
                  <Text
                    center
                    style={{
                      lineHeight: 24,
                      marginTop: 10,
                      paddingHorizontal: 24,
                    }}>
                    <HighLightText
                      content={correctAnswer}
                      fontSize={17}
                      bold
                      center
                      colorHighLight={'rgb(248, 147, 31)'}
                      color={colors.white}
                    />
                  </Text>
                </>
              )}
            </>
          )}
        </ImageBackground>
      </AnimateView>
    );
  }
}

BottomResult.propTypes = {
  isCorrect: PropTypes.bool,
  correctAnswer: PropTypes.string,
};

BottomResult.defaultProps = {
  isCorrect: false,
  correctAnswer: null,
};
