import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {RowContainer, Text} from '~/BaseComponent';
import styles from '~/BaseComponent/components/elements/script/flashcardStyles';
import SingleChoiceQuestion from '~/BaseComponent/components/elements/script/question/SingleChoiceQuestion';
import CommonMatchExpressionWithPicturesTextItem from '~/BaseComponent/components/elements/grammar/element/CommonMatchExpressionWithPicturesTextItem';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import {answerQuestion} from '~/features/script/ScriptAction';
import {LANGUAGE, LANGUAGE_MAPPING} from '~/constants/lang';
import {images} from '~/themes';

class ReadingMatchingExercise extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      showAward: false,
      lang: LANGUAGE.VI,
    };
  }

  changeText = () => {
    this.setState((old) => {
      return {
        lang: old.lang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI,
      };
    });
  };

  renderQuestion = () => {
    const {questions} = this.props;
    const {currentIndex} = this.state;

    return (
      <View style={{alignItems: 'center', paddingVertical: 30}}>
        <CommonMatchExpressionWithPicturesTextItem
          item={questions[currentIndex]}
          shadow={true}
          width={OS.WIDTH - 48}
        />
      </View>
    );
  };

  renderAnswer = () => {
    const {questions} = this.props;
    const {currentIndex} = this.state;
    // if (this.state.showAward) {
    //   return null;
    // }
    return (
      <>
        <RowContainer>
          <Text h5 uppercase bold>
            {LANGUAGE_MAPPING[this.state.lang].choose_correct_answer}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.translateWrap}
            onPress={this.changeText}>
            <Image source={images.translate} style={styles.translate} />
          </TouchableOpacity>
        </RowContainer>

        <SingleChoiceQuestion
          item={questions[currentIndex]}
          key={questions[currentIndex].key}
          containerStyle={{
            paddingHorizontal: 0,
            marginBottom: 0,
            paddingTop: 10,
          }}
          buttonContainerStyle={{paddingHorizontal: 0}}
          showIndex={false}
          onDone={this.next}
        />
      </>
    );
  };

  next = (isCorrect) => {
    const time = isCorrect ? 2000 : 100;
    if (isCorrect) {
      this.setState({showAward: true});
    }
    setTimeout(() => {
      const {questions} = this.props;
      const {currentIndex} = this.state;

      if (currentIndex < questions.length - 1) {
        this.setState({
          currentIndex: currentIndex + 1,
        });
      } else {
        generateNextActivity();
      }
      this.setState({showAward: false});
    }, time);
  };

  existedAnswer = (currentIndex) => {
    const {questions} = this.props;

    if (
      questions &&
      questions[currentIndex] &&
      questions[currentIndex].answer
    ) {
      return questions[currentIndex].answer.length;
    }
    return 0;
  };

  renderAward = () => {
    if (!this.state.showAward) {
      return null;
    }
    return (
      <>
        <ScoreFlashCard score={1} />
        <Answer
          isCorrect={true}
          maxHeight={
            this.existedAnswer(this.state.currentIndex) % 4 === 0 ? 400 : 350
          }
        />
      </>
    );
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        {this.renderQuestion()}
        {!this.state.showAward && (
          <View
            style={[
              styles.bottomCard,
              styles.bottomNormal,
              {
                bottom: 0,
                paddingBottom: 0,
                maxHeight:
                  this.existedAnswer(this.state.currentIndex) % 4 === 0
                    ? 400
                    : 350,
              },
            ]}>
            {this.renderAnswer()}
          </View>
        )}

        {this.renderAward()}
      </View>
    );
  }
}

ReadingMatchingExercise.propTypes = {
  questions: PropTypes.array.isRequired,
};
export default connect(null, {answerQuestion})(ReadingMatchingExercise);
