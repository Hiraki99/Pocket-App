import React, {useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {StyleSheet, FlatList} from 'react-native';
import PropTypes from 'prop-types';

import {FlexContainer, SeparatorVertical} from '~/BaseComponent';
import LessonSliderItem from '~/BaseComponent/components/elements/lesson/LessonSliderItem';
import {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
} from '~/features/lessons/LessonAction';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';

const LessonContainer = (props) => {
  const dispatch = useDispatch();

  const {user, currentCourse, lessons, isExam} = props;

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
      fetchLesson({
        start: 0,
        length: -1,
        course_id: courseId,
        isExam,
      }),
    );
  }, [user, currentCourse, dispatch, isExam]);

  const changeLesson = useCallback(
    (lesson) => {
      dispatch(changeCurrentLesson(lesson));
      navigator.navigate('LessonDetail');
    },
    [dispatch],
  );

  const renderItemLesson = useCallback(
    ({item}) => {
      return (
        <LessonSliderItem data={item} onChange={() => changeLesson(item)} />
      );
    },
    [changeLesson],
  );

  return (
    <FlexContainer>
      <FlatList
        data={lessons}
        renderItem={renderItemLesson}
        keyExtractor={(item) => item._id}
        numColumns={2}
        style={styles.flatlist}
        ItemSeparatorComponent={() => <SeparatorVertical md />}
        ListFooterComponent={() => <SeparatorVertical height={48} />}
        showsVerticalScrollIndicator={false}
      />
    </FlexContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    currentCourse: state.course.currentCourse,
    lessons: state.lesson.lessons,
    loading: state.lesson.loading,
    currentLesson: state.lesson.currentLesson,
    errorMessage: state.lesson.errorMessage,
    user: state.auth.user,
    speakLessons: state.lesson.speakLessons,
  };
};

LessonContainer.propTypes = {
  isExam: PropTypes.bool,
};

LessonContainer.defaultProps = {
  isExam: false,
};

const styles = StyleSheet.create({
  flatlist: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.white,
  },
});
export default connect(mapStateToProps, {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
})(LessonContainer);
