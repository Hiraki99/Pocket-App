import {createSelector} from 'reselect';

const currentLesson = (state) => state.lesson.currentLesson;
const listCourse = (state) => state.course.courses;

export const currentLessonSelector = createSelector(
  currentLesson,
  (data) => data,
);

export const listCourseSelector = createSelector(listCourse, (data) => data);
