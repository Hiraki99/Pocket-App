import React, {useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import {
  Card,
  FlexContainer,
  Loading,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
} from '~/features/lessons/LessonAction';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {PRIMARY_FOOTER_IMAGES} from '~/themes/footer';

const LessonPrimaryContainer = (props) => {
  const dispatch = useDispatch();
  const {user, currentCourse, lessons} = props;
  const [imageFooter] = React.useState(
    PRIMARY_FOOTER_IMAGES[
      Math.round(Math.random() * (PRIMARY_FOOTER_IMAGES.length - 1))
    ],
  );

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
        // length: -1,
        course_id: courseId,
        isExam: props.isExam,
      }),
    );
  }, [user, currentCourse, dispatch, props.isExam]);

  const changeLesson = useCallback(
    (lesson) => {
      dispatch(changeCurrentLesson(lesson));
      navigator.navigate('LessonDetailPrimary');
    },
    [dispatch],
  );

  const renderItemLesson = useCallback(
    ({item}) => {
      return (
        <TouchableWithoutFeedback onPress={() => changeLesson(item)}>
          <View marginHorizontal={24}>
            <Card style={styles.itemContainer}>
              <FlexContainer paddingRight={8}>
                <Text h6 primary bold uppercase>
                  {item.name}
                </Text>
                <Text fontSize={20} paddingTop={8} bold>
                  {item.description || item.display_name}
                </Text>
              </FlexContainer>
              <Image
                resizeMode="contain"
                source={{uri: item.featured_image}}
                style={styles.featured_image}
              />
            </Card>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [changeLesson],
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.lessonInfoTeacher}>
        <FastImage
          source={{uri: currentCourse?.banner_image}}
          style={{
            width: OS.WIDTH - 48,
            height: 200,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
        <Text h2 uppercase bold>
          {currentCourse ? currentCourse.display_name : ''}
        </Text>
      </View>
    );
  }, [currentCourse]);

  const renderFooter = useCallback(() => {
    return (
      <View>
        <FastImage source={imageFooter} style={[styles.footerImage]} />
      </View>
    );
  }, [imageFooter]);

  const renderSeparator = useCallback(() => {
    return <SeparatorVertical sm />;
  }, []);

  return (
    <FlexContainer>
      {lessons.length === 0 ? (
        <Loading style={styles.loading} />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item._id}
          renderItem={renderItemLesson}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{flexGrow: 1}}
          ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
          bounces={false}
        />
      )}
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

LessonPrimaryContainer.propTypes = {
  isExam: PropTypes.bool,
};

LessonPrimaryContainer.defaultProps = {
  isExam: false,
};

export default connect(mapStateToProps, {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
})(LessonPrimaryContainer);

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
    marginTop: 16,
  },
  footerImage: {
    width: OS.WIDTH,
    height: 260,
  },
  featured_image: {
    width: 126,
    height: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
});
