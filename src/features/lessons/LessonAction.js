import {
  CHANGE_CURRENT_LESSON,
  CHANGE_CURRENT_LESSON_PRACTICE,
  FETCH_LESSON,
  FETCH_LESSON_FAIL,
  FETCH_LESSON_PRACTICE_SPEAK,
  FETCH_LESSON_PRACTICE_SPEAK_FAIL,
  FETCH_LESSON_PRACTICE_SPEAK_SUCCESS,
  FETCH_LESSON_SUCCESS,
  FETCH_TEACH_CATEGORY,
  FETCH_TEACH_CATEGORY_DETAIL,
  FETCH_TEACH_CATEGORY_DETAIL_FAIL,
  FETCH_TEACH_CATEGORY_DETAIL_SUCCESS,
  FETCH_TEACH_CATEGORY_FAIL,
  FETCH_TEACH_CATEGORY_SUCCESS,
} from './LessonType';

export const fetchLesson = (form) => {
  return {
    type: FETCH_LESSON,
    payload: {form},
  };
};

export const fetchLessonSuccess = (data) => {
  return {
    type: FETCH_LESSON_SUCCESS,
    payload: {data},
  };
};

export const fetchLessonFail = () => {
  return {
    type: FETCH_LESSON_FAIL,
  };
};

export const fetchLessonPracticeSpeak = (form) => {
  return {
    type: FETCH_LESSON_PRACTICE_SPEAK,
    payload: {form},
  };
};

export const fetchLessonPracticeSpeakSuccess = (data) => {
  return {
    type: FETCH_LESSON_PRACTICE_SPEAK_SUCCESS,
    payload: {data},
  };
};

export const fetchLessonPracticeSpeakFail = () => {
  return {
    type: FETCH_LESSON_PRACTICE_SPEAK_FAIL,
  };
};

export const changeCurrentLesson = (currentLesson) => {
  return {
    type: CHANGE_CURRENT_LESSON,
    payload: {currentLesson},
  };
};

export const changeCurrentLessonPractice = (currentLesson) => {
  return {
    type: CHANGE_CURRENT_LESSON_PRACTICE,
    payload: {currentLesson},
  };
};

export const fetchTeachingCategory = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY,
    payload: {data},
  };
};

export const fetchTeachingCategorySuccess = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY_SUCCESS,
    payload: {data},
  };
};

export const fetchTeachingCategoryFail = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY_FAIL,
    payload: {data},
  };
};

export const fetchTeachCategoryDetail = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY_DETAIL,
    payload: {data},
  };
};

export const fetchTeachCategoryDetailSuccess = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY_DETAIL_SUCCESS,
    payload: {data},
  };
};

export const fetchTeachCategoryDetailFail = (data) => {
  return {
    type: FETCH_TEACH_CATEGORY_DETAIL_FAIL,
    payload: {data},
  };
};
