import orderBy from 'lodash/orderBy';

import {
  FETCH_COURSE_SUCCESS,
  FETCH_COURSE,
  FETCH_COURSE_FAIL,
  CHANGE_CURRENT_COURSE,
  FETCH_COMMON_COMMENT_SPEAK_SUCCESS,
} from './CourseType';
import {LOGOUT} from '~/features/authentication/AuthenType';

const initState = {
  courses: [],
  currentCourse: null,
  errorMessage: null,
  loading: false,
  commonCommentSpeak: {},
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_COURSE_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: 'error',
      };
    case FETCH_COURSE:
      return {
        ...state,
        courses: [],
        loading: true,
        errorMessage: null,
      };
    case FETCH_COURSE_SUCCESS:
      return {
        ...state,
        courses: orderBy(payload.data.data, 'order'),
        loading: false,
        errorMessage: null,
      };
    case CHANGE_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: payload.currentCourse,
      };
    case LOGOUT:
      return {
        ...initState,
      };
    case FETCH_COMMON_COMMENT_SPEAK_SUCCESS:
      const good = payload.data.filter(
        (item) => item.pronunciation_score.min >= 0.7,
      )[0];
      const avg = payload.data.filter(
        (item) =>
          item.pronunciation_score.min >= 0.3 &&
          item.pronunciation_score.min < 0.7,
      )[0];
      const bad = payload.data.filter(
        (item) => item.pronunciation_score.min < 0.3,
      )[0];
      return {
        ...state,
        commonCommentSpeak: {
          good,
          avg,
          bad,
        },
      };
    default:
      return state;
  }
};
