import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

import {Text} from '~/BaseComponent';
import {dispatchAnswerQuestion} from '~/utils/script';
import RoundAudioPlayer from '~/BaseComponent/components/elements/script/RoundAudioPlayer';
import {playAudioAnswer} from '~/utils/utils';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';

export default class LearnFlashcardSelectPictureListeningItem extends React.Component {
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
      <View style={styles.bottomAnswerContainer}>
        {options.map((o) => {
          return (
            <TouchableOpacity
              key={o.key}
              onPress={() => this.checkAnswer(o)}
              activeOpacity={0.65}>
              <FastImage
                source={{uri: o.url}}
                style={styles.imageAnswerWrapper}
              />
            </TouchableOpacity>
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
      <View style={[styles.overlay, styles.audioContainer]}>
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
          style={styles.imageQuestionContainer}
          resizeMode="cover"
          blurRadius={30}
        />

        {this.renderAudio()}

        {this.renderScore()}

        <View style={styles.bottomCard}>
          {this.renderResult()}

          <Text fontSize={19} center medium>
            Bức tranh đúng là gì?
          </Text>

          {this.renderOptions()}
        </View>
      </View>
    );
  }
}

LearnFlashcardSelectPictureListeningItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardSelectPictureListeningItem.defaultProps = {
  onNext: () => {},
};
