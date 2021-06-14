import React, {useEffect, useCallback, useState, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {View, FlatList, Alert} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  FlexContainer,
  NoFlexContainer,
  Text,
  CommonHeader,
} from '~/BaseComponent';
import {HeaderQuestion} from '~/BaseComponent/components/elements/exam/HeaderQuestion';
import {QuestionImageExam} from '~/BaseComponent/components/elements/exam/QuestionImageExam';
import {QuestionChoice} from '~/BaseComponent/components/elements/exam/QuestionChoice';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {
  increaseScoreExam,
  resetExam,
  resetPart,
  selectPart,
  setCurrentSection,
  updateStatusPart,
  updateStatusQuestion,
} from '~/features/exam/ExamAction';
import {STATUS_PART, STATUS_QUESTION} from '~/constants/testData';
import timer from '~/utils/timer';
import navigator from '~/navigation/customNavigator';
import {formatsMinuteOptions, makeid} from '~/utils/utils';
import getAllInfoExamSelector from '~/selector/examSelector';
import {translate} from '~/utils/multilanguage';

const PartSectionListExamScreen = (props) => {
  const [time, setTime] = useState(0);
  const [listIdSelected, setListIdSelected] = useState({});

  const dispatch = useDispatch();

  const {
    currentSection,
    showResult,
    parts,
    sections,
    currentPart,
    questions,
    introExam,
  } = getAllInfoExamSelector();

  const listQuestionCurrent =
    (currentPart.questionIds || []).map((item) => questions[item]) || [];

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
    // part1
    if (props.showHeader) {
      timer.getTimerCurrentExam((t) => {
        if (t > introExam.time * 60 && typeof introExam.time === 'number') {
          Alert.alert(
            `${translate('Thông báo')}`,
            `${translate('Thời gian kiểm tra đã kết thúc')}`,
            [{text: `${translate('Đồng ý')}`}],
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
  }, [isEndPartInSection, isEndExam, props.showHeader, introExam]);

  const startPart = () => {
    dispatch(
      updateStatusPart({
        ...currentPart,
        status: STATUS_PART.DONE,
      }),
    );
    if (!showResult) {
      dispatch(increaseScoreExam(numberScoreSuccess));
    }

    if (isEndPartInSection) {
      if (isEndExam) {
        navigator.navigate('ExamResult');
        return;
      }
      dispatch(setCurrentSection(sections[activeSectionIndex + 1]));
      dispatch(resetPart());
      navigator.navigate('Section');
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
    navigator.navigate('Section');
  };

  const renderHeader = useMemo(() => {
    return (
      <>
        {currentPart.audio && (
          <EmbedAudio
            isUser={true}
            audio={currentPart.audio}
            isSquare={true}
            showTime={true}
          />
        )}
        <NoFlexContainer paddingVertical={32} paddingHorizontal={16}>
          <Text h5 color={colors.primary} bold uppercase>
            {/* {`Part ${activePartIndex + 1}/${currentSection.partIds.length}`} */}
            {`${translate('Part %s/%s', {
              s1: `${activePartIndex + 1}`,
              s2: `${currentSection.partIds.length}`,
            })}`}
          </Text>
          <Text h5 color={colors.helpText} paddingVertical={8}>
            {currentPart.desc}
          </Text>
        </NoFlexContainer>
      </>
    );
  }, [currentPart]);

  const chooseAnswer = (item, question) => {
    // add new question in list
    setListIdSelected({
      ...listIdSelected,
      [question.id]: {
        answerId: item.id,
        isAnswer: item.isAnswer,
      },
    });
    dispatch(
      updateStatusQuestion({
        [question.id]: {
          ...question,
          idSelected: item.id,
          status: STATUS_QUESTION.CHECKED,
        },
      }),
    );
  };

  const isAnswerAll =
    Object.keys(listIdSelected).length === listQuestionCurrent.length;
  let numberScoreSuccess = 0;

  const onClose = () => {
    Alert.alert(
      `${translate('Thông báo')}`,
      `${translate('Bạn có chắc muốn kết thúc bài kiểm tra ?')}`,
      [
        {
          text: `${translate('Đồng ý')}`,
          onPress: () => {
            dispatch(resetExam());
            navigator.navigate('MainStack', {
              screen: 'BottomTabExam',
            });
          },
        },
        {text: `${translate('Huỷ')}`},
      ],
    );
  };

  for (let i in listIdSelected) {
    if (listIdSelected[i].isAnswer) {
      numberScoreSuccess += 1;
    }
  }

  const renderAnswer = useCallback(
    ({item}, question) => {
      if (item.image) {
        return (
          <QuestionImageExam
            item={item}
            question={question}
            action={chooseAnswer}
            idSelected={question.idSelected}
            showResult={showResult}
          />
        );
      }
      return (
        <QuestionChoice
          item={item}
          question={question}
          action={chooseAnswer}
          idSelected={question.idSelected}
          showResult={showResult}
        />
      );
    },
    [listQuestionCurrent, showResult],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      const questionItem = item;
      return (
        <NoFlexContainer paddingHorizontal={16}>
          <HeaderQuestion index={index + 1} desc={item.title} />
          <FlatList
            data={questionItem.answers}
            numColumns={questionItem.answers[0].image ? 2 : 1}
            renderItem={({item}) => renderAnswer({item}, questionItem)}
            keyExtractor={() => makeid(16)}
            style={{paddingLeft: 20, paddingTop: 16}}
            ItemSeparatorComponent={() => <View style={{height: 16}} />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          />
        </NoFlexContainer>
      );
    },
    [listQuestionCurrent],
  );

  const BodyComponent = useCallback(
    <FlexContainer>
      <FlatList
        data={listQuestionCurrent}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 24}} />}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={() => (
          <View paddingVertical={48} paddingHorizontal={16}>
            <Button
              primary
              rounded
              large
              shadow={!OS.IsAndroid}
              icon
              uppercase
              bold
              disabled={!showResult && !isAnswerAll}
              onPress={startPart}>
              {`${translate('OK')}`}
            </Button>
          </View>
        )}
      />
    </FlexContainer>,
    [listQuestionCurrent, showResult, isAnswerAll],
  );

  return (
    <FlexContainer backgroundColor={colors.white}>
      {props.showHeader && (
        <CommonHeader
          title={formatsMinuteOptions(time)}
          themeWhite
          close
          onClose={onClose}
          back={false}
        />
      )}
      {BodyComponent}
    </FlexContainer>
  );
};

PartSectionListExamScreen.propTypes = {
  showHeader: PropTypes.bool,
};
PartSectionListExamScreen.defaultProps = {
  showHeader: true,
};

export default PartSectionListExamScreen;
