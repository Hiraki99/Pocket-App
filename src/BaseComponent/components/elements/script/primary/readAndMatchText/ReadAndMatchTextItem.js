import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';

import {colors} from '~/themes';
import Text from '~/BaseComponent/components/base/Text';
import {matchAllRegex} from '~/utils/utils';

const ReadAndMatchTextItem = (props) => {
  const {
    item,
    index,
    selectItem,
    itemRef,
    updateCorrectStatus,
    showAnswer,
  } = props;

  const score = item.score || 1;
  const key = item.key;
  const question = item.question;

  const [leftText, setLeftText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [correctText, setCorrectText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (answerText && answerText.length > 0) {
      const correct = answerText === correctText;
      setIsCorrect(correct);
      if (updateCorrectStatus) {
        updateCorrectStatus(key, correct, score, answerText);
      }
    }
  }, [answerText, correctText, updateCorrectStatus, key, score]);
  useEffect(() => {
    if (itemRef) {
      itemRef.current = {
        setAnswer: setAnswerText,
        correctAnswer: correctText,
      };
    }
  }, [itemRef, correctText]);
  useEffect(() => {
    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, question);
    let cursorIndex = 0;
    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      if (cursorIndex < indexItem) {
        const subString = question.substr(cursorIndex, indexItem - cursorIndex);
        setLeftText(subString);
      }
      const correctString = it[0].replace('[', '').replace(']', '').trim();
      setAnswerText('');
      setCorrectText(correctString);
      cursorIndex = indexItem + itemLength;
    });
  }, [question]);

  const onPress = useCallback(() => {
    if (selectItem && index >= 0 && !showAnswer) {
      const params = {setAnswer: setAnswerText};
      selectItem(index, params);
    }
  }, [index, selectItem, showAnswer]);

  const renderCorrectAnswer = useCallback(() => {
    if (showAnswer && !isCorrect) {
      return (
        <Text style={[stylesItem.text, stylesItem.textCorrect]}>
          {correctText}
        </Text>
      );
    }
    return null;
  }, [showAnswer, isCorrect, correctText]);

  const renderRightContent = useCallback(() => {
    let displayText;
    if (answerText && answerText.length > 0) {
      displayText = answerText;
    } else {
      displayText = ' ';
    }
    let styleView = [stylesItem.rightContent];
    let styleText = [stylesItem.text];

    if (showAnswer) {
      styleView.push(
        isCorrect
          ? stylesItem.rightContentCorrect
          : stylesItem.rightContentWrong,
      );
      styleText.push(isCorrect ? stylesItem.textCorrect : stylesItem.textWrong);
    }
    return (
      <View style={stylesItem.rightContentWrapper}>
        <View style={styleView}>
          <Text style={styleText}>{displayText}</Text>
          {renderCorrectAnswer()}
        </View>
      </View>
    );
  }, [answerText, showAnswer, isCorrect, renderCorrectAnswer]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={stylesItem.item}>
        <NumberCircle number={index + 1} />
        <View style={stylesItem.mainContent}>
          <View style={stylesItem.leftContent}>
            <Text style={stylesItem.text}>{leftText}</Text>
          </View>
          {renderRightContent()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const NumberCircle = (props) => {
  const number = props.number;
  return (
    <View style={stylesNumber.background}>
      <View style={stylesNumber.innerBackground} />
      <Text style={stylesNumber.text}>{number}</Text>
    </View>
  );
};
const stylesItem = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 23,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  rightContentWrapper: {
    flex: 0.65,
  },
  rightContent: {
    borderColor: colors.black,
    borderRadius: 7,
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  rightContentCorrect: {
    borderColor: 'rgb(74,80,241)',
  },
  rightContentWrong: {
    borderColor: 'rgb(251,2,59)',
  },
  leftContent: {
    flex: 0.35,
  },
  text: {
    fontSize: 17,
    color: colors.black,
  },
  textCorrect: {
    color: 'rgb(74,80,241)',
  },
  textWrong: {
    color: 'rgb(251,2,59)',
    textDecorationLine: 'line-through',
  },
});

const stylesNumber = StyleSheet.create({
  background: {
    height: 28,
    width: 28,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74,80,241, 0.35)',
  },
  innerBackground: {
    position: 'absolute',
    height: 22,
    width: 22,
    top: 3,
    left: 3,
    backgroundColor: 'rgb(74,80,241)',
    borderRadius: 12,
  },
  text: {
    fontSize: 15,
    color: colors.white,
  },
});

export default ReadAndMatchTextItem;

ReadAndMatchTextItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number,
  selectItem: PropTypes.func,
  updateCorrectStatus: PropTypes.func,
  showAnswer: PropTypes.bool,
};

ReadAndMatchTextItem.defaultProps = {
  item: {score: 1, key: '', question: ''},
  index: 0,
  selectItem: () => {},
  updateCorrectStatus: () => {},
  showAnswer: false,
};
