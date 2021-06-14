import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Button from '~/BaseComponent/components/base/Button';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import LookAndWriteItem from '~/BaseComponent/components/elements/script/primary/lookAndWrite/LookAndWriteItem';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {
  ContinueBtnState,
  CorrectModalState,
  FinishAnswerState,
} from '~/features/activity/container/primary/LookAndTraceContainer';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const LookAndWriteContainer = () => {
  const dispatch = useDispatch();

  const inputModalRef = useRef(null);
  const carouselRef = useRef(null);
  const currentBlankTextRef = useRef(null);

  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );
  const [finishAnswer, setFinishAnswer] = useState(FinishAnswerState.DEFAULT);
  const [index, setIndex] = useState(0);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const answers = useMemo(() => {
    if (currentScriptItem) {
      return currentScriptItem.objects;
    }
    return [];
  }, [currentScriptItem]);

  useEffect(() => {
    if (
      finishAnswer === FinishAnswerState.WRONG ||
      finishAnswer === FinishAnswerState.SUCCESS
    ) {
      const finish = index === answers.length - 1;
      const item = answers[index];
      if (finish) {
      } else {
        setIndex(index + 1);
        setContinueBtnState(ContinueBtnState.CHECK_ANSWER_DISABLE);
        carouselRef.current.snapToNext();
      }
      dispatch(doneQuestion());
      if (finishAnswer === FinishAnswerState.SUCCESS) {
        dispatch(increaseScore(item.score || 1, 1, 0));
      } else {
        dispatch(increaseScore(0, 0, 0));
      }
      if (finish) {
        generateNextActivity();
      }
      setFinishAnswer(FinishAnswerState.DEFAULT);
    }
  }, [dispatch, finishAnswer, answers, index]);

  useEffect(() => {
    if (currentScriptItem) {
      if (currentScriptItem.objects && currentScriptItem.objects.length > 0) {
        dispatch(setTotalQuestion(currentScriptItem.objects.length));
      }
    }
  }, [dispatch, currentScriptItem]);

  const checkAnswer = useCallback(() => {
    if (continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG) {
      setFinishAnswer(FinishAnswerState.WRONG);
    } else {
      if (currentBlankTextRef.current) {
        currentBlankTextRef.current.showCorrectAnswer();
      }
    }
    currentBlankTextRef.current = null;
  }, [continueBtnState]);

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
          onPress={checkAnswer}>
          {title}
        </Button>
      </View>
    );
  }, [continueBtnState, checkAnswer]);

  const showInputModal = useCallback((ref) => {
    if (inputModalRef) {
      currentBlankTextRef.current = ref;
      inputModalRef.current.show('');
    }
  }, []);

  const submitAnswer = useCallback((text) => {
    if (currentBlankTextRef.current) {
      currentBlankTextRef.current.setCurrentAnswer(text);
    }
  }, []);

  const setCanCheckAnswer = useCallback((canContinue) => {
    setContinueBtnState(
      canContinue
        ? ContinueBtnState.CHECK_ANSWER_ENABLE
        : ContinueBtnState.CHECK_ANSWER_DISABLE,
    );
  }, []);

  const showCorrectModal = useCallback((isCorrect) => {
    setCorrectModalMode(
      isCorrect ? CorrectModalState.SUCCESS : CorrectModalState.WRONG,
    );
    playAudioAnswer(isCorrect);
    setTimeout(() => {
      setCorrectModalMode(CorrectModalState.HIDE);
      if (isCorrect) {
        setFinishAnswer(FinishAnswerState.SUCCESS);
      } else {
        setContinueBtnState(ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG);
      }
    }, 1000);
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <LookAndWriteItem
          key={item.key}
          item={item}
          showInputModal={showInputModal}
          setCanCheckAnswer={setCanCheckAnswer}
          showCorrectModal={showCorrectModal}
        />
      );
    },
    [setCanCheckAnswer, showCorrectModal, showInputModal],
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

  if (!currentScriptItem) {
    return null;
  }

  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
      <View style={styles.contentView}>
        <View style={styles.carouselWrapper}>
          <Carousel
            ref={carouselRef}
            data={answers}
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
      <WritingInputExam ref={inputModalRef} onSubmit={submitAnswer} />
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
  topWrapper: {
    flex: 1,
  },
  carouselWrapper: {
    flex: 1,
    marginBottom: 25,
  },
});

export default LookAndWriteContainer;
