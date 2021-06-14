import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import styles from './flashcardStyles';

import {Button, Text} from '~/BaseComponent';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import {PreloadVideoComponent} from '~/BaseComponent/components/elements/script/video/PreloadVideoComponent';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {getDimensionVideo169, playAudioAnswer} from '~/utils/utils';
import {OS} from '~/constants/os';
import {dispatchAnswerQuestion} from '~/utils/script';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class LearnFlashcardVideoAndAnswerItem extends React.Component {
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
      <View style={[{marginTop: 32}, showResult ? {opacity: 0} : null]}>
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

  renderVideo = () => {
    const {item} = this.props;

    return (
      <VideoPlayer
        videoId={item.attachment.item.video.id}
        start={item.attachment.item.video.start}
        end={item.attachment.item.video.end}
        height={getDimensionVideo169(OS.WIDTH)}
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
    const {item} = this.props;
    const {showResult, isCorrect} = this.state;
    const correct = item.attachment.item.answers.find((o) => o.isAnswer);

    const correctAnswer = correct ? correct.text : null;

    if (!showResult) {
      return null;
    }

    return (
      <AnswerFlashCard
        isCorrect={isCorrect}
        correctAnswers={correctAnswer}
        video
      />
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
    return (
      <>
        {this.props.activeVideo ? (
          this.renderVideo()
        ) : (
          <PreloadVideoComponent />
        )}

        {this.renderScore()}

        <View
          style={[
            styles.videoFlashcardAndAnswer,
            {
              backgroundColor: colors.white,
              paddingTop: 32,
              paddingHorizontal: 24,
            },
          ]}>
          <Text fontSize={24} center bold paddingVertical={8}>
            {`${translate('Video này nói về gì?')}`}
          </Text>

          <Text fontSize={17} center color={colors.placeHolder}>
            {translate(
              'Hãy bấm để chọn phương án phù hợp nhất với video trong số các phương án dưới đây',
            )}
          </Text>

          {this.renderOptions()}
          {this.renderResult()}
        </View>
      </>
    );
  }
}

LearnFlashcardVideoAndAnswerItem.propTypes = {
  item: PropTypes.object.isRequired,
  activeVideo: PropTypes.bool.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardVideoAndAnswerItem.defaultProps = {
  onNext: () => {},
};
