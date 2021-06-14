import {
  DECREASE_UNREAD_NOTIFICATION,
  FETCH_LIST_NOTIFICATION,
  FETCH_LIST_NOTIFICATION_SUCCESS,
  INCREASE_UNREAD_NOTIFICATION,
  MARK_READ,
  MARK_READ_ALL,
  MARK_READ_ALL_SUCCESS,
  MARK_READ_SUCCESS,
} from '~/features/notification/NotificationType';

export const fetchListNotificationAction = (data) => {
  return {
    type: FETCH_LIST_NOTIFICATION,
    payload: {data},
  };
};

export const fetchListNotificationSuccessAction = (query, data) => {
  return {
    type: FETCH_LIST_NOTIFICATION_SUCCESS,
    payload: {query, data},
  };
};

export const markReadNotificationAction = (data) => {
  return {
    type: MARK_READ,
    payload: {data},
  };
};

export const markReadNotificationSuccessAction = (data) => {
  return {
    type: MARK_READ_SUCCESS,
    payload: {data},
  };
};

export const increaseNumberNotification = (data) => {
  return {
    type: INCREASE_UNREAD_NOTIFICATION,
    payload: {data},
  };
};

export const decreaseNumberNotification = (data) => {
  return {
    type: DECREASE_UNREAD_NOTIFICATION,
    payload: {data},
  };
};

export const markReadAllNotification = () => {
  return {type: MARK_READ_ALL};
};

export const markReadAllNotificationSuccess = () => {
  return {type: MARK_READ_ALL_SUCCESS};
};
