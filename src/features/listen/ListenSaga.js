import {put, call, takeLatest} from 'redux-saga/effects';
import {FETCH_LECTURE_LISTEN} from './ListenType';
import listenAPI from './ListenApi';
import {
  fetchLectureListenSuccess,
  fetchLectureListenFail,
} from './ListenAction';

export default function* lessonSagas() {
  yield takeLatest(FETCH_LECTURE_LISTEN, fetchLectureListen);
}

function* fetchLectureListen({payload: {data}}) {
  const response = yield call(listenAPI.fetchVocabularyFeatures, data);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchLectureListenSuccess(response.data.data));
    return;
  }
  yield put(fetchLectureListenFail());
}

function* fetchDegreeeListen({payload: {data}}) {
  const response = yield call(listenAPI.fetchVocabularyFeatures, data);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchLectureListenSuccess(response.data.data));
    return;
  }
  yield put(fetchLectureListenFail());
}
