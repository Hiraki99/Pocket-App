import React from 'react';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Image} from 'react-native-animatable';

import styles from './flashcardStyles';

import {Text} from '~/BaseComponent';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {colors} from '~/themes';
import {dispatchAnswerQuestion} from '~/utils/script';
import {capitalizeFirstLetter, playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const {height, width} = Dimensions.get('window');

export default class LearnFlashcardSelectPictureItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResult: false,
      isCorrect: false,
    };
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderOptions = () => {
    const {item} = this.props;

    const options = item.attachment.item.answers;

    return (
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {options.map((o) => {
          return (
            <TouchableOpacity
              key={o.key}
              onPress={() => this.checkAnswer(o)}
              activeOpacity={0.65}>
              <FastImage
                source={{uri: o.url}}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  marginRight: 10,
                  borderRadius: 8,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  renderQuiz = () => {
    const {showResult} = this.state;

    if (showResult) {
      return null;
    }

    const {item} = this.props;
    return (
      <View style={[styles.overlay, styles.audioContainer]}>
        <Text color={colors.white} center bold h2 style={{marginBottom: 20}}>
          {capitalizeFirstLetter(item.mainWord)}
        </Text>
        <Text color={colors.white} center fontSize={19} medium>
          {item.attachment.item.content}
        </Text>
      </View>
    );
  };

  renderScore = () => {
    const {item} = this.props;
    const {score} = item;

    const {showResult, isCorrect} = this.state;

    if (!showResult || !isCorrect) {
      return null;
    }

    return <ScoreFlashCard score={score} />;
  };

  renderResult = () => {
    const {showResult, isCorrect} = this.state;

    if (!showResult) {
      return null;
    }

    return <AnswerFlashCard isCorrect={isCorrect} />;
  };

  checkAnswer = (o) => {
    const {item} = this.props;

    this.setState({
      showResult: true,
      isCorrect: o.isAnswer,
    });

    playAudioAnswer(o.isAnswer);
    dispatchAnswerQuestion(o.isAnswer, this.props.item.score, false, {
      word: item.mainWord,
    });

    this.timeout = setTimeout(() => this.props.onNext(o.isAnswer), 1200);
  };

  render() {
    const {item} = this.props;

    return (
      <View style={styles.wrap}>
        <Image
          source={{
            uri: item.attachment.item.background,
          }}
          style={{width: width, height: height - 320}}
          resizeMode="cover"
          blurRadius={30}
        />

        {this.renderQuiz()}

        {this.renderScore()}

        <View style={styles.bottomCard}>
          {this.renderResult()}

          <Text fontSize={19} center medium>
            {translate('Bức tranh đúng là gì?')}
          </Text>

          {this.renderOptions()}
        </View>
      </View>
    );
  }
}

LearnFlashcardSelectPictureItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardSelectPictureItem.defaultProps = {
  onNext: () => {},
};
