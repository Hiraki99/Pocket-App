import {createSelector} from 'reselect';

const queryNotification = (state) => state.notification.query;
const unreadNotification = (state) => state.notification.unread_count;
const notifications = (state) => {
  return state.notification.list_id_notification.map(
    (item) => state.notification.detail_notification[item],
  );
};

export const queryNotificationSelector = createSelector(
  queryNotification,
  (data) => data,
);

export const notificationsSelector = createSelector(
  notifications,
  (data) => data,
);

export const unreadCountNotificationSelector = createSelector(
  unreadNotification,
  (data) => data,
);
