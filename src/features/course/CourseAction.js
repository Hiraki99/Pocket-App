import {
  CHANGE_CURRENT_COURSE,
  FETCH_COURSE,
  FETCH_COURSE_FAIL,
  FETCH_COURSE_SUCCESS,
  FETCH_COMMON_COMMENT_SPEAK,
  FETCH_COMMON_COMMENT_SPEAK_FAIL,
  FETCH_COMMON_COMMENT_SPEAK_SUCCESS,
} from './CourseType';

export const fetchCourse = (form) => {
  return {
    type: FETCH_COURSE,
    payload: {form},
  };
};

export const fetchCourseSuccess = (data) => {
  return {
    type: FETCH_COURSE_SUCCESS,
    payload: {data},
  };
};

export const fetchCourseFail = () => {
  return {
    type: FETCH_COURSE_FAIL,
  };
};

export const changeCurrentCourse = (currentCourse) => {
  return {
    type: CHANGE_CURRENT_COURSE,
    payload: {currentCourse},
  };
};

export const fetchCommonCommentSpeak = () => {
  return {
    type: FETCH_COMMON_COMMENT_SPEAK,
    payload: {},
  };
};

export const fetchCommonCommentSpeakSuccess = (data) => {
  return {
    type: FETCH_COMMON_COMMENT_SPEAK_SUCCESS,
    payload: {data},
  };
};

export const fetchCommonCommentSpeakFail = () => {
  return {
    type: FETCH_COMMON_COMMENT_SPEAK_FAIL,
  };
};
