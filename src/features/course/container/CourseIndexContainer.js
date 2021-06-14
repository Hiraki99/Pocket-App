import React, {useEffect, useState, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Loading,
  Text,
  FlexContainer,
  RowContainer,
  SeparatorVertical,
  NoFlexContainer,
  Card,
} from '~/BaseComponent/index';
import {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
} from '~/features/lessons/LessonAction';
import {changeCurrentPart, fetchPartSuccess} from '~/features/part/PartAction';
import navigator from '~/navigation/customNavigator';
import colors from '~/themes/colors';
import {OS} from '~/constants/os';
import CourseApi from '~/features/course/CourseApi';
import {translate} from '~/utils/multilanguage';

const CourseIndexContainer = (props) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const {user, currentCourse} = props;

  useEffect(() => {
    const getTableContentCourse = async (course_id, key) => {
      const res = await CourseApi.getTableContentCourse({
        course_id,
        keyword: key,
      });
      if (res.ok) {
        setData(res.data);
      }
    };
    if (!currentCourse) {
      return;
    }
    const courseId =
      (currentCourse ? currentCourse._id : null) || user.current_course;

    if (!courseId) {
      return;
    }
    getTableContentCourse(courseId, keyword.trim());
  }, [user, currentCourse, keyword]);

  const setCurrentLesson = useCallback(
    (lesson) => {
      dispatch(changeCurrentLesson(lesson));
      navigator.navigate('LessonDetail');
    },
    [dispatch],
  );

  const onChangePart = useCallback(
    (part, lesson) => {
      dispatch(fetchPartSuccess({data: lesson.parts}));
      dispatch(changeCurrentPart(part));
      navigator.navigate('Activity');
    },
    [dispatch],
  );

  const renderHeaderSpeak = React.useCallback(() => {
    return (
      <NoFlexContainer alignItems={'center'} paddingVertical={16}>
        <Text h2 uppercase bold>
          {translate('Mục lục')}
        </Text>
        <Text
          fontSize={14}
          color="rgba(31,38,49,0.54)"
          center
          paddingVertical={16}>
          {currentCourse?.description_web}
        </Text>
        <RowContainer backgroundColor={colors.white} borderRadius={8}>
          <TextInput
            placeholder={translate('Tìm kiếm bài học')}
            style={styles.textInputWhite}
            onChangeText={(text) => setKeyword(text)}
            value={keyword}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
            style={styles.defaultIcon}>
            <Ionicons
              color={'rgba(31, 38, 49, 0.38)'}
              size={20}
              name={'ios-search'}
            />
          </TouchableOpacity>
        </RowContainer>
      </NoFlexContainer>
    );
  }, [currentCourse, keyword]);

  const renderItem = ({item}) => {
    return (
      <Card
        justifyContent={'center'}
        borderRadius={16}
        paddingHorizontal={24}
        paddingVertical={24}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCurrentLesson(item.lesson)}>
          <Text fontSize={14} bold uppercase color={colors.hoverText}>
            {item.lesson?.name}
          </Text>
          <Text
            fontSize={20}
            lineHeight={28}
            bold
            color={colors.helpText}
            paddingTop={8}
            paddingBottom={6}>
            {item.lesson?.display_name}
          </Text>
        </TouchableOpacity>
        <>
          {(item.parts || []).map((it) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={it._id}
                onPress={() => {
                  onChangePart(it, {
                    ...item.lesson,
                    parts: item.parts,
                  });
                }}>
                <Text h5 color={colors.primary} paddingTop={8}>
                  {it.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      </Card>
    );
  };

  if (props.loading && props.speakLessons.length === 0) {
    return <Loading />;
  }
  return (
    <FlexContainer>
      <ScrollView>
        <View paddingHorizontal={24}>{renderHeaderSpeak()}</View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item._id}_${index}`}
          renderItem={renderItem}
          style={styles.container}
          ItemSeparatorComponent={() => <SeparatorVertical md />}
          ListFooterComponent={() => <SeparatorVertical slg />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        />
      </ScrollView>
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

export default connect(mapStateToProps, {
  fetchLesson,
  changeCurrentLesson,
  changeCurrentLessonPractice,
  fetchLessonPracticeSpeak,
})(CourseIndexContainer);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 1,
    backgroundColor: colors.mainBgColor,
  },
  defaultIcon: {paddingHorizontal: 16},
  primaryIcon: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  textInputWhite: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: OS.IsAndroid ? 11 : 15,
    fontSize: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: colors.white,
  },
});
