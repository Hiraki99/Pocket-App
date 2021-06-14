import React from 'react';
import {View, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

import {Button, Text} from '~/BaseComponent';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import {playAudioAnswer} from '~/utils/utils';
import {dispatchAnswerQuestion} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

const {height, width} = Dimensions.get('window');

export default class LearnFlashcardPictureAndAnswerItem extends React.Component {
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
    const {showResult} = this.state;

    return (
      <View style={[{marginTop: 24}, showResult ? {opacity: 0} : null]}>
        {item.attachment.item.answers.map((o) => {
          return (
            <View key={o.key} style={{marginBottom: 8}}>
              <Button
                shadow={false}
                rounded
                outline
                uppercase
                primary
                bold
                style={{paddingVertical: 3.15}}
                onPress={() => this.checkAnswer(o)}>
                {o.text}
              </Button>
            </View>
          );
        })}
      </View>
    );
  };

  renderScore = () => {
    const {
      item: {score},
    } = this.props;

    const {showResult, isCorrect} = this.state;

    if (!showResult || !isCorrect) {
      return null;
    }

    return <ScoreFlashCard score={score} />;
  };

  renderResult = () => {
    const {item} = this.props;
    const {showResult, isCorrect} = this.state;
    const correct = item.attachment.item.answers.find((o) => o.isAnswer);

    const correctAnswer = correct ? correct.text : null;

    if (!showResult) {
      return null;
    }

    return (
      <AnswerFlashCard isCorrect={isCorrect} correctAnswers={correctAnswer} />
    );
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
        <FastImage
          source={{
            uri: item.attachment.item.background,
          }}
          style={{width: width, height: height - 320}}
          resizeMode="cover"
        />

        {this.renderScore()}

        <View style={styles.bottomCard}>
          {this.renderResult()}

          <Text fontSize={19} center medium>
            {translate('What is the picture about?')}
          </Text>

          {this.renderOptions()}
        </View>
      </View>
    );
  }
}

LearnFlashcardPictureAndAnswerItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardPictureAndAnswerItem.defaultProps = {
  onNext: () => {},
};
