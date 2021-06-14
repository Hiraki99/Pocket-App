import {
  FETCH_CATEGORIES_EXAM_SUCCESS,
  FETCH_EXAM_FEATURE_SUCCESS,
  FETCH_EXAMS_BY_MULTI_CATEGORY_SUCCESS,
  FETCH_LIST_ESSAY_EXAM_SUCCESS,
  FETCH_QUESTION_BY_PART_SUCCESS,
  FETCH_SECTION_BY_EXAM_SUCCESS,
  INCREASE_SCORE_EXAM,
  RESET_EXAM,
  RESET_PART,
  SELECT_PART,
  SET_CURRENT_SECTION,
  SET_DETAIL_ESSAY_EXAM,
  SET_INFO_EXAM,
  SHOW_RESULT,
  UPDATE_STATUS_PART,
  UPDATE_STATUS_QUESTION,
} from './ExamType';

const initState = {
  introExam: {},
  sections: [],
  currentSection: {
    partIds: [],
  },
  currentPart: {},
  parts: {},
  questions: {},
  showResult: false,
  score: 0,
  inWordSet: false,
};

export const detailExam = (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_INFO_EXAM:
      return {
        ...state,
        introExam: payload.data.info,
      };
    case FETCH_SECTION_BY_EXAM_SUCCESS:
      return {
        ...state,
        sections: payload.data,
      };
    case SET_CURRENT_SECTION:
      return {
        ...state,
        currentSection: payload.section,
        parts: {
          ...state.parts,
          ...payload.partDetail,
        },
      };
    case SELECT_PART:
      return {
        ...state,
        currentPart: payload.data,
        parts: {
          ...state.parts,
          [payload.data._id]: {
            ...state.parts[payload.data._id],
            ...payload.data,
          },
        },
      };
    case FETCH_QUESTION_BY_PART_SUCCESS:
      return {
        ...state,
        questions: {
          ...state.questions,
          ...payload.data,
        },
      };
    case UPDATE_STATUS_PART:
      return {
        ...state,
        parts: {
          ...state.parts,
          [payload.data._id]: {
            ...state.parts[payload.data._id],
            ...payload.data,
          },
        },
      };
    case INCREASE_SCORE_EXAM:
      return {
        ...state,
        score: state.score + payload.data,
      };
    case SHOW_RESULT:
      return {
        ...state,
        showResult: true,
      };
    case UPDATE_STATUS_QUESTION:
      return {
        ...state,
        questions: {
          ...state.questions,
          ...payload.data,
        },
      };
    case RESET_PART:
      return {
        ...state,
        currentPart: {},
      };
    case RESET_EXAM:
      return initState;
    default:
      return state;
  }
};

const initOverViewState = {
  examsAttention: [],
  categoriesExam: [],
  categoryMostExam: [],
  essayExam: [],
  detailEssayExam: null,
};
export const overViewExam = (state = initOverViewState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_EXAM_FEATURE_SUCCESS:
      return {
        ...state,
        examsAttention: payload.data,
      };
    case FETCH_CATEGORIES_EXAM_SUCCESS:
      return {
        ...state,
        categoriesExam: payload.data,
      };
    case FETCH_EXAMS_BY_MULTI_CATEGORY_SUCCESS:
      return {
        ...state,
        categoryMostExam: payload.data,
      };
    case FETCH_LIST_ESSAY_EXAM_SUCCESS:
      return {
        ...state,
        essayExam: payload.data,
      };
    case SET_DETAIL_ESSAY_EXAM:
      return {
        ...state,
        detailEssayExam: payload.data,
      };
    default:
      return state;
  }
};
