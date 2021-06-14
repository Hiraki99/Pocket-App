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
import AutoResizeImage from '~/BaseComponent/components/elements/script/primary/lookAndWrite/AutoResizeImage';
import Button from '~/BaseComponent/components/base/Button';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import ListenAndRepeatItem from '~/BaseComponent/components/elements/script/primary/listenAndRepeat/ListenAndRepeatItem';
import {generateNextActivity} from '~/utils/script';
import {CorrectModalState} from '~/features/activity/container/primary/LookAndTraceContainer';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const PrimaryListenAndRepeatScreen = () => {
  const dispatch = useDispatch();
  const soundRef = useRef(null);
  const correctMapRef = useRef({});

  const [listItems, setListItems] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    if (selectedIndex >= 0 && listItems.length > 0) {
      setIsLoadingSound(true);
      const currentItem = listItems[selectedIndex];
      if (currentItem.audio && currentItem.audio.length > 0) {
        stopAndReleaseCurrentSound();
        soundRef.current = new Sound(currentItem.audio, '', (error) => {
          setIsLoadingSound(false);
          if (!error) {
            soundRef.current.play();
          }
        });
      } else {
        setIsLoadingSound(false);
      }
    }
  }, [selectedIndex, listItems, stopAndReleaseCurrentSound]);

  useEffect(() => {
    if (
      currentScriptItem &&
      currentScriptItem.texts &&
      currentScriptItem.texts.length > 0
    ) {
      setImageUrl(currentScriptItem.image);
      setListItems(currentScriptItem.texts);
      dispatch(setTotalQuestion(currentScriptItem.texts.length));
    }
  }, [currentScriptItem, dispatch]);

  const showRecordModal = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    setShowRecord(true);
  }, []);

  const closeRecordModal = useCallback(() => {
    setShowRecord(false);
  }, []);

  const playAudio = useCallback((index) => {
    setSelectedIndex(index);
    setReplay(true);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ListenAndRepeatItem
          item={item}
          index={index}
          showRecordModal={showRecordModal}
          playAudio={playAudio}
          isSelected={index === selectedIndex}
          isLoadingSound={isLoadingSound}
        />
      );
    },
    [showRecordModal, selectedIndex, playAudio, isLoadingSound],
  );

  const handleContinue = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    generateNextActivity();
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
          dispatch(increaseScore(listItems[selectedIndex].score || 1, 1, 0));
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
    [dispatch, selectedIndex, listItems],
  );

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

  const renderRecordModal = useCallback(() => {
    if (showRecord) {
      const currentItem = listItems[selectedIndex];
      const text = currentItem.text;
      const attachment = {item: {audio: currentItem.audio}};
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
  }, [
    showRecord,
    processRecordResult,
    listItems,
    selectedIndex,
    closeRecordModal,
  ]);

  const renderImage = useCallback(() => {
    return (
      <View paddingVertical={24} backgroundColor={'rgb(243,245,249)'}>
        <AutoResizeImage url={imageUrl} imageWidth={OS.WIDTH - 48} />
      </View>
    );
  }, [imageUrl]);

  if (listItems.length === 0 || !currentScriptItem) {
    return null;
  }
  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
      <View style={styles.contentView}>
        <FlatList
          style={styles.flatList}
          data={listItems || []}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderImage}
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
      </View>
      {renderRecordModal()}
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  flatList: {
    backgroundColor: colors.white,
    marginBottom: 20,
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

export default PrimaryListenAndRepeatScreen;
