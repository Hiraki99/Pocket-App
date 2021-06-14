import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

import styles from '~/BaseComponent/components/elements/script/flashcardStyles';
import {colors} from '~/themes';
import {Text} from '~/BaseComponent';

const ScoreFlashCard = (props) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.score}>
        <Text h2 bold color={colors.white}>
          +{props.score}
        </Text>
        <LottieView
          source={require('~/assets/animate/star-blast')}
          autoPlay
          loop={false}
          style={{width: 56, marginLeft: -3}}
        />
      </View>
    </View>
  );
};

ScoreFlashCard.propTypes = {
  score: PropTypes.number,
};

ScoreFlashCard.defaultProps = {
  score: 1,
};

export default ScoreFlashCard;
