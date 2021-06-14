import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import Button from '~/BaseComponent/components/base/Button';
import {ContinueBtnState} from '~/features/activity/container/primary/LookAndTraceContainer';
import {generateNextActivity} from '~/utils/script';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {makeid, playAudioAnswer} from '~/utils/utils';
import LookListenRepeatItem from '~/BaseComponent/components/elements/script/primary/lookListenRepeat/LookListenRepeatItem';
import {translate} from '~/utils/multilanguage';

const PrimaryLookListenAndRepeatSentenceScreen = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const stopAllSoundRef = useRef({});

  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const getArrFromText = useCallback((text, main = false) => {
    const characterList = text.split('');
    let arr = [];
    characterList.forEach((character) => {
      arr.push({
        key: makeid(32),
        text: character,
        isSpace: character === ' ',
        main,
      });
    });
    return arr;
  }, []);

  const calculateItem = useCallback(
    (itm) => {
      const res = [];
      const data = itm.object;
      const conversations = data.conversations;

      if (conversations && conversations.length > 0) {
        conversations.forEach((it) => {
          let listWords = [];
          const rawContent = it.content.trim();
          const jump =
            (parseFloat(it.end) - parseFloat(it.start)) / rawContent.length;
          let arr = [...getArrFromText(it.content)];
          let tempList = [];
          let isHightLight = false;
          arr.map((arrItem, index) => {
            if (arrItem.text === '<') {
              isHightLight = true;
            } else if (arrItem.text === '>') {
              isHightLight = false;
            }
            if (arrItem.isSpace) {
              listWords.push(tempList);
              tempList = [];
            } else {
              tempList.push({
                ...arrItem,
                start: parseFloat(it.start) + jump * index,
                end: parseFloat(it.start) + jump * (index + 1),
                main: isHightLight,
              });
              if (index === arr.length - 1) {
                listWords.push(tempList);
                tempList = [];
              }
            }
          });
          res.push({
            ...it,
            detail: listWords,
            start: parseFloat(it.start),
            end: parseFloat(it.end),
          });
        });
        return res;
      }
      return [];
    },
    [getArrFromText],
  );

  const listDatas = useMemo(() => {
    let listItems = [];
    if (currentScriptItem && currentScriptItem.data) {
      currentScriptItem.data.map((it) => {
        listItems.push({...it, karaokeItems: calculateItem(it)});
      });
      return listItems;
    }
    return [];
  }, [currentScriptItem, calculateItem]);

  useEffect(() => {
    if (currentScriptItem) {
      dispatch(setTotalQuestion(currentScriptItem.data.length));
    }
  }, [dispatch, currentScriptItem]);

  const setCanContinue = useCallback(() => {
    setContinueBtnState(ContinueBtnState.CHECK_ANSWER_ENABLE);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <LookListenRepeatItem
          item={item}
          setCanContinue={setCanContinue}
          stopAllSoundRef={stopAllSoundRef}
          pageIndex={currentIndex}
          index={index}
        />
      );
    },
    [setCanContinue, currentIndex],
  );

  const handleContinue = useCallback(() => {
    Object.values(stopAllSoundRef.current).map((it) => {
      it.pauseAll();
    });
    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      const score = listDatas[currentIndex].score || 1;
      dispatch(doneQuestion());
      dispatch(increaseScore(score, 1, 0));
      playAudioAnswer(true);

      if (currentIndex < listDatas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setContinueBtnState(ContinueBtnState.CHECK_ANSWER_DISABLE);
        carouselRef.current.snapToNext();
      } else {
        generateNextActivity();
      }
    }
  }, [dispatch, continueBtnState, currentIndex, listDatas]);

  const renderContinueButton = useCallback(() => {
    let disable = false;
    let title = `${translate('Tiếp tục')}`;

    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_DISABLE) {
      disable = true;
      title = `${translate('Tiếp tục')}`;
    } else if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      disable = false;
      title = `${translate('Tiếp tục')}`;
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
          onPress={handleContinue}>
          {title}
        </Button>
      </View>
    );
  }, [continueBtnState, handleContinue]);
  if (!currentScriptItem) {
    return null;
  }
  return (
    <ScriptWrapper mainBgColor={colors.white}>
      <Carousel
        ref={carouselRef}
        style={styles.carousel}
        data={listDatas}
        renderItem={renderItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH}
        firstItem={0}
        inactiveSlideScale={1.0}
        inactiveSlideOpacity={1.0}
        overScrollMode={'never'}
        scrollEnabled={false}
        maxToRenderPerBatch={1}
      />
      {renderContinueButton()}
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    marginBottom: 20,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
});

export default PrimaryLookListenAndRepeatSentenceScreen;
