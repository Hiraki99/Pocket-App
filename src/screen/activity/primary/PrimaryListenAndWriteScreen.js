import React, {useEffect, useState, useCallback, useRef} from 'react';
import {StyleSheet, View, FlatList, Keyboard} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Sound from 'react-native-sound';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import Button from '~/BaseComponent/components/base/Button';
import {generateNextActivity} from '~/utils/script';
import {
  ContinueBtnState,
  CorrectModalState,
} from '~/features/activity/container/primary/LookAndTraceContainer';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import AutoResizeImage from '~/BaseComponent/components/elements/script/primary/lookAndWrite/AutoResizeImage';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import ListenAndWriteItem, {
  SoundControlState,
  SoundState,
} from '~/BaseComponent/components/elements/script/primary/listenAndWrite/ListenAndWriteItem';
import {translate} from '~/utils/multilanguage';

const PrimaryListenAndWriteScreen = () => {
  const dispatch = useDispatch();

  const flatListRef = useRef(null);
  const soundRef = useRef(null);
  const inputModalRef = useRef(null);
  const currentBlankTextRef = useRef(null);

  const [listItems, setListItems] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const finishItemMap = useRef({});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );

  const [soundControl, setSoundControl] = useState(SoundControlState.DEFAULT);
  const [soundIndex, setSoundIndex] = useState(-1);
  const [soundState, setSoundState] = useState(SoundState.DEFAULT);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const keyboardWillShow = useCallback(
    (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: soundIndex >= 0 ? soundIndex : 0,
          });
        }
      }, 150);
    },
    [soundIndex],
  );

  const keyboardWillHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardWillShow', keyboardWillShow);
      Keyboard.removeListener('keyboardWillHide', keyboardWillHide);
    };
  }, [keyboardWillShow, keyboardWillHide]);

  useEffect(() => {
    if (currentScriptItem && currentScriptItem.objects.length > 0) {
      setListItems(currentScriptItem.objects);
      setImageUrl(currentScriptItem.backgroundUrl);
      dispatch(setTotalQuestion(1));
    }
  }, [dispatch, currentScriptItem]);

  const stopAndReleaseCurrentSound = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');

    return () => {
      stopAndReleaseCurrentSound();
    };
  }, [stopAndReleaseCurrentSound]);

  useEffect(() => {
    if (soundControl > SoundControlState.DEFAULT) {
      if (soundControl === SoundControlState.PLAY) {
        if (soundState !== SoundState.LOADING && soundRef.current) {
          soundRef.current.stop();
          soundRef.current.play(() => {
            setSoundState(SoundState.STOP);
          });
          setSoundState(SoundState.PLAYING);
        }
      }
      if (soundControl === SoundControlState.STOP) {
        if (soundRef.current) {
          soundRef.current.stop();
          setSoundState(SoundState.STOP);
        }
      }
      setSoundControl(SoundControlState.DEFAULT);
    }
  }, [soundControl, soundState]);

  useEffect(() => {
    if (soundIndex >= 0) {
      setSoundState(SoundState.LOADING);
      const currentItem = listItems[soundIndex];
      stopAndReleaseCurrentSound();
      if (currentItem.audio && currentItem.audio.length > 0) {
        soundRef.current = new Sound(currentItem.audio, '', (error) => {
          if (!error) {
            soundRef.current.play(() => {
              setSoundState(SoundState.STOP);
            });
            setSoundState(SoundState.PLAYING);
          } else {
            soundRef.current = null;
            setSoundState(SoundState.DEFAULT);
          }
        });
      } else {
        setSoundState(SoundState.DEFAULT);
      }
    }
  }, [soundIndex, listItems, stopAndReleaseCurrentSound]);

  const submitAnswer = useCallback((text) => {
    if (currentBlankTextRef.current) {
      currentBlankTextRef.current.setCurrentAnswer(text);
    }
  }, []);

  const showInputModal = useCallback((ref) => {
    if (inputModalRef) {
      currentBlankTextRef.current = ref;
      inputModalRef.current.show('');
    }
  }, []);

  const setFinishItem = useCallback(
    (key, isCorrect) => {
      finishItemMap.current = {
        ...finishItemMap.current,
        [key]: isCorrect,
      };
      if (Object.keys(finishItemMap.current).length === listItems.length) {
        setContinueBtnState(ContinueBtnState.CHECK_ANSWER_ENABLE);
      }
    },
    [listItems],
  );

  const loadAudio = useCallback((index) => {
    setSoundIndex(index);
  }, []);

  const controlAudio = useCallback((soundCommand) => {
    setSoundControl(soundCommand);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ListenAndWriteItem
          key={item.key}
          item={item}
          index={index}
          showInputModal={showInputModal}
          setFinishItem={setFinishItem}
          showCorrectAnswer={showCorrectAnswer}
          loadAudio={loadAudio}
          soundState={soundState}
          controlAudio={controlAudio}
          currentSoundIndex={soundIndex}
        />
      );
    },
    [
      showInputModal,
      setFinishItem,
      showCorrectAnswer,
      loadAudio,
      controlAudio,
      soundState,
      soundIndex,
    ],
  );

  const keyExtractor = useCallback((item) => {
    return item.key;
  }, []);

  const renderImage = useCallback(() => {
    return <AutoResizeImage url={imageUrl} imageWidth={OS.WIDTH} />;
  }, [imageUrl]);

  const renderFooter = useCallback(() => {
    return <View style={{height: keyboardHeight}} />;
  }, [keyboardHeight]);

  const checkAnswer = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    if (continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG) {
      generateNextActivity();
      return;
    }
    let isCorrect = true;
    let totalWrong = 0;
    let totalCorrect = 0;
    let totalScore = 0;

    for (let i = 0; i < listItems.length; i++) {
      const it = listItems[i];
      const isOk = finishItemMap.current[it.key] || false;
      if (isOk === false) {
        isCorrect = false;
        totalWrong += 1;
      } else {
        totalCorrect += 1;
        totalScore += it.score || 1;
      }
    }
    playAudioAnswer(isCorrect);
    setCorrectModalMode(
      isCorrect ? CorrectModalState.SUCCESS : CorrectModalState.WRONG,
    );
    dispatch(doneQuestion());
    dispatch(increaseScore(totalScore, totalCorrect, totalWrong));
    setTimeout(() => {
      setCorrectModalMode(CorrectModalState.HIDE);
      if (isCorrect) {
        generateNextActivity();
      }
    }, 1000);
    setShowCorrectAnswer(true);
    setContinueBtnState(ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG);
  }, [dispatch, continueBtnState, listItems]);

  const renderContinueButton = useCallback(() => {
    let disable = false;
    let title = `${translate('Kiểm tra')}`;

    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_DISABLE) {
      disable = true;
      title = `${translate('Kiểm tra')}`;
    } else if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      disable = false;
      title = `${translate('Kiểm tra')}`;
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      disable = false;
      title = `${translate('Tiếp tục')}`;
    }

    return (
      <View style={styles.bottomWrapper}>
        <Button
          disabled={disable}
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={checkAnswer}>
          {title}
        </Button>
      </View>
    );
  }, [continueBtnState, checkAnswer]);
  const renderCorrectModal = useCallback(() => {
    if (correctModalMode === CorrectModalState.HIDE) {
      return null;
    }
    return (
      <Answer
        isCorrect={correctModalMode === CorrectModalState.SUCCESS}
        maxHeight={350}
      />
    );
  }, [correctModalMode]);
  return (
    <ScriptWrapper mainBgColor={colors.white}>
      <FlatList
        ref={flatListRef}
        style={styles.flatList}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContentView}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderImage}
        ListFooterComponent={renderFooter}
      />
      {renderContinueButton()}
      <WritingInputExam ref={inputModalRef} onSubmit={submitAnswer} />
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};
const styles = StyleSheet.create({
  flatList: {
    marginBottom: 25,
  },
  flatListContentView: {
    paddingBottom: 48,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
});
export default PrimaryListenAndWriteScreen;
