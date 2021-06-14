import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import {View as AnimateView} from 'react-native-animatable';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Button from '~/BaseComponent/components/base/Button';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import LetTalkItem from '~/BaseComponent/components/elements/script/primary/letsTalk/LetTalkItem';
import LetTalkBlankText from '~/BaseComponent/components/elements/script/primary/letsTalk/LetTalkBlankText';
import {playAudioAnswer} from '~/utils/utils';
import {increaseScore} from '~/features/script/ScriptAction';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {CorrectModalState} from '~/features/activity/container/primary/LookAndTraceContainer';
import {generateNextActivity} from '~/utils/script';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const PrimaryLetTalkScreen = () => {
  const dispatch = useDispatch();
  const soundRef = useRef(null);
  const correctMapRef = useRef({});
  const currentScore = useRef(0);
  const recordTextRef = useRef('');

  const [listItems, setListItems] = useState([]);
  const [mainText, setMainText] = useState('');
  const [blankText, setBlankText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [soundUrl, setSoundUrl] = useState('');
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [replay, setReplay] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );
  const updateRecordText = useCallback((text) => {
    recordTextRef.current = text;
  }, []);

  useEffect(() => {
    if (currentScriptItem && currentScriptItem.images.length > 0) {
      setMainText(currentScriptItem.text);

      let count = 0;
      let tempList = [];
      let list = [];
      currentScriptItem.images.map((it, index) => {
        if (count < 2) {
          count += 1;
          tempList.push({...it, idx: index});
        } else {
          list.push([...tempList]);
          count = 1;
          tempList = [];
          tempList.push({...it, idx: index});
        }
      });
      if (tempList.length > 0) {
        list.push([...tempList]);
      }
      setListItems(list);
      dispatch(setTotalQuestion(currentScriptItem.images.length));
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

    const initRecord = async () => {
      const checkExistedFolder = await RNFS.exists(
        RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
      );
      if (!checkExistedFolder) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
      }
    };
    initRecord();

    return () => {
      stopAndReleaseCurrentSound();
      RNFS.unlink(
        `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
      ).then(() => {});
    };
  }, [stopAndReleaseCurrentSound]);

  useEffect(() => {
    if (replay) {
      if (!isLoadingSound && soundRef.current) {
        soundRef.current.stop();
        soundRef.current.play();
      }
      setReplay(false);
    }
  }, [replay, isLoadingSound]);

  useEffect(() => {
    if (soundUrl && soundUrl.length > 0) {
      setIsLoadingSound(true);
      stopAndReleaseCurrentSound();
      soundRef.current = new Sound(soundUrl, '', (error) => {
        setIsLoadingSound(false);
        if (!error) {
          soundRef.current.play();
        }
      });
    } else {
      setIsLoadingSound(false);
    }
  }, [soundUrl, stopAndReleaseCurrentSound]);

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

  const showRecordModal = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    setShowRecord(true);
  }, []);

  const closeRecordModal = useCallback(() => {
    setShowRecord(false);
  }, []);

  const selectItem = useCallback((item, index) => {
    currentScore.current = item.score || 1;
    setSelectedIndex(index);
    setBlankText(item.text);
    setSoundUrl(item.audio);
    setReplay(true);
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <LetTalkItem
          items={item}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          isLoadingSound={isLoadingSound}
          showRecordModal={showRecordModal}
        />
      );
    },
    [selectedIndex, selectItem, isLoadingSound, showRecordModal],
  );
  const keyExtractor = useCallback((item, index) => {
    return index;
  }, []);

  const processRecordResult = useCallback(
    (isCorrect) => {
      playAudioAnswer(isCorrect);
      setCorrectModalMode(
        isCorrect ? CorrectModalState.SUCCESS : CorrectModalState.WRONG,
      );
      if (isCorrect) {
        const isCounted =
          correctMapRef.current[selectedIndex] &&
          correctMapRef.current[selectedIndex].length > 0;
        if (!isCounted) {
          dispatch(doneQuestion());
          dispatch(increaseScore(currentScore.current, 1, 0));
          correctMapRef.current = {
            ...correctMapRef.current,
            [selectedIndex]: 'counted',
          };
        }
      }
      setTimeout(() => {
        setCorrectModalMode(CorrectModalState.HIDE);
        if (isCorrect) {
          setShowRecord(false);
        }
      }, 1000);
    },
    [dispatch, selectedIndex],
  );

  const renderRecordModal = useCallback(() => {
    if (showRecord) {
      const text = recordTextRef.current;
      const attachment = {item: {audio: soundUrl}};
      return (
        <View style={styles.modalWrapper}>
          <TouchableWithoutFeedback onPress={closeRecordModal}>
            <View style={styles.backgroundModal} />
          </TouchableWithoutFeedback>
          <View style={styles.bottomCard}>
            <AnimateView
              animation="fadeInUp"
              useNativeDriver={true}
              easing="ease-in-out"
              duration={300}>
              <EmbedAudioRecorder
                word={text}
                attachment={attachment}
                onRecorded={processRecordResult}
                activeScreen={true}
                isWord={true}
              />
            </AnimateView>
          </View>
        </View>
      );
    }
    return null;
  }, [showRecord, processRecordResult, soundUrl, closeRecordModal]);

  const handleContinue = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    currentScore.current = 0;
    setSelectedIndex(-1);
    setBlankText('');
    setSoundUrl('');
    setReplay(false);
    generateNextActivity();
  }, []);

  if (!currentScriptItem) {
    return null;
  }
  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
      <LetTalkBlankText
        text={mainText}
        blankText={blankText}
        updateRecordText={updateRecordText}
      />
      <FlatList
        style={styles.flatList}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContentView}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomWrapper}>
        <Button
          disabled={false}
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={handleContinue}>
          {translate('Tiếp tục')}
        </Button>
      </View>
      {renderRecordModal()}
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginTop: 20,
    marginBottom: 25,
  },
  flatListContentView: {
    paddingBottom: 48,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
  bottomCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 48,

    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 40,

    elevation: 2,
  },
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  backgroundModal: {
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

export default PrimaryLetTalkScreen;
