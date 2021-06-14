import React from 'react';
import {View, Dimensions, Image} from 'react-native';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

import {Button, Text} from '~/BaseComponent';
import RoundAudioPlayer from '~/BaseComponent/components/elements/script/RoundAudioPlayer';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {dispatchAnswerQuestion} from '~/utils/script';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const {height, width} = Dimensions.get('window');

export default class LearnFlashcardListenAndAnswerItem extends React.Component {
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

  renderAudio = () => {
    const {showResult} = this.state;

    if (showResult) {
      return null;
    }

    const {item} = this.props;

    return (
      <View style={[styles.overlay, styles.listenAnswerContainer]}>
        <RoundAudioPlayer audio={item.attachment.item.audio} autoPlay={false} />
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
        <Image
          source={{
            uri: item.attachment.item.background,
          }}
          style={{width: width, height: height - 320}}
          resizeMode="cover"
          blurRadius={30}
        />

        {this.renderAudio()}

        {this.renderScore()}

        <View style={styles.bottomCard}>
          {this.renderResult()}

          <Text fontSize={19} center bold>
            {translate('Bài nghe nói về gì?')}
          </Text>

          {this.renderOptions()}
        </View>
      </View>
    );
  }
}

LearnFlashcardListenAndAnswerItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardListenAndAnswerItem.defaultProps = {
  onNext: () => {},
};
