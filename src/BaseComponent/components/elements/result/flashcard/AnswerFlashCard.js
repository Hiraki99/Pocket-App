import React from 'react';
import {View as AnimateView} from 'react-native-animatable';
import {Image, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';

import styles from '~/BaseComponent/components/elements/script/flashcardStyles';
import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

const AnswerFlashCard = (props) => {
  return (
    <AnimateView
      style={[
        styles.result,
        props.isCorrect ? styles.correctResult : styles.wrongResult,
        props.video ? {borderTopLeftRadius: 0, borderTopRightRadius: 0} : null,
      ]}
      animation="fadeInUp"
      useNativeDriver={true}
      easing="ease-in-out"
      duration={300}>
      <ImageBackground
        source={props.isCorrect ? images.correctBg : images.wrongBg}
        resizeMode="cover"
        style={styles.resultBg}>
        {props.isCorrect && (
          <Image source={images.checkSuccess} style={styles.iconTimeout} />
        )}

        {!props.isCorrect && (
          <Image source={images.wrong} style={styles.iconTimeout} />
        )}

        <Text color={colors.white} h2 bold paddingVertical={8}>
          {props.speakAnswers
            ? props.speakAnswers
            : props.isCorrect
            ? translate('Xuất sắc')
            : translate('Sai mất rồi')}
        </Text>

        {!props.isCorrect && props.correctAnswers && (
          <Text color={colors.white} fontSize={24} bold paddingVertical={8}>
            {translate('Đáp án là')}: {props.correctAnswers}
          </Text>
        )}
      </ImageBackground>
    </AnimateView>
  );
};

AnswerFlashCard.propTypes = {
  isCorrect: PropTypes.bool,
  video: PropTypes.bool,
  correctAnswers: PropTypes.string,
  speakAnswers: PropTypes.string,
};

AnswerFlashCard.defaultProps = {
  isCorrect: false,
  video: false,
  correctAnswers: null,
  speakAnswers: null,
};

export default AnswerFlashCard;
