import React, {useEffect, useState, useCallback, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from 'react-native';
import shuffle from 'lodash/shuffle';
import Sound from 'react-native-sound';

import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {OS} from '~/constants/os';
import {colors, images} from '~/themes';
import Button from '~/BaseComponent/components/base/Button';
import {
  ContinueBtnState,
  CorrectModalState,
} from '~/features/activity/container/primary/LookAndTraceContainer';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import {playAudioAnswer} from '~/utils/utils';
import {generateNextActivity} from '~/utils/script';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import ListenAndNumberItem from '~/BaseComponent/components/elements/script/primary/listenAndNumber/ListenAndNumberItem';
import ListenAndNumberModal from '~/BaseComponent/components/elements/script/primary/listenAndNumber/ListenAndNumberModal';
import TranscriptModal from '~/BaseComponent/components/elements/script/primary/listenAndNumber/TranscriptModal';
import {translate} from '~/utils/multilanguage';

const PrimaryListenAndNumberScreen = () => {
  const dispatch = useDispatch();

  const timer = useRef(null);
  const audioRef = useRef(null);
  const audioClipRef = useRef(null);
  const clipInfoRef = useRef(null);
  const focusNumberRef = useRef(null);
  const mapCorrectRef = useRef({});
  const transcriptRef = useRef('');

  const [listFlatlist, setListFlatlist] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [totalPicture, setTotalPicture] = useState(0);
  const [showPickNumberModal, setShowPickNumberModal] = useState(false);
  const [mapAnswer, setMapAnswer] = useState({});
  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const stopAndReleaseCurrentSound = useCallback(() => {
    if (audioClipRef.current) {
      audioClipRef.current.stop();
      audioClipRef.current.release();
      audioClipRef.current = null;
    }
  }, []);
  useEffect(() => {
    Sound.enableInSilenceMode(true);
    Sound.setCategory('Playback');
    timer.current = setInterval(() => {
      if (audioClipRef.current && clipInfoRef.current) {
        audioClipRef.current.getCurrentTime((second) => {
          if (clipInfoRef.current) {
            if (second >= clipInfoRef.current.end) {
              audioClipRef.current.stop();
              clipInfoRef.current = null;
            }
          }
        });
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
      stopAndReleaseCurrentSound();
    };
  }, [stopAndReleaseCurrentSound]);
  useEffect(() => {
    audioClipRef.current = new Sound(audioUrl, '', (error) => {
      if (error) {
      }
    });
  }, [audioUrl]);
  useEffect(() => {
    if (totalPicture > 0) {
      const keys = Object.keys(mapAnswer);
      if (keys.length === totalPicture) {
        setContinueBtnState(ContinueBtnState.CHECK_ANSWER_ENABLE);
      }
    }
  }, [mapAnswer, totalPicture]);

  useEffect(() => {
    if (currentScriptItem && currentScriptItem.objects) {
      const data = currentScriptItem.objects;
      setAudioUrl(data.audio);
      const labels = 'abcdefghijklmnopqrstuvwxyz';
      let listOrigin = [];
      let transcript = '';
      for (let i = 0; i < data.conversations.length; i++) {
        const item = data.conversations[i];
        listOrigin.push({
          ...item,
          correctIndex: i + 1,
        });
        mapCorrectRef.current[item.id] = {value: i + 1, score: item.score || 1};
        transcript += (i !== 0 ? '\n' : '') + item.transcript;
      }
      transcriptRef.current = transcript;
      setTotalPicture(listOrigin.length);
      let listShuffle = shuffle(listOrigin);

      let list = [];
      let tempList = [];
      let count = 0;
      for (let i = 0; i < listShuffle.length; i++) {
        const label = i < labels.length ? labels.charAt(i) : '#';
        const item = {...listShuffle[i], label: label};
        if (count < 2) {
          tempList.push(item);
          count += 1;
        } else {
          list.push(tempList);
          tempList = [item];
          count = 1;
        }
      }
      if (count > 0) {
        list.push(tempList);
      }
      setListFlatlist(list);
      dispatch(setTotalQuestion(1));
    }
  }, [currentScriptItem, dispatch]);

  const closePickAnswerModal = useCallback(() => {
    setShowPickNumberModal(false);
  }, []);

  const showPickAnswerModal = useCallback((params) => {
    focusNumberRef.current = params;
    setShowPickNumberModal(true);
  }, []);

  const playAudioClip = useCallback((clip) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioClipRef.current) {
      const clipInfo = {
        start: parseFloat(clip.start),
        end: parseFloat(clip.end),
      };
      clipInfoRef.current = null;
      audioClipRef.current.pause();
      audioClipRef.current.setCurrentTime(clipInfo.start);
      audioClipRef.current.play();
      clipInfoRef.current = {...clipInfo};
    }
  }, []);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <ListenAndNumberItem
          list={item}
          showPickAnswerModal={showPickAnswerModal}
          mapAnswer={mapAnswer}
          playAudioClip={playAudioClip}
          showAnswer={showAnswer}
          key={item.key}
        />
      );
    },
    [showPickAnswerModal, mapAnswer, playAudioClip, showAnswer],
  );

  const keyExtractor = useCallback((item) => {
    return item.key;
  }, []);
  const submitAnswer = useCallback(
    (number) => {
      if (focusNumberRef.current) {
        setMapAnswer({...mapAnswer, [focusNumberRef.current.itemId]: number});
      }
      closePickAnswerModal();
    },
    [closePickAnswerModal, mapAnswer],
  );
  const renderPickNumberModal = useCallback(() => {
    if (showPickNumberModal) {
      return (
        <ListenAndNumberModal
          closePickAnswerModal={closePickAnswerModal}
          label={focusNumberRef.current.label}
          totalPicture={totalPicture}
          submitAnswer={submitAnswer}
          mapAnswer={mapAnswer}
        />
      );
    }
    return null;
  }, [
    showPickNumberModal,
    closePickAnswerModal,
    totalPicture,
    submitAnswer,
    mapAnswer,
  ]);
  const closeTranscriptModal = useCallback(() => {
    setShowTranscriptModal(false);
  }, []);
  const renderTranscriptModal = useCallback(() => {
    if (showTranscriptModal) {
      return (
        <TranscriptModal
          closeTranscriptModal={closeTranscriptModal}
          content={transcriptRef.current}
        />
      );
    }
    return null;
  }, [showTranscriptModal, closeTranscriptModal]);

  const checkAnswer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioClipRef.current) {
      audioClipRef.current.pause();
    }
    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      setShowAnswer(true);
      const keys = Object.keys(mapAnswer);
      let isCorrect = true;
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalScore = 0;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const answer = mapAnswer[key];
        const correctAnswer = mapCorrectRef.current[key];
        if (answer !== correctAnswer.value) {
          isCorrect = false;
          totalWrong += 1;
        } else {
          totalCorrect += 1;
          totalScore += correctAnswer.score;
        }
      }
      dispatch(doneQuestion());
      dispatch(increaseScore(totalScore, totalCorrect, totalWrong));
      playAudioAnswer(isCorrect);
      setCorrectModalMode(
        isCorrect ? CorrectModalState.SUCCESS : CorrectModalState.WRONG,
      );
      setTimeout(() => {
        setCorrectModalMode(CorrectModalState.HIDE);
      }, 1000);
      setContinueBtnState(ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG);
    } else {
      generateNextActivity();
    }
  }, [continueBtnState, dispatch, mapAnswer]);

  const renderContinueButton = useCallback(() => {
    let disable = false;
    let title = translate('Kiểm tra');

    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_DISABLE) {
      disable = true;
      title = translate('Kiểm tra');
    } else if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      disable = false;
      title = translate('Kiểm tra');
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      disable = false;
      title = translate('Hoàn thành');
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

  const showTranscript = useCallback(() => {
    setShowTranscriptModal(true);
  }, []);

  const updateAudioState = useCallback((state) => {
    if (state === 'playing') {
      if (audioClipRef.current) {
        audioClipRef.current.pause();
      }
    }
  }, []);

  const renderCorrectModal = useCallback(() => {
    if (correctModalMode === CorrectModalState.HIDE) {
      return null;
    }
    return (
      <Answer
        isCorrect={correctModalMode === CorrectModalState.SUCCESS}
        maxHeight={320}
      />
    );
  }, [correctModalMode]);

  if (!currentScriptItem) {
    return null;
  }
  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
      <View>
        <EmbedAudioAnimate
          ref={audioRef}
          autoPlay={false}
          audio={audioUrl}
          isUser
          isSquare
          fullWidth
          getAudioState={updateAudioState}
        />
        <TouchableWithoutFeedback onPress={showTranscript}>
          <View style={styles.transcriptBtn}>
            <Image
              source={images.transcript_btn}
              style={styles.transcriptIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        data={listFlatlist}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContentView}
      />
      {renderContinueButton()}
      {renderPickNumberModal()}
      {renderTranscriptModal()}
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginBottom: 25,
  },
  flatListContentView: {
    paddingTop: 10,
    paddingBottom: 48,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
  transcriptBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  transcriptIcon: {
    width: 34,
    height: 34,
  },
});
export default PrimaryListenAndNumberScreen;
