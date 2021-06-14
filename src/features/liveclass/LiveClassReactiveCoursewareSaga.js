import {select, takeEvery, put, takeLatest} from 'redux-saga/effects';

import {
  RECEIVE_REACTIVE_COURSEWARE_ACTION,
  RESTORE_REACTIVE_COURSEWARE_DATA,
} from '~/features/liveclass/LiveClassType';
import {
  removeReactiveCourseware,
  updateReactiveCoursewareData,
} from '~/features/liveclass/LiveClassReactiveCoursewareAction';
import navigator from '~/navigation/customNavigator';

const getInfoCurrentWare = (state) => {
  return {
    indexCurrentItemWare: state.socket.indexCurrentItemWare,
    currentWare: state.socket.currentWares,
    currentLessonOpen: state.socket.currentLessonOpen,
  };
};

export default function* liveClassReactiveCoursewareSagas() {
  yield takeEvery(
    RECEIVE_REACTIVE_COURSEWARE_ACTION,
    handleReactiveCoursewareActionSaga,
  );
  yield takeLatest(
    RESTORE_REACTIVE_COURSEWARE_DATA,
    handleRestoreReactiveCoursewareDataSaga,
  );
}
function* handleRestoreReactiveCoursewareDataSaga({payload: {wareInfo, data}}) {
  if (wareInfo?.ware && wareInfo.ware?.items?.length > 0) {
    const item = wareInfo.ware?.items[wareInfo.wareIndex || 0];
    if (
      data?.type === item?.attachment?.type &&
      data?.path === item?.attachment?.path
    ) {
      if (item?.attachment?.type === 'slide' && data?.page) {
        yield put(updateReactiveCoursewareData({[item.key]: data}));
        navigateSlide(item);
      }
      if (item?.attachment?.type === 'audio') {
        yield put(
          updateReactiveCoursewareData({
            ...data,
            type: 'audio',
            data,
          }),
        );
      }
      if (item?.attachment?.type === 'video_upload' && data?.time_at) {
        yield put(updateReactiveCoursewareData({[item.key]: data}));
        navigateCoursewareFullscreen(item);
      }
      if (item?.attachment?.type === 'list_image') {
        yield put(updateReactiveCoursewareData({[item.key]: data}));
        navigateCoursewareFullscreen(item);
      }
    }
  }
}

function* handleReactiveCoursewareActionSaga({payload: {data}}) {
  const wareData = yield select(getInfoCurrentWare);
  if (wareData?.currentWare && wareData.currentWare?.items?.length > 0) {
    const item =
      wareData.currentWare?.items[wareData.indexCurrentItemWare || 0];
    const actionData = data?.data;
    if (data?.action === 'open') {
      if (
        actionData?.type === item?.attachment?.type &&
        actionData?.path === item?.attachment?.path
      ) {
        if (item?.attachment?.type === 'slide' && actionData?.page) {
          yield put(updateReactiveCoursewareData({[item.key]: actionData}));
          navigateSlide(item);
        }
        if (item?.attachment?.type === 'video_upload' && actionData?.time_at) {
          yield put(updateReactiveCoursewareData({[item.key]: actionData}));
          navigateCoursewareFullscreen(item);
        }
        if (item?.attachment?.type === 'list_image' && actionData) {
          yield put(updateReactiveCoursewareData({[item.key]: actionData}));
          navigateCoursewareFullscreen(item);
        }
        if (item?.attachment?.type === 'audio') {
          yield put(
            updateReactiveCoursewareData({
              ...data,
              type: 'audio',
            }),
          );
        }
      }
    } else if (data?.action === 'update') {
      if (item?.attachment?.type === 'slide' && actionData?.page) {
        yield put(updateReactiveCoursewareData({[item.key]: actionData}));
        navigateSlide(item);
      }
      if (item?.attachment?.type === 'video_upload' && actionData?.time_at) {
        yield put(updateReactiveCoursewareData({[item.key]: actionData}));
      }
      if (item?.attachment?.type === 'list_image' && actionData) {
        yield put(updateReactiveCoursewareData({[item.key]: actionData}));
      }
      if (item?.attachment?.type === 'audio') {
        yield put(
          updateReactiveCoursewareData({
            ...data,
            type: 'audio',
          }),
        );
      }
    } else if (data?.action === 'close') {
      if (navigator.getCurrentRoute() !== 'LiveHome') {
        navigator.navigate('LiveHome');
      }
      yield put(removeReactiveCourseware(item.key));
    }
  }
}

const navigateSlide = (item) => {
  if (navigator.getCurrentRoute() !== 'SlideFullScreen') {
    navigator.navigate('SlideFullScreen', {data: item});
  }
};

const navigateCoursewareFullscreen = (item) => {
  if (navigator.getCurrentRoute() !== 'ReactiveCoursewareFull') {
    navigator.navigate('ReactiveCoursewareFull', {item: item});
  }
};
