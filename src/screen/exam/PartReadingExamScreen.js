import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {TabBar, TabView} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Alert, TouchableWithoutFeedback} from 'react-native';
import {Image} from 'react-native-animatable';

import {colors, images} from '~/themes';
import {FlexContainer, Text, CommonHeader} from '~/BaseComponent';
import {OS} from '~/constants/os';
import timer from '~/utils/timer';
import {formatsMinuteOptions} from '~/utils/utils';
import {ReadingExamContainer} from '~/features/exam/container/ReadingExamContainer';
import navigator from '~/navigation/customNavigator';
import ListStatusQuestionModalRef from '~/BaseComponent/components/elements/exam/modal/ListStatusQuestionModal';
import {resetExam} from '~/features/exam/ExamAction';
import PartExamContainer from '~/features/exam/container/PartExamContainer';
import {translate} from '~/utils/multilanguage';

const routes = [
  {key: 'reading', title: 'Bài đọc'},
  {key: 'test', title: 'Câu hỏi'},
];
const PartReadingExamScreen = () => {
  const modalRef = React.useRef(null);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentSection = useSelector(
    (state) => state.exam.currentSection || {},
    shallowEqual,
  );

  const introExam = useSelector(
    (state) => state.exam.introExam || {},
    shallowEqual,
  );

  const sections = useSelector(
    (state) => state.exam.sections || [],
    shallowEqual,
  );

  const currentPart = useSelector(
    (state) => state.exam.currentPart || {},
    shallowEqual,
  );

  useEffect(() => {
    if (currentPart.indexJump || typeof currentPart.indexJump === 'number') {
      setTimeout(() => {
        setIndex(1);
      }, 200);
    }
  }, [currentPart]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setLoading(false);
    });
    navigation.addListener('blur', () => {
      setLoading(true);
    });
  }, [navigation]);

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

    return function () {
      if (isEndExam && isEndPartInSection) {
        timer.clearIntervalTimingGlobal();
      }
    };
  });

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
              params: {
                screen: 'TeacherExam',
              },
            });
          },
        },
        {text: `${translate('Hủy')}`},
      ],
    );
  }, [dispatch]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary, height: 3}}
      style={styles.tabBar}
      initialLayout={OS.WIDTH}
      renderLabel={({route, focused}) => (
        <Text fontSize={14} bold uppercase primary={focused}>
          {route.title}
        </Text>
      )}
    />
  );

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'reading':
        return <ReadingExamContainer />;
      default:
        return <PartExamContainer showHeader={false} disablePadding={true} />;
    }
  };

  return (
    <FlexContainer backgroundColor={colors.white}>
      <CommonHeader
        title={formatsMinuteOptions(time)}
        themeWhite
        close
        onClose={onClose}
        back={false}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (modalRef && modalRef.current) {
              modalRef.current.showModal();
            }
          }}>
          <Image
            source={images.menuExam}
            style={{width: 16, height: 16, marginBottom: 32}}
          />
        </TouchableWithoutFeedback>
      </CommonHeader>
      {!loading && (
        <FlexContainer backgroundColor={colors.white}>
          <TabView
            navigationState={{index, routes}}
            onIndexChange={(i) => setIndex(i)}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
          />
        </FlexContainer>
      )}

      <ListStatusQuestionModalRef ref={modalRef} />
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 0,
  },
  label: {width: 'auto', marginTop: 6},
});

export default PartReadingExamScreen;
