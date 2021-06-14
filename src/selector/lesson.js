import {createSelector} from 'reselect';

const currentLesson = (state) => state.lesson.currentLesson;

export const currentLessonSelector = createSelector(
  currentLesson,
  (data) => data,
);
