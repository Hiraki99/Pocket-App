import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import Button from '~/BaseComponent/components/base/Button';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import LottiePreviewModal from '~/BaseComponent/components/elements/script/primary/lookAndTrace/LottiePreviewModal';
import LookAndTraceItem from '~/BaseComponent/components/elements/script/primary/lookAndTrace/LookAndTraceItem';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {
  setTotalQuestion,
  doneQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export const ContinueBtnState = {
  CHECK_ANSWER_DISABLE: 0,
  CHECK_ANSWER_ENABLE: 1,
  CONTINUE_WITH_ANSWER_WRONG: 2,
  CONTINUE_WITH_NO_QUESTION: 3,
};

export const CorrectModalState = {
  HIDE: 0,
  SUCCESS: 1,
  WRONG: 2,
};

export const FinishAnswerState = {
  DEFAULT: 0,
  SUCCESS: 1,
  WRONG: 2,
};

const LookAndTraceContainer = () => {
  const dispatch = useDispatch();

  const inputModalRef = useRef(null);
  const carouselRef = useRef(null);
  const currentFillInBlankTextRef = useRef(null);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  const answers = useMemo(() => {
    if (currentScriptItem && currentScriptItem.items) {
      let list = [];
      for (let i = 0; i < currentScriptItem.items.length; i++) {
        const item = currentScriptItem.items[i];
        if (item.answers && item.answers.length > 0) {
          for (let j = 0; j < item.answers.length; j++) {
            const answer = item.answers[j];
            list.push({
              hasQuestion: true,
              ...answer,
              lottieUrl: item.file,
              lottiePreviewUrl: item.image,
            });
          }
        } else {
          list.push({
            hasQuestion: false,
            lottieUrl: item.file,
            lottiePreviewUrl: item.image,
          });
        }
      }
      return list;
    }
    return [];
  }, [currentScriptItem]);

  const [index, setIndex] = useState(0);
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );
  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [showLottieModal, setShowLottieModal] = useState(false);
  const [finishAnswer, setFinishAnswer] = useState(FinishAnswerState.DEFAULT);

  const lottieUrl = useMemo(() => {
    if (index < answers.length) {
      const item = answers[index];
      return item.lottieUrl;
    }
    return '';
  }, [index, answers]);

  const lottiePreviewUrl = useMemo(() => {
    if (index < answers.length) {
      const item = answers[index];
      return item.lottiePreviewUrl;
    }
    return '';
  }, [index, answers]);

  useEffect(() => {
    if (answers && answers.length > index) {
      const currentItem = answers[index];
      if (!currentItem.hasQuestion) {
        setContinueBtnState(ContinueBtnState.CONTINUE_WITH_NO_QUESTION);
      }
    }
  }, [index, answers]);

  useEffect(() => {
    if (currentScriptItem) {
      let totalAnswer = 0;
      if (currentScriptItem.items && currentScriptItem.items.length > 0) {
        currentScriptItem.items.forEach((it) => {
          if (it.answers && it.answers.length > 0) {
            const listAnswers = it.answers;
            totalAnswer += listAnswers.length;
          } else {
            totalAnswer += 1;
          }
        });
        dispatch(setTotalQuestion(totalAnswer));
      }
    }
  }, [dispatch, currentScriptItem]);

  useEffect(() => {
    if (
      finishAnswer === FinishAnswerState.WRONG ||
      finishAnswer === FinishAnswerState.SUCCESS
    ) {
      const finishActivity = index === answers.length - 1;
      const score = answers[index].score || 1;
      if (finishActivity) {
        generateNextActivity();
      } else {
        setIndex(index + 1);
        setContinueBtnState(ContinueBtnState.CHECK_ANSWER_DISABLE);
        carouselRef.current.snapToNext();
      }
      dispatch(doneQuestion());
      if (finishAnswer === FinishAnswerState.SUCCESS) {
        dispatch(increaseScore(score, 1, 0));
      } else {
        dispatch(increaseScore(0, 0, 1));
      }
      setFinishAnswer(FinishAnswerState.DEFAULT);
    }
  }, [dispatch, finishAnswer, answers, index, currentScriptItem]);

  const submitAnswer = useCallback((text) => {
    if (currentFillInBlankTextRef.current) {
      currentFillInBlankTextRef.current.setCurrentAnswer(text);
    }
  }, []);

  const checkAnswer = useCallback(() => {
    if (continueBtnState === ContinueBtnState.CONTINUE_WITH_NO_QUESTION) {
      setFinishAnswer(FinishAnswerState.SUCCESS);
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      setFinishAnswer(FinishAnswerState.WRONG);
    } else {
      if (currentFillInBlankTextRef.current) {
        currentFillInBlankTextRef.current.setShowCorrectAnswer(1);
      }
    }
    currentFillInBlankTextRef.current = null;
  }, [continueBtnState]);

  const showInputModal = useCallback((fillInBlankRef) => {
    if (inputModalRef) {
      currentFillInBlankTextRef.current = fillInBlankRef;
      inputModalRef.current.show('');
    }
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

  const openLottieModal = useCallback(() => {
    setShowLottieModal(true);
  }, []);
  const onFinishItem = useCallback((isFinish) => {
    if (isFinish) {
      setContinueBtnState(ContinueBtnState.CHECK_ANSWER_ENABLE);
    }
  }, []);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <LookAndTraceItem
          key={item.key}
          item={item}
          showInputModal={showInputModal}
          showCorrectModal={showCorrectModal}
          onFinishItem={onFinishItem}
          openLottieModal={openLottieModal}
          lottiePreviewUrl={lottiePreviewUrl}
        />
      );
    },
    [showInputModal, showCorrectModal, lottiePreviewUrl, openLottieModal],
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

  const closeLottieModal = useCallback(() => {
    setShowLottieModal(false);
  }, []);

  const renderLottieModal = useCallback(() => {
    if (showLottieModal) {
      return <LottiePreviewModal url={lottieUrl} dismiss={closeLottieModal} />;
    }
    return null;
  }, [showLottieModal, lottieUrl, closeLottieModal]);

  // const renderFocusItem = useCallback(() => {
  //   if (currentFillInBlankTextRef.current) {
  //     return (
  //       <FillInBlankWord
  //         text={currentFillInBlankTextRef.current.getText()}
  //         disable={true}
  //         currentFocusBlank={
  //           currentFillInBlankTextRef.current.currentFocusBlank
  //         }
  //       />
  //     );
  //   }
  //   return null;
  // }, []);

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
      continueBtnState === ContinueBtnState.CONTINUE_WITH_NO_QUESTION
    ) {
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
          onPress={checkAnswer}>
          {title}
        </Button>
      </View>
    );
  }, [continueBtnState, checkAnswer]);

  if (!currentScriptItem) {
    return null;
  }

  return (
    <ScriptWrapper mainBgColor={colors.mainBgColor}>
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
      {renderContinueButton()}
      <WritingInputExam
        ref={inputModalRef}
        // questionComp={renderFocusItem}
        onSubmit={submitAnswer}
      />
      {renderCorrectModal()}
      {renderLottieModal()}
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
});

export default LookAndTraceContainer;
