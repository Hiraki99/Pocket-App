import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, FlatList, Alert, Animated} from 'react-native';
import isEqual from 'lodash/isEqual';

import {
  Button,
  FlexContainer,
  NoFlexContainer,
  Text,
  SeparatorVertical,
  ThumbnailImage,
} from '~/BaseComponent';
import {HeaderQuestion} from '~/BaseComponent/components/elements/exam/HeaderQuestion';
import {QuestionImageExam} from '~/BaseComponent/components/elements/exam/QuestionImageExam';
import {QuestionChoice} from '~/BaseComponent/components/elements/exam/QuestionChoice';
import QuestionSelectParagraph from '~/BaseComponent/components/elements/exam/QuestionSelectParagraph';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import QuestionWithOrder from '~/BaseComponent/components/elements/exam/QuestionWithOrder';
import QuestionFillInBlank from '~/BaseComponent/components/elements/exam/QuestionFillInBlank';
import QuestionRewriteBySuggest from '~/BaseComponent/components/elements/exam/QuestionRewriteBySuggest';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {
  resetPart,
  selectPart,
  setCurrentSection,
  updateStatusPart,
  updateStatusQuestion,
} from '~/features/exam/ExamAction';
import {STATUS_PART, STATUS_QUESTION} from '~/constants/testData';
import timer from '~/utils/timer';
import navigator from '~/navigation/customNavigator';
import {
  formatObjectCompareAnswerFillInBlank,
  compareStringAcronym,
  normalizeText,
} from '~/utils/utils';
import {EXAM_TYPE} from '~/constants/exam';
import getAllInfoExamSelector from '~/selector/examSelector';
import {translate} from '~/utils/multilanguage';

const PartExamContainer = (props) => {
  const dispatch = useDispatch();
  const flatlistRef = React.useRef(null);
  const [isContentSizeChange, setIsContentSizeChange] = React.useState(true);

  const {
    currentSection,
    showResult,
    parts,
    sections,
    currentPart,
    questions,
    introExam,
  } = getAllInfoExamSelector();

  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(0);
  const [listQuestionCurrent, setListQuestionCurrent] = useState([]);
  const indexOfSection = sections
    .map((item) => item._id)
    .indexOf(currentSection._id);
  const activeSectionIndex = indexOfSection > 0 ? indexOfSection : 0;
  const activePartIndex = currentSection._id
    ? currentSection.partIds.indexOf(currentPart._id) > 0
      ? currentSection.partIds.indexOf(currentPart._id)
      : 0
    : 0;

  const isEndPartInSection =
    activePartIndex === currentSection.partIds.length - 1;
  // end Exam
  const isEndExam = activeSectionIndex === sections.length - 1;

  useEffect(() => {
    let res = [];

    (currentPart.questionIds || []).forEach((item) => {
      const questionItem = questions[item];
      if (
        questionItem &&
        questionItem.answers &&
        questionItem.answers.length > 0
      ) {
        questionItem.answers.forEach((it, index) => {
          questionItem.answers[index] = {
            ...it,
            type: questionItem.type,
            parentId: questionItem._id,
          };
        });
      }
      res.push(questionItem);
    });
    setListQuestionCurrent(res);
  }, [currentPart, questions]);

  useEffect(() => {
    // part1
    if (props.showHeader) {
      timer.getTimerCurrentExam((t) => {
        if (t > introExam.time * 60 && typeof introExam.time === 'number') {
          Alert.alert(
            translate('Thông báo'),
            translate('Thời gian kiểm tra đã kết thúc'),
            [{text: translate('Đồng ý')}],
          );
          timer.clearIntervalTimingGlobal();
          navigator.navigate('ExamResult');
        } else {
          setTime(t);
        }
      });
    }

    return function () {
      if (isEndExam && isEndPartInSection) {
        timer.clearIntervalTimingGlobal();
      }
    };
  }, [isEndExam, isEndPartInSection, props.showHeader, introExam.time]);

  const startPart = () => {
    dispatch(
      updateStatusPart({
        ...currentPart,
        status: STATUS_PART.DONE,
      }),
    );

    if (isEndPartInSection) {
      if (isEndExam) {
        navigator.navigate('ExamResult');
        return;
      }
      dispatch(setCurrentSection(sections[activeSectionIndex + 1]));
      dispatch(resetPart());
      navigator.navigate('SectionExam');
      return;
    }
    if (parts[currentSection.partIds[activePartIndex + 1]]) {
      dispatch(
        selectPart(
          {
            ...parts[currentSection.partIds[activePartIndex + 1]],
            status: STATUS_PART.ACTIVE,
          },
          !showResult,
        ),
      );
    }
    navigator.navigate('SectionExam');
  };

  useEffect(() => {
    if (flatlistRef && flatlistRef.current) {
      if (!isContentSizeChange) {
        onContentSizeChange();
      }
    }
    return () => {
      setIsContentSizeChange(true);
    };
  }, [currentPart, isContentSizeChange, onContentSizeChange]);

  const onContentSizeChange = useCallback(() => {
    setIsContentSizeChange(false);
    if (currentPart.indexJump || typeof currentPart.indexJump === 'number') {
      setTimeout(() => {
        if (flatlistRef && flatlistRef.current) {
          flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPart.indexJump,
          });
        }
      }, 100);
    }
  }, [currentPart]);

  const chooseAnswerForQuestionChoice = useCallback(
    (item, question) => {
      const listIdsAnswerSuccessQuestion = (question.answers || [])
        .filter((i) => i.isAnswer)
        .map((m) => m.key);

      const listIdsUserSelected =
        question.type !== EXAM_TYPE.multi_choice_inline
          ? //single choice
            [item.key]
          : //    multi choice
          (question.idSelected || []).includes(item.key)
          ? (question.idSelected || []).filter((fi) => fi !== item.key)
          : [...(question.idSelected || []), item.key];

      const statusAnswerQuestion = isEqual(
        listIdsAnswerSuccessQuestion,
        listIdsUserSelected,
      );

      dispatch(
        updateStatusQuestion({
          [question._id]: {
            ...question,
            idSelected: listIdsUserSelected,
            statusAnswerQuestion,
            status: STATUS_QUESTION.CHECKED,
          },
        }),
      );
    },
    [dispatch],
  );

  const onSelectParagraph = useCallback(
    (item, question, answerSelected) => {
      dispatch(
        updateStatusQuestion({
          [question.key]: {
            ...question,
            answerSelectedKey: answerSelected.key,
            statusAnswerQuestion: answerSelected.isAnswer,
            status: STATUS_QUESTION.CHECKED,
          },
        }),
      );
    },
    [dispatch],
  );

  const onAnswerRewriteBySuggest = useCallback(
    (question, text) => {
      const statusAnswerQuestion = compareStringAcronym(text, question.answer);

      dispatch(
        updateStatusQuestion({
          [question._id]: {
            ...question,
            userAnswerText: text,
            statusAnswerQuestion,
            status: STATUS_QUESTION.CHECKED,
          },
        }),
      );
    },
    [dispatch],
  );

  const onAnswerQuestionWithOrder = useCallback(
    (question, selectedOrder) => {
      const text = selectedOrder.map((item) => item.text).join(' ');
      const statusAnswerQuestion = compareStringAcronym(
        text,
        question.correctAnswer,
      );

      dispatch(
        updateStatusQuestion({
          [question._id]: {
            ...question,
            userOrderAnswer: selectedOrder,
            userTextAnswer: text,
            statusAnswerQuestion,
            status: STATUS_QUESTION.CHECKED,
          },
        }),
      );
    },
    [dispatch],
  );

  const saveAnswerQuestionFillInBlank = useCallback(
    (question, answer) => {
      let statusAnswerQuestion = false;
      if (question.type === EXAM_TYPE.fill_in_blank_sentence) {
        statusAnswerQuestion = question.correctAnswers
          .map((item) => normalizeText(item))
          .includes(normalizeText(answer.text));
      }
      if (question.type === EXAM_TYPE.fill_in_blank) {
        statusAnswerQuestion = isEqual(
          formatObjectCompareAnswerFillInBlank(question.correctAnswers),
          formatObjectCompareAnswerFillInBlank({
            ...question.userAnswers,
            [answer.index]: answer,
          }),
        );
      }

      dispatch(
        updateStatusQuestion({
          [question._id]: {
            ...question,
            statusAnswerQuestion,
            userAnswers: question.userAnswers
              ? {
                  ...question.userAnswers,
                  [answer.index]: answer,
                }
              : {[answer.index]: answer},
            status: STATUS_QUESTION.CHECKED,
          },
        }),
      );
    },
    [dispatch],
  );

  const renderAnswer = useCallback(
    ({item, index}) => {
      const question = questions[item.parentId] || {};
      if (item.type !== 'single_choice_picture') {
        return (
          <QuestionChoice
            item={item}
            question={question}
            action={chooseAnswerForQuestionChoice}
            idSelected={question.idSelected}
            showResult={showResult}
            index={index}
          />
        );
      }

      return (
        <QuestionImageExam
          item={item}
          index={index}
          question={question}
          action={chooseAnswerForQuestionChoice}
          idSelected={question.idSelected}
          showResult={showResult}
        />
      );
    },
    [questions, chooseAnswerForQuestionChoice, showResult],
  );

  const renderItem = useCallback(
    ({item}) => {
      if (
        item.type === EXAM_TYPE.select_answer_paragraph ||
        item.type === EXAM_TYPE.select_answer_sentence
      ) {
        return (
          <QuestionSelectParagraph
            data={item}
            onPress={onSelectParagraph}
            showResult={showResult}
            isSentence={item.type === EXAM_TYPE.select_answer_sentence}
            isParagraph={item.type === EXAM_TYPE.select_answer_paragraph}
          />
        );
      }

      if (item.type === EXAM_TYPE.question_with_order) {
        return (
          <QuestionWithOrder
            data={item}
            action={onAnswerQuestionWithOrder}
            showResult={showResult}
          />
        );
      }
      if (
        item.type === EXAM_TYPE.fill_in_blank_sentence ||
        item.type === EXAM_TYPE.fill_in_blank
      ) {
        return (
          <QuestionFillInBlank
            data={item}
            action={saveAnswerQuestionFillInBlank}
            isSentence={item.type === EXAM_TYPE.fill_in_blank_sentence}
            showResult={showResult}
          />
        );
      }

      if (item.type === EXAM_TYPE.rewrite_base_suggested) {
        return (
          <QuestionRewriteBySuggest
            data={item}
            action={onAnswerRewriteBySuggest}
            showResult={showResult}
          />
        );
      }
      return (
        <NoFlexContainer paddingHorizontal={16}>
          <HeaderQuestion
            indexQuestion={item.indexQuestion}
            desc={item.question}
          />
          <FlatList
            data={item.answers}
            numColumns={item.type === 'single_choice_picture' ? 2 : 1}
            renderItem={renderAnswer}
            keyExtractor={(it) => `${it.key}`}
            style={{paddingLeft: 20, paddingTop: 16}}
            ItemSeparatorComponent={() => <SeparatorVertical md />}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          />
        </NoFlexContainer>
      );
    },
    [
      renderAnswer,
      showResult,
      onAnswerQuestionWithOrder,
      onAnswerRewriteBySuggest,
      onSelectParagraph,
      saveAnswerQuestionFillInBlank,
    ],
  );

  const renderHeader = useCallback(() => {
    return (
      <>
        {currentPart.attachment && currentPart.attachment.type === 'audio' && (
          <EmbedAudio
            isUser={true}
            audio={currentPart.attachment.path}
            isSquare={true}
            showTime={true}
          />
        )}
        {currentPart.attachment && currentPart.attachment.type === 'image' && (
          <ThumbnailImage
            source={{uri: currentPart.attachment.path}}
            attachmentWidth={OS.WIDTH}
            showButton={false}
          />
        )}
        <NoFlexContainer paddingVertical={32} paddingHorizontal={16}>
          <Text h5 color={colors.primary} bold uppercase>
            {translate('Part %s', {
              s1: `${activePartIndex + 1}/${currentSection.partIds.length}`,
            })}
          </Text>
          <Text h5 color={colors.helpText} paddingVertical={8}>
            {currentPart.description}
          </Text>
        </NoFlexContainer>
      </>
    );
  }, [currentPart, activePartIndex, currentSection]);

  const renderFooter = useCallback(() => {
    return (
      <View paddingVertical={OS.hasNotch ? 48 : 24} paddingHorizontal={16}>
        <Button
          primary
          rounded
          large
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={startPart}>
          {isEndPartInSection && isEndExam
            ? translate('Kết thúc')
            : translate('OK')}
        </Button>
      </View>
    );
  }, [isEndPartInSection, isEndExam, startPart]);
  return (
    <FlexContainer>
      <Animated.FlatList
        ref={flatlistRef}
        data={listQuestionCurrent || []}
        keyExtractor={(item) => item._id}
        extraData={currentPart}
        renderItem={renderItem}
        keyboardShouldPersistTaps={'always'}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <SeparatorVertical lg />}
        ListFooterComponent={renderFooter}
        onContentSizeChange={onContentSizeChange}
      />
    </FlexContainer>
  );
};

PartExamContainer.propTypes = {};
PartExamContainer.defaultProps = {};

export default PartExamContainer;
