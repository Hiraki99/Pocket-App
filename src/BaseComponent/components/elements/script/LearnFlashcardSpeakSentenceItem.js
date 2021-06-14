import React from 'react';
import {View, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

const {height, width} = Dimensions.get('window');
import {dispatchAnswerQuestion} from '~/utils/script';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import {playAudioAnswer} from '~/utils/utils';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {translate} from '~/utils/multilanguage';

export default class LearnFlashcardSpeakSentenceItem extends React.Component {
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

  renderRecorder = () => {
    const {item, activeScreen} = this.props;
    return (
      <EmbedAudioRecorder
        attachment={item.attachment}
        activeScreen={activeScreen}
        word={item.attachment.item.word || item.attachment.item.sentence}
        onRecorded={this.checkAnswer}
        isWord={false}
        googleApiKey={this.props.googleApiKey}
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

    return (
      <AnswerFlashCard
        isCorrect={isCorrect}
        speakAnswers={translate('Chưa chuẩn lắm')}
      />
    );
  };

  checkAnswer = (isCorrect) => {
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
      () => this.props.onNextItem(isCorrect),
      isCorrect ? 1200 : 3000,
    );
  };

  render() {
    const {item} = this.props;

    return (
      <View style={[styles.wrap, {paddingTop: 0}]}>
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

LearnFlashcardSpeakSentenceItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNextItem: PropTypes.func,
  activeScreen: PropTypes.bool,
  googleApiKey: PropTypes.string,
};

LearnFlashcardSpeakSentenceItem.defaultProps = {
  onNextItem: () => {},
  activeScreen: false,
  googleApiKey: '',
};
