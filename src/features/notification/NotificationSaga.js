import {put, call, takeLatest} from 'redux-saga/effects';
import {
  FETCH_LIST_NOTIFICATION,
  MARK_READ,
  MARK_READ_ALL,
} from './NotificationType';
import notificationApi from './NotificationApi';
import {
  fetchListNotificationSuccessAction,
  markReadAllNotificationSuccess,
  markReadNotificationSuccessAction,
} from '~/features/notification/NotificationAction';
import {PAGE_SIZE} from '~/constants/query';

export default function* lessonSagas() {
  yield takeLatest(FETCH_LIST_NOTIFICATION, fetchListNotificationSaga);
  yield takeLatest(MARK_READ, markReadNotificationSaga);
  yield takeLatest(MARK_READ_ALL, markReadAllNotificationSaga);
}

function* fetchListNotificationSaga({payload: {data}}) {
  const response = yield call(notificationApi.fetchListNotification, data);
  if (response.ok && response.data && response.data.data) {
    const canLoadMore = response.data.totalCount > (data.page + 1) * PAGE_SIZE;
    let DETAIL_DATA = {};
    const LIST_NOTIFICATION_ID = (response.data.data || []).map((item) => {
      DETAIL_DATA[item._id] = item;
      return item._id;
    });
    yield put(
      fetchListNotificationSuccessAction(
        {
          ...data,
          canLoadMore,
        },
        {
          DETAIL_DATA,
          LIST_NOTIFICATION_ID,
          UNREAD_COUNT: response.data.unreadCount,
        },
      ),
    );
  }
}

function* markReadNotificationSaga({payload: {data}}) {
  const response = yield call(notificationApi.markReadNotification, data);
  if (response.ok && response.data && response.data.data) {
    yield put(
      markReadNotificationSuccessAction({...response.data.data, ...data}),
    );
    return;
  }
}

function* markReadAllNotificationSaga() {
  const response = yield call(notificationApi.markReadAllNotificationApi);
  console.log('re ', response);
  if (response.ok && response.data && response.data.data) {
    yield put(markReadAllNotificationSuccess());
  }
}
