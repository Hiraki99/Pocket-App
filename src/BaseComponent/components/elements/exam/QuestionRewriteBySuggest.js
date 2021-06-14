import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

import {NoFlexContainer, RowContainer, Text} from '~/BaseComponent';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {colors} from '~/themes';
import {makeid, matchAllRegex} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class QuestionRewriteBySuggest extends React.PureComponent {
  showInput = () => {
    if (this.writingRef) {
      this.writingRef.show(this.props.data.userAnswerText || '');
    }
  };

  onAnswer = (text) => {
    const {data} = this.props;
    this.props.action(data, text);
  };

  renderSuggestSentence = (text) => {
    const pronunciationRegex = /<.*?>/g;
    const listCmpText = [];
    const listMatchAll = matchAllRegex(pronunciationRegex, text);
    if (listMatchAll.length === 0) {
      return (
        <Text h5 color={colors.helpText} paddingRight={4}>
          {text}
        </Text>
      );
    }

    listMatchAll.map((it, index) => {
      if (index === 0 && it.index > 0) {
        listCmpText.push(
          <Text key={makeid(16)} h5 color={colors.helpText} paddingRight={4}>
            {it.input.slice(0, it.index).trim()}
          </Text>,
        );
      }
      listCmpText.push(
        <Text key={makeid(16)} h5 color={colors.helpText} bold paddingRight={4}>
          {it[0].replace(/[<|>]/g, '').trim()}
        </Text>,
      );
      if (index === listMatchAll.length - 1) {
        listCmpText.push(
          <Text key={makeid(16)} h5 color={colors.helpText} paddingRight={4}>
            {it.input.slice(it[0].length + it.index).trim()}
          </Text>,
        );
      } else {
        listCmpText.push(
          <Text key={makeid(16)} h5 color={colors.helpText} paddingRight={4}>
            {it.input
              .slice(it.index + it[0].length, listMatchAll[index + 1].index)
              .trim()}
          </Text>,
        );
      }
    });

    return <Text>{listCmpText}</Text>;
  };

  render() {
    const {data, showResult} = this.props;
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
              <Text fontSize={18} paddingVertical={4}>
                {translate('Viết lại câu trả lời')}
              </Text>
              {this.renderSuggestSentence(this.props.data.question)}

              {data.userAnswerText && (
                <>
                  <Text h5 paddingVertical={8} bold>
                    {translate('Câu trả lời')}
                  </Text>
                  <Text
                    fontSize={20}
                    style={{
                      fontStyle: 'italic',
                      textDecorationLine: 'underline',
                    }}
                    color={
                      showResult
                        ? data.statusAnswerQuestion
                          ? colors.successChoice
                          : colors.heartActive
                        : colors.helpText
                    }>
                    {data.userAnswerText}
                  </Text>
                </>
              )}

              {this.props.showResult && !data.statusAnswerQuestion && (
                <View paddingVertical={8}>
                  <Text h5 bold paddingBottom={8}>
                    {translate('Đáp án')}{' '}
                  </Text>
                  <Text h4 color={colors.helpText} paddingHorizontal={4}>
                    {data.answer.trim()}
                  </Text>
                </View>
              )}
            </NoFlexContainer>
          </RowContainer>
          <TouchableOpacity
            activeOpacity={0.65}
            style={[
              activityStyles.embedButton,
              activityStyles.embedButtonRound,
              {marginLeft: 40},
            ]}
            onPress={this.showInput}>
            <Text h5>{translate('Viết lại câu trả lời')}</Text>
          </TouchableOpacity>
        </View>

        <WritingInputExam
          ref={(ref) => (this.writingRef = ref)}
          questionComp={() => this.renderSuggestSentence(data.question)}
          onSubmit={this.onAnswer}
          placeHolderText={translate('Viết câu trả lời thích hợp...')}
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

QuestionRewriteBySuggest.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
  showResult: PropTypes.bool,
};
QuestionRewriteBySuggest.defaultProps = {
  action: () => {},
  data: {},
  showResult: false,
};

export default QuestionRewriteBySuggest;
