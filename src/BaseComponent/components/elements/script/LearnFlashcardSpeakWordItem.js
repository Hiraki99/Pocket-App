import React from 'react';
import {View, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

import {dispatchAnswerQuestion} from '~/utils/script';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import {playAudioAnswer} from '~/utils/utils';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';

const {height, width} = Dimensions.get('window');
export default class LearnFlashcardSpeakWordItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResult: false,
      isCorrect: false,
    };
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderRecorder = () => {
    const {item, activeScreen} = this.props;
    return (
      <EmbedAudioRecorder
        word={item.attachment.item.word || item.attachment.item.sentence}
        attachment={item.attachment}
        googleApiKey={this.props.googleApiKey}
        onRecorded={this.processAnswer}
        activeScreen={activeScreen}
        isWord={true}
        key={item.id}
      />
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

  processAnswer = (isCorrect) => {
    const {item} = this.props;

    this.setState({
      showResult: true,
      isCorrect,
    });
    playAudioAnswer(isCorrect);

    dispatchAnswerQuestion(isCorrect, this.props.item.score, false, {
      word: item.mainWord,
    });

    this.timeout = setTimeout(
      () => this.props.onNext(isCorrect),
      isCorrect ? 1200 : 3000,
    );
  };

  render() {
    const {item} = this.props;

    return (
      <View style={styles.wrap}>
        <FastImage
          source={{
            uri: item.attachment.item.image,
          }}
          style={{width: width, height: height - 320}}
          resizeMode="cover"
        />

        {this.renderScore()}

        <View style={[styles.bottomCard, {paddingTop: 0}]}>
          {this.renderResult()}

          {this.renderRecorder()}
        </View>
      </View>
    );
  }
}

LearnFlashcardSpeakWordItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
  activeScreen: PropTypes.bool,
  googleApiKey: PropTypes.string,
};

LearnFlashcardSpeakWordItem.defaultProps = {
  onNext: () => {},
  activeScreen: false,
  googleApiKey: '',
};
