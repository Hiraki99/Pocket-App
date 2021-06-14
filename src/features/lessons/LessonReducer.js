import orderBy from 'lodash/orderBy';

import {
  FETCH_LESSON_SUCCESS,
  FETCH_LESSON,
  FETCH_LESSON_FAIL,
  CHANGE_CURRENT_LESSON,
  FETCH_LESSON_PRACTICE_SPEAK_FAIL,
  FETCH_LESSON_PRACTICE_SPEAK,
  FETCH_LESSON_PRACTICE_SPEAK_SUCCESS,
  CHANGE_CURRENT_LESSON_PRACTICE,
  FETCH_TEACH_CATEGORY_DETAIL_SUCCESS,
  FETCH_TEACH_CATEGORY_SUCCESS,
} from './LessonType';

const initState = {
  lessons: [],
  speakLessons: [],
  currentLesson: null,
  currentLessonPracticeSpeak: null,
  errorMessage: null,
  loading: false,
  teachLessons: [],
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_LESSON_FAIL:
    case FETCH_LESSON_PRACTICE_SPEAK_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: 'error',
      };
    case FETCH_LESSON:
    case FETCH_LESSON_PRACTICE_SPEAK:
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case FETCH_LESSON_SUCCESS:
      return {
        ...state,
        lessons: orderBy(payload.data.data, 'order'),
        loading: false,
        errorMessage: null,
      };
    case FETCH_LESSON_PRACTICE_SPEAK_SUCCESS:
      return {
        ...state,
        speakLessons: orderBy(payload.data.data, 'order'),
        loading: false,
        errorMessage: null,
      };
    case CHANGE_CURRENT_LESSON:
      return {
        ...state,
        currentLesson: payload.currentLesson,
      };
    case CHANGE_CURRENT_LESSON_PRACTICE:
      return {
        ...state,
        currentLessonPracticeSpeak: payload.currentLesson,
      };
    case FETCH_TEACH_CATEGORY_SUCCESS:
      return {
        ...state,
        teachLessons: payload.data,
      };
    default:
      return state;
  }
};
