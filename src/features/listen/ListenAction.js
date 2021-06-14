import {
  FETCH_LECTURE_LISTEN,
  FETCH_LECTURE_LISTEN_FAIL,
  FETCH_LECTURE_LISTEN_SUCCESS,
} from '~/features/listen/ListenType';

export const fetchLectureListen = (data) => {
  return {
    type: FETCH_LECTURE_LISTEN,
    payload: {data},
  };
};

export const fetchLectureListenSuccess = (data) => {
  return {
    type: FETCH_LECTURE_LISTEN_SUCCESS,
    payload: {data},
  };
};

export const fetchLectureListenFail = () => {
  return {
    type: FETCH_LECTURE_LISTEN_FAIL,
  };
};
