import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
} from '~/features/script/ScriptAction';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {OS} from '~/constants/os';
import CommonMatchExpressionWithPicturesTextItem from '~/BaseComponent/components/elements/grammar/element/CommonMatchExpressionWithPicturesTextItem';
import BottomResult from '~/BaseComponent/components/elements/script/FlashCard/BottomResult';
import FillInBlankTextItem from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankTextItem';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {
  normalizeAnswerFillInBlank,
  playAudio,
  playAudioAnswer,
} from '~/utils/utils';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';

class FillInBlankMultiPartScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      currentAnswer: [],
      showAnswer: false,
      loading: false,
      currentBlankIndex: 0,
    };
  }

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({loading: true});
    }, 100);
  }

  renderQuestionText = () => {
    const {currentScriptItem} = this.props;
    const {loading} = this.state;

    if (!loading) {
      return null;
    }

    return (
      <ScrollView
        alignItems="center"
        // justifyContent="center"
        backgroundColor="transparent"
        style={styles.container}>
        <Carousel
          ref={(c) => {
            this.carouselQuestion = c;
          }}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
          data={currentScriptItem.items}
          extraData={this.state.activeSlide}
          renderItem={this.renderQuestionTextItem}
          sliderWidth={OS.WIDTH}
          itemWidth={OS.WIDTH - 60}
          firstItem={0}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
          scrollEnabled={false}
          // scrollEnabled
          containerCustomStyle={{zIndex: 999}}
          loop={false}
        />
        {this.pagination()}
      </ScrollView>
    );
  };

  pagination = () => {
    const {currentScriptItem} = this.props;
    const {items} = currentScriptItem;

    return (
      <Pagination
        dotsLength={items.length > 5 ? 5 : items.length}
        activeDotIndex={
          items.length > 5 ? this.state.activeSlide % 5 : this.state.activeSlide
        }
        containerStyle={{
          width: 10,
          alignSelf: 'center',
        }}
        dotContainerStyle={{
          paddingTop: 0,
          height: 12,
          justifyContent: 'center',
        }}
        dotStyle={{
          width: 12,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(74,80,241, 0.75)',
        }}
        inactiveDotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
        }}
        inactiveDotOpacity={0.3}
        inactiveDotScale={0.8}
      />
    );
  };

  renderQuestionTextItem = ({item, index}) => {
    const {currentScriptItem} = this.props;
    const {currentAnswer, showAnswer} = this.state;

    return (
      <CommonMatchExpressionWithPicturesTextItem
        item={item}
        onNext={this.nextQuestion}
        textComponent={
          <FillInBlankTextItem
            key={item.key}
            item={item}
            index={index}
            totalQuestion={currentScriptItem.items.length}
            onSelected={this.onSelected}
            answer={currentAnswer}
            showCorrectAnswer={showAnswer}
          />
        }
      />
    );
  };

  nextQuestion = () => {
    if (this.carouselQuestion) {
      this.carouselQuestion.snapToNext();
    }
  };

  onSelected = (index) => {
    if (this.writingRef) {
      this.setState({
        currentBlankIndex: index,
      });
      playAudio('selected');
      this.writingRef.show(this.state.currentAnswer[index]);
    }
  };

  onAnswer = (text) => {
    const {currentScriptItem} = this.props;
    const {activeSlide, currentAnswer, currentBlankIndex} = this.state;

    const corrects = currentScriptItem.items[activeSlide].question.match(
      /\[.*?]/g,
    );

    const correctAnswers = corrects.map((correct_answer) =>
      normalizeAnswerFillInBlank(correct_answer),
    );
    const userAnswers = [...currentAnswer];
    userAnswers[currentBlankIndex] = text;

    this.setState(
      {
        currentAnswer: userAnswers,
      },
      () => {
        if (userAnswers.length === correctAnswers.length) {
          let allAnswersCorrect = [];
          correctAnswers.forEach((item) => {
            allAnswersCorrect = [...allAnswersCorrect, ...item.split('/')];
          });
          const isCorrect = userAnswers.every((val) =>
            allAnswersCorrect.includes(val),
          );

          this.props.answerQuestion(
            isCorrect,
            currentScriptItem.items[activeSlide].score,
          );
          playAudioAnswer(isCorrect);
          this.setState(
            {
              showAnswer: true,
            },
            () => {
              setTimeout(() => {
                if (activeSlide < currentScriptItem.items.length - 1) {
                  this.setState({
                    currentAnswer: [],
                    showAnswer: false,
                  });

                  this.nextQuestion();
                } else {
                  generateNextActivity();
                }
              }, 2000);
            },
          );
        }
      },
    );
  };

  renderResult = () => {
    const {showAnswer, activeSlide, currentAnswer} = this.state;
    const {currentScriptItem} = this.props;

    const corrects = currentScriptItem.items[activeSlide].question.match(
      /\[.*?\]/g,
    );

    const correctAnswers = corrects.map((o) => normalizeAnswerFillInBlank(o));
    let allAnswersCorrect = [];
    correctAnswers.forEach((item) => {
      allAnswersCorrect = [...allAnswersCorrect, ...item.split('/')];
    });
    const isCorrect = currentAnswer.every((val) =>
      allAnswersCorrect.includes(val),
    );

    // const isCorrect = isEqual(
    //   currentAnswer.map((o) => o.trim().toLowerCase()),
    //   correctAnswers,
    // );

    if (!showAnswer) {
      return null;
    }

    return (
      <View
        style={{
          height: 400,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <BottomResult
          isCorrect={isCorrect}
          correctAnswer={correctAnswers.join(' - ')}
        />
      </View>
    );
  };

  render() {
    const {currentScriptItem} = this.props;

    if (
      !currentScriptItem ||
      currentScriptItem.type !== 'fill_in_blank_multi_part'
    ) {
      return null;
    }

    return (
      <ScriptWrapper mainBgColor={colors.mainBgColor}>
        {this.renderQuestionText()}
        <WritingInputExam
          ref={(ref) => (this.writingRef = ref)}
          onSubmit={this.onAnswer}
        />

        {this.renderResult()}
      </ScriptWrapper>
    );
  }
}

const styles = {
  container: {
    paddingHorizontal: 0,
    paddingTop: 64,
  },
};

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
})(FillInBlankMultiPartScreen);
