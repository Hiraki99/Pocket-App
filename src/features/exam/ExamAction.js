import {
  SET_CURRENT_SECTION,
  SELECT_PART,
  SET_INFO_EXAM,
  UPDATE_STATUS_PART,
  UPDATE_STATUS_QUESTION,
  INCREASE_SCORE_EXAM,
  RESET_EXAM,
  SHOW_RESULT,
  RESET_PART,
  FETCH_EXAM_FEATURE,
  FETCH_EXAM_FEATURE_SUCCESS,
  FETCH_EXAM_FEATURE_FAIL,
  FETCH_CATEGORIES_EXAM,
  FETCH_CATEGORIES_EXAM_SUCCESS,
  FETCH_CATEGORIES_EXAM_FAIL,
  FETCH_EXAMS_BY_MULTI_CATEGORY,
  FETCH_EXAMS_BY_MULTI_CATEGORY_SUCCESS,
  FETCH_EXAMS_BY_MULTI_CATEGORY_FAIL,
  FETCH_SECTION_BY_EXAM,
  FETCH_SECTION_BY_EXAM_SUCCESS,
  FETCH_SECTION_BY_EXAM_FAIL,
  FETCH_QUESTION_BY_PART,
  FETCH_QUESTION_BY_PART_SUCCESS,
  FETCH_QUESTION_BY_PART_FAIL,
  FETCH_LIST_ESSAY_EXAM,
  FETCH_LIST_ESSAY_EXAM_SUCCESS,
  FETCH_LIST_ESSAY_EXAM_FAIL,
  SET_DETAIL_ESSAY_EXAM,
} from './ExamType';

export const setInfoExam = (data) => {
  return {
    type: SET_INFO_EXAM,
    payload: {data},
  };
};

export const setCurrentSection = (data) => {
  const {parts, ...restData} = data;
  const partDetail = {};
  const partIds = (parts || []).map((item) => {
    partDetail[item._id] = item;
    return item._id;
  });
  return {
    type: SET_CURRENT_SECTION,
    payload: {
      section: {
        ...restData,
        partIds,
      },
      partDetail,
    },
  };
};

// add question to redux
export const selectPart = (data) => {
  const {test_questions, ...restData} = data;
  let questionIds = [];
  if (test_questions) {
    questionIds = test_questions.map((item) => item._id);
  }
  return {
    type: SELECT_PART,
    payload: {
      data: {...restData, questionIds},
    },
  };
};

export const resetPart = () => {
  return {type: RESET_PART};
};

export const updateStatusPart = (data) => {
  return {
    type: UPDATE_STATUS_PART,
    payload: {data},
  };
};

export const updateStatusQuestion = (data) => {
  return {
    type: UPDATE_STATUS_QUESTION,
    payload: {data},
  };
};

export const increaseScoreExam = (data) => {
  return {
    type: INCREASE_SCORE_EXAM,
    payload: {data},
  };
};

export const resetExam = (data) => {
  return {type: RESET_EXAM, payload: {data}};
};

export const showResult = () => {
  return {type: SHOW_RESULT};
};

export const fetchExamFeature = (data) => {
  return {
    type: FETCH_EXAM_FEATURE,
    payload: {data},
  };
};

export const fetchExamFeatureSuccess = (data) => {
  return {
    type: FETCH_EXAM_FEATURE_SUCCESS,
    payload: {data},
  };
};

export const fetchExamFeatureFail = (data) => {
  return {
    type: FETCH_EXAM_FEATURE_FAIL,
    payload: {data},
  };
};

export const fetchCategoryExam = (data) => {
  return {
    type: FETCH_CATEGORIES_EXAM,
    payload: {data},
  };
};

export const fetchCategoryExamSuccess = (data) => {
  return {
    type: FETCH_CATEGORIES_EXAM_SUCCESS,
    payload: {data},
  };
};

export const fetchCategoryExamFail = (data) => {
  return {
    type: FETCH_CATEGORIES_EXAM_FAIL,
    payload: {data},
  };
};

export const fetchExamByMultiCategory = (data, refData) => {
  return {
    type: FETCH_EXAMS_BY_MULTI_CATEGORY,
    payload: {data, refData},
  };
};

export const fetchExamByMultiCategorySuccess = (data) => {
  return {
    type: FETCH_EXAMS_BY_MULTI_CATEGORY_SUCCESS,
    payload: {data},
  };
};

export const fetchExamByMultiCategoryFail = (data) => {
  return {
    type: FETCH_EXAMS_BY_MULTI_CATEGORY_FAIL,
    payload: {data},
  };
};

export const fetchSectionByExam = (data) => {
  return {
    type: FETCH_SECTION_BY_EXAM,
    payload: {data},
  };
};

export const fetchSectionByExamSuccess = (data) => {
  return {
    type: FETCH_SECTION_BY_EXAM_SUCCESS,
    payload: {data},
  };
};

export const fetchSectionByExamFail = (data) => {
  return {
    type: FETCH_SECTION_BY_EXAM_FAIL,
    payload: {data},
  };
};

export const fetchQuestionByPart = (data) => {
  return {
    type: FETCH_QUESTION_BY_PART,
    payload: {data},
  };
};

export const fetchQuestionByPartSuccess = (data) => {
  return {
    type: FETCH_QUESTION_BY_PART_SUCCESS,
    payload: {data},
  };
};

export const fetchQuestionByPartFail = (data) => {
  return {
    type: FETCH_QUESTION_BY_PART_FAIL,
    payload: {data},
  };
};

export const fetchEssayExamList = (data) => {
  return {
    type: FETCH_LIST_ESSAY_EXAM,
    payload: {data},
  };
};

export const fetchEssayExamListSuccess = (data) => {
  return {
    type: FETCH_LIST_ESSAY_EXAM_SUCCESS,
    payload: {data},
  };
};
export const fetchEssayExamListFail = (data) => {
  return {
    type: FETCH_LIST_ESSAY_EXAM_FAIL,
    payload: {data},
  };
};

export const setDetailEssayExam = (data) => {
  return {
    type: SET_DETAIL_ESSAY_EXAM,
    payload: {data},
  };
};
