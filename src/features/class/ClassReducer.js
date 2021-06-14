import {
  FETCH_DETAIL_CLASS,
  FETCH_DETAIL_CLASS_SUCCESS,
  FETCH_DETAIL_CLASS_FAIL,
  SET_QUERY_SELECTED,
} from './ClassType';

import {TimeQuery} from '~/constants/query';

const initState = {
  classDetail: {},
  loading: false,
  rankingResult: [],
  querySelected: TimeQuery.last7days,
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_DETAIL_CLASS:
      return {
        ...state,
        wordTranslation: payload.word,
      };
    case FETCH_DETAIL_CLASS_SUCCESS:
      return {
        ...state,
        classDetail: payload.data,
      };
    case FETCH_DETAIL_CLASS_FAIL:
      return {
        ...state,
        topicsVocabulary: payload.data,
      };
    case SET_QUERY_SELECTED:
      return {
        ...state,
        querySelected: payload.data,
      };
    default:
      return state;
  }
};
