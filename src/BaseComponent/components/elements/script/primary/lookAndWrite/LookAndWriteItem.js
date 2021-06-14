import React, {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import AutoResizeImage from '~/BaseComponent/components/elements/script/primary/lookAndWrite/AutoResizeImage';
import {OS} from '~/constants/os';
import {matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const LookAndWriteItem = (props) => {
  const scrollRef = useRef(null);
  const conversationRef = useRef(null);

  const [listAnswers, setListAnswers] = useState([]);
  const [listCorrects, setListCorrects] = useState([]);
  const [focusBlankIndex, setFocusBlankIndex] = useState(-1);
  const [firstTime, setFirstTime] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const {item, showInputModal, setCanCheckAnswer, showCorrectModal} = props;
  const textProps = item.text;
  const urlImage = item.image;

  const onPressBlankText = useCallback(
    (indexBlank) => {
      if (showCorrectAnswer) {
        return;
      }
      setFocusBlankIndex(indexBlank);
      setShowCorrectAnswer(false);
      const params = {
        setCurrentAnswer: setCurrentAnswer,
        showCorrectAnswer: () => setShowCorrectAnswer(true),
      };
      showInputModal(params);
      if (scrollRef.current && conversationRef.current) {
        scrollRef.current.scrollToFocusedInput(conversationRef.current, 300);
      }
    },
    [showInputModal, showCorrectAnswer],
  );

  const onPressConversation = useCallback(() => {
    if (showCorrectAnswer) {
      return;
    }
    onPressBlankText(0);
  }, [onPressBlankText, showCorrectAnswer]);

  const renderConversation = useCallback(() => {
    if (firstTime) {
      return null;
    }

    let cursorBlankIndex = -1;

    const renderLine = (lineString) => {
      const regex = /<.*?>/g;
      const listMatchAll = matchAllRegex(regex, lineString);
      let cursorIndex = 0;
      let listItems = [];

      listMatchAll.map((it) => {
        const itemLength = it[0].length;
        const indexItem = it.index;

        const boldString = it[0].replace('<', '').replace('>', '');

        if (cursorIndex < indexItem) {
          const subString = lineString.substr(
            cursorIndex,
            indexItem - cursorIndex,
          );
          listItems.push(renderSubLine(subString, false));
        }

        listItems.push(renderSubLine(boldString, true));

        cursorIndex = indexItem + itemLength;
      });

      if (cursorIndex <= lineString.length - 1) {
        const subString = lineString.substr(
          cursorIndex,
          lineString.length - 1 - cursorIndex + 1,
        );
        listItems.push(renderSubLine(subString, false));
      }
      return <Text style={stylesItem.textWrap}>{listItems}</Text>;
    };

    const renderSubLine = (subLine, isBold) => {
      const regex = /\[.*?]/g;
      const listMatchAll = matchAllRegex(regex, subLine);
      let cursorIndex = 0;
      let listItems = [];

      listMatchAll.map((it) => {
        const itemLength = it[0].length;
        const indexItem = it.index;

        if (cursorIndex < indexItem) {
          const subString = subLine.substr(
            cursorIndex,
            indexItem - cursorIndex,
          );
          listItems.push(renderText(subString, isBold));
        }

        listItems.push(renderBlankText(' ______ ', isBold));

        cursorIndex = indexItem + itemLength;
      });

      if (cursorIndex <= subLine.length - 1) {
        const subString = subLine.substr(
          cursorIndex,
          subLine.length - 1 - cursorIndex + 1,
        );
        listItems.push(renderText(subString, isBold));
      }

      return <Text style={stylesItem.textWrap}>{listItems}</Text>;
    };

    const renderText = (text, isBold) => {
      const styles = isBold ? stylesItem.textBold : stylesItem.textNormal;
      return <Text style={styles}>{text}</Text>;
    };

    const renderBlankText = (text, isBold) => {
      cursorBlankIndex += 1;
      const indexBlank = cursorBlankIndex;
      const isFocus = indexBlank === focusBlankIndex;
      const answer = listAnswers[indexBlank];
      const correctAnswer = listCorrects[indexBlank];
      const hasAnswer = answer && answer.length > 0;
      const onPress = () => onPressBlankText(indexBlank);
      let displayText = hasAnswer ? answer : text;
      if (showCorrectAnswer) {
        displayText = correctAnswer;
      }
      let color = hasAnswer ? colors.primary : colors.black;
      if (isFocus || showCorrectAnswer) {
        color = colors.primary;
      }

      const styles = {
        ...(isBold ? stylesItem.textBold : stylesItem.textNormal),
        color: color,
      };

      const renderWrongAnswer = () => {
        if (hasAnswer && showCorrectAnswer && answer !== correctAnswer) {
          return <Text style={[styles, stylesItem.textWrong]}>{answer} </Text>;
        }
        return null;
      };

      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <Text style={styles.textWrap}>
            {renderWrongAnswer()}
            <Text style={styles}>{displayText}</Text>
          </Text>
        </TouchableWithoutFeedback>
      );
    };

    let listLines = textProps.split(/\r\n|\r|\n/);
    if (textProps.includes('\\n') !== -1) {
      listLines = textProps.split('\\n');
    }
    return (
      <TouchableWithoutFeedback onPress={onPressConversation}>
        <View style={stylesItem.conversationWrapper} ref={conversationRef}>
          <View style={stylesItem.conversationBox}>
            {listLines.map((it) => {
              return renderLine(it);
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [
    firstTime,
    textProps,
    focusBlankIndex,
    listAnswers,
    showCorrectAnswer,
    listCorrects,
    onPressBlankText,
    onPressConversation,
  ]);

  useEffect(() => {
    let list = [];
    let answers = [];
    const inputText = textProps;
    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, inputText);

    listMatchAll.map((it) => {
      const correctString = it[0].replace('[', '').replace(']', '').trim();
      list.push(correctString);
      answers.push('');
    });
    setListCorrects(list);
    setListAnswers(answers);
    setFirstTime(false);
  }, [textProps]);

  useEffect(() => {
    if (currentAnswer && currentAnswer.length > 0) {
      let newList = [...listAnswers];
      if (focusBlankIndex >= 0) {
        newList[focusBlankIndex] = currentAnswer;
      }
      setListAnswers(newList);
      setCurrentAnswer('');
    }
  }, [currentAnswer, listAnswers, focusBlankIndex]);

  useEffect(() => {
    if (listCorrects && listCorrects.length > 0) {
      let canCheck = true;
      if (listAnswers.length === listCorrects.length) {
        for (let i = 0; i < listAnswers.length; i++) {
          if (listAnswers[i] === '' || typeof listAnswers[i] === 'undefined') {
            canCheck = false;
            break;
          }
        }
      } else {
        canCheck = false;
      }
      if (canCheck) {
        setCanCheckAnswer(true);
      }
    }
  }, [listCorrects, listAnswers, setCanCheckAnswer]);

  useEffect(() => {
    if (showCorrectAnswer) {
      if (listCorrects && listCorrects.length > 0) {
        let isCorrect = true;
        if (listAnswers.length === listCorrects.length) {
          for (let i = 0; i < listAnswers.length; i++) {
            if (
              listCorrects[i].toLocaleLowerCase() !==
              listAnswers[i].toLocaleLowerCase()
            ) {
              isCorrect = false;
              break;
            }
          }
        } else {
          isCorrect = false;
        }
        showCorrectModal(isCorrect);
      }
    }
  }, [showCorrectAnswer, listCorrects, listAnswers, showCorrectModal]);

  const renderCorrectLabel = useCallback(() => {
    if (!showCorrectAnswer) {
      return null;
    }
    return (
      <View style={stylesItem.correctLabelWrapper}>
        <Text style={stylesItem.correctLabel}>
          {translate('Đáp án đúng là:')}
        </Text>
      </View>
    );
  }, [showCorrectAnswer]);

  const renderImage = useCallback(() => {
    return <AutoResizeImage url={urlImage} imageWidth={OS.WIDTH} />;
  }, [urlImage]);
  return (
    <KeyboardAwareScrollView style={stylesItem.itemWrapper} ref={scrollRef}>
      {renderImage()}
      <View>
        {renderCorrectLabel()}
        {renderConversation()}
      </View>
    </KeyboardAwareScrollView>
  );
};

const stylesItem = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  textWrap: {
    flexWrap: 'wrap',
  },
  conversationWrapper: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
  conversationBox: {
    backgroundColor: 'rgb(243,245,249)',
    paddingHorizontal: 40,
    paddingVertical: 7,
    borderRadius: 25,
  },
  textBold: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 32,
  },
  textNormal: {
    fontSize: 20,
    color: colors.black,
    lineHeight: 32,
  },
  textWrong: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
  correctLabelWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  correctLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
  },
});

export default LookAndWriteItem;

LookAndWriteItem.propTypes = {
  item: PropTypes.object.isRequired,
  showInputModal: PropTypes.func,
  setCanCheckAnswer: PropTypes.func,
  showCorrectModal: PropTypes.func,
};

LookAndWriteItem.defaultProps = {
  item: {text: '', image: ''},
  showInputModal: () => {},
  setCanCheckAnswer: () => {},
  showCorrectModal: () => {},
};
