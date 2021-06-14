import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Alert, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-animatable';

import {
  Button,
  FlexContainer,
  NoFlexContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
} from '~/BaseComponent';
import TestPartTimeline from '~/BaseComponent/components/elements/exam/TestPartTimeline';
import ListStatusQuestionModalRef from '~/BaseComponent/components/elements/exam/modal/ListStatusQuestionModal';
import {colors, images} from '~/themes';
import {
  selectPart,
  fetchQuestionByPart,
  resetExam,
} from '~/features/exam/ExamAction';
import {OS} from '~/constants/os';
import {STATUS_PART} from '~/constants/testData';
import navigator from '~/navigation/customNavigator';
import timer from '~/utils/timer';
import {formatsMinuteOptions} from '~/utils/utils';
import getAllInfoExamSelector from '~/selector/examSelector';
import {translate} from '~/utils/multilanguage';

const SectionExamScreen = () => {
  const modalRef = React.useRef(null);
  const [time, setTime] = useState(0);

  const dispatch = useDispatch();

  const {
    currentSection,
    showResult,
    parts,
    sections,
    currentPart,
    introExam,
  } = getAllInfoExamSelector();

  const listPartCurrent =
    currentSection.partIds.map((item, index) => {
      return {
        ...parts[item],
        name: parts[item].name_display
          ? `${translate('Part %s: %s', {
              s1: `${index + 1}`,
              s2: `${parts[item].name_display}`,
            })}`
          : `${translate('Part %s', {s1: `${index + 1}`})}`,
      };
    }) || [];

  const indexOfSection = sections
    .map((item) => item._id)
    .indexOf(currentSection._id);

  const activeSectionIndex = indexOfSection > 0 ? indexOfSection : 0;

  const activePartIndex = currentSection._id
    ? currentSection.partIds.indexOf(currentPart._id) > 0
      ? currentSection.partIds.indexOf(currentPart._id)
      : 0
    : 0;

  useEffect(() => {
    timer.getTimerCurrentExam((t) => {
      if (t > introExam.time * 60 && typeof introExam.time === 'number') {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Thời gian kiểm tra đã kết thúc')}`,
          [{text: `${translate('Đồng ý')}`}],
        );
        navigator.navigate('ExamResult');
        timer.clearIntervalTimingGlobal();
      } else {
        setTime(t);
      }
    });
  });

  useEffect(() => {
    // part1
    if (!currentPart._id) {
      if (parts[currentSection.partIds[0]]) {
        dispatch(
          selectPart(
            {
              ...parts[currentSection.partIds[0]],
              status: STATUS_PART.ACTIVE,
            },
            !showResult,
          ),
        );
        dispatch(
          fetchQuestionByPart({id: parts[currentSection.partIds[0]]._id}),
        );
      }
    } else {
      dispatch(fetchQuestionByPart({id: currentPart._id}));
    }
  }, [currentPart, currentSection, showResult, dispatch, parts]);

  const onClose = useCallback(() => {
    Alert.alert(
      `${translate('Thông báo')}`,
      `${translate('Bạn có chắc muốn kết thúc bài kiểm tra ?')}`,
      [
        {
          text: `${translate('Đồng ý')}`,
          onPress: () => {
            dispatch(resetExam());
            timer.clearIntervalTimingGlobal();
            navigator.navigate('MainStack', {
              screen: 'BottomTabExam',
            });
          },
        },
        {text: `${translate('Hủy')}`},
      ],
    );
  }, [dispatch]);

  const startPart = useCallback(() => {
    if (currentPart.attachment && currentPart.attachment.type === 'reading') {
      navigator.navigate('PartReadingExam');
      return;
    }
    navigator.navigate('PartExam');
  }, [currentPart]);

  const selectPartOnTimeline = useCallback(
    (data) => {
      dispatch(
        selectPart(
          {
            ...data,
            status: STATUS_PART.ACTIVE,
          },
          !showResult,
        ),
      );
      if (data.attachment && data.attachment.type === 'reading') {
        navigator.navigate('PartReadingExam');
        return;
      }
      navigator.navigate('PartExam');
    },
    [dispatch, showResult],
  );

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer paddingHorizontal={12}>
        <SeparatorVertical lg />
        <Text
          fontSize={18}
          color={colors.primary}
          bold
          uppercase
          paddingVertical={8}>
          {sections.length > 1
            ? `section ${activeSectionIndex + 1}/${sections.length}`
            : `section ${activeSectionIndex + 1}`}
        </Text>
        {!!currentSection.name && (
          <Text h2 color={colors.helpText} bold>
            {currentSection.name}
          </Text>
        )}
        {currentSection.description ? (
          <Text
            h5
            color={colors.helpText}
            style={{paddingTop: 12, paddingBottom: 32}}>
            {currentSection.description}
          </Text>
        ) : (
          <SeparatorVertical lg />
        )}
      </NoFlexContainer>
    );
  }, [currentSection, activeSectionIndex, sections]);

  const BodyComponent = useCallback(
    <FlexContainer
      paddingHorizontal={40}
      backgroundColor={colors.white}
      style={{marginTop: 12}}>
      <TestPartTimeline
        activeIndex={activePartIndex}
        parts={listPartCurrent}
        renderHeader={renderHeader}
        selectPart={selectPartOnTimeline}
      />
      <Button
        primary
        rounded
        large
        shadow={!OS.IsAndroid}
        icon
        uppercase
        bold
        onPress={startPart}>
        {`${translate('OK')}`}
      </Button>
      <SeparatorVertical slg={OS.hasNotch} lg={!OS.hasNotch} />
    </FlexContainer>,
    [activePartIndex, listPartCurrent],
  );
  return (
    <FlexContainer backgroundColor={colors.white}>
      <CommonHeader
        title={formatsMinuteOptions(time)}
        themeWhite
        close
        onClose={onClose}
        back={false}>
        <TouchableOpacity
          onPress={() => {
            if (modalRef && modalRef.current) {
              modalRef.current.showModal();
            }
          }}>
          <Image
            source={images.menuExam}
            style={{width: 16, height: 16, marginBottom: 32}}
          />
        </TouchableOpacity>
      </CommonHeader>
      {BodyComponent}
      <ListStatusQuestionModalRef
        ref={modalRef}
        action={() => {
          setTimeout(() => {
            startPart();
          }, 200);
        }}
      />
    </FlexContainer>
  );
};

export default SectionExamScreen;
