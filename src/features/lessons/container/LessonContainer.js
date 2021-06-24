import orderBy from 'lodash/orderBy';
import React, {useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {StyleSheet, FlatList} from 'react-native';
import PropTypes from 'prop-types';

import {FlexContainer, Loading, SeparatorVertical, Text} from '~/BaseComponent';
import LessonSliderItem from '~/BaseComponent/components/elements/lesson/LessonSliderItem';
import lessonApi from '~/features/lessons/LessonApi';
import {translate} from '~/utils/multilanguage';
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
  const [lessons, setLessons] = React.useState([]);
  const [loading, setLoading] = React.useState([]);
  const {user, data} = props;

  useEffect(() => {
    const requestToServer = async (body) => {
      let res = await lessonApi.fetchLesson(body);
      setLoading(true);
      if (res.ok && res.data && res.data.data) {
        setLessons(orderBy(res.data.data, 'order'));
        setLoading(false);
      }
    };

    requestToServer({
      start: 0,
      length: -1,
      course_id: data._id,
    });
  }, [user, data]);

  const changeLesson = useCallback(
    (lesson) => {
      dispatch(changeCurrentLesson(lesson));
      navigator.navigate('LessonDetail');
    },
    [dispatch],
  );

  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return <Loading />;
    }
    return <Text h5>{translate('Chưa có dữ liệu cho phần này')}</Text>;
  }, [loading]);
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
        ListEmptyComponent={renderEmptyComponent}
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
