import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {FlatList, StyleSheet} from 'react-native';

import {
  Loading,
  Text,
  FlexContainer,
  RowContainer,
  SpeakActivityItem,
  SeparatorVertical,
  NoFlexContainer,
} from '~/BaseComponent';
import {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
} from '~/features/lessons/LessonAction';
import {fetchPartVip, changeCurrentPart} from '~/features/part/PartAction';
import navigator from '~/navigation/customNavigator';
import colors from '~/themes/colors';
import {translate} from '~/utils/multilanguage';

const SpeakContainer = (props) => {
  const dispatch = useDispatch();
  const {user, currentCourse} = props;

  useEffect(() => {
    if (!currentCourse) {
      return;
    }
    const courseId =
      (currentCourse ? currentCourse._id : null) || user.current_course;

    if (!courseId) {
      return;
    }

    dispatch(
      fetchPartVip({
        start: 0,
        length: -1,
        course_id: courseId,
      }),
    );
  }, [user, currentCourse, dispatch]);

  const changeLessonSpeak = (lesson) => {
    dispatch(changeCurrentPart(lesson));
    navigator.navigate('LessonPracticeSpeakDetail');
  };

  const renderHeaderSpeak = React.useCallback(() => {
    return (
      <NoFlexContainer alignItems={'center'} paddingVertical={32}>
        <Text h2 uppercase bold>
          {`${translate('Luyện nói')}`}
        </Text>
        <Text color="rgba(31,38,49,0.54)">Trình độ B1</Text>
      </NoFlexContainer>
    );
  }, []);

  const renderItemSpeak = ({item}) => {
    return (
      <RowContainer justifyContent={'center'}>
        <SpeakActivityItem item={item} onChange={changeLessonSpeak} />
      </RowContainer>
    );
  };

  const renderEmptyList = () => {
    return (
      <RowContainer
        paddingHorizontal={24}
        paddingVertical={8}
        backgroundColor={colors.white}
        justifyContent={'center'}
        style={{borderRadius: 24}}>
        <Text h5 center accented>
          {`${translate('Chưa có bài học cho khóa này')}`}
        </Text>
      </RowContainer>
    );
  };

  if (props.loading && props.speakLessons.length === 0) {
    return <Loading />;
  }
  return (
    <FlexContainer>
      <FlatList
        data={props.partsVip}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        ListHeaderComponent={renderHeaderSpeak}
        ListEmptyComponent={renderEmptyList}
        renderItem={renderItemSpeak}
        style={styles.container}
        ItemSeparatorComponent={() => <SeparatorVertical lg />}
        ListFooterComponent={() => <SeparatorVertical slg />}
        showsVerticalScrollIndicator={false}
      />
    </FlexContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    currentCourse: state.course.currentCourse,
    partsVip: state.part.partsVip,
    lessons: state.lesson.lessons,
    loading: state.lesson.loading,
    currentLesson: state.lesson.currentLesson,
    errorMessage: state.lesson.errorMessage,
    user: state.auth.user,
    speakLessons: state.lesson.speakLessons,
  };
};

export default connect(mapStateToProps, {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
  fetchPartVip,
  changeCurrentPart,
})(SpeakContainer);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 1,
    backgroundColor: colors.mainBgColor,
  },
});
