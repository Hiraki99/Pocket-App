import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import shuffle from 'lodash/shuffle';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Button from '~/BaseComponent/components/base/Button';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import ChooseAnswerForImageItem from '~/BaseComponent/components/elements/script/primary/chooseAnswerForImage/ChooseAnswerForImageItem';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import {
  ContinueBtnState,
  CorrectModalState,
} from '~/features/activity/container/primary/LookAndTraceContainer';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const PrimaryChooseAnswerForImageScreen = () => {
  const dispatch = useDispatch();
  const carouselRef = useRef(null);
  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );
  const items = useMemo(() => {
    if (currentScriptItem && currentScriptItem.items) {
      const list = currentScriptItem.items;
      const listAnswers = [...list];
      let listItems = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        listItems.push({listAnswers: shuffle(listAnswers), ...item});
      }
      return shuffle(listItems);
    }
    return [];
  }, [currentScriptItem]);

  useEffect(() => {
    if (currentScriptItem && currentScriptItem.items) {
      const list = currentScriptItem.items;
      dispatch(setTotalQuestion(list.length));
    }
  }, [currentScriptItem]);

  const handleContinue = useCallback(() => {
    const itemScore = items[currentIndex].score || 1;
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setContinueBtnState(ContinueBtnState.CHECK_ANSWER_DISABLE);
      carouselRef.current.snapToNext();
    } else {
      generateNextActivity();
    }
    dispatch(doneQuestion());
    dispatch(increaseScore(itemScore, 1, 0));
  }, [dispatch, currentIndex, items]);

  const showCorrectModal = useCallback(
    (isCorrect) => {
      setCorrectModalMode(
        isCorrect ? CorrectModalState.SUCCESS : CorrectModalState.WRONG,
      );
      playAudioAnswer(isCorrect);
      setTimeout(() => {
        setCorrectModalMode(CorrectModalState.HIDE);
        if (isCorrect) {
          handleContinue();
        }
      }, 1000);
    },
    [handleContinue],
  );

  const setCanContinue = useCallback(
    (canContinue) => {
      setContinueBtnState(
        canContinue
          ? ContinueBtnState.CHECK_ANSWER_ENABLE
          : ContinueBtnState.CHECK_ANSWER_DISABLE,
      );
      showCorrectModal(canContinue);
    },
    [showCorrectModal],
  );

  const renderContinueButton = useCallback(() => {
    let disable = false;
    let title = translate('Kiểm tra');

    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_DISABLE) {
      disable = true;
      title = translate('Tiếp tục');
    } else if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      disable = false;
      title = translate('Tiếp tục');
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      disable = false;
      title = translate('Tiếp tục');
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

  const renderItem = useCallback(
    ({item}) => {
      return (
        <ChooseAnswerForImageItem item={item} setCanContinue={setCanContinue} />
      );
    },
    [setCanContinue],
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
  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
      <View style={styles.contentView}>
        <View style={styles.carouselWrapper}>
          <Carousel
            ref={carouselRef}
            data={items}
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
        </View>
        {renderContinueButton()}
      </View>
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};
const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
  carouselWrapper: {
    flex: 1,
    marginBottom: 25,
  },
});
export default PrimaryChooseAnswerForImageScreen;
