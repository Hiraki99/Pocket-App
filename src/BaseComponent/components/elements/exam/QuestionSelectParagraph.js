import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import {shallowEqual, useSelector} from 'react-redux';

import Text from '~/BaseComponent/components/base/Text';
import {RowContainer} from '~/BaseComponent';
import {HeaderQuestion} from '~/BaseComponent/components/elements/exam/HeaderQuestion';
import SelectAnswerQuestionParagraph from '~/BaseComponent/components/elements/exam/modal/SelectAnswerQuestionParagraphModal';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const QuestionSelectParagraph = (props) => {
  const modalRef = React.useRef(null);
  const questions = useSelector(
    (state) => state.exam.questions || {},
    shallowEqual,
  );

  const [questionSelected, setQuestionSelected] = React.useState([]);

  const action = (item, el) => {
    props.onPress(props.data, item, el);
  };

  const popUpQuestion = React.useCallback(
    (item) => {
      if (questions[item.key]) {
        const answerSelectedKey = questions[item.key].answerSelectedKey;
        const answerQuestion = questions[item.key].answers.filter(
          (it) => it.key === answerSelectedKey,
        );
        const correctAnswer = questions[item.key].answers.filter(
          (it) => it.isAnswer,
        );
        const active = answerQuestion.length > 0;
        const colorSelected = active ? colors.primary : colors.heartDeactive;
        // const colorSelectedFail = active
        //   ? colors.milanoRed
        //   : colors.heartDeactive;
        const colorShow = props.showResult
          ? questions[item.key].statusAnswerQuestion
            ? colors.successChoice
            : colors.milanoRed
          : colorSelected;

        return (
          <TouchableWithoutFeedback
            onPress={() => {
              modalRef.current.showModal();
              setQuestionSelected(item);
            }}>
            <RowContainer>
              {props.showResult && (
                <Text
                  h5
                  key={item.key}
                  // style={[styles.answer]}
                  color={colors.successChoice}
                  paddingHorizontal={8}
                  marginBottom={4}
                  paddingVertical={4}>
                  {correctAnswer[0] ? correctAnswer[0].text : ''}
                </Text>
              )}
              {!(
                props.showResult && questions[item.key].statusAnswerQuestion
              ) && (
                <Text
                  h5
                  key={item.key}
                  style={{
                    fontStyle: 'italic',
                    textDecorationLine: 'underline',
                  }}
                  color={colorShow}
                  paddingHorizontal={8}
                  marginBottom={4}
                  paddingVertical={4}>
                  {answerQuestion.length > 0
                    ? answerQuestion[0].text
                    : item.textHide}
                </Text>
              )}
            </RowContainer>
          </TouchableWithoutFeedback>
        );
      }
      return null;
    },
    [questions, props.showResult],
  );

  return (
    <>
      {props.isSentence && (
        <View paddingHorizontal={16}>
          <HeaderQuestion indexQuestion={props.data.indexQuestion} />
        </View>
      )}

      {props.isParagraph && (
        <View paddingHorizontal={16}>
          <Text bold h5>
            {props.data.firstQuestion === props.data.indexQuestion
              ? translate('Question %s', {s1: props.data.firstQuestion})
              : translate('Question %s', {
                  s1: `${props.data.firstQuestion} - ${props.data.indexQuestion}`,
                })}
          </Text>
        </View>
      )}
      {(props.data.renderQuestion || []).map((sentence, sentenceIndex) => {
        return (
          <View
            id={sentence.id}
            style={styles.wrapper}
            paddingHorizontal={16}
            key={sentenceIndex}>
            {(sentence.renderQuestion || []).map((item) => {
              if (!item.answers) {
                return (
                  <Text
                    h5
                    key={item.key}
                    paddingVertical={4}
                    paddingHorizontal={2}
                    marginBottom={4}>
                    {item.text}
                  </Text>
                );
              }

              if (!questions[item.key]) {
                return null;
              }

              return (
                <RowContainer key={item.key} style={styles.wrapper}>
                  {props.isParagraph && (
                    <RowContainer
                      justifyContent={'center'}
                      alignItem={'center'}
                      key={item.key}
                      style={styles.index}>
                      <Text
                        fontSize={10}
                        style={{lineHeight: 12}}
                        bold
                        color={colors.white}>
                        {item.indexQuestion}
                      </Text>
                    </RowContainer>
                  )}
                  {item.display_type === 'popup' && popUpQuestion(item)}
                  {item.display_type !== 'popup' &&
                    item.answers.map((el, elIndex) => {
                      const active =
                        questions[item.key].answerSelectedKey === el.key;
                      const correctAnswer = questions[item.key].answers.filter(
                        (it) => it.isAnswer,
                      );
                      const isCorrectKeyAnswer =
                        correctAnswer[0] && correctAnswer[0].key === el.key;
                      const colorSelected = active
                        ? colors.primary
                        : colors.heartDeactive;
                      const colorSelectedFail = active
                        ? colors.milanoRed
                        : colors.heartDeactive;
                      const colorShow = props.showResult
                        ? item.isAnswer
                          ? colors.successChoice
                          : colorSelectedFail
                        : colorSelected;

                      return (
                        <>
                          <Text
                            accessibilityRole={'button'}
                            accessible
                            key={`${el.key}_${elIndex}`}
                            onPress={() => {
                              props.onPress(props.data, item, el);
                            }}>
                            <Text
                              h5
                              style={[
                                styles.answer,
                                {
                                  borderColor:
                                    props.showResult && isCorrectKeyAnswer
                                      ? colors.successChoice
                                      : colorShow,
                                },
                              ]}
                              color={
                                props.showResult && isCorrectKeyAnswer
                                  ? colors.successChoice
                                  : colorShow
                              }
                              paddingHorizontal={8}
                              marginBottom={4}
                              paddingVertical={4}>
                              {el.text}
                            </Text>
                          </Text>
                          {elIndex !== item.answers.length - 1 && (
                            <Text
                              h5
                              marginBottom={4}
                              paddingHorizontal={4}
                              paddingVertical={4}>
                              /
                            </Text>
                          )}
                        </>
                      );
                    })}
                </RowContainer>
              );
            })}
          </View>
        );
      })}

      <SelectAnswerQuestionParagraph
        ref={modalRef}
        data={questionSelected}
        action={action}
      />
    </>
  );
};
QuestionSelectParagraph.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func,
  showResult: PropTypes.bool,
  isSentence: PropTypes.bool,
  isParagraph: PropTypes.bool,
};
QuestionSelectParagraph.defaultProps = {
  data: {},
  onPress: () => {},
  showResult: false,
  isSentence: false,
  isParagraph: false,
};

const styles = StyleSheet.create({
  index: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    // top: 10,
    // marginRight: 8,
    // position: 'absolute',
  },
  answer: {
    borderRadius: 1,
    borderWidth: 1,
  },
  answerActive: {
    borderRadius: 1,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  wrapper: {flexWrap: 'wrap', flexDirection: 'row'},
});

export default QuestionSelectParagraph;
