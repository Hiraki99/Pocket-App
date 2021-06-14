import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet} from 'react-native';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import Question from '~/BaseComponent/components/elements/result/Question';
import {OS} from '~/constants/os';
import {FlexContainer, RowContainer, Text} from '~/BaseComponent';
import {View as AnimatedView} from 'react-native-animatable';
import {colors, images} from '~/themes';
import CommonMatchExpressionWithPicturesTextItem from '~/BaseComponent/components/elements/grammar/element/CommonMatchExpressionWithPicturesTextItem';
import {connect} from 'react-redux';
import {answerQuestion} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import {LANGUAGE_MAPPING} from '~/constants/lang';

class VocabularyMatchWordDefinitionItem extends React.PureComponent {
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
      height: null,
    };
  }

  setAnswer = async (value) => {
    const {onNext, updateStar, item} = this.props;

    this.props.answerQuestion(value, 1);
    if (value) {
      updateStar(1);
    }
    playAudioAnswer(value);
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
    if (!value) {
      this.props.addIncorrectAnswer(item);
    }
    setTimeout(() => {
      onNext();
    }, 1000);
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
        style={[
          styles.responseContainer,
          this.state.height ? {height: this.state.height + 20} : {},
        ]}>
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

  onLayout = (e) => {
    this.setState({height: e.nativeEvent.layout.height});
  };

  render() {
    const {item} = this.props;
    const {answer} = this.state;
    return (
      <FlexContainer>
        <FlexContainer alignItems={'center'} justifyContent={'center'}>
          <CommonMatchExpressionWithPicturesTextItem item={item} />
        </FlexContainer>
        <FlexContainer>
          <Question
            onLayout={this.onLayout}
            data={item}
            autoHeight
            onAnswer={this.setAnswer}
            title={LANGUAGE_MAPPING.en.choose_the_right_word}
            translateTitle={LANGUAGE_MAPPING.vi.choose_the_right_word}
          />
          {answer.show && (
            <Answer
              isCorrect={answer.isCorrect}
              maxHeight={this.state.height}
            />
          )}
        </FlexContainer>
        {this.renderAwardOrDead()}
      </FlexContainer>
    );
  }
}

VocabularyMatchWordDefinitionItem.propTypes = {
  item: PropTypes.object,
  onNext: PropTypes.func,
  updateStar: PropTypes.func,
  addIncorrectAnswer: PropTypes.func,
  active: PropTypes.bool,
};

VocabularyMatchWordDefinitionItem.defaultProps = {
  item: {},
  onNext: () => {},
  updateStar: () => {},
  addIncorrectAnswer: () => {},
  active: false,
};

const styles = StyleSheet.create({
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    bottom: 0,
    height: OS.Game + 50,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default connect(null, {answerQuestion})(
  VocabularyMatchWordDefinitionItem,
);
