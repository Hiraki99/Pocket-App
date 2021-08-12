import React, {useCallback, useRef} from 'react';
import {
  ImageBackground,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import ScriptWrapper from 'BaseComponent/components/elements/script/ScriptWrapper';
import ListenAndPoint from 'BaseComponent/components/elements/listen/ListenAndPoint';
import {Button, Card, SeparatorVertical, Text} from 'BaseComponent/index';
import EmbedMultiAudioAnimate from 'BaseComponent/components/elements/result/EmbedMultiAudioAnimate';
import {capitalizeFirstLetter} from '~/utils/utils';
import {OS, STATE_AUDIO} from '~/constants/os';
import {currentScriptObjectSelector} from '~/selector/activity';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const equal = (prev, next) => {
  return !(
    prev.currentTime === next.currentTime ||
    prev.selectedItem === next.selectedItem
  );
};

const EmbedMultiAudioAnimateMemo = React.memo(EmbedMultiAudioAnimate, equal);

const PrimaryListenAndPointScreen = () => {
  const isFocus = useIsFocused();
  const animationsRef = useRef([]);
  const audioRef = useRef(null);
  const timeout = useRef();
  const question = useSelector(currentScriptObjectSelector);
  const conversations = question?.object?.conversations || [];
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [indexSelected, setIndexSelected] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [actions, setListActions] = React.useState(conversations);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [loadingDone, setLoadingDone] = React.useState(false);
  const [playDone, setPlayDone] = React.useState(false);

  const actionSelected = useCallback((item, index) => {
    if (
      animationsRef &&
      animationsRef.current &&
      animationsRef.current[index]
    ) {
      animationsRef.current[index].show();
      setIndexSelected(index);
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
      hideItemSelected(indexSelected);
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
      indexSelected,
      hideItemSelected,
    ],
  );

  React.useEffect(() => {
    dispatch(doneQuestion());
    dispatch(increaseScore(1, 1, 0));
  }, [dispatch]);

  React.useEffect(() => {
    let interval;
    if (loadingDone) {
      if (audioRef && audioRef.current) {
        interval = setInterval(() => {
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
        if (interval) {
          clearInterval(interval);
        }
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
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
      const actionsUpdate = conversations.slice(actions[0].index + 1);
      setListActions(() => actionsUpdate);
      actionSelected(actions[0], actions[0].index);
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
      hideItemSelected(indexSelected);
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
    indexSelected,
    hideItemSelected,
  ]);

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
              transparent
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

  const renderSeparator = useCallback(() => {
    return <SeparatorVertical height={4} />;
  }, []);

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
        setPlayDone={() => setPlayDone(true)}
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
              onEffectPlay={onEffectPlay}
            />
          );
        })}
      </ImageBackground>
      <FlatList
        data={question?.object?.conversations || []}
        keyExtractor={(item) => `question_${item.id}`}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        style={{paddingTop: 12, flexGrow: 0}}
        showsVerticalScrollIndicator={false}
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
          disabled={!playDone}
          onPress={() => {
            generateNextActivity();
          }}>
          {translate('Tiếp tục')}
        </Button>
      </View>
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
});
export default PrimaryListenAndPointScreen;
