import {
  DECREASE_UNREAD_NOTIFICATION,
  FETCH_LIST_NOTIFICATION_SUCCESS,
  INCREASE_UNREAD_NOTIFICATION,
  MARK_READ_ALL_SUCCESS,
  MARK_READ_SUCCESS,
} from './NotificationType';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';

const initState = {
  unread_count: 0,
  detail_notification: {},
  list_id_notification: [],
  query: {
    page: FIRST_PAGE,
    length: PAGE_SIZE,
  },
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_LIST_NOTIFICATION_SUCCESS:
      return {
        query: payload.query,
        detail_notification: {
          ...state.detail_notification,
          ...payload.data.DETAIL_DATA,
        },
        list_id_notification: [
          ...new Set([
            ...state.list_id_notification,
            ...payload.data.LIST_NOTIFICATION_ID,
          ]),
        ],
        unread_count: payload.data.UNREAD_COUNT,
      };
    case MARK_READ_SUCCESS:
      return {
        ...state,
        unread_count: payload.data.unreadCount,
        detail_notification: {
          ...state.detail_notification,
          [payload.data._id]: {
            ...(state.detail_notification[payload.data._id] || {}),
            read_at: true,
          },
        },
      };
    case INCREASE_UNREAD_NOTIFICATION:
      return {
        ...state,
        unread_count: state.unread_count + 1,
      };
    // case MARK_READ_ALL: {
    case MARK_READ_ALL_SUCCESS: {
      let updateData = {};
      Object.keys(state.detail_notification).map((item) => {
        updateData = {
          ...updateData,
          [item]: Object.assign(state.detail_notification[item] || {}, {
            read_at: true,
          }),
        };
        return;
      });
      return {
        ...state,
        unread_count: 0,
        detail_notification: updateData,
      };
    }
    case DECREASE_UNREAD_NOTIFICATION:
      return {
        ...state,
        unread_count: state.unread_count - 1 < 0 ? 0 : state.unread_count - 1,
      };
    default:
      return state;
  }
};
