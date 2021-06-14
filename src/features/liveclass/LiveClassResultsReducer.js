// import moment from 'moment';
import lodash from 'lodash';

import {
  SET_RESULT_QUESTION_WARES,
  UPDATE_SCORE_CLASS,
  CREATE_DETAIL_INFO_STUDENT,
  RESET_DETAIL_RESULT_STUDENTS,
  UPDATE_STUDENT_SCRIPT_SCORE,
  RESET_STUDENT_SCRIPT_SCORE,
  SELECTED_USER_VIEW_RESULT,
  SET_SCHOOL_LIVE_CLASS_DATA,
  SET_USERS_JOIN,
  LEAVE_USER_ZOOM,
  ADD_NEW_USER_JOIN_ZOOM_SUCCESS,
  UPDATE_STATUS_MEMBER,
  SET_SHOW_VIDEO_ZOOM,
  SET_SHOW_LATENCY_CONTAINER,
  SET_LATENCY_CLIENT_SERVER,
  UPDATE_AUDIO_STATUS_ZOOM,
  UPDATE_VIDEO_STATUS_ZOOM,
} from '~/features/liveclass/LiveClassType';

const initLiveClassResults = {
  totalQuestionScript: 0,
  totalSuccessAnswerScript: 0,
  // user join đã làm bài
  userJointed: [],
  detailResultQuestion: {},
  scriptScores: {},
  selectedUserViewResult: null,
};

export const liveClassResultsReducer = (
  state = initLiveClassResults,
  action,
) => {
  const {type, payload} = action;
  switch (type) {
    case SET_RESULT_QUESTION_WARES: {
      return {
        ...state,
        totalQuestionScript: payload.data.totalQuestionScript || 1,
        totalSuccessAnswerScript: payload.data.totalSuccessAnswerScript || 0,
      };
    }
    case RESET_STUDENT_SCRIPT_SCORE: {
      return {
        ...state,
        scriptScores: {},
      };
    }
    case UPDATE_STUDENT_SCRIPT_SCORE: {
      const listScores = payload.listScores;
      const newData = state.scriptScores;
      listScores.map((itScore) => {
        const userId = itScore.userId;
        const scriptId = itScore.scriptId;
        const data = itScore.data;
        const userScores = newData[userId] || {};
        userScores[scriptId] = data;
        newData[userId] = userScores;
      });
      return {
        ...state,
        scriptScores: {...newData},
      };
    }
    case CREATE_DETAIL_INFO_STUDENT: {
      return {
        ...state,
        userJointed: payload.data.userJointed,
        detailResultQuestion: payload.data.detailResultQuestion,
      };
    }
    case RESET_DETAIL_RESULT_STUDENTS:
      const keys = Object.keys(state.detailResultQuestion);
      let updateData = state.detailResultQuestion;
      keys.forEach((item) => {
        updateData[item] = {
          ...state.detailResultQuestion[item],
          questions: null,
        };
      });
      return {
        ...state,
        totalQuestionScript: 0,
        totalSuccessAnswerScript: 0,
        detailResultQuestion: updateData,
      };
    case UPDATE_SCORE_CLASS: {
      return {
        ...state,
        userJointed: lodash.uniq([...state.userJointed, payload.data.userId]),
        detailResultQuestion: {
          ...state.detailResultQuestion,
          [payload.data.userId]: payload.data.detailAnswer,
        },
      };
    }
    case SELECTED_USER_VIEW_RESULT:
      return {
        ...state,
        selectedUserViewResult: payload.data,
      };
    case SET_SCHOOL_LIVE_CLASS_DATA: {
      const {listStudents} = payload.data;
      let detail = {};
      const listId = listStudents.map((item) => {
        detail[item.email] = item;
        return item.email;
      });
      return {
        ...state,
        userJointed: listId,
        detailResultQuestion: detail,
      };
    }
    default:
      return state;
  }
};

const initZoomMediaStateAccountReducer = {
  usersJoin: [],
  detailStatus: {},
  showVideo: true,
  latencyServer: 0,
  showLatencyContainer: false,
};

export const zoomStateAccountReducer = (
  state = initZoomMediaStateAccountReducer,
  action,
) => {
  const {type, payload} = action;
  switch (type) {
    case SET_USERS_JOIN: {
      return {
        ...state,
        usersJoin: payload.data,
        detailStatus: payload.detailStatusMember,
      };
    }
    case ADD_NEW_USER_JOIN_ZOOM_SUCCESS: {
      return {
        ...state,
        usersJoin: [...state.usersJoin, payload.data.newMember],
        detailStatus: {
          ...state.detailStatus,
          ...payload.data.detailMember,
        },
      };
    }
    case UPDATE_AUDIO_STATUS_ZOOM: {
      return {
        ...state,
        detailStatus: {
          ...state.detailStatus,
          [payload.user]: {
            ...(state.detailStatus[payload.user] || {}),
            audioStatus: payload.audioStatus,
          },
        },
      };
    }
    case UPDATE_VIDEO_STATUS_ZOOM: {
      return {
        ...state,
        detailStatus: {
          ...state.detailStatus,
          [payload.user]: {
            ...(state.detailStatus[payload.user] || {}),
            videoStatus: payload.videoStatus,
          },
        },
      };
    }
    case UPDATE_STATUS_MEMBER: {
      return {
        ...state,
        detailStatus: {
          ...state.detailStatus,
          ...payload.data,
        },
      };
    }
    case LEAVE_USER_ZOOM:
      return {
        ...state,
        usersJoin: state.usersJoin.filter(
          (item) => item.userID !== payload.data,
        ),
      };
    case SET_SHOW_VIDEO_ZOOM:
      return {
        ...state,
        showVideo: payload.data,
      };
    case SET_SHOW_LATENCY_CONTAINER:
      return {
        ...state,
        showLatencyContainer: payload.data,
      };
    case SET_LATENCY_CLIENT_SERVER:
      return {
        ...state,
        latencyServer: payload.data,
      };
    default:
      return state;
  }
};
