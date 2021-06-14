import {
  SET_RESULT_QUESTION_WARES,
  UPDATE_SCORE_CLASS,
  CREATE_DETAIL_INFO_STUDENT,
  RESET_DETAIL_RESULT_STUDENTS,
  UPDATE_STUDENT_SCRIPT_SCORE,
  RESET_STUDENT_SCRIPT_SCORE,
  UPDATE_SCORE_RECONNECT,
  SELECTED_USER_VIEW_RESULT,
  RECEIVE_UPDATE_SCORE_EVENT,
  SET_SHOW_LATENCY_CONTAINER,
  SET_LATENCY_CLIENT_SERVER,
  UPDATE_AUDIO_STATUS_ZOOM,
  UPDATE_VIDEO_STATUS_ZOOM,
  LOAD_VIDEO_REACTIVE_STATUS,
  LOAD_AUDIO_REACTIVE_STATUS,
} from '~/features/liveclass/LiveClassType';

export const resetStudentScriptScore = () => {
  return {
    type: RESET_STUDENT_SCRIPT_SCORE,
  };
};

export const updateStudentScriptScore = (listScores) => {
  return {
    type: UPDATE_STUDENT_SCRIPT_SCORE,
    payload: {listScores},
  };
};

export const setResultCurrentWares = (data) => {
  return {
    type: SET_RESULT_QUESTION_WARES,
    payload: {data},
  };
};

export const updateScoreClass = (userId, detailAnswer) => {
  return {
    type: UPDATE_SCORE_CLASS,
    payload: {
      data: {
        userId,
        detailAnswer,
      },
    },
  };
};

export const createDetailInfoStudentClass = (
  userJointed,
  detailResultQuestion,
) => {
  return {
    type: CREATE_DETAIL_INFO_STUDENT,
    payload: {
      data: {
        userJointed,
        detailResultQuestion,
      },
    },
  };
};
export const resetDetailResultStudent = () => {
  return {
    type: RESET_DETAIL_RESULT_STUDENTS,
  };
};

export const updateScoreReconnect = (data, currentQuestionWares) => {
  return {
    type: UPDATE_SCORE_RECONNECT,
    payload: {data, currentQuestionWares},
  };
};

export const selectedStudentViewResult = (data) => {
  return {
    type: SELECTED_USER_VIEW_RESULT,
    payload: {data},
  };
};

export const receiveUpdateScoreEvent = (data) => {
  return {
    type: RECEIVE_UPDATE_SCORE_EVENT,
    payload: {data},
  };
};

export const setShowLatencyNetworkContainer = (data) => {
  return {
    type: SET_SHOW_LATENCY_CONTAINER,
    payload: {data},
  };
};

export const setLatencyClientServer = (data) => {
  return {
    type: SET_LATENCY_CLIENT_SERVER,
    payload: {data},
  };
};

export const updateAudioStatusZoom = (user, audioStatus) => {
  return {
    type: UPDATE_AUDIO_STATUS_ZOOM,
    payload: {
      user,
      audioStatus,
    },
  };
};
export const updateVideoStatusZoom = (user, videoStatus) => {
  return {
    type: UPDATE_VIDEO_STATUS_ZOOM,
    payload: {
      user,
      videoStatus,
    },
  };
};

export const loadVideoReactiveStatus = (status) => {
  return {
    type: LOAD_VIDEO_REACTIVE_STATUS,
    payload: {status},
  };
};

export const loadAudioReactiveStatus = (status) => {
  return {
    type: LOAD_AUDIO_REACTIVE_STATUS,
    payload: {status},
  };
};
