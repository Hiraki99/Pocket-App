import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, StyleSheet} from 'react-native';
import {View as AnimatedView} from 'react-native-animatable';

import QuestionImages from './QuestionImages';

import {RowContainer, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';
import {answerQuestion} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import {LANGUAGE_MAPPING} from '~/constants/lang';

class CommonMatchExpressionWithQuestionAnswerItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: {
        show: false,
        isCorrect: false,
      },
      award: {
        show: false,
        isCorrect: false,
      },
      timeout: false,
    };
  }

  setAnswer = async (value) => {
    const {onNext, updateStar, answerQuestion} = this.props;
    answerQuestion(value, 1);
    if (value) {
      updateStar(1);
    }
    await this.setState({
      answer: {
        show: true,
        isCorrect: value,
      },
      award: {
        show: true,
        isCorrect: value,
      },
    });
    playAudioAnswer(value);
    setTimeout(
      () => {
        onNext();
      },
      value ? 1000 : 3000,
    );
  };

  renderAwardOrDead = () => {
    const {award} = this.state;
    if (!award.show || !award.isCorrect) {
      return null;
    }
    return (
      <AnimatedView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}
        style={styles.responseContainer}>
        <RowContainer>
          <Text
            h2
            fontSize={32}
            bold
            color={colors.helpText}
            paddingHorizontal={10}>
            +1
          </Text>
          <Image
            source={images.star}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </RowContainer>
      </AnimatedView>
    );
  };

  render() {
    const {item} = this.props;
    const {answer} = this.state;
    return (
      <>
        <QuestionImages
          data={item}
          onAnswer={this.setAnswer}
          image={true}
          questionContent={LANGUAGE_MAPPING.vi.choose_the_correct_picture}
          translateQuestionContent={
            LANGUAGE_MAPPING.en.choose_the_correct_picture
          }
          showAnswer={answer.show}
        />
        {this.renderAwardOrDead()}
        {/*{answer.show && <Answer isCorrect={answer.isCorrect} />}*/}
      </>
    );
  }
}

CommonMatchExpressionWithQuestionAnswerItem.propTypes = {
  item: PropTypes.object,
  onNext: PropTypes.func,
  updateStar: PropTypes.func,
  active: PropTypes.bool,
};

CommonMatchExpressionWithQuestionAnswerItem.defaultProps = {
  item: {},
  onNext: () => {},
  updateStar: () => {},
  active: false,
};

const styles = StyleSheet.create({
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    height: OS.Game + 20,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default connect(null, {answerQuestion})(
  CommonMatchExpressionWithQuestionAnswerItem,
);
