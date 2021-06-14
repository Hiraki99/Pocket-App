import {
  FETCH_LIST_HOMEWORK,
  FETCH_LIST_HOMEWORK_SUCCESS,
  FETCH_LIST_HOMEWORK_FAIL,
  SELECTED_HOMEWORK,
  FETCH_DETAIL_HOMEWORK_SUCCESS,
  PUSH_PROGRESS_HOMEWORK,
} from './HomeworkType';

import {FIRST_PAGE} from '~/constants/query';

const initState = {
  loading: false,
  homeworks: [],
  homeworkSelected: null,
  activitiesHomework: {},
  totalCount: 0,
  query: {
    page: FIRST_PAGE,
    canLoadMore: true,
  },
  error: null,
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_LIST_HOMEWORK:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LIST_HOMEWORK_SUCCESS:
      return {
        ...state,
        loading: false,
        homeworks:
          payload.body.query.page === FIRST_PAGE
            ? payload.data
            : [...state.homeworks, ...payload.data],
        query: payload.body.query,
        totalCount: payload.body.totalCount,
        error: null,
        activitiesHomework: {
          ...state.activitiesHomework,
          ...payload.activitiesHomework,
        },
      };
    case FETCH_LIST_HOMEWORK_FAIL:
      return {
        ...state,
        loading: false,
        error: payload.data,
      };
    case SELECTED_HOMEWORK:
      return {
        ...state,
        homeworkSelected: payload.data,
      };
    case FETCH_DETAIL_HOMEWORK_SUCCESS:
      return {
        ...state,
        homeworkSelected: {
          ...state.homeworkSelected,
          ...payload.data,
        },
        activitiesHomework: {
          ...state.activitiesHomework,
          ...payload.detailActivity,
        },
      };
    case PUSH_PROGRESS_HOMEWORK:
      let activityUpdateProgress =
        state.activitiesHomework[payload.data.activityId];
      activityUpdateProgress.progress.push(payload.data);
      return {
        ...state,
        activitiesHomework: {
          ...state.activitiesHomework,
          [payload.data.activityId]: activityUpdateProgress,
        },
      };
    default:
      return state;
  }
};
