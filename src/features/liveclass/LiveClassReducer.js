// import moment from 'moment';
import lodash from 'lodash';

import {
  FETCH_CLASS_LIVE_INFO_SUCCESS,
  FETCH_DOCS_LIVE_SUCCESS,
  FETCH_LIST_LIVE_CLASS_SUCCESS,
  FETCH_SESSION_ACTIVITY,
  FETCH_SESSION_ACTIVITY_SUCCESS,
  FETCH_LIVE_CLASS_INFO,
  FETCH_LIVE_CLASS_INFO_SUCCESS,
  SET_CURRENT_WARES,
  // SET_INDEX_ACTION_WARES,
  SET_TIMER_DOING_SCRIPT,
  SET_STATUS_DONE_WARES,
  UPDATE_RAISE_HAND_DATA,
  RESTORE_RAISE_HAND_DATA,
  RESET_CHAT_LIVE_CLASS,
  FETCH_MESSAGE_CLASS,
  FETCH_MESSAGE_CLASS_SUCCESS,
  FETCH_MESSAGE_CLASS_FAIL,
  SET_SCHOOL_LIVE_CLASS_DATA,
  ADD_MESSAGE_ONLINE,
  ADD_USER_TYPING,
  REMOVE_USER_TYPING,
  SET_COLOR_CHATTING_ACCOUNT_SUCCESS,
  SET_HAS_NEW_MESSAGE,
  SET_CURRENT_LESSON,
} from '~/features/liveclass/LiveClassType';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {getChattingFormat} from '~/utils/utils';

const initState = {
  query: {
    page: FIRST_PAGE,
    length: PAGE_SIZE,
    keyword: '',
    canLoadMore: false,
  },
  listClass: [],
  selectedClassId: null,
  detailClassInfo: {},
  sessionActivity: {},
  selectedSessionId: null,
  selectedScheduleId: null,
  liveClassInfo: {
    docs: [],
    students: {},
  },
  detailCourseWares: {},
};

export const liveClassReducer = (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_LIST_LIVE_CLASS_SUCCESS: {
      const list = payload.data.data;
      const query = payload.query;
      return {
        ...state,
        query,
        listClass: query.page === 0 ? list : [...state.listClass, ...list],
      };
    }
    case FETCH_LIVE_CLASS_INFO: {
      const classId = payload.classId;
      return {
        ...state,
        selectedClassId: classId,
      };
    }
    case FETCH_LIVE_CLASS_INFO_SUCCESS: {
      const classId = payload.classId;
      const data = payload.data;
      return {
        ...state,
        detailClassInfo: {
          ...state.detailClassInfo,
          [classId]: data,
        },
      };
    }
    case FETCH_SESSION_ACTIVITY: {
      const sessionId = payload.sessionId;
      const scheduleId = payload.scheduleId;
      return {
        ...state,
        selectedSessionId: sessionId,
        selectedScheduleId: scheduleId,
      };
    }
    case FETCH_SESSION_ACTIVITY_SUCCESS: {
      const sessionId = payload.sessionId;
      const data = payload.data;
      return {
        ...state,
        sessionActivity: {
          ...state.sessionActivity,
          [sessionId]: data,
        },
      };
    }
    case FETCH_DOCS_LIVE_SUCCESS:
      return {
        ...state,
        liveClassInfo: {
          ...state.liveClassInfo,
          docs: payload.data,
        },
        detailCourseWares: payload.detailWares,
      };
    case SET_CURRENT_LESSON:
      return {
        ...state,
        detailCourseWares: payload.detailWares,
      };
    case FETCH_CLASS_LIVE_INFO_SUCCESS: {
      return {
        ...state,
        liveClassInfo: {
          ...state.liveClassInfo,
          students: payload.data,
        },
      };
    }
    case SET_CURRENT_WARES: {
      return {
        ...state,
        currentWares: payload.data,
      };
    }
    case SET_SCHOOL_LIVE_CLASS_DATA: {
      const {schoolClassId, students, teacher, listStudents} = payload.data;
      return {
        ...state,
        selectedClassId: schoolClassId,
        selectedSessionId: null,
        selectedScheduleId: null,
        detailClassInfo: {
          ...state.detailClassInfo,
          [schoolClassId]: {class: {teacher, students: listStudents}},
        },
        liveClassInfo: {
          docs: [],
          students,
          usersJoin: [],
        },
      };
    }
    default:
      return state;
  }
};

const initStateSocket = {
  timerLiveClass: null,
  enableScript: false,
  doneWares: false,
  currentWares: null,
  currentLessonOpen: null,
  indexCurrentItemWare: 0,
  raiseHand: {},
};

export const socketReducer = (state = initStateSocket, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_CURRENT_LESSON: {
      return {
        ...state,
        currentLessonOpen: payload.data,
      };
    }
    case SET_CURRENT_WARES: {
      return {
        ...state,
        currentWares: payload.data,
        indexCurrentItemWare: payload.index,
      };
    }
    case SET_TIMER_DOING_SCRIPT:
      return {
        ...state,
        timerLiveClass: payload.data,
        enableScript: !!payload.data,
      };
    case SET_STATUS_DONE_WARES:
      return {
        ...state,
        doneWares: payload.data,
      };
    case UPDATE_RAISE_HAND_DATA: {
      let newData = state.raiseHand;
      if (payload.data.isRaiseHand) {
        newData[payload.data.userId] = true;
      } else {
        delete newData[payload.data.userId];
      }
      return {
        ...state,
        raiseHand: {...newData},
      };
    }
    case RESTORE_RAISE_HAND_DATA: {
      let newData = {};
      payload.data.forEach((item) => {
        newData[item] = true;
      });
      return {
        ...state,
        raiseHand: {...newData},
      };
    }
    default:
      return state;
  }
};

const initChattingSocket = {
  typingMessage: {},
  listIdMessage: [],
  detailMessage: {},
  first_message_time: '',
  loading: false,
  canLoadMore: true,
  colorChatting: {},
  hasNewMessage: false,
};

export const chattingReducer = (state = initChattingSocket, action) => {
  const {type, payload} = action;
  const dataTyping = state.typingMessage;
  switch (type) {
    case SET_COLOR_CHATTING_ACCOUNT_SUCCESS:
      return {
        ...state,
        colorChatting: payload.data,
      };
    case FETCH_MESSAGE_CLASS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MESSAGE_CLASS_SUCCESS:
      return {
        ...state,
        listIdMessage: payload.data.listId,
        detailMessage: payload.data.detailMessage,
        first_message_time: payload.data.time || '',
        canLoadMore: true,
        loading: false,
      };
    case SET_HAS_NEW_MESSAGE: {
      return {
        ...state,
        hasNewMessage: payload.data,
      };
    }
    case FETCH_MESSAGE_CLASS_FAIL:
      return {
        ...state,
        loading: false,
        canLoadMore: false,
      };
    case ADD_MESSAGE_ONLINE: {
      const detailMess = {
        ...state.detailMessage,
        [payload.data._id]: payload.data,
      };
      const messages = lodash
        .uniq([payload.data._id, ...state.listIdMessage])
        .map((item) => detailMess[item]);
      const detailMessageFormat = getChattingFormat(messages);
      return {
        ...state,
        listIdMessage: lodash.uniq([payload.data._id, ...state.listIdMessage]),
        detailMessage: detailMessageFormat,
      };
    }
    case ADD_USER_TYPING: {
      if (dataTyping[payload.data._id]) {
        return state;
      }
      return {
        ...state,
        typingMessage: {
          ...state.typingMessage,
          [payload.data._id]: payload.data,
        },
      };
    }
    case REMOVE_USER_TYPING: {
      if (dataTyping[payload.data._id]) {
        delete dataTyping[payload.data._id];
        return {
          ...state,
          typingMessage: {...dataTyping},
        };
      }
      return state;
    }
    case RESET_CHAT_LIVE_CLASS:
      return initChattingSocket;
    default:
      return state;
  }
};
