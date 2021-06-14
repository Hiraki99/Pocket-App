import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {matchAllRegex, makeid} from '~/utils/utils';

export const SoundControlState = {
  DEFAULT: 0,
  PLAY: 1,
  STOP: 2,
};

export const SoundState = {
  DEFAULT: 0,
  LOADING: 1,
  PLAYING: 2,
  STOP: 3,
};

const ListenAndWriteItem = (props) => {
  const {
    item,
    showInputModal,
    setFinishItem,
    showCorrectAnswer,
    loadAudio,
    soundState,
    controlAudio,
    currentSoundIndex,
  } = props;
  const soundIndex = props.index;
  const firstBlankRef = useRef(null);

  const text = item.text;
  const [listAnswers, setListAnswers] = useState([]);
  const [listCorrects, setListCorrects] = useState([]);

  useEffect(() => {
    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, text);
    let answers = [];
    let corrects = [];

    listMatchAll.map((it) => {
      const correctString = it[0].replace('[', '').replace(']', '').trim();
      answers.push('');
      corrects.push(correctString);
    });
    setListAnswers(answers);
    setListCorrects(corrects);
  }, [text]);

  const handleAudioBtn = useCallback(() => {
    if (soundIndex === currentSoundIndex) {
      if (soundState === SoundState.DEFAULT || soundState === SoundState.STOP) {
        loadAudio(soundIndex);
        controlAudio(SoundControlState.PLAY);
      } else if (soundState === SoundState.PLAYING) {
        controlAudio(SoundControlState.STOP);
      } else if (soundState === SoundState.LOADING) {
      }
    } else {
      loadAudio(soundIndex);
      controlAudio(SoundControlState.PLAY);
    }
  }, [soundState, soundIndex, loadAudio, controlAudio, currentSoundIndex]);

  const renderSoundState = useCallback(() => {
    if (soundIndex === currentSoundIndex) {
      if (soundState === SoundState.LOADING) {
        return <ActivityIndicator size={'small'} color={'gray'} center />;
      } else if (soundState === SoundState.PLAYING) {
        return (
          <Image
            source={images.pause_circle_btn}
            style={stylesItem.iconAudioBtn}
          />
        );
      } else {
        return (
          <Image
            source={images.play_circle_btn}
            style={stylesItem.iconAudioBtn}
          />
        );
      }
    } else {
      return (
        <Image
          source={images.play_circle_btn}
          style={stylesItem.iconAudioBtn}
        />
      );
    }
  }, [soundState, soundIndex, currentSoundIndex]);

  const renderAudioBtn = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={handleAudioBtn}>
        <View style={stylesItem.audioBtn}>{renderSoundState()}</View>
      </TouchableWithoutFeedback>
    );
  }, [handleAudioBtn, renderSoundState]);

  const renderNormalText = useCallback((string) => {
    return (
      <Text key={makeid(8)} style={stylesItem.textNormal}>
        {string}
      </Text>
    );
  }, []);

  const setAnswer = useCallback(
    (index, answer) => {
      let newList = [...listAnswers];
      newList[index] = answer;
      setListAnswers(newList);
      if (listCorrects.length > 0 && newList.length === listCorrects.length) {
        let isFinish = true;
        let isCorrect = true;
        for (let i = 0; i < newList.length; i++) {
          if (!(newList[i] && newList[i].length > 0)) {
            isFinish = false;
            isCorrect = false;
            break;
          } else {
            if (newList[i].toLowerCase() === listCorrects[i].toLowerCase()) {
            } else {
              isCorrect = false;
            }
          }
        }
        if (isFinish) {
          setFinishItem(item.key, isCorrect);
        }
      }
    },
    [item.key, setFinishItem, listCorrects, listAnswers],
  );

  const renderBlankText = useCallback(
    (index, string) => {
      const answer = listAnswers[index];
      const correct = listCorrects[index];
      const isCorrect = answer === correct;
      return (
        <BlankTextItem
          text={string}
          index={index}
          answer={answer}
          correct={correct}
          key={index}
          isCorrect={isCorrect}
          showInputModal={showInputModal}
          setAnswer={setAnswer}
          showCorrectAnswer={showCorrectAnswer}
          onRef={firstBlankRef}
        />
      );
    },
    [showInputModal, listAnswers, listCorrects, setAnswer, showCorrectAnswer],
  );
  const focusInFirstBlank = useCallback(() => {
    if (firstBlankRef.current) {
      firstBlankRef.current.focus();
    }
  }, []);
  const renderText = useCallback(() => {
    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, text);
    let cursorIndex = 0;
    let listItems = [];
    let currentIndexBlank = 0;
    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      if (cursorIndex < indexItem) {
        const subString = text.substr(cursorIndex, indexItem - cursorIndex);
        listItems.push(renderNormalText(subString));
      }

      listItems.push(renderBlankText(currentIndexBlank, ' ______ '));
      currentIndexBlank += 1;

      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= text.length - 1) {
      const subString = text.substr(
        cursorIndex,
        text.length - 1 - cursorIndex + 1,
      );
      listItems.push(renderNormalText(subString));
    }
    return (
      <TouchableWithoutFeedback onPress={focusInFirstBlank}>
        <View style={stylesItem.textContent}>
          <Text style={stylesItem.textWrap}>{listItems}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [text, renderNormalText, renderBlankText, focusInFirstBlank]);

  return (
    <View style={stylesItem.item}>
      {renderAudioBtn()}
      {renderText()}
    </View>
  );
};
const BlankTextItem = (props) => {
  const {
    text,
    index,
    showInputModal,
    setAnswer,
    answer,
    correct,
    isCorrect,
    showCorrectAnswer,
    onRef,
  } = props;
  const [currentAnswer, setCurrentAnswer] = useState('');

  const onTapInItem = useCallback(() => {
    const params = {
      setCurrentAnswer: setCurrentAnswer,
    };
    showInputModal(params);
  }, [showInputModal]);

  useEffect(() => {
    if (index === 0 && text.length > 0) {
      onRef.current = {focus: onTapInItem};
    }
  }, [index, text, onTapInItem, onRef]);

  useEffect(() => {
    if (currentAnswer.length > 0) {
      setAnswer(index, currentAnswer);
      setCurrentAnswer('');
    }
  }, [index, currentAnswer, setAnswer]);
  const renderWrongAnswer = useCallback(() => {
    if (showCorrectAnswer && !isCorrect) {
      return (
        <Text style={[stylesItem.textNormal, stylesItem.textWrong]}>
          {answer + ' '}
        </Text>
      );
    }
    return null;
  }, [answer, showCorrectAnswer, isCorrect]);
  const renderBlank = useCallback(() => {
    let displayText = text;
    const hasAnswer = answer && answer.length > 0;
    let styles = [stylesItem.textNormal];
    if (hasAnswer) {
      displayText = answer;
      styles.push(stylesItem.textCorrect);
    }
    if (showCorrectAnswer) {
      displayText = correct;
      styles.push(stylesItem.textCorrect);
    }
    return (
      <TouchableWithoutFeedback onPress={onTapInItem}>
        <Text style={stylesItem.textWrap}>
          {renderWrongAnswer()}
          <Text style={styles}>{displayText}</Text>
        </Text>
      </TouchableWithoutFeedback>
    );
  }, [
    text,
    answer,
    correct,
    onTapInItem,
    showCorrectAnswer,
    renderWrongAnswer,
  ]);
  return renderBlank();
};
const stylesItem = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginTop: 15,
  },
  audioBtn: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAudioBtn: {
    height: 35,
    width: 35,
  },
  textContent: {
    marginLeft: 13,
    marginRight: 8,
    paddingHorizontal: 27,
    paddingVertical: 5,
    backgroundColor: 'rgb(243,245,249)',
    borderRadius: 25,
    flex: 1,
  },
  textWrap: {
    flexWrap: 'wrap',
  },
  textNormal: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.black,
    lineHeight: 32,
  },
  textCorrect: {
    color: colors.primary,
  },
  textWrong: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
});
export default ListenAndWriteItem;

ListenAndWriteItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number,
  showInputModal: PropTypes.func,
  setFinishItem: PropTypes.func,
  showCorrectAnswer: PropTypes.bool,
  loadAudio: PropTypes.func,
  soundState: PropTypes.number,
  controlAudio: PropTypes.func,
  currentSoundIndex: PropTypes.number,
};
ListenAndWriteItem.defaultProps = {
  item: {text: '', key: ''},
  index: 0,
  showInputModal: () => {},
  setFinishItem: () => {},
  showCorrectAnswer: false,
  loadAudio: () => {},
  soundState: SoundState.DEFAULT,
  controlAudio: () => {},
  currentSoundIndex: 0,
};
