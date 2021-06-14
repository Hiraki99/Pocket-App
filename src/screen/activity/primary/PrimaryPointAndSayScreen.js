import React, {useCallback, useRef} from 'react';
import {
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import {useSelector, useDispatch} from 'react-redux';
import ModalWrapper from 'react-native-modal-wrapper';
import {useIsFocused} from '@react-navigation/native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import ListenAndPoint from '~/BaseComponent/components/elements/listen/ListenAndPoint';
import {Button, Card, SeparatorVertical, Text} from '~/BaseComponent/index';
import EmbedMultiAudioAnimate from '~/BaseComponent/components/elements/result/EmbedMultiAudioAnimate';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import {currentScriptObjectSelector} from '~/selector/activity';
import {OS, STATE_AUDIO} from '~/constants/os';
import {capitalizeFirstLetter, playAudioAnswer} from '~/utils/utils';
import {generateNextActivity} from '~/utils/script';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const equal = (prev, next) => {
  return !(
    prev.currentTime === next.currentTime ||
    prev.selectedItem === next.selectedItem ||
    prev.autoPlay === next.autoPlay
  );
};

const EmbedMultiAudioAnimateMemo = React.memo(EmbedMultiAudioAnimate, equal);

const PrimaryPointAnSayScreen = () => {
  const animationsRef = useRef([]);
  const audioRef = useRef(null);
  const timeout = useRef();
  const timeInterval = useRef();
  const question = useSelector(currentScriptObjectSelector);
  const conversations = question?.object?.conversations || [];
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [actions, setListActions] = React.useState(conversations);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [loadingDone, setLoadingDone] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [answers, setAnswers] = React.useState({});
  const isFocus = useIsFocused();
  const actionSelected = useCallback((item, index) => {
    if (
      animationsRef &&
      animationsRef.current &&
      animationsRef.current[index]
    ) {
      animationsRef.current[index].show();
    }
  }, []);

  const hideItemSelected = useCallback((index) => {
    if (
      animationsRef &&
      animationsRef.current &&
      animationsRef.current[index]
    ) {
      animationsRef.current[index].hide();
    }
  }, []);

  const playAudioObject = useCallback((item) => {
    if (audioRef && audioRef.current) {
      audioRef.current.setCurrentTime(item.start);
    }
  }, []);

  const selectedItemFlatList = useCallback(
    (item, index) => {
      setAutoPlay(false);
      audioRef.current.pause();
      clearTimeout(timeout.current);
      if (selectedItem) {
        hideItemSelected(selectedItem.index);
      }
      setTimeout(() => {
        playAudioObject(item);
      }, 100);
      setTimeout(() => {
        actionSelected(item, index);
      }, 500);
      setListActions(conversations.slice(item.index + 1));
    },
    [
      playAudioObject,
      actionSelected,
      conversations,
      selectedItem,
      hideItemSelected,
    ],
  );

  React.useEffect(() => {
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
      RNFS.unlink(
        `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
      ).then(() => {});
    };
  }, []);

  React.useEffect(() => {
    dispatch(setTotalQuestion(conversations.length));
  }, [dispatch]);

  React.useEffect(() => {
    if (loadingDone) {
      if (audioRef && audioRef.current) {
        timeInterval.current = setInterval(() => {
          if (audioRef && audioRef.current) {
            audioRef.current.getCurrentTime((time) => {
              setCurrentTime(time);
              if (
                audioRef.current &&
                selectedItem &&
                !autoPlay &&
                time >= selectedItem.end
              ) {
                audioRef.current.pause();
              }
            });
          }
        }, 60);
      } else {
        if (timeInterval.current) {
          clearInterval(timeInterval.current);
        }
      }
    }

    return () => {
      if (timeInterval.current) {
        clearInterval(timeInterval.current);
      }
    };
  }, [audioRef, loadingDone, selectedItem, autoPlay]);

  React.useEffect(() => {
    if (
      currentTime > 0 &&
      autoPlay &&
      actions[0] &&
      actions[0].start <= currentTime &&
      (!selectedItem || (selectedItem && selectedItem.id !== actions[0].id))
    ) {
      actionSelected(actions[0], actions[0].index);
      const actionsUpdate = conversations.slice(actions[0].index + 1);
      setListActions(() => actionsUpdate);
      timeout.current = setTimeout(() => {
        if (
          animationsRef &&
          typeof actions[0].index === 'number' &&
          actions[0].index >= 0 &&
          animationsRef.current[actions[0].index]
        ) {
          animationsRef.current[actions[0].index].hide();
        }
      }, (((actions[0].end - actions[0].start) * 2) / 3) * 1000);
      return;
    }

    if (
      audioRef &&
      audioRef.current &&
      audioRef.current.getPlayState() === STATE_AUDIO.STOP
    ) {
      if (selectedItem) {
        hideItemSelected(selectedItem.index);
      }
      setListActions(conversations);
      setSelectedItem(null);
      setAutoPlay(false);
    }
  }, [
    autoPlay,
    currentTime,
    actionSelected,
    actions,
    conversations,
    selectedItem,
    hideItemSelected,
  ]);

  const renderItem = useCallback(
    ({item, index}) => {
      const isSelected = selectedItem && selectedItem.id === item.id;
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            selectedItemFlatList(item, index);
          }}>
          <View marginHorizontal={24}>
            <Card
              style={isSelected ? styles.selected : {}}
              backgroundColor={colors.mainBgColor}
              borderRadius={20}>
              <Text
                fontSize={19}
                lineHeight={24}
                bold
                primary={isSelected}
                center
                paddingVertical={10}>
                {capitalizeFirstLetter(item.text)}
              </Text>
            </Card>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedItem, selectedItemFlatList],
  );

  const onEffectPlay = useCallback(
    (item) => {
      clearTimeout(timeout.current);
      setAutoPlay(false);
      audioRef.current.pause();
      playAudioObject(item);
      setListActions(conversations.slice(item.index + 1));
    },
    [playAudioObject, conversations],
  );

  const onRecord = useCallback(
    (item) => {
      clearTimeout(timeout.current);
      setAutoPlay(false);
      audioRef.current.pause();
      actionSelected(item);
      setListActions(conversations.slice(item.index + 1));
      setShowModal(true);
    },
    [actionSelected, conversations],
  );

  const onRecordedDone = useCallback(
    (isCorrect) => {
      setShowResult(true);
      playAudioAnswer(isCorrect);
      if (!answers[selectedItem.id]) {
        dispatch(doneQuestion());
        if (isCorrect) {
          dispatch(increaseScore(1, 1, 0));
        } else {
          dispatch(increaseScore(0, 0, 1));
        }
      } else {
        if (!isCorrect && answers[selectedItem.id].isBonus) {
          dispatch(increaseScore(0, 0, 1));
        }
        if (isCorrect && !answers[selectedItem.id].isBonus) {
          dispatch(increaseScore(1, 1, 0));
        }
      }

      setAnswers((old) => {
        return {
          ...old,
          [selectedItem.id]: {
            isBonus: isCorrect,
          },
        };
      });
      setTimeout(() => {
        setShowResult(false);
        if (isCorrect) {
          setShowModal(false);
        }
      }, 2000);
    },
    [dispatch, answers, selectedItem],
  );

  const renderResult = useCallback(() => {
    if (
      !showResult ||
      (selectedItem && !answers[selectedItem?.id]) ||
      !selectedItem
    ) {
      return null;
    }

    return <AnswerFlashCard isCorrect={answers[selectedItem?.id]?.isBonus} />;
  }, [showResult, answers, selectedItem]);

  if (!isFocus) {
    return null;
  }
  return (
    <ScriptWrapper backgroundColor={colors.white}>
      <EmbedMultiAudioAnimateMemo
        ref={audioRef}
        data={question.object}
        currentTime={currentTime}
        selectedItem={selectedItem}
        hideItemSelected={hideItemSelected}
        setAutoPlay={setAutoPlay}
        loadingDone={loadingDone}
        isUser
      />
      <ImageBackground
        source={{uri: question.backgroundUrl}}
        onLoadEnd={() => {
          setLoadingDone(true);
        }}
        onLoadStart={() => {
          setLoadingDone(false);
        }}
        style={styles.background}>
        {(question?.object?.conversations || []).map((item, index) => {
          return (
            <ListenAndPoint
              ref={(el) => (animationsRef.current[index] = el)}
              key={item.id}
              data={item}
              answer={selectedItem}
              setAnswer={setSelectedItem}
              setAutoPlay={setAutoPlay}
              playAudioObject={playAudioObject}
              enableRecord
              onRecord={onRecord}
              onEffectPlay={onEffectPlay}
            />
          );
        })}
      </ImageBackground>
      <FlatList
        data={question?.object?.conversations || []}
        keyExtractor={(item) => `question_${item.id}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorVertical height={4} />}
        style={{paddingTop: 12, flexGrow: 0}}
      />
      <View paddingHorizontal={24} paddingVertical={24}>
        <SeparatorVertical sm />
        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={() => {
            generateNextActivity();
          }}>
          {`${translate('Tiếp tục')}`}
        </Button>
      </View>
      <ModalWrapper
        containerStyle={styles.modalContainer}
        onRequestClose={() => {
          setShowModal(false);
          setShowResult(false);
        }}
        shouldAnimateOnRequestClose={true}
        style={styles.modalWrapper}
        visible={showModal}>
        {selectedItem && (
          <EmbedAudioRecorder
            word={selectedItem.text}
            // attachment={{item: {audio: selectedItem.audio}}}
            attachment={null}
            activeScreen={true}
            onRecorded={onRecordedDone}
          />
        )}
        {renderResult()}
      </ModalWrapper>
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  background: {
    width: OS.WIDTH,
    height: (OS.WIDTH * 1080) / 1440,
    position: 'relative',
    zIndex: 1,
  },
  selected: {borderColor: colors.primary, borderWidth: 1},
  modalWrapper: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 48,
  },
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
export default PrimaryPointAnSayScreen;
