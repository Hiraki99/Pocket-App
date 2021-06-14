import {
  FETCH_DETAIL_CLASS,
  FETCH_DETAIL_CLASS_FAIL,
  FETCH_DETAIL_CLASS_SUCCESS,
  SET_QUERY_SELECTED,
} from '~/features/class/ClassType';

export const fetchDetailClass = (data) => {
  return {
    type: FETCH_DETAIL_CLASS,
    payload: {data},
  };
};

export const fetchDetailClassSuccess = (data) => {
  return {
    type: FETCH_DETAIL_CLASS_SUCCESS,
    payload: {data},
  };
};

export const fetchDetailClassFail = () => {
  return {
    type: FETCH_DETAIL_CLASS_FAIL,
  };
};

export const setQuerySelected = (data) => {
  return {
    type: SET_QUERY_SELECTED,
    payload: {data},
  };
};
