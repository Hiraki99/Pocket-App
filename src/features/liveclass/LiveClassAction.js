import {
  FETCH_CLASS_LIVE_INFO,
  FETCH_CLASS_LIVE_INFO_SUCCESS,
  FETCH_DOCS_LIVE,
  FETCH_DOCS_LIVE_SUCCESS,
  FETCH_LIST_LIVE_CLASS,
  FETCH_LIST_LIVE_CLASS_SUCCESS,
  FETCH_SESSION_ACTIVITY,
  FETCH_SESSION_ACTIVITY_SUCCESS,
  FETCH_LIVE_CLASS_INFO,
  FETCH_LIVE_CLASS_INFO_SUCCESS,
  LEAVE_LIVE_CLASS,
  SET_CURRENT_WARES,
  SET_USERS_JOIN,
  SET_TIMER_DOING_SCRIPT,
  SET_STATUS_DONE_WARES,
  RESTORE_SCRIPT_STATE,
  UPDATE_STATE_JOIN_CLASS,
  SET_MAIN_SCRIPT_ACTIVITY,
  UPDATE_RAISE_HAND_DATA,
  RESTORE_RAISE_HAND_DATA,
  FETCH_MESSAGE_CLASS,
  FETCH_MESSAGE_CLASS_SUCCESS,
  FETCH_MESSAGE_PREVIEW_LINK,
  FETCH_MESSAGE_PREVIEW_LINK_SUCCESS,
  CLEAR_TYPING_MESSAGE,
  RESET_CHAT_LIVE_CLASS,
  FETCH_MESSAGE_CLASS_FAIL,
  SET_SCHOOL_LIVE_CLASS_DATA,
  UPDATE_COURSEWARES_DATA,
  ADD_MESSAGE_ONLINE,
  REMOVE_USER_TYPING,
  ADD_USER_TYPING,
  SET_COLOR_CHATTING_ACCOUNT,
  SET_COLOR_CHATTING_ACCOUNT_SUCCESS,
  SET_HAS_NEW_MESSAGE,
  SEND_LIVE_SCORE,
  COURSEWARE_OPEN_ACTION,
  COURSEWARE_ACTION_SOCKET,
  COUNTDOWN_START_ACTION,
  COUNTDOWN_REMOVE_ACTION,
  NEW_USER_JOIN_ZOOM,
  UPDATE_STATUS_MEMBER,
  LEAVE_USER_ZOOM,
  ADD_NEW_USER_JOIN_ZOOM_SUCCESS,
  SET_CURRENT_LESSON,
  UPDATE_SCORE_WHEN_DONE_WARES,
  SET_SHOW_VIDEO_ZOOM,
} from '~/features/liveclass/LiveClassType';

export const fetchListLiveClassAction = (data) => {
  return {
    type: FETCH_LIST_LIVE_CLASS,
    payload: {data},
  };
};

export const fetchListLiveClassSuccessAction = (query, data) => {
  return {
    type: FETCH_LIST_LIVE_CLASS_SUCCESS,
    payload: {query, data},
  };
};

export const fetchLiveClassInfoAction = (classId) => {
  return {
    type: FETCH_LIVE_CLASS_INFO,
    payload: {classId},
  };
};

export const fetchLiveClassInfoSuccessAction = (classId, data) => {
  return {
    type: FETCH_LIVE_CLASS_INFO_SUCCESS,
    payload: {classId, data},
  };
};

export const fetchSessionActivityAction = (sessionId, scheduleId) => {
  return {
    type: FETCH_SESSION_ACTIVITY,
    payload: {sessionId, scheduleId},
  };
};

export const fetchSessionActivitySuccessAction = (sessionId, data) => {
  return {
    type: FETCH_SESSION_ACTIVITY_SUCCESS,
    payload: {sessionId, data},
  };
};

export const fetchClassLiveInfo = (data) => {
  return {
    type: FETCH_CLASS_LIVE_INFO,
    payload: {data},
  };
};

export const fetchClassLiveInfoSuccess = (data) => {
  return {
    type: FETCH_CLASS_LIVE_INFO_SUCCESS,
    payload: {data},
  };
};

export const fetchDocsLiveClass = (data, isSchoolClass = false) => {
  return {
    type: FETCH_DOCS_LIVE,
    payload: {data, isSchoolClass},
  };
};

export const fetchDocsLiveClassSuccess = (data, detailWares) => {
  return {
    type: FETCH_DOCS_LIVE_SUCCESS,
    payload: {data, detailWares},
  };
};

export const leaveLiveClass = () => {
  return {
    type: LEAVE_LIVE_CLASS,
  };
};

export const setCurrentWares = (data, index = 0) => {
  return {
    type: SET_CURRENT_WARES,
    payload: {data, index},
  };
};

export const setTimerLiveClass = (data) => {
  return {
    type: SET_TIMER_DOING_SCRIPT,
    payload: {data},
  };
};

export const setStatusDoneWares = (data) => {
  return {
    type: SET_STATUS_DONE_WARES,
    payload: {data},
  };
};

export const restoreScriptStateAction = (currentState, courseWare) => {
  return {
    type: RESTORE_SCRIPT_STATE,
    payload: {currentState, courseWare},
  };
};

export const updateStateJoinClass = (data) => {
  return {
    type: UPDATE_STATE_JOIN_CLASS,
    payload: {data},
  };
};

export const setMainScriptActivity = (
  activity,
  score = [],
  autoGenerateNextActivity = false,
) => {
  return {
    type: SET_MAIN_SCRIPT_ACTIVITY,
    payload: {activity, score, autoGenerateNextActivity},
  };
};

export const updateRaiseHandData = (data) => {
  return {
    type: UPDATE_RAISE_HAND_DATA,
    payload: {data},
  };
};

export const restoreRaiseHandData = (data) => {
  return {
    type: RESTORE_RAISE_HAND_DATA,
    payload: {data},
  };
};

export const setSchoolLiveClassData = (data) => {
  return {
    type: SET_SCHOOL_LIVE_CLASS_DATA,
    payload: {data},
  };
};

export const updateCoursewaresData = (listData) => {
  return {
    type: UPDATE_COURSEWARES_DATA,
    payload: {listData},
  };
};

export const fetchMessageChat = (data) => {
  return {
    type: FETCH_MESSAGE_CLASS,
    payload: {data},
  };
};

export const fetchMessageChatSuccess = (listId, detailMessage, time = '') => {
  return {
    type: FETCH_MESSAGE_CLASS_SUCCESS,
    payload: {data: {listId, detailMessage, time}},
  };
};

export const fetchMessageChatFail = () => {
  return {
    type: FETCH_MESSAGE_CLASS_FAIL,
  };
};

export const fetchMessagePreviewLink = (data) => {
  return {
    type: FETCH_MESSAGE_PREVIEW_LINK,
    payload: {data},
  };
};

export const fetchMessagePreviewLinkSuccess = (data) => {
  return {
    type: FETCH_MESSAGE_PREVIEW_LINK_SUCCESS,
    payload: {data},
  };
};

export const clearTypingMessage = (data) => {
  return {
    type: CLEAR_TYPING_MESSAGE,
    payload: {data},
  };
};

export const resetChatClass = () => {
  return {
    type: RESET_CHAT_LIVE_CLASS,
  };
};

export const addMessageOnline = (data) => {
  return {
    type: ADD_MESSAGE_ONLINE,
    payload: {data},
  };
};

export const removeMessageTyping = (data) => {
  return {
    type: REMOVE_USER_TYPING,
    payload: {data},
  };
};

export const addMessageTyping = (data) => {
  return {
    type: ADD_USER_TYPING,
    payload: {data},
  };
};

export const setColorChattingAccount = () => {
  return {
    type: SET_COLOR_CHATTING_ACCOUNT,
  };
};

export const setColorChattingAccountSuccess = (data) => {
  return {
    type: SET_COLOR_CHATTING_ACCOUNT_SUCCESS,
    payload: {data},
  };
};

export const setNewMessage = (data) => {
  return {
    type: SET_HAS_NEW_MESSAGE,
    payload: {data},
  };
};

export const sendLiveScore = (isCorrect, answerKey) => {
  return {
    type: SEND_LIVE_SCORE,
    payload: {isCorrect, answerKey},
  };
};

// SOCKET_EVENT

export const coursewareOpenAction = (data) => {
  return {
    type: COURSEWARE_OPEN_ACTION,
    payload: {data},
  };
};

export const courseActionSocket = (data) => {
  return {
    type: COURSEWARE_ACTION_SOCKET,
    payload: {data},
  };
};

export const countDownStartAction = (data) => {
  return {
    type: COUNTDOWN_START_ACTION,
    payload: {data},
  };
};

export const countDownRemoveAction = (data) => {
  return {
    type: COUNTDOWN_REMOVE_ACTION,
    payload: {data},
  };
};

export const updateUsersJoin = (data) => {
  let detailStatusMember = {};
  const listMember = data.usersJoin.map((item) => {
    detailStatusMember[item.userName] = item;
    return {
      userName: item.userName,
      videoStatus: item.videoStatus,
      userID: item.userID,
    };
  });

  return {
    type: SET_USERS_JOIN,
    payload: {data: listMember, detailStatusMember},
  };
};

export const addNewUserJoinZoom = (data) => {
  return {
    type: NEW_USER_JOIN_ZOOM,
    payload: {data},
  };
};

export const addNewUserJoinZoomSuccess = (data) => {
  return {
    type: ADD_NEW_USER_JOIN_ZOOM_SUCCESS,
    payload: {data},
  };
};

export const updateStatusUserZoom = (data) => {
  return {
    type: UPDATE_STATUS_MEMBER,
    payload: {data},
  };
};

export const leaveUserZoom = (data) => {
  return {
    type: LEAVE_USER_ZOOM,
    payload: {data},
  };
};

export const setCurrentLessonOpenLive = (data, detailWares) => {
  return {
    type: SET_CURRENT_LESSON,
    payload: {data, detailWares},
  };
};

export const updateScoreDoneWares = (scores, wares, page) => {
  return {
    type: UPDATE_SCORE_WHEN_DONE_WARES,
    payload: {scores, wares, page},
  };
};

export const setShowVideoZoom = (data) => {
  return {
    type: SET_SHOW_VIDEO_ZOOM,
    payload: {data},
  };
};
