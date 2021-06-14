import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import shuffle from 'lodash/shuffle';

import styles from './flashcardStyles';

import {Button, Text} from '~/BaseComponent';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import {PreloadVideoComponent} from '~/BaseComponent/components/elements/script/video/PreloadVideoComponent';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {colors} from '~/themes';
import {dispatchAnswerQuestion} from '~/utils/script';
import {OS} from '~/constants/os';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class LearnFlashcardCharacterVideoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      correctAnswers: [],
      shuffleOptions: [],
      selected: [],
      isDone: false,
      showResult: false,
      isCorrect: false,
      videoHeight: 0,
    };
  }

  componentDidMount() {
    const {item} = this.props;
    const correctAnswers = item.attachment.item.characters.filter(
      (o) => o.isAnswer,
    );

    const shuffleOptions = shuffle(item.attachment.item.characters);

    this.setState({
      correctAnswers,
      shuffleOptions,
    });
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderAnswer() {
    const {correctAnswers, selected} = this.state;

    return (
      <View style={styles.wordAnswerWrap}>
        {correctAnswers.map((item, index) => {
          return (
            <View style={styles.wordBorderWrap}>
              <Text h2 primary bold>
                {selected[index] ? selected[index].text : ' '}
              </Text>
              <View style={styles.wordBorder} />
            </View>
          );
        })}
      </View>
    );
  }

  renderOptions() {
    const {shuffleOptions, selected} = this.state;

    return (
      <View style={styles.characterOptions}>
        {shuffleOptions.map((item) => {
          const index = selected.findIndex((o) => o.key === item.key);

          return (
            <TouchableOpacity
              onPress={() => this.onSelectItem(item, index !== -1)}
              style={styles.characterOption}
              activeOpacity={0.7}>
              <Text
                fontSize={24}
                bold
                color={index !== -1 ? colors.white : colors.helpText}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  onSelectItem = (item, isSelected) => {
    if (isSelected) {
      const {selected} = this.state;
      const index = selected.findIndex((o) => o.key === item.key);

      const newSelected = [...selected];
      newSelected.splice(index, 1);
      this.setState({
        selected: newSelected,
      });
    } else {
      this.setState({
        selected: [...this.state.selected, item],
      });
    }
  };

  checkAnswer = () => {
    const {correctAnswers, selected} = this.state;
    const correctStr = correctAnswers.map((item) => item.text).join('');
    const answer = selected.map((item) => item.text).join('');

    this.setState({
      showResult: true,
      isCorrect: correctStr === answer,
    });

    const {item, onNext} = this.props;
    const {score} = item;
    playAudioAnswer(correctStr === answer);
    dispatchAnswerQuestion(correctStr === answer, score, false, {
      word: item.mainWord,
    });

    this.timeout = setTimeout(() => onNext(correctStr === answer), 1200);
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
    const {showResult, isCorrect, correctAnswers} = this.state;

    if (!showResult) {
      return null;
    }

    return (
      <AnswerFlashCard
        isCorrect={isCorrect}
        correctAnswers={correctAnswers.map((o) => o.text).join('')}
      />
    );
  };

  renderVideo = () => {
    const {item} = this.props;
    const {videoHeight} = this.state;

    return (
      <VideoPlayer
        videoId={item.attachment.item.video.id}
        start={item.attachment.item.video.start}
        end={item.attachment.item.video.end}
        height={videoHeight}
      />
    );
  };

  calculateHeight = (event) => {
    const {height} = event.nativeEvent.layout;
    this.setState({
      videoHeight:
        OS.HEIGHT - height - OS.statusBarHeight - (OS.IsAndroid ? 110 : 20),
    });
  };

  render() {
    const {correctAnswers, selected, showResult} = this.state;

    return (
      <View style={[styles.wrap, {backgroundColor: colors.black}]}>
        {this.props.activeVideo ? (
          this.renderVideo()
        ) : (
          <PreloadVideoComponent />
        )}

        {this.renderScore()}

        <View style={styles.bottomCard} onLayout={this.calculateHeight}>
          {this.renderResult()}

          <Text fontSize={19} center medium>
            {translate('Điền chữ cái phù hợp')}
          </Text>

          {this.renderAnswer()}
          {this.renderOptions()}

          <View style={[showResult ? {opacity: 0} : null]}>
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              shadow
              disabled={correctAnswers.length !== selected.length}
              onPress={this.checkAnswer}>
              {translate('Kiểm tra')}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

LearnFlashcardCharacterVideoItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardCharacterVideoItem.defaultProps = {
  onNext: () => {},
};
