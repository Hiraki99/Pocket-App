import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';

import {NoFlexContainer, RowContainer, Text} from '~/BaseComponent';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import {colors} from '~/themes';
import {makeid, matchAllRegex} from '~/utils/utils';
import {LANGUAGE} from '~/constants/lang';
import {translate} from '~/utils/multilanguage';

class QuestionFillInBlank extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      lang: LANGUAGE.VI,
    };
  }

  showInput = (activeIndex) => {
    const {
      data: {userAnswers},
    } = this.props;
    if (this.writingRef) {
      this.writingRef.show(
        userAnswers[activeIndex] ? userAnswers[activeIndex].text : '',
      );
    }
    this.setActiveIndex(activeIndex);
  };

  setActiveIndex = (activeIndex) => {
    this.setState({activeIndex});
  };

  onAnswer = (text, index) => {
    const {data} = this.props;
    this.props.action(data, {index, text});
  };

  renderBold = (text) => {
    const pronunciationRegex = /<.*?>/g;
    const listCmpText = [];
    const listMatchAll = matchAllRegex(pronunciationRegex, text);
    if (listMatchAll.length === 0) {
      return (
        <Text
          key={makeid(16)}
          h5
          color={colors.helpText}
          paddingRight={4}
          style={{flexWrap: 'wrap'}}>
          {text}
        </Text>
      );
    }

    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        listCmpText.push(
          <Text h5 key={makeid(16)} color={colors.helpText} paddingRight={4}>
            {it.input.slice(0, it.index).trim()}
          </Text>,
        );
      }
      listCmpText.push(
        <Text h5 key={makeid(16)} color={colors.helpText} bold paddingRight={4}>
          {it[0].replace(/[<|>]/g, '').trim()}
        </Text>,
      );
      if (index === listMatchAll.length - 1) {
        listCmpText.push(
          <Text h5 key={makeid(16)} color={colors.helpText} paddingRight={4}>
            {it.input.slice(it[0].length + it.index).trim()}
          </Text>,
        );
      } else {
        listCmpText.push(
          <Text h5 key={makeid(16)} color={colors.helpText} paddingRight={4}>
            {it.input
              .slice(it.index + it[0].length, listMatchAll[index + 1].index)
              .trim()}
          </Text>,
        );
      }
    });

    return (
      <RowContainer style={{backgroundColor: 'blue'}}>
        {listCmpText}
      </RowContainer>
    );
  };

  renderText = () => {
    const {
      listMatchAll,
      userAnswers,
      answer,
      statusAnswerQuestion,
    } = this.props.data;
    const listCmpText = [];
    if (listMatchAll.length === 0) {
      return (
        <Text
          h5
          color={colors.helpText}
          paddingHorizontal={16}
          paddingVertical={8}>
          {this.props.data.question}
        </Text>
      );
    }

    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        listCmpText.push(this.renderBold(it.input.slice(0, it.index).trim()));
      }

      const textUserAnswer = userAnswers[index] ? userAnswers[index].text : '';
      const correctTextAnswer = this.props.isSentence
        ? answer
        : it[0].replace('[', '').replace(']', '');
      const selected =
        userAnswers[index] &&
        userAnswers[index].text &&
        userAnswers[index].index === index;

      const colorSelected = selected ? colors.primary : colors.heartDeactive;
      const colorSelectedFail = colors.milanoRed;
      // selected || !textUserAnswer ? colors.milanoRed : colors.heartDeactive;

      const colorShow = this.props.showResult
        ? statusAnswerQuestion
          ? colors.successChoice
          : colorSelectedFail
        : colorSelected;

      listCmpText.push(
        <Text>
          <Text>{'  '}</Text>
          <Text
            key={makeid(16)}
            accessibilityRole={'button'}
            accessible
            marginHorizontal={40}
            onPress={() => {
              this.showInput(index);
            }}>
            {this.props.showResult && !statusAnswerQuestion && (
              <Text h5 color={colors.successChoice} paddingRight={4} bold>
                {correctTextAnswer}
                <Text>{'  '}</Text>
              </Text>
            )}
            {!(this.props.showResult && statusAnswerQuestion) && (
              <Text
                h5
                color={colorShow}
                bold={selected}
                style={{
                  fontStyle: 'italic',
                }}
                primary={
                  !this.props.showResult &&
                  (this.state.activeIndex === index || selected)
                }>
                {this.props.showResult && statusAnswerQuestion
                  ? correctTextAnswer
                  : selected
                  ? userAnswers[index].text
                  : '______'}
              </Text>
            )}
          </Text>
          <Text>{'  '}</Text>
        </Text>,
      );
      if (index === listMatchAll.length - 1) {
        listCmpText.push(
          this.renderBold(it.input.slice(it[0].length + it.index).trim()),
        );
      } else {
        listCmpText.push(
          this.renderBold(
            it.input
              .slice(it.index + it[0].length, listMatchAll[index + 1].index)
              .trim(),
          ),
        );
      }
    });

    return <Text paddingTop={8}>{listCmpText}</Text>;
  };

  render() {
    const {data} = this.props;

    return (
      <>
        <View paddingHorizontal={16}>
          <RowContainer paddingVertical={8} alignItems={'flex-start'}>
            <RowContainer
              justifyContent={'center'}
              alignItems={'center'}
              style={styles.index}>
              <Text
                fontSize={10}
                style={{lineHeight: 12}}
                bold
                color={colors.white}>
                {data.indexQuestion || 0}
              </Text>
            </RowContainer>
            <NoFlexContainer paddingHorizontal={16}>
              <Text h5 bold>
                {translate('Question %s', {s1: data.indexQuestion})}
              </Text>
              <Text h5>{translate('Điền từ vào chỗ trống')}</Text>
              {!this.state.activeIndex && this.renderText()}
            </NoFlexContainer>
          </RowContainer>
        </View>

        <WritingInputExam
          ref={(ref) => (this.writingRef = ref)}
          questionComp={this.renderText}
          onSubmit={this.onAnswer}
          indexActive={this.state.activeIndex}
          setActiveIndex={this.setActiveIndex}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  index: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});

QuestionFillInBlank.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
  isSentence: PropTypes.bool,
  showResult: PropTypes.bool,
};
QuestionFillInBlank.defaultProps = {
  action: () => {},
  data: {},
  isSentence: false,
  showResult: false,
};

export default QuestionFillInBlank;
