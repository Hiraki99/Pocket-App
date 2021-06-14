import React, {useState, useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';

import {Loading, TextBase} from '~/BaseComponent';
import {TextBaseStyle} from '~/BaseComponent/components/base/text-base/TextBase';
import LessonSliderItem from '~/BaseComponent/components/elements/lesson/LessonSliderItem';
import {
  sliderWidth,
  itemWidth,
} from '~/BaseComponent/components/elements/lesson/lessonStyles';
import {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
} from '~/features/lessons/LessonAction';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const LessonContainer = (props) => {
  const carouselRef = React.useRef(null);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [loadDone, setLoadDone] = useState(false);
  const {user, currentCourse, lessons, isExam} = props;
  const numberLesson = lessons.length;

  useEffect(() => {
    if (
      user?.current_lesson_obj?.order > -1 &&
      user?.current_lesson_obj?.is_exam === isExam &&
      loadDone
    ) {
      setTimeout(() => {
        setIndex(
          !lessons.length > user?.current_lesson_obj?.order
            ? 0
            : user?.current_lesson_obj?.order,
        );
      }, 300);
    }
  }, [user, isExam, lessons, loadDone]);

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
    <View>
      <View style={styles.lessonInfoTeacher}>
        <TextBase
          style={[
            TextBaseStyle.h2,
            TextBaseStyle.uppercase,
            TextBaseStyle.bold,
          ]}>
          {currentCourse ? currentCourse.display_name : ''}
        </TextBase>
        {lessons.length > 0 && (
          <TextBase style={{color: 'rgba(31, 38, 49, 0.54)'}}>
            {/*{`Lesson ${index + 1 >= 10 ? index + 1 : `0${index + 1}`}/${*/}
            {/*  numberLesson >= 10 ? numberLesson : `0${numberLesson}`*/}
            {/*}`}*/}
            {`${translate('Lesson %s/%s', {
              s1: `${index + 1 >= 10 ? index + 1 : `0${index + 1}`}`,
              s2: numberLesson >= 10 ? numberLesson : `0${numberLesson}`,
            })}`}
          </TextBase>
        )}
      </View>
      {lessons.length === 0 && (
        <View paddingTop={24}>
          <Loading style={styles.loading} />
        </View>
      )}
      <Carousel
        ref={carouselRef}
        data={lessons}
        onLayout={() => setLoadDone(true)}
        renderItem={renderItemLesson}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        firstItem={index}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.6}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        removeClippedSubviews
        // maxToRenderPerBatch={3}
        onSnapToItem={(i) => setIndex(i)}
        lockScrollTimeoutDuration={0}
        swipeThreshold={5}
        // enableMomentum
        // decelerationRate={'fast'}
      />
    </View>
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

export default connect(mapStateToProps, {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
})(LessonContainer);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90,
  },
  slider: {
    marginTop: 15 * OS.scaleYByDesign,
    overflow: 'visible',
  },
  sliderContentContainer: {
    paddingVertical: 0,
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  lessonInfoTeacher: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    marginTop: 32,
  },
});
