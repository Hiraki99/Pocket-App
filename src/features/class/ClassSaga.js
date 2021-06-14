import {put, call, takeLatest} from 'redux-saga/effects';

import {FETCH_DETAIL_CLASS} from './ClassType';
import classApi from './ClassApi';
import {fetchDetailClassSuccess, fetchDetailClassFail} from './ClassAction';

export default function* lessonSagas() {
  yield takeLatest(FETCH_DETAIL_CLASS, fetchLectureListen);
}

function* fetchLectureListen({payload: {data}}) {
  const response = yield call(classApi.fetchDetailClass, data);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchDetailClassSuccess(response.data.data));
    return;
  }
  yield put(fetchDetailClassFail());
}
