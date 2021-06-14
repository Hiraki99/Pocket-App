import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent/index';
import {colors} from '~/themes';
import {matchAllRegex} from '~/utils/utils';
import {OS} from '~/constants/os';

const FillInBlankWord = (props) => {
  const [listParts, setListParts] = useState([]);
  const [listCorrects, setListCorrects] = useState([]);
  const [listAnswers, setListAnswers] = useState([]);
  const [totalBlank, setTotalBlank] = useState(0);

  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(0);
  const [focusBlankIndex, setFocusBlankIndex] = useState(-1);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const {
    text,
    disable,
    showInputModal,
    showCorrectModal,
    onFinish,
    currentFocusBlank,
    wordRef,
    onLayoutWord,
  } = props;

  useEffect(() => {
    if (currentAnswer && currentAnswer.length > 0) {
      if (!disable && totalBlank > 0) {
        let newListAnswers = [...listAnswers];
        newListAnswers[focusBlankIndex] = currentAnswer;
        setListAnswers(newListAnswers);

        let canCheck = true;
        let isCorrect = true;
        for (let i = 0; i < listCorrects.length; i++) {
          const correct = listCorrects[i];
          const answer = newListAnswers[i];
          if (correct !== '_') {
            if (answer === '_') {
              canCheck = false;
              isCorrect = false;
              break;
            } else {
              if (answer.toLowerCase() !== correct.toLowerCase()) {
                isCorrect = false;
              }
            }
          }
        }
        setIsCorrectAnswer(isCorrect);
        if (canCheck) {
          onFinish(true);
        }
      }
      setCurrentAnswer('');
    }
  }, [
    currentAnswer,
    disable,
    focusBlankIndex,
    listAnswers,
    listCorrects,
    totalBlank,
    onFinish,
  ]);

  useEffect(() => {
    if (showCorrectAnswer === 1) {
      showCorrectModal(isCorrectAnswer);
    }
  }, [showCorrectAnswer, showCorrectModal, isCorrectAnswer]);

  useEffect(() => {
    const inputText = text;

    let textParts = [];
    let listCorrectAnswers = [];
    let listCurrentAnswers = [];
    let currentPointer = 0;

    const answerRegex = /\[.*?]/g;
    const corrects = matchAllRegex(answerRegex, inputText);
    (corrects || []).forEach((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      const answersCorrect = it[0].replace('[', '').replace(']', '').trim();

      if (currentPointer < indexItem) {
        const subString = inputText.substr(
          currentPointer,
          indexItem - currentPointer,
        );
        textParts.push(subString);
        listCorrectAnswers.push('_');
        listCurrentAnswers.push('_');
      }

      textParts.push('_'.repeat(itemLength - 2));
      listCorrectAnswers.push(answersCorrect);
      listCurrentAnswers.push('_');

      currentPointer = indexItem + itemLength;
    });
    if (currentPointer <= inputText.length - 1) {
      const subString = inputText.substr(
        currentPointer,
        inputText.length - 1 - currentPointer + 1,
      );
      textParts.push(subString);
      listCorrectAnswers.push('_');
      listCurrentAnswers.push('_');
    }
    setTotalBlank((corrects || []).length);
    setIsCorrectAnswer(false);
    setShowCorrectAnswer(0);
    setListParts(textParts);
    setListCorrects(listCorrectAnswers);
    setListAnswers(listCurrentAnswers);
    setFocusBlankIndex(-1);
  }, [text]);

  const showInputModalWhenTap = useCallback(() => {
    if (showCorrectAnswer === 1) {
      return;
    }
    if (!disable) {
      let indexBlank = -1;
      for (let i = 0; i < listCorrects.length; i++) {
        const correct = listCorrects[i];
        if (correct !== '_') {
          indexBlank = i;
          break;
        }
      }
      setFocusBlankIndex(indexBlank);
      setShowCorrectAnswer(0);

      const params = {
        setCurrentAnswer: setCurrentAnswer,
        setShowCorrectAnswer: setShowCorrectAnswer,
        getText: () => {
          return text;
        },
        currentFocusBlank: indexBlank,
      };
      showInputModal(params);
    }
  }, [disable, listCorrects, text, showInputModal, showCorrectAnswer]);

  const showInputModalForMultiBlanks = useCallback(
    (index) => {
      if (showCorrectAnswer === 1) {
        return;
      }
      if (!disable) {
        setFocusBlankIndex(index);
        setShowCorrectAnswer(0);

        const params = {
          setCurrentAnswer: setCurrentAnswer,
          setShowCorrectAnswer: setShowCorrectAnswer,
          getText: () => {
            return text;
          },
          currentFocusBlank: index,
        };
        showInputModal(params);
      }
    },
    [disable, text, showInputModal, showCorrectAnswer],
  );

  const renderLabelCorrectAnswer = useCallback(() => {
    if (showCorrectAnswer === 1) {
      if (isCorrectAnswer) {
        return null;
      } else {
        return <Text style={styles.wrongText}>Đáp án đúng là:</Text>;
      }
    }
  }, [showCorrectAnswer, isCorrectAnswer]);

  const renderBlankText = useCallback(
    (item, index) => {
      const answer = listAnswers[index];
      const focusIndex = disable ? currentFocusBlank : focusBlankIndex;
      const correctAnswer = listCorrects[index];
      return (
        <BlankText
          text={item}
          currentAnswer={answer}
          index={index}
          focusBlankIndex={focusIndex}
          showInput={showInputModalForMultiBlanks}
          showCorrectAnswer={showCorrectAnswer === 1}
          correctAnswer={correctAnswer}
          key={index}
        />
      );
    },
    [
      disable,
      listAnswers,
      currentFocusBlank,
      focusBlankIndex,
      listCorrects,
      showInputModalForMultiBlanks,
      showCorrectAnswer,
    ],
  );
  const renderWrongText = useCallback(
    (index) => {
      const answer = listAnswers[index];
      const isCorrect =
        answer.toLowerCase() === listCorrects[index].toLowerCase();
      return (
        <Text
          key={index}
          style={[
            styles.text,
            isCorrect ? styles.colorCorrect : styles.colorWrong,
          ]}>
          {answer}
        </Text>
      );
    },
    [listAnswers, listCorrects],
  );
  const renderWrongAnswer = useCallback(() => {
    if (showCorrectAnswer === 1) {
      if (!isCorrectAnswer) {
        return (
          <View style={styles.wrongAnswerWrapper}>
            {(listParts || []).map((item, index) => {
              if (item.startsWith('_')) {
                return renderWrongText(index);
              } else {
                return (
                  <Text key={index} style={styles.text}>
                    {item}
                  </Text>
                );
              }
            })}
            <Text style={styles.text}>{'  ->  '}</Text>
          </View>
        );
      }
    }
    return null;
  }, [showCorrectAnswer, isCorrectAnswer, listParts, renderWrongText]);

  const renderTextParts = useCallback(() => {
    return (
      <View style={styles.textPartsWrapper}>
        {renderWrongAnswer()}
        {(listParts || []).map((item, index) => {
          if (item.startsWith('_')) {
            return renderBlankText(item, index);
          } else {
            return (
              <Text key={index} style={styles.text}>
                {item}
              </Text>
            );
          }
        })}
      </View>
    );
  }, [listParts, renderBlankText, renderWrongAnswer]);

  return (
    <TouchableWithoutFeedback onPress={showInputModalWhenTap}>
      <View
        style={styles.itemTextWrapper}
        ref={wordRef}
        onLayout={onLayoutWord}>
        {renderLabelCorrectAnswer()}
        {renderTextParts()}
      </View>
    </TouchableWithoutFeedback>
  );
};

const BlankText = (props) => {
  const isFocus = props.index === props.focusBlankIndex;
  const showCurrentAnswer = props.currentAnswer !== '_';

  let color;
  if (isFocus || showCurrentAnswer || props.showCorrectAnswer) {
    color = colors.primary;
  } else {
    color = colors.black;
  }

  let paddingHor = 0;
  if (showCurrentAnswer || props.showCorrectAnswer) {
    paddingHor = 0;
  } else {
    if (!showCurrentAnswer) {
      paddingHor = 5;
    }
  }

  const additionStyles = {color: color, paddingHorizontal: paddingHor};
  let text;
  if (props.showCorrectAnswer) {
    text = props.correctAnswer;
  } else {
    if (showCurrentAnswer) {
      text = props.currentAnswer;
    } else {
      text = props.text;
    }
  }

  const showInput = useCallback(() => {
    props.showInput(props.index);
  }, [props]);

  return (
    <TouchableWithoutFeedback onPress={showInput}>
      <Text style={[styles.text, additionStyles]}>{text}</Text>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  itemTextWrapper: {
    alignItems: 'center',
  },
  textPartsWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 45,
    maxWidth: OS.WIDTH - 30 * 2,
    justifyContent: 'center',
  },
  wrongAnswerWrapper: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    lineHeight: 42,
  },
  colorWrong: {
    color: colors.milanoRed,
  },
  colorCorrect: {
    color: colors.primary,
  },
  wrongText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 10,
  },
});

export default FillInBlankWord;

FillInBlankWord.propTypes = {
  text: PropTypes.string.isRequired,
  disable: PropTypes.bool,
  showInputModal: PropTypes.func,
  showCorrectModal: PropTypes.func,
  onFinish: PropTypes.func,
  currentFocusBlank: PropTypes.number,
  onLayoutWord: PropTypes.func,
};
FillInBlankWord.defaultProps = {
  text: '',
  disable: false,
  showInputModal: () => {},
  showCorrectModal: () => {},
  onFinish: () => {},
  currentFocusBlank: -1,
  onLayoutWord: () => {},
};
